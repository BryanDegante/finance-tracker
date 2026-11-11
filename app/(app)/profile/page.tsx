import PersonalInfo from "@/components/Profile/PersonalInfo";

export default function Profile() {
  return (
    <main className="min-h-screen p-4 sm:p-6 ">
      <div className="max-w-6xl w-full mx-auto">

			<h1 className="font-nunito-titles text-2xl font-bold text-text-primary">
				Profile
      </h1>
      <PersonalInfo />
      </div>
		</main>
  );
}
