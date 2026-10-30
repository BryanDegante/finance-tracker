import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import OnBoardingFlow from '@/components/OnBoarding/OnBoardingFlow';

export default async function OnboardingPage() {
	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

	const { data: claimsData, error: claimsError } =
		await supabase.auth.getClaims();

	const userId = claimsData?.claims?.sub;
	if (claimsError || typeof userId !== 'string') {
		redirect('/');
	}
	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('onboarding_completed')
		.eq('id', userId)
		.maybeSingle();

if (profileError || !profile) {
	console.error('Unable to verify onboarding status:', profileError);
	redirect('/');
}

	if (profile.onboarding_completed) {
		redirect('/dashboard');
	}

	return (
		<main className="flex min-h-dvh flex-1 bg-background">
			<OnBoardingFlow />
		</main>
	);
}
