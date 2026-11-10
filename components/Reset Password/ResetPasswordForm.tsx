'use client';

import { useActionState } from 'react';
import { resetPasswordAction } from '@/app/actions/auth';
import type { AuthActionState } from '@/app/actions/auth';
import FormButton from '@/components/UI/AuthForm/FormButton';

const initialState: AuthActionState = {
	error: null,
	success: null,
};

export default function ResetPasswordForm() {
	const [state, formAction, isPending] = useActionState(
		resetPasswordAction,
		initialState,
	);

	return (
		<form action={formAction} className="space-y-4">
			<div>
				<label
					htmlFor="new-password"
					className="mb-1 block text-sm font-medium text-text-primary"
				>
					New Password
				</label>

				<input
					id="new-password"
					type="password"
					name="password"
					autoComplete="new-password"
					required
					minLength={12}
					maxLength={128}
					disabled={isPending}
					placeholder="Enter your new password"
					className="w-full rounded-cozy-sm border border-border bg-card px-4 py-3 text-text-primary outline-none transition focus:border-primary disabled:opacity-60"
				/>
			</div>

			<div>
				<label
					htmlFor="confirm-password"
					className="mb-1 block text-sm font-medium text-text-primary"
				>
					Confirm New Password
				</label>

				<input
					id="confirm-password"
					type="password"
					name="confirm-password"
					autoComplete="new-password"
					required
					minLength={12}
					maxLength={128}
					disabled={isPending}
					placeholder="Confirm your new password"
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
				variant="blush"
				label={isPending ? 'Updating...' : 'Update Password'}
				type="submit"
				disabled={isPending}
			/>
		</form>
	);
}
