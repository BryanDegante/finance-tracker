import type { OnboardingStepProps } from '@/types/onboarding';

export default function ProfileStep({ data, updateData }: OnboardingStepProps) {
	return (
		<div className="flex flex-col gap-7">
			{/* Step Heading */}
			<div className="space-y-2">
				<h2 className="font-nunito-titles text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
					Let’s personalize your space.
				</h2>

				<p className="max-w-lg text-sm leading-relaxed text-text-muted sm:text-base">
					A few details will help make Budgetier feel more like yours.
					You can leave the optional fields blank and update them
					anytime.
				</p>
			</div>

			<div className="flex flex-col gap-5">
				{/* Full Name */}
				<div className="space-y-2">
					<label
						htmlFor="fullName"
						className="block text-sm font-semibold text-text-primary"
					>
						What’s your full name?
						<span className="ml-2 text-xs font-normal text-danger">
							Required
						</span>
					</label>

					<input
						id="fullName"
						name="fullName"
						type="text"
						autoComplete="name"
						maxLength={60}
						required
						value={data.fullName}
						onChange={(event) =>
							updateData({ fullName: event.target.value })
						}
						placeholder="Your full name"
						className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary transition-colors placeholder:text-text-muted/80 hover:border-border-hover focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
					/>
				</div>

				{/* Display Name */}
				<div className="space-y-2">
					<label
						htmlFor="displayName"
						className="block text-sm font-semibold text-text-primary"
					>
						What should we call you?
						<span className="ml-2 text-xs font-normal text-text-muted">
							Optional
						</span>
					</label>

					<input
						id="displayName"
						name="displayName"
						type="text"
						autoComplete="nickname"
						maxLength={60}
						value={data.displayName}
						onChange={(event) =>
							updateData({ displayName: event.target.value })
						}
						placeholder="Your preferred name"
						className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary transition-colors placeholder:text-text-muted/80 hover:border-border-hover focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
					/>
				</div>

				{/* Starting Balance */}
				<div className="space-y-2">
					<label
						htmlFor="startingBalance"
						className="block text-sm font-semibold text-text-primary"
					>
						Starting balance
						<span className="ml-2 text-xs font-normal text-text-muted">
							Optional
						</span>
					</label>

					<p className="text-xs leading-relaxed text-text-muted">
						How much money do you currently have available?
					</p>

					<div className="relative">
						<span
							aria-hidden="true"
							className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted"
						>
							$
						</span>

						<input
							id="startingBalance"
							name="startingBalance"
							type="number"
							inputMode="decimal"
							min="0"
							step="0.01"
							value={data.startingBalance}
							onChange={(event) =>
								updateData({
									startingBalance: event.target.value,
								})
							}
							placeholder="0.00"
							className="w-full rounded-xl border border-border bg-card py-3 pl-8 pr-4 text-text-primary transition-colors placeholder:text-text-muted/80 hover:border-border-hover focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
						/>
					</div>
				</div>
			</div>

			<p className="text-xs leading-relaxed text-text-muted">
				Your financial details should stay private. You can review and
				update your information as your finances change.
			</p>
		</div>
	);
}
