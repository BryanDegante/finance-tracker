import { useState } from 'react';
import FormButton from '../../FormButton';

export default function SignUpView() {
  const [error, setError] = useState('');
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setError('');
  }

  return (
    <div>
      {/* Heading */}
      <div className='mb-6'>
        <h3 className='mb-1 font-quicksand-decorative text-lg font-bold text-text-primary sm:text-xl'>
          Sign Up
        </h3>

        <p className='font-sans-text text-base text-text-muted sm:text-lg'>
          Create an account to grow financially
        </p>
      </div>

      {/* SignUp Form */}
      <form
        className='flex flex-col gap-4'
        onSubmit={(event) => handleSubmit(event)}>
        {/* Name */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='name'
            className='text-sm font-medium text-text-secondary'>
            Name
          </label>

          <input
            id='name'
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
            htmlFor='email'
            className='text-sm font-medium text-text-secondary'>
            Email
          </label>

          <input
            id='email'
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
            htmlFor='password'
            className='text-sm font-medium text-text-secondary'>
            Password
          </label>

          <input
            id='password'
            name='password'
            type='password'
            placeholder='Enter your password'
            autoComplete='new-password'
            required
            className='min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base'
          />
        </div>

        {/*Confirm Password */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='confirm-password'
            className='text-sm font-medium text-text-secondary'>
            Confirm Password
          </label>

          <input
            id='confirm-password'
            name='confirm-password'
            type='password'
            placeholder='Enter your password'
            autoComplete='new-password'
            required
            className='min-h-11 w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base'
          />
        </div>
        {error && (
          <p className='text-sm text-danger' role='alert'>
            {error}
          </p>
        )}

        <FormButton label='Create Account' variant='sage' type='submit' />
      </form>
    </div>
  );
}
