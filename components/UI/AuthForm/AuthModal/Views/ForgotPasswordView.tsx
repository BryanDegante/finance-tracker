'use client';

import { useActionState } from 'react';
import { forgotPasswordAction, type AuthActionState } from '@/app/actions/auth';
import FormButton from '../../FormButton';

const initialState: AuthActionState = {
	error: null,
	success: null,
};

export default function ForgotPasswordView() {
	const [state, formAction, isPending] = useActionState(
		forgotPasswordAction,
		initialState,
	);

	return (
		<div className="w-full">
			<div className="mb-6 text-center">
				<h2 className="text-2xl font-bold text-text-primary">
					Forgot Password?
				</h2>

				<p className="mt-2 text-sm text-text-secondary">
					Enter your email address and we&apos;ll send you a link to
					reset your password.
				</p>
			</div>

			<form action={formAction} className="space-y-4">
				<div>
					<label
						htmlFor="forgot-password-email"
						className="mb-1 block text-sm font-medium text-text-primary"
					>
						Email
					</label>

					<input
						id="forgot-password-email"
						type="email"
						name="email"
						autoComplete="email"
						required
						maxLength={254}
						disabled={isPending}
						placeholder="you@example.com"
						className="w-full rounded-cozy-sm border border-border bg-card px-4 py-3 text-text-primary outline-none transition focus:border-primary disabled:opacity-60"
					/>
				</div>

				{state.error && (
					<p role="alert" className="text-sm text-red-500">
						{state.error}
					</p>
				)}

				{state.success && (
					<p role="status" className="text-sm text-secondary">
						{state.success}
					</p>
				)}

				<FormButton
					label={isPending ? 'Sending...' : 'Send Reset Link'}
                    type="submit"
                    variant='sage'
					disabled={isPending}
				/>
			</form>
		</div>
	);
}
