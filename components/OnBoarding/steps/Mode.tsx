
'use client';

import type { OnboardingStepProps } from '@/types/onboarding';
import { updateThemeAction } from '@/app/actions/theme';
import { CiDark, CiLight } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa6';

export default function Mode({ data, updateData }: OnboardingStepProps) {
	const selectedTheme = data.theme;

	const handleThemeChange = async (theme: 'light' | 'dark') => {
		// Update onboarding state
		updateData({ theme });

		// Apply theme immediately
		document.documentElement.classList.toggle(
			'dark',
			theme === 'dark',
		);

		// Persist preference in cookie
		try {
			await updateThemeAction(theme);
		} catch (error) {
			console.error('Failed to save theme preference:', error);
		}
	};

	return (
		<div className="flex flex-col gap-7">
			{/* Heading */}
			<div className="space-y-2">
				<h2 className="font-nunito-titles text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
					Make yourself at home.
				</h2>

				<p className="max-w-lg text-sm leading-relaxed text-text-muted sm:text-base">
					Choose the look that feels right for you. You can always
					change your preference later.
				</p>
			</div>

			{/* Theme options */}
			<fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<legend className="mb-3 text-sm font-semibold text-text-primary">
					Choose your appearance
				</legend>

				{/* Light Mode */}
				<label
					className={`group relative flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ${
						selectedTheme === 'light'
							? 'border-primary bg-card-muted shadow-sm'
							: 'border-border bg-card hover:border-border-hover hover:shadow-sm'
					}`}
				>
					<div className="flex min-w-0 items-center gap-4">
						<div
							aria-hidden="true"
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background transition-transform duration-200 group-hover:scale-105"
						>
							<CiLight className="text-2xl text-text-secondary" />
						</div>

						<div className="min-w-0">
							<p className="font-nunito-titles font-bold text-text-primary">
								Light Mode
							</p>

							<p className="mt-1 text-xs leading-relaxed text-text-muted">
								Warm, cozy, and easy on the eyes.
							</p>
						</div>
					</div>

					<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border">
						{selectedTheme === 'light' && (
							<div className="flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
						)}
					</div>

					<input
						type="radio"
						name="theme"
						value="light"
						checked={selectedTheme === 'light'}
						onChange={() => handleThemeChange('light')}
						className="sr-only"
					/>
				</label>

				{/* Dark Mode */}
				<label
					className={`group relative flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ${
						selectedTheme === 'dark'
							? 'border-primary bg-card-muted shadow-sm'
							: 'border-border bg-card hover:border-border-hover hover:shadow-sm'
					}`}
				>
					<div className="flex min-w-0 items-center gap-4">
						<div
							aria-hidden="true"
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card-muted transition-transform duration-200 group-hover:scale-105"
						>
							<CiDark className="text-2xl text-text-secondary" />
						</div>

						<div className="min-w-0">
							<p className="font-nunito-titles font-bold text-text-primary">
								Dark Mode
							</p>

							<p className="mt-1 text-xs leading-relaxed text-text-muted">
								A softer look for low-light environments.
							</p>
						</div>
					</div>

					<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border">
						{selectedTheme === 'dark' && (
							<div className="flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
						)}
					</div>

					<input
						type="radio"
						name="theme"
						value="dark"
						checked={selectedTheme === 'dark'}
						onChange={() => handleThemeChange('dark')}
						className="sr-only"
					/>
				</label>
			</fieldset>

			{/* Theme status */}
			<div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
				<FaCheck
					aria-hidden="true"
					className="mt-0.5 shrink-0 text-secondary"
				/>

				<p className="text-xs leading-relaxed text-text-muted">
					Your appearance preference is applied immediately and saved
					on this device. You can change it anytime in your settings.
				</p>
			</div>
		</div>
	);
}
