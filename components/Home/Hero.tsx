import Image from 'next/image';
import ModalButton from '../UI/AuthForm/AuthModal/ModalButton';

export default function Hero() {
	return (
		<section id="hero" className="w-full overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
				{/* App Branding */}
				<div className="mb-8 sm:mb-12">
					<a
						href="/"
						aria-label="Budgetier home"
						className="inline-flex items-center gap-2 font-quicksand text-2xl font-bold tracking-tight text-text-primary transition-opacity hover:opacity-80 focus-visible:rounded-cozy-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:gap-3 sm:text-3xl"
					>
						<Image
							src="/budgetier.png"
							alt=""
							width={120}
							height={120}
							priority
							className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24 lg:h-28 lg:w-28"
						/>

						<span>
							Budgetier<span className="text-primary">.</span>
						</span>
					</a>
				</div>

				{/* Hero Layout */}
				<div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-16">
					{/* Left Column: Introduction */}
					<div className="flex flex-col items-start">
						{/* Introductory Label */}
						<p className="mb-5 inline-flex max-w-full rounded-full bg-secondary-light px-3 py-2 text-[10px] font-bold tracking-[0.12em] text-text-secondary sm:mb-6 sm:px-4 sm:text-xs sm:tracking-[0.15em]">
							A FRESH APPROACH TO PERSONAL FINANCE
						</p>

						{/* Headline */}
						<h1 className="max-w-xl font-quicksand text-4xl font-bold leading-[1.12] tracking-tight text-text-primary min-[400px]:text-5xl sm:text-6xl lg:text-5xl xl:text-7xl">
							Your finances.
							<br />
							Your pace.
							<br />
							<span className="text-primary-hover">
								Your rules.
							</span>
						</h1>

						{/* Description */}
						<p className="mt-6 max-w-lg text-base leading-7 text-text-muted sm:mt-7 sm:text-lg sm:leading-8">
							Keep track of what you earn, plan where your money
							goes, and make progress toward your goals—all in one
							place.
						</p>

						{/* Call to Action */}
						<div className="mt-8 sm:mt-10">
							<ModalButton label="Get Started" />
						</div>

						{/* Supporting Message */}
						<p className="mt-4 text-xs leading-5 text-text-muted sm:text-sm">
							A little more clarity. A little less money stress.
						</p>
					</div>

					{/* Right Column: Dashboard Preview */}
					<div
						aria-hidden="true"
						className="relative mx-auto w-full max-w-lg lg:max-w-none"
					>
						{/* Decorative Background Glow */}
						<div className="absolute -right-8 -top-8 -z-10 h-48 w-48 rounded-full bg-primary/15 blur-3xl sm:-right-10 sm:-top-10 sm:h-72 sm:w-72" />

						<div className="flex flex-col gap-4 rounded-cozy-lg border border-border bg-card p-4 shadow-cozy-lg sm:gap-5 sm:p-6">
							{/* Monthly Savings */}
							<div className="flex flex-col gap-3 rounded-cozy bg-surface-tint p-4 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between sm:p-5">
								<div className="min-w-0">
									<p className="text-xs font-medium text-text-muted sm:text-sm">
										Total Monthly Savings
									</p>

									<p className="mt-1 wrap-break-word font-quicksand text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
										$2,450.00
									</p>
								</div>

								<span className="w-fit shrink-0 rounded-full bg-secondary-light px-3 py-1.5 text-xs font-semibold text-text-secondary">
									+12.5% this month
								</span>
							</div>

							{/* Budget Progress */}
							<div className="rounded-cozy border border-border p-4 sm:p-5">
								<div className="flex flex-col gap-1 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
									<p className="text-sm font-semibold text-text-primary">
										Monthly Budget Goal
									</p>

									<p className="text-sm font-medium text-text-muted">
										$1,800 / $2,500
									</p>
								</div>

								<div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-tint">
									<div className="h-full w-[72%] rounded-full bg-primary" />
								</div>

								<p className="mt-2 text-xs text-text-muted">
									72% of your budget goal
								</p>
							</div>

							{/* Recent Activity */}
							<div className="pt-1">
								<p className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
									Recent Activity
								</p>

								{/* Grocery Expense */}
								<div className="flex items-center justify-between gap-3 rounded-cozy-sm p-2 transition-colors hover:bg-surface-tint">
									<div className="flex min-w-0 items-center gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
											<span>🛒</span>
										</div>

										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-text-primary">
												Groceries
											</p>

											<p className="text-xs text-text-muted">
												Today, 2:30 PM
											</p>
										</div>
									</div>

									<span className="shrink-0 text-sm font-semibold text-text-primary">
										−$84.20
									</span>
								</div>

								{/* Income */}
								<div className="flex items-center justify-between gap-3 rounded-cozy-sm p-2 transition-colors hover:bg-surface-tint">
									<div className="flex min-w-0 items-center gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-light">
											<span>💰</span>
										</div>

										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-text-primary">
												Freelance Deposit
											</p>

											<p className="text-xs text-text-muted">
												Yesterday
											</p>
										</div>
									</div>

									<span className="shrink-0 text-sm font-semibold text-success">
										+$650.00
									</span>
								</div>
							</div>

							{/* Decorative Accent */}
							<div className="flex items-center gap-3 rounded-cozy bg-primary-light/60 p-3">
								<span className="text-lg">✿</span>

								<p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
									Small steps today. More confidence tomorrow.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
