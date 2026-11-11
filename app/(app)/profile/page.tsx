import PersonalInfo from "@/components/Profile/PersonalInfo";

export default function Profile() {
  return (
		<main className="min-h-screen p-6">
			<h1 className="font-nunito-titles text-2xl font-bold text-text-primary">
				Settings
      </h1>
      <PersonalInfo />
		</main>
  );
}
