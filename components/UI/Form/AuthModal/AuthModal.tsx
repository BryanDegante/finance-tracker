'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store/store';
import { closeAuthModal } from '@/redux/slices/AuthModalSlice';
import FormButton from '../FormButton';
import LoginView from './Views/LoginView';
import SignUpView from './Views/SignUpView';

export default function AuthModal() {
  const [view, setView] = useState<'login' | 'signUp'>('login');

  const dispatch = useDispatch();

  const isAuthOpen = useSelector(
    (state: RootState) => state.auth.isAuthOpen
  );

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isAuthOpen) {
      setView('login');
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const firstInput =
      dialogRef.current?.querySelector<HTMLInputElement>('input');

    firstInput?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      const dialog = dialogRef.current;

      if (!dialog) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        dispatch(closeAuthModal());
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );

        const elements = Array.from(focusableElements).filter(
          (element) => element.getAttribute('aria-hidden') !== 'true'
        );

        if (elements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        if (
          event.shiftKey &&
          (document.activeElement === firstElement ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === lastElement ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      document.body.style.overflow = previousOverflow;

      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [isAuthOpen, dispatch]);

  if (!isAuthOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      onClick={() => dispatch(closeAuthModal())}
    >
      {/* Accessible dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          view === 'login'
            ? 'Log in to Budgetier'
            : 'Create your Budgetier account'
        }
        className="relative my-auto w-full max-w-100 rounded-cozy bg-card"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => dispatch(closeAuthModal())}
          aria-label="Close authentication modal"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-xl text-text-muted transition-colors hover:bg-surface-tint hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary cursor-pointer"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        {/* Login / Signup Views */}
        <div
          id="auth-modal-content"
          className="flex flex-col gap-4 px-6 py-6"
        >
          {view === 'login' ? <LoginView /> : <SignUpView />}

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-sm text-text-muted">or</span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <FormButton
            label={view === 'login' ? 'Sign Up' : 'Log In'}
            onClick={() =>
              setView(view === 'login' ? 'signUp' : 'login')
            }
            variant="outline"
            type="button"
          />
        </div>
      </div>
    </div>
  );
}