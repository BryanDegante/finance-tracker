'use client';

import { useState } from 'react';
import FormButton from '../FormButton';
import LoginView from './Views/LoginView';
import SignUpView from './Views/SignUpView';

export default function LoginModal() {
  const [view, setView] = useState('login');
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4'>
      {/* Modal Wrapper */}
      <div className='relative w-full max-w-100 rounded-cozy bg-card'>
        {/* View Wrapper */}
        <div className='flex flex-col gap-4 px-6 py-6'>
          {view === 'login' ? <LoginView /> : <SignUpView />}
          <div className='flex items-center gap-3'>
            <div className='h-px flex-1 bg-border' />
            <span className='text-sm text-text-muted'>or</span>
            <div className='h-px flex-1 bg-border' />
          </div>
          <FormButton
            label={view === 'login' ? 'Sign Up' : 'Log In'}
            onClick={() => setView(view === 'login' ? 'signUp' : 'login')}
            variant='outline'
            type='button'
          />
        </div>
      </div>
    </div>
  );
}
