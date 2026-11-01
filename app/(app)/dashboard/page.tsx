import FinanceOverview from '@/components/Dashboard/FinanceOverview';
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
    .select('display_name, currency_code, onboarding_completed')
    .eq('id', claims.sub)
    .maybeSingle();

  if (profileError) {
    throw new Error('Unable to load your profile.');
  }

  if (!profile) {
    throw new Error('Your profile could not be found.');
  }

  if (!profile.onboarding_completed) {
    redirect('/onboarding');
  }

  const currencyCode = profile.currency_code ?? 'USD';

  return (
    <main className='min-h-screen p-6'>
			<FinanceOverview />
    </main>
  );
}
