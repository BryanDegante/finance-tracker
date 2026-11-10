import Skeleton from '@/components/UI/Skeleton/Skeleton';

export default function SettingsLoading() {
	return (
		<main className="min-h-screen p-6">
			{/* Page heading */}
			<h1 className="font-nunito-titles text-2xl font-bold text-text-primary">
				Settings
			</h1>

			{/* Appearance section */}
			<section className="mt-8">
				<h2 className="text-lg font-semibold text-text-primary">
					Appearance
				</h2>

				<p className="mt-1 text-sm font-sans-text text-text-secondary">
					Customize how Budgetier looks on your device.
				</p>

				<div className="mt-4 space-y-6">
					{/* Theme cards */}
					<div className="flex flex-wrap gap-4">
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="w-full sm:max-w-64 flex flex-col gap-4 rounded-cozy p-5 border-2 border-border bg-card-muted"
							>
								{/* Card Header */}
								<div className="flex items-center gap-3">
									<Skeleton className="h-5 w-5 rounded-full" />

									<Skeleton className="h-5 w-20 rounded-cozy-sm" />

									<Skeleton className="ml-auto h-3 w-14 rounded-cozy-sm" />
								</div>

								{/* Theme Preview */}
								<div className="w-full rounded-cozy-sm border border-border bg-background p-4 flex flex-col gap-4">
									{/* Preview Label */}
									<div className="flex items-center justify-between">
										<Skeleton className="h-3 w-12 rounded-cozy-sm" />

										<div className="flex gap-1">
											<Skeleton className="h-2 w-2 rounded-full" />
											<Skeleton className="h-2 w-2 rounded-full" />
										</div>
									</div>

									{/* Typography */}
									<div className="space-y-2">
										<Skeleton className="h-6 w-24 rounded-cozy-sm" />
										<Skeleton className="h-4 w-20 rounded-cozy-sm" />
										<Skeleton className="h-3 w-16 rounded-cozy-sm" />
									</div>

									{/* Buttons */}
									<div className="flex flex-wrap gap-2">
										<Skeleton className="h-7 w-16 rounded-cozy-sm" />
										<Skeleton className="h-7 w-20 rounded-cozy-sm" />
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Save button */}
					<div className="flex flex-col items-end gap-2">
						<Skeleton className="h-12 w-36 rounded-cozy" />
					</div>
				</div>
			</section>
		</main>
	);
}
