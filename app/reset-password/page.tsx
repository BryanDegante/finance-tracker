import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import ResetPasswordForm from '@/components/Reset Password/ResetPasswordForm';

export default async function ResetPasswordPage() {
	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect('/');
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
			<div className="w-full max-w-md rounded-cozy bg-card p-6 shadow-cozy sm:p-8">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold text-text-primary">
						Reset Your Password
					</h1>

					<p className="mt-2 text-sm text-text-secondary">
						Choose a new password for your Budgetier account.
					</p>
				</div>

				<ResetPasswordForm />
			</div>
		</main>
	);
}
