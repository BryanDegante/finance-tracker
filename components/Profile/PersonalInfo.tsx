export default function PersonalInfo() {
	return (
		<section
			aria-labelledby="personal-info-heading"
			className="flex flex-col gap-4 my-6 bg-card p-6 sm:p-8 rounded-cozy"
		>
			<h2
				id="personal-info-heading"
				className="text-text-primary text-lg sm:text-xl font-semibold font-nunito-titles"
			>
				Personal Information
			</h2>

			<div className="bg-card-muted p-3 sm:p-4 rounded-cozy-sm">
				<label className='text-text-primary' htmlFor="fullName">Full Name</label>
				{/* Full name field */}
			</div>

			<div className="bg-card-muted p-3 sm:p-4 rounded-cozy-sm">
				<label className='text-text-primary' htmlFor="displayName">Display Name</label>
				{/* Display name field */}
			</div>
		</section>
	);
}
