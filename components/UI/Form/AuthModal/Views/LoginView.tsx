'use client';

import { useState } from 'react';
import FormButton from '../../FormButton';

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {/* Heading */}
      <div className='mb-6'>
        <h3 className='mb-1 font-quicksand-decorative text-lg font-bold text-text-primary sm:text-xl'>
          Welcome Back
        </h3>

        <p className='font-sans-text text-sm text-text-muted sm:text-base'>
          Log in to continue your financial journey.
        </p>
      </div>

      {/* Login Form */}
      <form className='flex flex-col gap-4'>
        {/* Email */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='login-email'
            className='text-sm font-medium text-text-secondary'
          >
            Email
          </label>

          <input
            id='login-email'
            name='email'
            type='email'
            placeholder='Enter your email'
            autoComplete='email'
            required
            className='min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base'
          />
        </div>

        {/* Password */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='login-password'
            className='text-sm font-medium text-text-secondary'
          >
            Password
          </label>

          <div className='relative'>
            <input
              id='login-password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              autoComplete='current-password'
              required
              className='min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 pr-16 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base'
            />

            <button
              type='button'
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute inset-y-0 right-3 text-sm font-medium text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <button
          type='button'
          className='self-end text-sm font-medium text-text-secondary transition-colors hover:text-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'
        >
          Forgot password?
        </button>

        {/* Submit */}
        <FormButton
          label='Sign In'
          variant='sage'
          type='submit'
        />
      </form>
    </div>
  );
}