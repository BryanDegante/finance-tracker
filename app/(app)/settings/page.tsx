import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppearanceSelector from '@/components/UI/Appearance Selector/AppearanceSelector';
import { isTheme } from '@/types/theme';
import { updateThemeAction } from '@/app/actions/theme';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Verify authentication
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    redirect('/');
  }

  // Retrieve the user's settings
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('theme, onboarding_completed')
    .eq('id', claims.sub)
    .maybeSingle();

  if (profileError) {
    throw new Error('Unable to load your settings.');
  }

  if (!profile) {
    throw new Error('Your profile could not be found.');
  }

  if (!profile.onboarding_completed) {
    redirect('/onboarding');
  }

const initialTheme = isTheme(profile.theme) ? profile.theme : 'light';
  return (
		<main className="min-h-screen p-6">
			<h1 className="font-nunito-titles text-2xl font-bold text-text-primary">
				Settings
			</h1>

			<section className="mt-8">
				<h2 className="text-lg font-semibold text-text-primary">
					Appearance
				</h2>

				<p className="mt-1 text-sm font-sans-text text-text-secondary">
					Customize how Budgetier looks on your device.
				</p>

				<div className="mt-4">
					<AppearanceSelector
						initialTheme={initialTheme}
						onSave={updateThemeAction}
					/>
				</div>
			</section>
		</main>
  );
}