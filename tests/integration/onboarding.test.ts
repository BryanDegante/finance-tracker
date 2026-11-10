import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const testEmail = env.SUPABASE_TEST_EMAIL;
const testPassword = env.SUPABASE_TEST_PASSWORD;

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

describe('complete_onboarding integration tests', () => {
	beforeAll(async () => {
		// Authenticate the dedicated onboarding test account.
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: testEmail!,
			password: testPassword!,
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

		// Verify the test account has completed onboarding.
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('id, onboarding_completed')
			.eq('id', testUserId)
			.single();

		if (profileError || !profile) {
			throw new Error(
				`Could not load the test user's profile: ${profileError?.message}`,
			);
		}

		if (!profile.onboarding_completed) {
			throw new Error(
				'The onboarding integration test account must have completed onboarding.',
			);
		}

		// Verify the expected Main Account exists.
		const { data: account, error: accountError } = await supabase
			.from('accounts')
			.select('id')
			.eq('user_id', testUserId)
			.eq('name', 'Main Account')
			.maybeSingle();

		if (accountError || !account) {
			throw new Error(
				'The onboarding integration test account needs a Main Account.',
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
			p_starting_balance: 100,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
	});

	// --------------------------------------------------
	// INPUT VALIDATION
	// --------------------------------------------------

	it('rejects a negative starting balance', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_starting_balance: -10,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid starting balance');
	});

	it('rejects a balance with more than two decimal places', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_starting_balance: 10.123,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid starting balance');
	});

	it('rejects a balance exceeding the maximum permitted amount', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_starting_balance: 10000000000,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid starting balance');
	});

	it('rejects a name longer than 60 characters', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'A'.repeat(61),
			p_starting_balance: 100,
			p_theme: 'light',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Name must be 60 characters or fewer');
	});

	it('rejects an invalid theme', async () => {
		const { error } = await supabase.rpc('complete_onboarding', {
			p_full_name: 'Integration Test',
			p_starting_balance: 100,
			p_theme: 'purple',
		});

		expect(error).not.toBeNull();
		expect(error?.message).toContain('Invalid theme');
	});

	// --------------------------------------------------
	// ONBOARDING IDEMPOTENCY
	// --------------------------------------------------

	it('does not change completed onboarding when called again', async () => {
		// Capture the original profile.
		const { data: profileBefore, error: profileBeforeError } =
			await supabase
				.from('profiles')
				.select('display_name, theme, onboarding_completed')
				.eq('id', testUserId)
				.single();

		expect(profileBeforeError).toBeNull();
		expect(profileBefore).not.toBeNull();
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

		// Attempt to complete onboarding again with different values.
		const { error: secondCallError } = await supabase.rpc(
			'complete_onboarding',
			{
				p_full_name: 'Changed Name',
				p_starting_balance: 999,
				p_theme: profileBefore?.theme === 'dark' ? 'light' : 'dark',
			},
		);

		expect(secondCallError).toBeNull();

		// Confirm the profile was not overwritten.
		const { data: profileAfter, error: profileAfterError } = await supabase
			.from('profiles')
			.select('display_name, theme, onboarding_completed')
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
});
