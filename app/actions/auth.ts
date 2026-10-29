'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AuthActionState = {
	error: string | null;
	success?: string | null;
};

// LOGIN
export async function loginAction(
	_previousState: AuthActionState,
	formData: FormData,
): Promise<AuthActionState> {
	const emailValue = formData.get('email');
	const passwordValue = formData.get('password');

	if (typeof emailValue !== 'string' || typeof passwordValue !== 'string') {
		return { error: 'Please enter a valid email and password.' };
	}

	const email = emailValue.trim();
	const password = passwordValue;

	if (
		!email ||
		email.length > 254 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
		!password ||
		password.length > 1024
	) {
		return { error: 'Please enter a valid email and password.' };
	}

	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return {
			error: 'Unable to sign in with those credentials. Please check them and try again.',
		};
	}

	redirect('/dashboard');
}

// SIGN UP
export async function signUpAction(
	_previousState: AuthActionState,
	formData: FormData,
): Promise<AuthActionState> {
	const nameValue = formData.get('name');
	const emailValue = formData.get('email');
	const passwordValue = formData.get('password');
	const confirmPasswordValue = formData.get('confirm-password');

	if (
		typeof nameValue !== 'string' ||
		typeof emailValue !== 'string' ||
		typeof passwordValue !== 'string' ||
		typeof confirmPasswordValue !== 'string'
	) {
		return {
			error: 'Please complete all fields.',
			success: null,
		};
	}

	const name = nameValue.trim();
	const email = emailValue.trim();
	const password = passwordValue;
	const confirmPassword = confirmPasswordValue;

	if (!name || name.length > 80) {
		return {
			error: 'Your name must be between 1 and 80 characters.',
			success: null,
		};
	}

	if (
		!email ||
		email.length > 254 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	) {
		return {
			error: 'Please enter a valid email address.',
			success: null,
		};
	}

	if (password.length < 12 || password.length > 128) {
		return {
			error: 'Your password must be between 12 and 128 characters.',
			success: null,
		};
	}

	if (password !== confirmPassword) {
		return {
			error: "Passwords don't match.",
			success: null,
		};
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	if (!siteUrl) {
		console.error('NEXT_PUBLIC_SITE_URL is not configured.');

		return {
			error: 'Account creation is temporarily unavailable. Please try again later.',
			success: null,
		};
	}

	let emailRedirectTo: string;

	try {
		const configuredUrl = new URL(siteUrl);

		const isHttps = configuredUrl.protocol === 'https:';
		const isLocalHttp =
			configuredUrl.protocol === 'http:' &&
			(configuredUrl.hostname === 'localhost' ||
				configuredUrl.hostname === '127.0.0.1' ||
				configuredUrl.hostname === '[::1]');

		if (!isHttps && !isLocalHttp) {
			throw new Error('The application URL must use HTTPS.');
		}

		if (configuredUrl.username || configuredUrl.password) {
			throw new Error(
				'The application URL must not contain credentials.',
			);
		}

		emailRedirectTo = new URL('/auth/confirm', configuredUrl).toString();
	} catch {
		console.error('NEXT_PUBLIC_SITE_URL is invalid.');

		return {
			error: 'Account creation is temporarily unavailable. Please try again later.',
			success: null,
		};
	}

	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

	const genericSignupSuccess =
		'If you can register with these details, check your inbox for an email confirmation link.';

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				display_name: name,
			},
			emailRedirectTo,
		},
	});

	if (error) {
		if (
			error.code === 'user_already_exists' ||
			error.code === 'email_exists'
		) {
			return {
				error: null,
				success: genericSignupSuccess,
			};
		}

		console.error('Supabase signup failed:', error.code);

		return {
			error: 'Unable to create your account with those details. Please try again.',
			success: null,
		};
	}

	if (data.session) {
		redirect('/dashboard');
	}

	return {
		error: null,
		success: genericSignupSuccess,
	};
}

// LOGOUT
export async function logoutAction(): Promise<void> {
	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error('Supabase sign-out failed:', error.message);
		throw new Error('Unable to sign out. Please try again.');
	}

	redirect('/');
}
