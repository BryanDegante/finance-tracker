
'use client';

import { useState } from 'react';

type EmailAddressProps = {
  emailAddress: string;
  onSave: (email: string) => Promise<void>;
};

export default function EmailAddress({
  emailAddress,
  onSave,
}: EmailAddressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(emailAddress);
  const [validationError, setValidationError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleEdit = () => {
    setCurrentEmail(emailAddress);
    setValidationError('');
    setStatusMessage('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentEmail(emailAddress);
    setValidationError('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedEmail = currentEmail.trim();

    if (!trimmedEmail) {
      setValidationError('Email address is required.');
      return;
    }

    if (trimmedEmail.length > 254) {
      setValidationError('Email address is too long.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    // Avoid requesting an email update when nothing changed.
    if (trimmedEmail.toLowerCase() === emailAddress.trim().toLowerCase()) {
      setCurrentEmail(emailAddress);
      setValidationError('');
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setValidationError('');
    setStatusMessage('');

    try {
      await onSave(trimmedEmail);

      // Supabase requires email confirmation.
      // Keep displaying the current email until confirmation.
      setCurrentEmail(emailAddress);
      setIsEditing(false);
      setStatusMessage(
        'Check your inbox to confirm your new email address.',
      );
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : 'Unable to update your email. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className='mt-6 rounded-cozy border border-border bg-card p-5 shadow-cozy sm:p-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='font-nunito-titles text-lg font-bold text-text-primary'>
            Email Address
          </h2>

          <p className='mt-1 text-sm text-text-secondary'>
            Manage the email address associated with your account.
          </p>
        </div>

        {!isEditing && (
          <button
            type='button'
            onClick={handleEdit}
            className='rounded-cozy-sm bg-secondary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-secondary-hover'
          >
            Edit
          </button>
        )}
      </div>

      <div className='mt-5'>
        {isEditing ? (
          <div className='space-y-4'>
            <p className='text-xs font-medium text-text-muted'>
              edit mode
            </p>

            <div>
              <label
                htmlFor='email'
                className='mb-2 block text-sm font-semibold text-text-primary'
              >
                Email
              </label>

              <input
                id='email'
                type='email'
                value={currentEmail}
                onChange={(event) => {
                  setCurrentEmail(event.target.value);
                  setValidationError('');
                }}
                disabled={isSaving}
                aria-invalid={Boolean(validationError)}
                aria-describedby={
                  validationError ? 'email-error' : undefined
                }
                className='w-full rounded-cozy-sm border border-border bg-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60'
              />

              {validationError && (
                <p
                  id='email-error'
                  role='alert'
                  className='mt-2 text-sm text-red-500'
                >
                  {validationError}
                </p>
              )}
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={handleCancel}
                disabled={isSaving}
                className='rounded-cozy-sm border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-card-muted disabled:cursor-not-allowed disabled:opacity-60'
              >
                Cancel
              </button>

              <button
                type='button'
                onClick={handleSave}
                disabled={isSaving}
                className='flex items-center justify-center gap-2 rounded-cozy-sm bg-primary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSaving ? (
                  <>
                    <span
                      className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'
                      aria-hidden='true'
                    />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className='space-y-2'>
            <p className='text-xs font-medium text-text-muted'>
              view mode
            </p>

            <p className='break-all text-sm font-medium text-text-primary'>
              {emailAddress}
            </p>
          </div>
        )}

        {statusMessage && (
          <p
            role='status'
            className='mt-4 text-sm font-medium text-text-secondary'
          >
            {statusMessage}
          </p>
        )}
      </div>
    </section>
  );
}
