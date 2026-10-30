import type { OnboardingData } from '@/types/onboarding';
import { FaCheck } from 'react-icons/fa6';

export default function Completion({ data }: { data: OnboardingData }) {
	return (
		<div className="flex flex-col items-center gap-7 py-6 text-center">
			{/* Success Icon */}
			<div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-primary/20 shadow-sm">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-text-on-primary">
					<FaCheck aria-hidden="true" className="text-2xl" />
				</div>
			</div>

			{/* Welcome Message */}
			<div className="space-y-3">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
					Setup complete
				</p>

				<h2 className="font-quicksand text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
					You’re all set
					{data.fullName.trim() ? `, ${data.fullName.trim()}` : ''}!
				</h2>

				<p className="mx-auto max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
					Your financial space is ready for you. Take a breath, start
					at your own pace, and remember that every small step toward
					understanding your money counts.
				</p>
			</div>

			{/* Setup Summary */}
			{(data.primaryGoal || data.appMode) && (
				<div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left">
					<h3 className="mb-4 font-quicksand text-base font-bold text-text-primary">
						Your setup
					</h3>

					<div className="flex flex-col gap-3">
						{data.primaryGoal && (
							<div className="flex items-start justify-between gap-4">
								<span className="text-sm text-text-muted">
									Your main goal
								</span>

								<span className="text-right text-sm font-medium capitalize text-text-primary">
									{data.primaryGoal}
								</span>
							</div>
						)}

						{data.appMode && (
							<div className="flex items-start justify-between gap-4">
								<span className="text-sm text-text-muted">
									Your experience
								</span>

								<span className="text-right text-sm font-medium capitalize text-text-primary">
									{data.appMode}
								</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Encouragement */}
			<p className="max-w-sm text-xs leading-relaxed text-text-muted">
				No pressure to have everything figured out. You can adjust your
				preferences as your financial goals evolve.
			</p>
		</div>
	);
}
