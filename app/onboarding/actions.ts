'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import type { OnboardingData } from '@/types/onboarding';

export type OnboardingActionState = {
	error: string | null;
};

export async function completeOnboarding(
	data: OnboardingData,
): Promise<OnboardingActionState> {
	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

	// 1. Verify the authenticated user's session.
	const { data: claimsData, error: claimsError } =
		await supabase.auth.getClaims();

	const userId = claimsData?.claims?.sub;

	if (claimsError || typeof userId !== 'string') {
		return { error: 'Your session has expired. Please sign in again.' };
	}

	// 2. Validate the submitted data at runtime.
	if (
		!data ||
		typeof data.fullName !== 'string' ||
		typeof data.startingBalance !== 'string' ||
		typeof data.theme !== 'string'
	) {
		return { error: 'Please check your information and try again.' };
	}

	const fullName = data.fullName.trim();
	const theme = data.theme;

	if (fullName.length > 60) {
		return { error: 'Your name must be 60 characters or fewer.' };
	}

	if (theme !== 'light' && theme !== 'dark') {
		return { error: 'Please select a valid theme.' };
	}

	// 3. Validate the starting balance.
	const balanceInput = data.startingBalance.trim();
	let startingBalance = 0;

	if (balanceInput !== '') {
		if (!/^\d{1,10}(\.\d{1,2})?$/.test(balanceInput)) {
			return {
				error: 'Enter a valid balance with up to two decimal places.',
			};
		}

		startingBalance = Number(balanceInput);

		if (
			!Number.isFinite(startingBalance) ||
			startingBalance < 0 ||
			startingBalance > 9999999999.99
		) {
			return {
				error: 'Enter a valid non-negative starting balance.',
			};
		}
	}

	// 4. Perform onboarding atomically in PostgreSQL.
	const { error: onboardingError } = await supabase.rpc(
		'complete_onboarding',
		{
			p_full_name: fullName || null,
			p_starting_balance: startingBalance,
			p_theme: theme,
		},
	);

	if (onboardingError) {
		console.error('Atomic onboarding failed:', onboardingError);

		return {
			error: 'We could not complete your setup. Please try again.',
		};
	}

	// 5. Redirect only after the database operation succeeds.
	redirect('/dashboard');
}
