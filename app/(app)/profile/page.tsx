import PersonalInfo from "@/components/Profile/PersonalInfo";
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { updateProfileAction } from "@/app/actions/profile";
import EmailAddress from "@/components/Profile/EmailAddress";

export default async function Profile() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  redirect('/');
}

const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('display_name, full_name, onboarding_completed')
  .eq('id', user.id)
  .maybeSingle();

if (profileError) {
  throw new Error('Unable to load your settings.');
}

if (!profile) {
  throw new Error('Your profile could not be found.');
}

if (!profile.onboarding_completed) {
  redirect('/onboarding');
}

const fullName = profile.full_name;
const displayName = profile.display_name;
const email = user.email ?? '';


  return (
    <main className="min-h-screen p-4 sm:p-6 ">
      <div className="max-w-6xl w-full mx-auto">

			<h1 className="font-nunito-titles text-2xl font-bold text-text-primary">
				Profile
      </h1>
      <PersonalInfo fullName={fullName} displayName={displayName} onSave={updateProfileAction}/>
      <EmailAddress emailAddress={email}/>
      </div>
		</main>
  );
}
