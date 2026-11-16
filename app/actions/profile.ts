'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

type UpdateProfileInput = {
  fullName: string;
  displayName: string;
};

export async function updateProfileAction(
  input: UpdateProfileInput,
): Promise<void> {
  if (
    !input ||
    typeof input.fullName !== 'string' ||
    typeof input.displayName !== 'string'
  ) {
    throw new Error('Invalid profile information.');
  }

  const fullName = input.fullName.trim();
  const displayName = input.displayName.trim();

  if (!fullName || fullName.length > 60) {
    throw new Error('Please enter a valid full name.');
  }

  if (displayName.length > 60) {
    throw new Error('Display name cannot exceed 60 characters.');
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('You must be signed in to update your profile.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      display_name: displayName || null,
    })
    .eq('id', user.id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Profile update failed:', error.code);
    throw new Error('Unable to save your profile. Please try again.');
  }

  if (!data) {
    throw new Error('Unable to find your profile.');
  }

  revalidatePath('/profile');
}

export async function updateEmailAction(newEmail: string): Promise<void> {
  if (typeof newEmail !== 'string' || !newEmail.trim()) {
    throw new Error('Please enter a valid email address.');
  }
  const email = newEmail.trim();

  if (email.length > 254) {
    throw new Error('Email address is too long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('You must be signed in to change your email.');
  }
  if (user.email?.toLowerCase() === email.toLowerCase()) {
    throw new Error('This is already your current email address.');
  }
  const { error: updateError } = await supabase.auth.updateUser({
    email,
  });

  if (updateError) {
    console.error('Email update failed:', updateError.code);
    throw new Error('Unable to update your email. Please try again.');
  }
  revalidatePath('/profile');
}
