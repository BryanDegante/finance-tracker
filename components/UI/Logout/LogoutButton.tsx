'use client';

import { useActionState } from 'react';
import { logoutAction } from '@/app/actions/auth';

export default function LogoutButton() {
	const [error, formAction, isPending] = useActionState(
		async (_previousState: string | null, _formData: FormData) => {
			try {
				await logoutAction();
				return null;
			} catch {
				return 'Unable to sign out. Please try again.';
			}
		},
		null,
	);

	return (
		<form action={formAction}>
			<button
				type="submit"
				disabled={isPending}
				className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isPending ? 'Signing out...' : 'Sign out'}
			</button>

			{error && (
				<p role="alert" className="mt-2 text-sm text-red-600">
					{error}
				</p>
			)}
		</form>
	);
}
