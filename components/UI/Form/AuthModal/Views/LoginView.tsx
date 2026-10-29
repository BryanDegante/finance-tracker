'use client';

import { useActionState, useState } from 'react';
import FormButton from '../../FormButton';
import { loginAction, type AuthActionState } from '@/app/actions/auth';

const initialState: AuthActionState = {
	error: null,
};

export default function LoginView() {
	const [showPassword, setShowPassword] = useState(false);

	const [state, formAction, isPending] = useActionState(
		loginAction,
		initialState,
	);

	return (
		<div>
			{/* Heading */}
			<div className="mb-6">
				<h3 className="mb-1 font-quicksand-decorative text-lg font-bold text-text-primary sm:text-xl">
					Welcome Back
				</h3>

				<p className="font-sans-text text-sm text-text-muted sm:text-base">
					Log in to continue your financial journey.
				</p>
			</div>

			{/* Login Form */}
			<form action={formAction} className="flex flex-col gap-4">
				{/* Email */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="login-email"
						className="text-sm font-medium text-text-secondary"
					>
						Email
					</label>

					<input
						id="login-email"
						name="email"
						type="email"
						placeholder="Enter your email"
						autoComplete="username"
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
						htmlFor="login-password"
						className="text-sm font-medium text-text-secondary"
					>
						Password
					</label>

					<div className="relative">
						<input
							id="login-password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Enter your password"
							autoComplete="current-password"
							required
							maxLength={1024}
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
				</div>

				{/* Login Error */}
				{state.error && (
					<p
						role="alert"
						aria-live="polite"
						className="rounded-cozy-sm border border-primary/30 bg-primary/10 p-3 text-sm text-text-primary"
					>
						{state.error}
					</p>
				)}

				{/* Forgot Password */}
				<button
					type="button"
					disabled={isPending}
					className="cursor-pointer self-end text-sm font-medium text-text-secondary transition-colors hover:text-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-60"
				>
					Forgot password?
				</button>

				{/* Submit */}
				<FormButton
					label={isPending ? 'Signing in...' : 'Sign In'}
					variant="sage"
					type="submit"
					disabled={isPending}
				/>
			</form>
		</div>
	);
}
