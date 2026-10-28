'use client';


import FormButton from '../FormButton';
import LoginView from './Views/LoginView';

export default function LoginModal() {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4'>
      {/* Modal Wrapper */}
      <div className='relative w-full max-w-100 rounded-cozy bg-card'>
        {/* View Wrapper */}
        <div className='flex flex-col gap-4 px-6 py-6'>
          <LoginView />
          <div className='flex items-center gap-3'>
            <div className='h-px flex-1 bg-border' />
            <span className='text-sm text-text-muted'>or</span>
            <div className='h-px flex-1 bg-border' />
          </div>
          <FormButton label='Sign Up' variant='outline' type='button' />
        </div>
      </div>
    </div>
  );
}
