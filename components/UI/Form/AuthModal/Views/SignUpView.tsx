'use client';

import { useState } from 'react';
import FormButton from '../../FormButton';

export default function SignUpView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError('');

    // Supabase account creation will go here later.
  }

  return (
    <div>
      {/* Heading */}
      <div className='mb-6'>
        <h3 className='mb-1 font-quicksand-decorative text-lg font-bold text-text-primary sm:text-xl'>
          Create Your Account
        </h3>

        <p className='font-sans-text text-sm text-text-muted sm:text-base'>
          Start building healthier money habits, one step at a time.
        </p>
      </div>

      {/* Signup Form */}
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='signup-name'
            className='text-sm font-medium text-text-secondary'
          >
            Name
          </label>

          <input
            id='signup-name'
            name='name'
            type='text'
            placeholder='Enter your name'
            autoComplete='name'
            required
            className='min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base'
          />
        </div>

        {/* Email */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='signup-email'
            className='text-sm font-medium text-text-secondary'
          >
            Email
          </label>

          <input
            id='signup-email'
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
            htmlFor='signup-password'
            className='text-sm font-medium text-text-secondary'
          >
            Password
          </label>

          <div className='relative'>
            <input
              id='signup-password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Create a password'
              autoComplete='new-password'
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

        {/* Confirm Password */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='confirm-password'
            className='text-sm font-medium text-text-secondary'
          >
            Confirm Password
          </label>

          <div className='relative'>
            <input
              id='confirm-password'
              name='confirm-password'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm your password'
              autoComplete='new-password'
              required
              className='min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 pr-16 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base'
            />

            <button
              type='button'
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'
              }
              className='absolute inset-y-0 right-3 text-sm font-medium text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Validation Error */}
        {error && (
          <p className='text-sm text-danger' role='alert'>
            {error}
          </p>
        )}

        {/* Submit */}
        <FormButton
          label='Create Account'
          variant='sage'
          type='submit'
        />
      </form>
    </div>
  );
}