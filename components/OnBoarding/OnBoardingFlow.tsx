'use client';

import { useState, useTransition } from 'react';
import { completeOnboarding } from '@/app/onboarding/actions';
import WelcomePage from './steps/WelcomePage';
import ProfileStep from './steps/ProfileStep';
import Mode from './steps/Mode';
import Completion from './steps/Completion';
import styles from './OnBoarding.module.css';
import { FaArrowRightLong, FaArrowLeftLong } from 'react-icons/fa6';
import type { OnboardingData } from '@/types/onboarding';

const TOTAL_STEPS = 4;

export default function OnBoardingFlow() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isPending, startTransition] = useTransition();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const [formData, setFormData] = useState<OnboardingData>({
		fullName: '',
		startingBalance: '',
		theme: 'light',
	});

	const updateData = (fields: Partial<OnboardingData>) => {
		setFormData((prev) => ({
			...prev,
			...fields,
		}));
	};

	const goToNextStep = () => {
		setSubmitError(null);
		setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
	};

	const goToPreviousStep = () => {
		setSubmitError(null);
		setCurrentStep((prev) => Math.max(1, prev - 1));
	};

	const handleSubmit = () => {
		if (isPending) return;

		setSubmitError(null);

		startTransition(async () => {
			try {
				const result = await completeOnboarding(formData);

				if (result?.error) {
					setSubmitError(result.error);
				}
			} catch (error) {
				// Next.js redirects use a special thrown signal.
				// Re-throw it so successful onboarding can redirect normally.
				if (
					error !== null &&
					typeof error === 'object' &&
					'digest' in error &&
					typeof error.digest === 'string' &&
					error.digest.startsWith('NEXT_REDIRECT')
				) {
					throw error;
				}

				console.error('Unexpected onboarding submission error:', error);

				setSubmitError(
					'Something went wrong while finishing your setup. Please try again.',
				);
			}
		});
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <WelcomePage />;

			case 2:
				return <ProfileStep data={formData} updateData={updateData} />;

			case 3:
				return <Mode data={formData} updateData={updateData} />;

			case 4:
				return <Completion data={formData} />;

			default:
				return null;
		}
	};

	const isFinalStep = currentStep === TOTAL_STEPS;

	return (
		<div className="flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
			<section
				aria-label="Account setup"
				className="w-full max-w-xl rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5 sm:p-8 md:p-10"
			>
				{/* Progress indicator */}
				<div className="mb-8">
					<div className="mb-3 flex items-center justify-between gap-4">
						<p
							id="onboarding-progress-label"
							className="text-xs font-semibold uppercase tracking-widest text-text-muted"
						>
							Your setup
						</p>

						<p className="text-sm font-medium text-text-muted">
							Step{' '}
							<span className="font-semibold text-text-primary">
								{currentStep}
							</span>{' '}
							of {TOTAL_STEPS}
						</p>
					</div>

					<div
						role="progressbar"
						aria-labelledby="onboarding-progress-label"
						aria-valuemin={1}
						aria-valuemax={TOTAL_STEPS}
						aria-valuenow={currentStep}
						className="flex items-center gap-2"
					>
						{Array.from({ length: TOTAL_STEPS }, (_, index) => {
							const step = index + 1;
							const isComplete = step <= currentStep;

							return (
								<div
									key={step}
									aria-hidden="true"
									className={`h-2 flex-1 rounded-full transition-colors duration-300 ease-out ${
										isComplete ? 'bg-primary' : 'bg-border'
									}`}
								/>
							);
						})}
					</div>
				</div>

				{/* Current onboarding step */}
				<div
					key={currentStep}
					aria-live="polite"
					className={`${styles.stepEnter} mb-8 min-h-70 sm:min-h-75`}
				>
					{renderStep()}
				</div>

				{/* Step navigation and error recovery */}
				<div className="flex items-center justify-between gap-4 border-t border-border pt-6">
					{submitError ? (
						<>
							<button
								type="button"
								onClick={goToPreviousStep}
								disabled={isPending}
								className="inline-flex items-center rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
							>
								<FaArrowLeftLong
									aria-hidden="true"
									className="mr-2"
								/>
								Go Back
							</button>

							<button
								type="button"
								onClick={handleSubmit}
								disabled={isPending}
								className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text-on-primary shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isPending ? 'Saving...' : 'Try Again'}
							</button>
						</>
					) : (
						<>
							{currentStep > 1 && !isFinalStep ? (
								<button
									type="button"
									onClick={goToPreviousStep}
									disabled={isPending}
									aria-label={`Go back to step ${currentStep - 1}`}
									className="flex cursor-pointer items-center rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:border-border-hover hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
								>
									<FaArrowLeftLong
										aria-hidden="true"
										className="mr-2"
									/>
									Previous
								</button>
							) : (
								<div aria-hidden="true" />
							)}

							{!isFinalStep ? (
								<button
									type="button"
									onClick={goToNextStep}
									aria-label={`Continue to step ${currentStep + 1}`}
									className="ml-auto inline-flex cursor-pointer items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-text-on-primary shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0"
								>
									Continue
									<FaArrowRightLong
										aria-hidden="true"
										className="ml-2"
									/>
								</button>
							) : (
								<button
									type="button"
									onClick={handleSubmit}
									disabled={isPending}
									className="ml-auto w-full cursor-pointer rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-text-on-primary shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
								>
									{isPending
										? 'Saving your setup...'
										: 'Enter Dashboard'}
								</button>
							)}
						</>
					)}
				</div>

				{/* Submission error */}
				{submitError && (
					<div
						role="alert"
						aria-live="assertive"
						className="mt-5 rounded-cozy border border-danger/20 bg-danger-bg p-4 text-center"
					>
						<p className="text-sm font-semibold text-danger">
							We couldn&apos;t finish setting up your account.
						</p>

						<p className="mt-1 text-sm text-text-secondary">
							{submitError}
						</p>

						<p className="mt-2 text-xs text-text-muted">
							Your information may have been partially saved. You
							can try again or go back to review your setup.
						</p>
					</div>
				)}
			</section>
		</div>
	);
}
