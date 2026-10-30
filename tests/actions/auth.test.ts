import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
	mockCreateClient,
	mockCookies,
	mockRedirect,
	mockSignInWithPassword,
	mockSignUp,
	mockSignOut,
} = vi.hoisted(() => ({
	mockCreateClient: vi.fn(),
	mockCookies: vi.fn(),
	mockRedirect: vi.fn(),
	mockSignInWithPassword: vi.fn(),
	mockSignUp: vi.fn(),
	mockSignOut: vi.fn(),
}));

vi.mock('@/utils/supabase/server', () => ({
	createClient: mockCreateClient,
}));

vi.mock('next/headers', () => ({
	cookies: mockCookies,
}));

vi.mock('next/navigation', () => ({
	redirect: mockRedirect,
}));

import {
	loginAction,
	logoutAction,
	signUpAction,
} from '@/app/actions/auth';

describe('Authentication actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';

		mockCookies.mockResolvedValue({});

		mockCreateClient.mockReturnValue({
			auth: {
				signInWithPassword: mockSignInWithPassword,
				signUp: mockSignUp,
				signOut: mockSignOut,
			},
		});

		mockRedirect.mockImplementation((path: string) => {
			throw new Error(`NEXT_REDIRECT:${path}`);
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('loginAction', () => {
		it('rejects missing email and password', async () => {
			const formData = new FormData();

			const result = await loginAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Please enter a valid email and password.',
			});

			expect(mockCreateClient).not.toHaveBeenCalled();
			expect(mockSignInWithPassword).not.toHaveBeenCalled();
		});

		it('rejects an invalid email address', async () => {
			const formData = new FormData();
			formData.set('email', 'not-an-email');
			formData.set('password', 'a-valid-password');

			const result = await loginAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Please enter a valid email and password.',
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
		});

		it('rejects a password longer than the permitted limit', async () => {
			const formData = new FormData();
			formData.set('email', 'user@example.com');
			formData.set('password', 'a'.repeat(1025));

			const result = await loginAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Please enter a valid email and password.',
			});

			expect(mockSignInWithPassword).not.toHaveBeenCalled();
		});

		it('returns a generic error when Supabase rejects credentials', async () => {
			mockSignInWithPassword.mockResolvedValue({
				error: { message: 'Invalid login credentials' },
			});

			const formData = new FormData();
			formData.set('email', 'user@example.com');
			formData.set('password', 'incorrect-password');

			const result = await loginAction({ error: null }, formData);

			expect(result).toEqual({
				error:
					'Unable to sign in with those credentials. Please check them and try again.',
			});

			expect(mockSignInWithPassword).toHaveBeenCalledWith({
				email: 'user@example.com',
				password: 'incorrect-password',
			});

			expect(mockRedirect).not.toHaveBeenCalled();
		});

		it('trims the email address before signing in', async () => {
			mockSignInWithPassword.mockResolvedValue({
				error: { message: 'Invalid login credentials' },
			});

			const formData = new FormData();
			formData.set('email', '  user@example.com  ');
			formData.set('password', 'correct-password');

			await loginAction({ error: null }, formData);

			expect(mockSignInWithPassword).toHaveBeenCalledWith({
				email: 'user@example.com',
				password: 'correct-password',
			});
		});

		it('redirects to the dashboard after successful login', async () => {
			mockSignInWithPassword.mockResolvedValue({
				error: null,
			});

			const formData = new FormData();
			formData.set('email', 'user@example.com');
			formData.set('password', 'correct-password');

			await expect(
				loginAction({ error: null }, formData),
			).rejects.toThrow('NEXT_REDIRECT:/dashboard');

			expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
		});
	});

	describe('signUpAction', () => {
		function createSignUpForm(overrides: Record<string, string> = {}) {
			const formData = new FormData();

			formData.set('name', 'Test User');
			formData.set('email', 'user@example.com');
			formData.set('password', 'secure-password-123');
			formData.set('confirm-password', 'secure-password-123');

			for (const [key, value] of Object.entries(overrides)) {
				formData.set(key, value);
			}

			return formData;
		}

		it('rejects missing required fields', async () => {
			const formData = new FormData();

			const result = await signUpAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Please complete all fields.',
				success: null,
			});

			expect(mockCreateClient).not.toHaveBeenCalled();
			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('rejects a name longer than 80 characters', async () => {
			const formData = createSignUpForm({
				name: 'A'.repeat(81),
			});

			const result = await signUpAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Your name must be between 1 and 80 characters.',
				success: null,
			});

			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('rejects an invalid email address', async () => {
			const formData = createSignUpForm({
				email: 'invalid-email',
			});

			const result = await signUpAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Please enter a valid email address.',
				success: null,
			});

			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('rejects a password shorter than 12 characters', async () => {
			const formData = createSignUpForm({
				password: 'short',
				'confirm-password': 'short',
			});

			const result = await signUpAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Your password must be between 12 and 128 characters.',
				success: null,
			});

			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('rejects a password longer than 128 characters', async () => {
			const password = 'a'.repeat(129);

			const formData = createSignUpForm({
				password,
				'confirm-password': password,
			});

			const result = await signUpAction({ error: null }, formData);

			expect(result).toEqual({
				error: 'Your password must be between 12 and 128 characters.',
				success: null,
			});

			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('rejects passwords that do not match', async () => {
			const formData = createSignUpForm({
				password: 'secure-password-123',
				'confirm-password': 'different-password-456',
			});

			const result = await signUpAction({ error: null }, formData);

			expect(result).toEqual({
				error: "Passwords don't match.",
				success: null,
			});

			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('fails safely when the site URL is missing', async () => {
			delete process.env.NEXT_PUBLIC_SITE_URL;

			vi.spyOn(console, 'error').mockImplementation(() => {});

			const result = await signUpAction(
				{ error: null },
				createSignUpForm(),
			);

			expect(result).toEqual({
				error:
					'Account creation is temporarily unavailable. Please try again later.',
				success: null,
			});

			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('rejects an insecure production site URL', async () => {
			process.env.NEXT_PUBLIC_SITE_URL = 'http://example.com';

			vi.spyOn(console, 'error').mockImplementation(() => {});

			const result = await signUpAction(
				{ error: null },
				createSignUpForm(),
			);

			expect(result).toEqual({
				error:
					'Account creation is temporarily unavailable. Please try again later.',
				success: null,
			});

			expect(mockSignUp).not.toHaveBeenCalled();
		});

		it('sends the correct registration data to Supabase', async () => {
			mockSignUp.mockResolvedValue({
				data: { session: null },
				error: null,
			});

			await signUpAction(
				{ error: null },
				createSignUpForm(),
			);

			expect(mockSignUp).toHaveBeenCalledWith({
				email: 'user@example.com',
				password: 'secure-password-123',
				options: {
					data: {
						display_name: 'Test User',
					},
					emailRedirectTo: 'http://localhost:3000/auth/confirm',
				},
			});
		});

		it('returns a confirmation message after registration', async () => {
			mockSignUp.mockResolvedValue({
				data: { session: null },
				error: null,
			});

			const result = await signUpAction(
				{ error: null },
				createSignUpForm(),
			);

			expect(result).toEqual({
				error: null,
				success:
					'If you can register with these details, check your inbox for an email confirmation link.',
			});
		});

		it('does not reveal whether an email already has an account', async () => {
			mockSignUp.mockResolvedValue({
				data: { user: null, session: null },
				error: {
					code: 'user_already_exists',
					message: 'User already registered',
				},
			});

			const result = await signUpAction(
				{ error: null },
				createSignUpForm(),
			);

			expect(result).toEqual({
				error: null,
				success:
					'If you can register with these details, check your inbox for an email confirmation link.',
			});
		});

		it('returns a safe error when Supabase registration fails', async () => {
			mockSignUp.mockResolvedValue({
				data: { user: null, session: null },
				error: {
					code: 'unexpected_error',
					message: 'Internal provider details',
				},
			});

			vi.spyOn(console, 'error').mockImplementation(() => {});

			const result = await signUpAction(
				{ error: null },
				createSignUpForm(),
			);

			expect(result).toEqual({
				error:
					'Unable to create your account with those details. Please try again.',
				success: null,
			});
		});

		it('redirects to the dashboard when registration creates a session', async () => {
			mockSignUp.mockResolvedValue({
				data: {
					session: { access_token: 'test-token' },
				},
				error: null,
			});

			await expect(
				signUpAction({ error: null }, createSignUpForm()),
			).rejects.toThrow('NEXT_REDIRECT:/dashboard');

			expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
		});
	});

	describe('logoutAction', () => {
		it('signs the user out and redirects to the home page', async () => {
			mockSignOut.mockResolvedValue({
				error: null,
			});

			await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT:/');

			expect(mockSignOut).toHaveBeenCalledOnce();
			expect(mockRedirect).toHaveBeenCalledWith('/');
		});

		it('throws a safe error when sign-out fails', async () => {
			mockSignOut.mockResolvedValue({
				error: { message: 'Internal provider details' },
			});

			vi.spyOn(console, 'error').mockImplementation(() => {});

			await expect(logoutAction()).rejects.toThrow(
				'Unable to sign out. Please try again.',
			);

			expect(mockSignOut).toHaveBeenCalledOnce();
			expect(mockRedirect).not.toHaveBeenCalled();
		});
	});
});