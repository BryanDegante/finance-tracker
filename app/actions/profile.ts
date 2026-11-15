
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
