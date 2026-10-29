import LogoutButton from '@/components/UI/Logout/LogoutButton';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);
	const { data, error } = await supabase.auth.getClaims();

	const claims = data?.claims;

	if (error || !claims?.sub) {
		redirect('/');
	}

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('display_name, currency_code')
		.eq('id', claims.sub)
		.maybeSingle();

	if (profileError) {
		throw new Error('Unable to load your profile.');
	}

	return (
		<main className="min-h-screen p-6">
			<div className="mx-auto max-w-5xl">
				<h1 className="text-2xl font-semibold">
					Welcome
					{profile?.display_name ? `, ${profile.display_name}` : ''}
				</h1>

				<p className="mt-2 text-sm text-gray-600">
					Your personal finance dashboard
				</p>

				<p className="mt-6 text-sm">
					Preferred currency: {profile?.currency_code ?? 'USD'}
				</p>
				<div className="mt-8">
					<LogoutButton />
				</div>
			</div>
		</main>
	);
}
