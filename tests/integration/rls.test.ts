
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

const expectedUserAId = '4488f5bc-f77c-4559-8d00-ac61ef6d8f51';

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

// Each client has a unique storage key and an independent auth session.
const userA = createTestClient('budgetier-rls-integration-user-a');
const userB = createTestClient('budgetier-rls-integration-user-b');

let userAId = '';
let userBId = '';
let accountAId = '';

let originalProfileA: {
  display_name: string | null;
  theme: string;
  onboarding_completed: boolean;
} | null = null;

describe('Row Level Security integration tests', () => {
  beforeAll(async () => {
    // Authenticate User A.
    const { error: signInErrorA } =
      await userA.auth.signInWithPassword({
        email: testEmailA!,
        password: testPasswordA!,
      });

    if (signInErrorA) {
      throw new Error(
        `Test User A authentication failed: ${signInErrorA.message}`,
      );
    }

    const { data: userDataA, error: userErrorA } =
      await userA.auth.getUser();

    if (
      userErrorA ||
      !userDataA.user ||
      userDataA.user.id !== expectedUserAId
    ) {
      throw new Error(
        'User A does not match the designated integration test account.',
      );
    }

    userAId = userDataA.user.id;

    // Authenticate User B independently.
    const { error: signInErrorB } =
      await userB.auth.signInWithPassword({
        email: testEmailB!,
        password: testPasswordB!,
      });

    if (signInErrorB) {
      throw new Error(
        `Test User B authentication failed: ${signInErrorB.message}`,
      );
    }

    const { data: userDataB, error: userErrorB } =
      await userB.auth.getUser();

    if (userErrorB || !userDataB.user) {
      throw new Error('Could not verify the identity of User B.');
    }

    userBId = userDataB.user.id;

    if (userAId === userBId) {
      throw new Error(
        'User A and User B must be different Supabase accounts.',
      );
    }

    // Read User A's profile without modifying it.
    const { data: profile, error: profileError } = await userA
      .from('profiles')
      .select('display_name, theme, onboarding_completed')
      .eq('id', userAId)
      .single();

    if (profileError || !profile) {
      throw new Error(
        `Could not load User A's profile: ${
          profileError?.message ?? 'Profile not found'
        }`,
      );
    }

    originalProfileA = profile;

    // Capture an existing account owned by User A.
    const { data: account, error: accountError } = await userA
      .from('accounts')
      .select('id')
      .eq('user_id', userAId)
      .limit(1)
      .maybeSingle();

    if (accountError || !account) {
      throw new Error(
        'User A needs at least one existing account for the RLS tests. ' +
          'Complete onboarding for the dedicated test account first.',
      );
    }

    accountAId = account.id;
  });

  afterAll(async () => {
    await userA.auth.signOut();
    await userB.auth.signOut();
  });

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

  it('prevents User A from reading User B profile', async () => {
    const { data, error } = await userA
      .from('profiles')
      .select('id')
      .eq('id', userBId);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('prevents User B from reading User A profile', async () => {
    const { data, error } = await userB
      .from('profiles')
      .select('id')
      .eq('id', userAId);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('prevents User A from reading User B accounts', async () => {
    const { data, error } = await userA
      .from('accounts')
      .select('id')
      .eq('user_id', userBId);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('prevents User B from reading User A accounts', async () => {
    const { data, error } = await userB
      .from('accounts')
      .select('id')
      .eq('user_id', userAId);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('prevents User B from updating User A profile', async () => {
    const { data, error } = await userB
      .from('profiles')
      .update({
        display_name: 'Unauthorized RLS Update',
      })
      .eq('id', userAId)
      .select('id');

    expect(error).toBeNull();
    expect(data).toEqual([]);

    // Verify the original profile remains unchanged.
    const { data: profileAfter, error: verifyError } = await userA
      .from('profiles')
      .select('display_name, theme, onboarding_completed')
      .eq('id', userAId)
      .single();

    expect(verifyError).toBeNull();
    expect(profileAfter).toEqual(originalProfileA);
  });

  it('prevents User B from deleting User A profile', async () => {
    const { data, error } = await userB
      .from('profiles')
      .delete()
      .eq('id', userAId)
      .select('id');

    // Profile deletion is intentionally unavailable to authenticated users.
    expect(error).not.toBeNull();
    expect(error?.code).toBe('42501');

    // Verify User A's profile still exists.
    const { data: profileAfter, error: verifyError } = await userA
      .from('profiles')
      .select('id')
      .eq('id', userAId)
      .single();

    expect(verifyError).toBeNull();
    expect(profileAfter?.id).toBe(userAId);

    // The attempted deletion must not return any deleted records.
    expect(data).toBeNull();
  });

  it('prevents User B from updating User A account', async () => {
    const { data, error } = await userB
      .from('accounts')
      .update({
        name: 'Unauthorized RLS Update',
      })
      .eq('id', accountAId)
      .eq('user_id', userAId)
      .select('id');

    expect(error).toBeNull();
    expect(data).toEqual([]);

    // Verify the original account still exists and remains owned by User A.
    const { data: accountAfter, error: verifyError } = await userA
      .from('accounts')
      .select('id, user_id')
      .eq('id', accountAId)
      .single();

    expect(verifyError).toBeNull();
    expect(accountAfter?.id).toBe(accountAId);
    expect(accountAfter?.user_id).toBe(userAId);
  });

  it('prevents User B from deleting User A account', async () => {
    const { data, error } = await userB
      .from('accounts')
      .delete()
      .eq('id', accountAId)
      .eq('user_id', userAId)
      .select('id');

    expect(error).toBeNull();
    expect(data).toEqual([]);

    // Verify the original account still exists.
    const { data: accountAfter, error: verifyError } = await userA
      .from('accounts')
      .select('id')
      .eq('id', accountAId)
      .single();

    expect(verifyError).toBeNull();
    expect(accountAfter?.id).toBe(accountAId);
  });

  it('prevents User B from creating an account for User A', async () => {
    const accountName = `RLS Cross-User Test ${Date.now()}`;

    const { data, error } = await userB
      .from('accounts')
      .insert({
        user_id: userAId,
        name: accountName,
        account_type: 'checking',
        initial_balance: 0,
      })
      .select('id');

    // Either a database error or zero inserted rows is an acceptable denial.
    expect(error !== null || (data?.length ?? 0) === 0).toBe(true);

    const { data: accountsAfter, error: verifyError } = await userA
      .from('accounts')
      .select('id')
      .eq('user_id', userAId)
      .eq('name', accountName);

    expect(verifyError).toBeNull();
    expect(accountsAfter).toEqual([]);
  });

  it('prevents User A from creating an account for User B', async () => {
    const accountName = `RLS Cross-User Test ${Date.now()}`;

    const { data, error } = await userA
      .from('accounts')
      .insert({
        user_id: userBId,
        name: accountName,
        account_type: 'checking',
        initial_balance: 0,
      })
      .select('id');

    expect(error !== null || (data?.length ?? 0) === 0).toBe(true);

    const { data: accountsAfter, error: verifyError } = await userB
      .from('accounts')
      .select('id')
      .eq('user_id', userBId)
      .eq('name', accountName);

    expect(verifyError).toBeNull();
    expect(accountsAfter).toEqual([]);
  });
});