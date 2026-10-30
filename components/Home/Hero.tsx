import Image from 'next/image';
import ModalButton from '../UI/AuthForm/AuthModal/ModalButton';
import { CiMoneyBill, CiShoppingCart } from 'react-icons/ci';
import { FaShoppingCart } from 'react-icons/fa';

export default function Hero() {
	return (
		<section id="hero" className="relative w-full overflow-hidden">
			{/* Decorative Background */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary-light/70 blur-3xl sm:h-96 sm:w-96"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-secondary-light/80 blur-3xl sm:h-96 sm:w-96"
			/>

			<div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
				{/* App Branding */}
				<div className="mb-12 sm:mb-16">
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
							className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
						/>

						<span>
							Budgetier
							<span className="text-primary-hover">.</span>
						</span>
					</a>
				</div>

				{/* Hero Content */}
				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
					{/* Introduction */}
					<div className="flex flex-col items-start">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-2 shadow-cozy-sm sm:px-4">
							<span
								aria-hidden="true"
								className="h-2 w-2 rounded-full bg-secondary"
							/>
							<p className="text-[10px] font-bold tracking-[0.14em] text-text-secondary sm:text-xs sm:tracking-[0.16em]">
								A FRESH APPROACH TO PERSONAL FINANCE
							</p>
						</div>

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
						<p className="mt-6 max-w-lg text-base leading-7 text-text-secondary sm:mt-7 sm:text-lg sm:leading-8">
							Keep track of what you earn, plan where your money
							goes, and make progress toward your goals — all in
							one place.
						</p>

						<div className="mt-8 w-full sm:mt-10 sm:w-auto">
							<ModalButton label="Get Started" />
						</div>

						{/* Supporting Message */}
						<p className="mt-4 flex items-center gap-2 text-xs leading-5 text-text-muted sm:text-sm">
							<span aria-hidden="true" className="text-secondary">
								✿
							</span>
							A little more clarity. A little less money stress.
						</p>
					</div>

					{/* Dashboard Preview */}
					<div className="relative mx-auto w-full max-w-lg lg:max-w-none">
						<div
							aria-hidden="true"
							className="absolute -right-8 -top-8 -z-10 h-48 w-48 rounded-full bg-primary-light blur-3xl sm:-right-12 sm:-top-12 sm:h-72 sm:w-72"
						/>
						<div
							aria-hidden="true"
							className="absolute -bottom-8 -left-8 -z-10 h-40 w-40 rounded-full bg-secondary-light blur-3xl sm:-bottom-12 sm:-left-12 sm:h-56 sm:w-56"
						/>

						{/* Dashboard Card */}
						<div className="rounded-cozy-lg border border-border bg-card p-4 shadow-cozy-lg sm:p-6">
							{/*  Header */}
							<div className="mb-5 flex items-center justify-between gap-3">
								<div>
									<p className="font-quicksand text-lg font-bold text-text-primary sm:text-xl">
										Your overview
									</p>
									<p className="mt-1 text-xs text-text-muted sm:text-sm">
										A clearer picture of your money
									</p>
								</div>

								<span className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary">
									Monthly
								</span>
							</div>

							{/* Monthly Savings */}
							<div className="rounded-cozy border border-border bg-surface-tint p-4 sm:p-5">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p className="text-xs font-medium text-text-muted sm:text-sm">
											Total monthly savings
										</p>

										<p className="mt-2 font-quicksand text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
											$2,450.00
										</p>
									</div>

									<span className="rounded-full bg-secondary-light px-3 py-1.5 text-xs font-semibold text-text-secondary">
										+12.5%
									</span>
								</div>

								<p className="mt-3 text-xs leading-relaxed text-text-muted">
									Small steps are adding up.
								</p>
							</div>

							{/* Budget Progress */}
							<div className="mt-4 rounded-cozy border border-border p-4 sm:p-5">
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="text-sm font-semibold text-text-primary">
											Monthly budget
										</p>
										<p className="mt-1 text-xs text-text-muted">
											Your spending plan
										</p>
									</div>

									<p className="shrink-0 text-sm font-semibold text-text-primary">
										72%
									</p>
								</div>

								<div
									role="img"
									aria-label="Illustrative budget progress: 72 percent of a 2,500 dollar budget, with 1,800 dollars used"
									className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-surface-tint"
								>
									<div className="h-full w-[72%] rounded-full bg-primary" />
								</div>

								<div className="mt-3 flex items-center justify-between gap-3 text-xs">
									<span className="text-text-muted">
										$1,800 spent
									</span>
									<span className="text-text-secondary">
										$700 remaining
									</span>
								</div>
							</div>

							{/* Recent Activity */}
							<div className="mt-6">
								<div className="mb-3 flex items-center justify-between gap-3">
									<p className="font-quicksand text-base font-bold text-text-primary">
										Recent activity
									</p>

									<span className="text-xs text-text-muted">
										Sample transactions
									</span>
								</div>

								{/* Grocery Expense */}
								<div className="flex items-center justify-between gap-3 rounded-cozy-sm p-3 transition-colors hover:bg-surface-tint">
									<div className="flex min-w-0 items-center gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light">
											<span aria-hidden="true">
												<FaShoppingCart />
											</span>
										</div>

										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-text-primary">
												Groceries
											</p>
											<p className="mt-1 text-xs text-text-muted">
												Everyday essentials
											</p>
										</div>
									</div>

									<span className="shrink-0 text-sm font-semibold text-text-primary">
										−$84.20
									</span>
								</div>

								{/* Income */}
								<div className="flex items-center justify-between gap-3 rounded-cozy-sm p-3 transition-colors hover:bg-surface-tint">
									<div className="flex min-w-0 items-center gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-light">
											<span aria-hidden="true">
												<CiMoneyBill />
											</span>
										</div>

										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-text-primary">
												Income received
											</p>
											<p className="mt-1 text-xs text-text-muted">
												Additional earnings
											</p>
										</div>
									</div>

									<span className="shrink-0 text-sm font-semibold text-success">
										+$650.00
									</span>
								</div>
							</div>

							{/* Footer */}
							<div className="mt-5 flex items-start gap-3 rounded-cozy bg-primary-light/60 p-3 sm:p-4">
								<span
									aria-hidden="true"
									className="mt-0.5 text-lg text-text-secondary"
								>
									✿
								</span>

								<p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
									Small steps today. More confidence tomorrow.
								</p>
							</div>
						</div>

						{/* Disclaimer */}
						<p className="mt-4 text-center text-xs text-text-muted">
							A little preview of what managing money could feel
							like.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
