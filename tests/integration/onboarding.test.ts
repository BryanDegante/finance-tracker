import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const testEmail = env.SUPABASE_ONBOARDING_TEST_EMAIL;
const testPassword = env.SUPABASE_ONBOARDING_TEST_PASSWORD;

if (!supabaseUrl || !supabaseKey || !testEmail || !testPassword) {
	throw new Error(
		'Missing Supabase integration test environment variables. ' +
			'Configure the test account in .env.local.',
	);
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
	auth: {
		storageKey: 'budgetier-onboarding-integration-test',
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
});

const anonymousSupabase: SupabaseClient = createClient(
	supabaseUrl,
	supabaseKey,
	{
		auth: {
			storageKey: 'budgetier-anonymous-integration-test',
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
	},
);

let testUserId = '';

/**
 * Reset the dedicated test account so onboarding
 * can be tested repeatedly.
 */
async function resetTestAccount() {
	// Remove the existing Main Account.
	const { error: deleteAccountError } = await supabase
		.from('accounts')
		.delete()
		.eq('user_id', testUserId)
		.eq('name', 'Main Account');

	if (deleteAccountError) {
		throw new Error(
			`Could not reset the test account: ${deleteAccountError.message}`,
		);
	}

	// Reset the profile to an incomplete onboarding state.
	const { error: profileError } = await supabase
		.from('profiles')
		.update({
			full_name: null,
			display_name: null,
			onboarding_completed: false,
			theme: 'light',
		})
		.eq('id', testUserId);

	if (profileError) {
		throw new Error(
			`Could not reset the test profile: ${profileError.message}`,
		);
	}
}

describe('complete_onboarding integration tests', () => {
	beforeAll(async () => {
		// Authenticate the dedicated onboarding test account.
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: testEmail,
			password: testPassword,
		});

		if (signInError) {
			throw new Error(
				`Test user authentication failed: ${signInError.message}`,
			);
		}

		// Retrieve the actual authenticated user's ID.
		const { data: userData, error: userError } =
			await supabase.auth.getUser();

		if (userError || !userData.user) {
			throw new Error(
				'Could not verify the identity of the onboarding test user.',
			);
		}

		testUserId = userData.user.id;

		// Verify the test account has a profile.
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('id')
			.eq('id', testUserId)
			.single();

		if (profileError || !profile) {
			throw new Error(
				`Could not load the test user's profile: ${profileError?.message}`,
			);
		}

		// Make sure the anonymous client has no authenticated session.
		const { data: anonymousSession } =
			await anonymousSupabase.auth.getSession();

		if (anonymousSession.session) {
			throw new Error(
				'Anonymous integration test client unexpectedly has a session.',
			);
		}

		// Start every test run with a clean onboarding state.
		await resetTestAccount();
	});

	afterAll(async () => {
		await Promise.all([
			supabase.auth.signOut(),
			anonymousSupabase.auth.signOut(),
		]);
	});

	// --------------------------------------------------
	// AUTHENTICATION
	// --------------------------------------------------

	it('rejects unauthenticated onboarding requests', async () => {
		const { data: sessionData } = await anonymousSupabase.auth.getSession();

		expect(sessionData.session).toBeNull();

		const { error } = await anonymousSupabase.rpc('complete_onboarding', {
			p_full_name: 'Unauthorized User',
			p_display_name: 'Unauthorized',
			p_starting_balance: 100,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
	});

	// --------------------------------------------------
	// FULL NAME VALIDATION
	// --------------------------------------------------

	it('rejects an empty full name', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: '',
			p_display_name: 'Test User',
			p_starting_balance: 100,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Full name is required');
	});

	it('rejects a full name longer than 60 characters', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'A'.repeat(61),
			p_display_name: 'Test User',
			p_starting_balance: 100,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain(
			'Full name must be 60 characters or fewer',
		);
	});

	// --------------------------------------------------
	// DISPLAY NAME VALIDATION
	// --------------------------------------------------

	it('rejects a display name longer than 60 characters', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_display_name: 'A'.repeat(61),
			p_starting_balance: 100,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain(
			'Display name must be 60 characters or fewer',
		);
	});

	// --------------------------------------------------
	// STARTING BALANCE VALIDATION
	// --------------------------------------------------

	it('rejects a negative starting balance', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_display_name: 'Test User',
			p_starting_balance: -10,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid starting balance');
	});

	it('rejects a balance with more than two decimal places', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_display_name: 'Test User',
			p_starting_balance: 10.123,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid starting balance');
	});

	it('rejects a balance exceeding the maximum permitted amount', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_display_name: 'Test User',
			p_starting_balance: 10000000000,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid starting balance');
	});

	// --------------------------------------------------
	// THEME VALIDATION
	// --------------------------------------------------

	it('rejects an invalid theme', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_display_name: 'Test User',
			p_starting_balance: 100,
			p_theme: 'purple',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid theme');
	});

	// --------------------------------------------------
	// SUCCESSFUL ONBOARDING
	// --------------------------------------------------

	it('stores the full name and custom display name correctly', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Alex Johnson',
			p_display_name: 'Alex',
			p_starting_balance: 500,
			p_theme: 'light',
		});

		expect(error).toBeNull();

		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('full_name, display_name, onboarding_completed, theme')
			.eq('id', testUserId)
			.single();

		expect(profileError).toBeNull();

		expect(profile).toEqual({
			full_name: 'Alex Johnson',
			display_name: 'Alex',
			onboarding_completed: true,
			theme: 'light',
		});
	});

	it('creates the Main Account with the correct starting balance', async () => {
		const { data: account, error } = await supabase
			.from('accounts')
			.select('name, account_type, initial_balance')
			.eq('user_id', testUserId)
			.eq('name', 'Main Account')
			.single();

		expect(error).toBeNull();

		expect(account).toEqual({
			name: 'Main Account',
			account_type: 'checking',
			initial_balance: 500,
		});
	});

	// --------------------------------------------------
	// ONBOARDING IDEMPOTENCY
	// --------------------------------------------------

	it('does not overwrite completed onboarding when called again', async () => {
		// Capture the original profile.
		const { data: profileBefore, error: profileBeforeError } =
			await supabase
				.from('profiles')
				.select('full_name, display_name, theme, onboarding_completed')
				.eq('id', testUserId)
				.single();

		expect(profileBeforeError).toBeNull();
		expect(profileBefore?.onboarding_completed).toBe(true);

		// Capture the original Main Account.
		const { data: accountsBefore, error: accountsBeforeError } =
			await supabase
				.from('accounts')
				.select('id, name, account_type, initial_balance')
				.eq('user_id', testUserId)
				.eq('name', 'Main Account');

		expect(accountsBeforeError).toBeNull();
		expect(accountsBefore).toHaveLength(1);

		// Attempt onboarding again with different values.
		const { error: secondCallError } = await supabase.rpc(
			'complete_onboarding',
			{
				p_full_name: 'Changed Name',
				p_display_name: 'Changed',
				p_starting_balance: 999,
				p_theme: 'dark',
			},
		);

		expect(secondCallError).toBeNull();

		// Confirm neither name nor other profile values changed.
		const { data: profileAfter, error: profileAfterError } = await supabase
			.from('profiles')
			.select('full_name, display_name, theme, onboarding_completed')
			.eq('id', testUserId)
			.single();

		expect(profileAfterError).toBeNull();
		expect(profileAfter).toEqual(profileBefore);

		// Confirm the Main Account was not duplicated or changed.
		const { data: accountsAfter, error: accountsAfterError } =
			await supabase
				.from('accounts')
				.select('id, name, account_type, initial_balance')
				.eq('user_id', testUserId)
				.eq('name', 'Main Account');

		expect(accountsAfterError).toBeNull();
		expect(accountsAfter).toEqual(accountsBefore);
	});

	// --------------------------------------------------
	// DISPLAY NAME FALLBACK
	// --------------------------------------------------

	it('uses the full name when the display name is blank', async () => {
		// Reset the account so onboarding can run again.
		await resetTestAccount();

		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Jordan Smith',
			p_display_name: '   ',
			p_starting_balance: 0,
			p_theme: 'dark',
		});

		expect(error).toBeNull();

		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('full_name, display_name, onboarding_completed, theme')
			.eq('id', testUserId)
			.single();

		expect(profileError).toBeNull();

		expect(profile).toEqual({
			full_name: 'Jordan Smith',
			display_name: 'Jordan Smith',
			onboarding_completed: true,
			theme: 'dark',
		});
	});

	// --------------------------------------------------
	// DEFAULT STARTING BALANCE
	// --------------------------------------------------

	it('creates a Main Account with a zero balance when no balance is provided', async () => {
		// Reset the account for another onboarding run.
		await resetTestAccount();

		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Taylor Smith',
			p_display_name: 'Taylor',
			p_starting_balance: 0,
			p_theme: 'light',
		});

		expect(error).toBeNull();

		const { data: account, error: accountError } = await supabase
			.from('accounts')
			.select('initial_balance')
			.eq('user_id', testUserId)
			.eq('name', 'Main Account')
			.single();

		expect(accountError).toBeNull();
		expect(account?.initial_balance).toBe(0);
	});
});
