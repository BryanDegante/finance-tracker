'use client';

import { useActionState, useEffect, useState } from 'react';
import FormButton from '../../FormButton';
import { signUpAction, type AuthActionState } from '@/app/actions/auth';

const initialState: AuthActionState = {
	error: null,
	success: null,
};

type SignUpViewProps = {
	onSuccessChange: (success: boolean) => void;
	onBackToSignIn: () => void;
};

export default function SignUpView({
	onSuccessChange,
	onBackToSignIn,
}: SignUpViewProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState('');

	const [state, formAction, isPending] = useActionState(
		signUpAction,
		initialState,
	);

	useEffect(() => {
		onSuccessChange(Boolean(state.success));
	}, [state.success, onSuccessChange]);

	// Show the dedicated confirmation screen after a successful signup request.
	if (state.success) {
		return (
			<div className="flex flex-col items-center py-4 text-center">
				{/* Email illustration */}
				<div
					aria-hidden="true"
					className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-8 w-8"
					>
						<rect x="3" y="5" width="18" height="14" rx="2" />
						<path d="m3 7 9 6 9-6" />
					</svg>
				</div>

				<h3 className="mb-2 font-quicksand-decorative text-xl font-bold text-text-primary sm:text-2xl">
					Check your email
				</h3>

				<p className="mb-4 text-sm leading-relaxed text-text-muted sm:text-base">
					Thanks for signing up! If an account can be registered with
					this address, you&apos;ll receive an email with instructions
					to confirm it.
				</p>

				{submittedEmail && (
					<div className="mb-5 w-full break-all rounded-cozy-sm border border-border bg-surface-tint px-4 py-3">
						<p className="text-xs text-text-muted">
							Check your inbox for
						</p>
						<p className="mt-1 text-sm font-semibold text-text-primary">
							{submittedEmail}
						</p>
					</div>
				)}

				<p
					role="status"
					aria-live="polite"
					className="mb-6 text-sm text-text-secondary"
				>
					Don&apos;t see the email? Check your spam or junk folder.
				</p>

				<div className="w-full">
					<FormButton
						label="Back to Sign In"
						variant="sage"
						type="button"
						onClick={onBackToSignIn}
					/>
				</div>
			</div>
		);
	}

	return (
		<div>
			{/* Heading */}
			<div className="mb-6">
				<h3 className="mb-1 font-quicksand-decorative text-lg font-bold text-text-primary sm:text-xl">
					Create Your Account
				</h3>

				<p className="font-sans-text text-sm text-text-muted sm:text-base">
					Start building healthier money habits, one step at a time.
				</p>
			</div>

			{/* Signup Form */}
			<form
				action={formAction}
				onSubmit={(event) => {
					const formData = new FormData(event.currentTarget);
					const email = formData.get('email');

					if (typeof email === 'string') {
						setSubmittedEmail(email.trim());
					}
				}}
				className="flex flex-col gap-4"
			>
				{/* Name */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="signup-name"
						className="text-sm font-medium text-text-secondary"
					>
						Name
					</label>

					<input
						id="signup-name"
						name="name"
						type="text"
						placeholder="Enter your name"
						autoComplete="name"
						required
						maxLength={80}
						disabled={isPending}
						className="min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
					/>
				</div>

				{/* Email */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="signup-email"
						className="text-sm font-medium text-text-secondary"
					>
						Email
					</label>

					<input
						id="signup-email"
						name="email"
						type="email"
						placeholder="Enter your email"
						autoComplete="email"
						autoCapitalize="none"
						spellCheck={false}
						required
						maxLength={254}
						disabled={isPending}
						className="min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
					/>
				</div>

				{/* Password */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="signup-password"
						className="text-sm font-medium text-text-secondary"
					>
						Password
					</label>

					<div className="relative">
						<input
							id="signup-password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Create a password"
							autoComplete="new-password"
							required
							minLength={12}
							maxLength={128}
							disabled={isPending}
							className="min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 pr-16 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
						/>

						<button
							type="button"
							onClick={() =>
								setShowPassword((current) => !current)
							}
							disabled={isPending}
							aria-label={
								showPassword ? 'Hide password' : 'Show password'
							}
							aria-pressed={showPassword}
							className="absolute inset-y-0 right-3 cursor-pointer text-sm font-medium text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-60"
						>
							{showPassword ? 'Hide' : 'Show'}
						</button>
					</div>

					<p className="text-xs text-text-muted">
						Use at least 12 characters.
					</p>
				</div>

				{/* Confirm Password */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="confirm-password"
						className="text-sm font-medium text-text-secondary"
					>
						Confirm Password
					</label>

					<div className="relative">
						<input
							id="confirm-password"
							name="confirm-password"
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Confirm your password"
							autoComplete="new-password"
							required
							minLength={12}
							maxLength={128}
							disabled={isPending}
							className="min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 pr-16 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
						/>

						<button
							type="button"
							onClick={() =>
								setShowConfirmPassword((current) => !current)
							}
							disabled={isPending}
							aria-label={
								showConfirmPassword
									? 'Hide password confirmation'
									: 'Show password confirmation'
							}
							aria-pressed={showConfirmPassword}
							className="absolute inset-y-0 right-3 cursor-pointer text-sm font-medium text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-60"
						>
							{showConfirmPassword ? 'Hide' : 'Show'}
						</button>
					</div>
				</div>

				{/* Server Error */}
				{state.error && (
					<p
						role="alert"
						aria-live="polite"
						className="rounded-cozy-sm border border-primary/30 bg-primary/10 p-3 text-sm text-text-primary"
					>
						{state.error}
					</p>
				)}

				{/* Submit */}
				<FormButton
					label={isPending ? 'Creating account...' : 'Create Account'}
					variant="sage"
					type="submit"
					disabled={isPending}
				/>
			</form>
		</div>
	);
}
