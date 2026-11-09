import type { Metadata } from 'next';
import { Nunito_Sans, Nunito, Quicksand } from 'next/font/google';
import './globals.css';
import AuthModal from '@/components/UI/AuthForm/AuthModal/AuthModal';
import ReduxProvider from '@/redux/store/Provider';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { isTheme } from '@/types/theme';

const nunitoSans = Nunito_Sans({
	variable: '--font-nunito-sans',
	subsets: ['latin'],
});

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin'],
});

const quicksand = Quicksand({
	variable: '--font-quicksand',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Budgetier',
	description: 'A cozy space to manage budgets and shared expenses.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

	// Use the cookie as the fallback theme.
	const cookieTheme = cookieStore.get('budgetier-theme')?.value;
	let theme = isTheme(cookieTheme) ? cookieTheme : 'light';

	// Check whether a user is authenticated.
	const { data: claimsData, error: claimsError } =
		await supabase.auth.getClaims();

	const userId = claimsData?.claims?.sub;

	if (!claimsError && typeof userId === 'string') {
		// Authenticated users get their saved preference from Supabase.
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('theme')
			.eq('id', userId)
			.maybeSingle();

		if (!profileError && profile && isTheme(profile.theme)) {
			theme = profile.theme;
		}
	}

	return (
		<html
			lang="en"
			className={`${nunitoSans.variable} ${nunito.variable} ${quicksand.variable} h-full antialiased ${theme}`}
		>
			<body className="min-h-full flex flex-col">
				<ReduxProvider>
					<AuthModal />
					{children}
				</ReduxProvider>
			</body>
		</html>
	);
}
