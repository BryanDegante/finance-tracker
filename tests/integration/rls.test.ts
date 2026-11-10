import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const testEmailA = env.SUPABASE_TEST_EMAIL;
const testPasswordA = env.SUPABASE_TEST_PASSWORD;

const testEmailB = env.SUPABASE_TEST_EMAIL_B;
const testPasswordB = env.SUPABASE_TEST_PASSWORD_B;

if (
	!supabaseUrl ||
	!supabaseKey ||
	!testEmailA ||
	!testPasswordA ||
	!testEmailB ||
	!testPasswordB
) {
	throw new Error(
		'Missing Supabase integration test environment variables. ' +
			'Configure both test accounts in .env.local.',
	);
}

function createTestClient(storageKey: string): SupabaseClient {
	return createClient(supabaseUrl!, supabaseKey!, {
		auth: {
			storageKey,
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
	});
}

// Each client has an independent authentication session.
const userA = createTestClient('budgetier-rls-integration-user-a');
const userB = createTestClient('budgetier-rls-integration-user-b');

let userAId = '';
let userBId = '';

let accountAId = '';
let accountBId = '';

let originalProfileA: {
	display_name: string | null;
	theme: string;
	onboarding_completed: boolean;
} | null = null;

let originalAccountA: {
	id: string;
	user_id: string;
	name: string;
} | null = null;

describe('Row Level Security integration tests', () => {
	beforeAll(async () => {
		// Authenticate User A.
		const { error: signInErrorA } = await userA.auth.signInWithPassword({
			email: testEmailA!,
			password: testPasswordA!,
		});

		if (signInErrorA) {
			throw new Error(
				`User A authentication failed: ${signInErrorA.message}`,
			);
		}

		const { data: userDataA, error: userErrorA } =
			await userA.auth.getUser();

		if (userErrorA || !userDataA.user) {
			throw new Error('Could not verify the identity of User A.');
		}

		userAId = userDataA.user.id;

		// Authenticate User B independently.
		const { error: signInErrorB } = await userB.auth.signInWithPassword({
			email: testEmailB!,
			password: testPasswordB!,
		});

		if (signInErrorB) {
			throw new Error(
				`User B authentication failed: ${signInErrorB.message}`,
			);
		}

		const { data: userDataB, error: userErrorB } =
			await userB.auth.getUser();

		if (userErrorB || !userDataB.user) {
			throw new Error('Could not verify the identity of User B.');
		}

		userBId = userDataB.user.id;

		// Make sure the accounts are actually different.
		if (userAId === userBId) {
			throw new Error(
				'User A and User B must be different Supabase accounts.',
			);
		}

		// Capture User A's original profile.
		const { data: profileA, error: profileErrorA } = await userA
			.from('profiles')
			.select('display_name, theme, onboarding_completed')
			.eq('id', userAId)
			.single();

		if (profileErrorA || !profileA) {
			throw new Error(
				`Could not load User A's profile: ${profileErrorA?.message}`,
			);
		}

		originalProfileA = profileA;

		// Capture an existing account for User A.
		const { data: accountA, error: accountErrorA } = await userA
			.from('accounts')
			.select('id, user_id, name')
			.eq('user_id', userAId)
			.limit(1)
			.maybeSingle();

		if (accountErrorA || !accountA) {
			throw new Error(
				'User A needs at least one existing account. ' +
					'Complete onboarding for the test account first.',
			);
		}

		accountAId = accountA.id;
		originalAccountA = accountA;

		// Capture an existing account for User B.
		const { data: accountB, error: accountErrorB } = await userB
			.from('accounts')
			.select('id')
			.eq('user_id', userBId)
			.limit(1)
			.maybeSingle();

		if (accountErrorB || !accountB) {
			throw new Error(
				'User B needs at least one existing account. ' +
					'Complete onboarding for the test account first.',
			);
		}

		accountBId = accountB.id;
	});

	afterAll(async () => {
		await Promise.all([userA.auth.signOut(), userB.auth.signOut()]);
	});

	// --------------------------------------------------
	// PROFILE ACCESS
	// --------------------------------------------------

	it('allows each user to read their own profile', async () => {
		const { data: profileA, error: errorA } = await userA
			.from('profiles')
			.select('id')
			.eq('id', userAId)
			.single();

		expect(errorA).toBeNull();
		expect(profileA?.id).toBe(userAId);

		const { data: profileB, error: errorB } = await userB
			.from('profiles')
			.select('id')
			.eq('id', userBId)
			.single();

		expect(errorB).toBeNull();
		expect(profileB?.id).toBe(userBId);
	});

	it('prevents users from reading each other profiles', async () => {
		const { data: dataA, error: errorA } = await userA
			.from('profiles')
			.select('id')
			.eq('id', userBId);

		expect(errorA).toBeNull();
		expect(dataA).toEqual([]);

		const { data: dataB, error: errorB } = await userB
			.from('profiles')
			.select('id')
			.eq('id', userAId);

		expect(errorB).toBeNull();
		expect(dataB).toEqual([]);
	});

	it('prevents users from updating each other profiles', async () => {
		const { data: dataA, error: errorA } = await userA
			.from('profiles')
			.update({ display_name: 'Unauthorized RLS Update' })
			.eq('id', userBId)
			.select('id');

		expect(errorA).toBeNull();
		expect(dataA).toEqual([]);

		const { data: dataB, error: errorB } = await userB
			.from('profiles')
			.update({ display_name: 'Unauthorized RLS Update' })
			.eq('id', userAId)
			.select('id');

		expect(errorB).toBeNull();
		expect(dataB).toEqual([]);

		// Confirm User A's profile was not changed.
		const { data: profileAfter, error: verifyError } = await userA
			.from('profiles')
			.select('display_name, theme, onboarding_completed')
			.eq('id', userAId)
			.single();

		expect(verifyError).toBeNull();
		expect(profileAfter).toEqual(originalProfileA);
	});

	it('prevents users from deleting each other profiles', async () => {
		const { data: dataA, error: errorA } = await userA
			.from('profiles')
			.delete()
			.eq('id', userBId)
			.select('id');

		// RLS may filter the row or reject the operation.
		if (errorA) {
			expect(errorA.code).toBe('42501');
		} else {
			expect(dataA).toEqual([]);
		}

		const { data: dataB, error: errorB } = await userB
			.from('profiles')
			.delete()
			.eq('id', userAId)
			.select('id');

		if (errorB) {
			expect(errorB.code).toBe('42501');
		} else {
			expect(dataB).toEqual([]);
		}

		// Verify both profiles still exist.
		const { data: profileA, error: verifyA } = await userA
			.from('profiles')
			.select('id')
			.eq('id', userAId)
			.single();

		const { data: profileB, error: verifyB } = await userB
			.from('profiles')
			.select('id')
			.eq('id', userBId)
			.single();

		expect(verifyA).toBeNull();
		expect(verifyB).toBeNull();
		expect(profileA?.id).toBe(userAId);
		expect(profileB?.id).toBe(userBId);
	});

	// --------------------------------------------------
	// ACCOUNT ACCESS
	// --------------------------------------------------

	it('allows each user to read their own accounts', async () => {
		const { data: accountsA, error: errorA } = await userA
			.from('accounts')
			.select('id, user_id')
			.eq('user_id', userAId);

		expect(errorA).toBeNull();
		expect(accountsA?.length).toBeGreaterThan(0);
		expect(accountsA?.every((account) => account.user_id === userAId)).toBe(
			true,
		);

		const { data: accountsB, error: errorB } = await userB
			.from('accounts')
			.select('id, user_id')
			.eq('user_id', userBId);

		expect(errorB).toBeNull();
		expect(accountsB?.length).toBeGreaterThan(0);
		expect(accountsB?.every((account) => account.user_id === userBId)).toBe(
			true,
		);
	});

	it('prevents users from reading each other accounts', async () => {
		const { data: dataA, error: errorA } = await userA
			.from('accounts')
			.select('id')
			.eq('user_id', userBId);

		expect(errorA).toBeNull();
		expect(dataA).toEqual([]);

		const { data: dataB, error: errorB } = await userB
			.from('accounts')
			.select('id')
			.eq('user_id', userAId);

		expect(errorB).toBeNull();
		expect(dataB).toEqual([]);
	});

	it('prevents users from updating each other accounts', async () => {
		const { data: dataA, error: errorA } = await userA
			.from('accounts')
			.update({ name: 'Unauthorized RLS Update' })
			.eq('id', accountBId)
			.select('id');

		expect(errorA).toBeNull();
		expect(dataA).toEqual([]);

		const { data: dataB, error: errorB } = await userB
			.from('accounts')
			.update({ name: 'Unauthorized RLS Update' })
			.eq('id', accountAId)
			.select('id');

		expect(errorB).toBeNull();
		expect(dataB).toEqual([]);

		// Verify User A's original account remains unchanged.
		const { data: accountAfter, error: verifyError } = await userA
			.from('accounts')
			.select('id, user_id, name')
			.eq('id', accountAId)
			.single();

		expect(verifyError).toBeNull();
		expect(accountAfter).toEqual(originalAccountA);
	});

	it('prevents users from deleting each other accounts', async () => {
		const { data: dataA, error: errorA } = await userA
			.from('accounts')
			.delete()
			.eq('id', accountBId)
			.select('id');

		expect(errorA).toBeNull();
		expect(dataA).toEqual([]);

		const { data: dataB, error: errorB } = await userB
			.from('accounts')
			.delete()
			.eq('id', accountAId)
			.select('id');

		expect(errorB).toBeNull();
		expect(dataB).toEqual([]);

		// Verify User A's account still exists.
		const { data: accountAfter, error: verifyError } = await userA
			.from('accounts')
			.select('id, user_id')
			.eq('id', accountAId)
			.single();

		expect(verifyError).toBeNull();
		expect(accountAfter?.id).toBe(accountAId);
		expect(accountAfter?.user_id).toBe(userAId);
	});

	// --------------------------------------------------
	// ACCOUNT CREATION
	// --------------------------------------------------

	it('prevents User A from creating an account for User B', async () => {
		const accountName = `RLS Cross-User Test ${crypto.randomUUID()}`;

		const { data, error } = await userA
			.from('accounts')
			.insert({
				user_id: userBId,
				name: accountName,
				account_type: 'checking',
				initial_balance: 0,
			})
			.select('id');

		expect(error).not.toBeNull();
		expect(data).toBeNull();

		// Verify that no account was created.
		const { data: accountsAfter, error: verifyError } = await userB
			.from('accounts')
			.select('id')
			.eq('name', accountName);

		expect(verifyError).toBeNull();
		expect(accountsAfter).toEqual([]);
	});

	it('prevents User B from creating an account for User A', async () => {
		const accountName = `RLS Cross-User Test ${crypto.randomUUID()}`;

		const { data, error } = await userB
			.from('accounts')
			.insert({
				user_id: userAId,
				name: accountName,
				account_type: 'checking',
				initial_balance: 0,
			})
			.select('id');

		expect(error).not.toBeNull();
		expect(data).toBeNull();

		// Verify that no account was created.
		const { data: accountsAfter, error: verifyError } = await userA
			.from('accounts')
			.select('id')
			.eq('name', accountName);

		expect(verifyError).toBeNull();
		expect(accountsAfter).toEqual([]);
	});
});
