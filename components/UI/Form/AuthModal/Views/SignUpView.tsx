'use client';

import { useActionState, useState } from 'react';
import FormButton from '../../FormButton';
import { signUpAction, type AuthActionState } from '@/app/actions/auth';

const initialState: AuthActionState = {
	error: null,
	success: null,
};

export default function SignUpView() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [state, formAction, isPending] = useActionState(
		signUpAction,
		initialState,
	);

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
			<form action={formAction} className="flex flex-col gap-4">
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

				{/* Confirmation Message */}
				{state.success && (
					<p
						role="status"
						aria-live="polite"
						className="rounded-cozy-sm border border-secondary/30 bg-secondary/10 p-3 text-sm text-text-primary"
					>
						{state.success}
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
