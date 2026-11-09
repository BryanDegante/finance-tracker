'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { isTheme, type Theme } from '@/types/theme';

export async function updateThemeAction(theme: Theme) {
  if (!isTheme(theme)) {
    throw new Error('Invalid theme');
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Verify the authenticated user
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== 'string') {
    throw new Error('You must be authenticated to update your theme.');
  }

  // Update the user's profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ theme })
    .eq('id', userId);

  if (updateError) {
    console.error('Failed to update theme:', updateError);
    throw new Error('Unable to save your theme preference.');
  }

  // Save the preference in the cookie
  cookieStore.set('budgetier-theme', theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}