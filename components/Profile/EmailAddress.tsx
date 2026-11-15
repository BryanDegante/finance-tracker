
'use client';

import { useState } from 'react';

type EmailAddressProps = {
  emailAddress: string;
};

export default function EmailAddress({ emailAddress }: EmailAddressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(emailAddress);
  const [validationError, setValidationError] = useState('');

  const handleEdit = () => {
    setCurrentEmail(emailAddress);
    setValidationError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentEmail(emailAddress);
    setValidationError('');
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmedEmail = currentEmail.trim();

    if (!trimmedEmail) {
      setValidationError('Email address is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setCurrentEmail(trimmedEmail);
    setValidationError('');
    setIsEditing(false);
  };

  return (
    <section
      aria-labelledby='email-address'
      className='flex flex-col gap-5 my-6 bg-card p-6 sm:p-8 rounded-cozy border border-border shadow-sm'>
      {/* Header wrapper */}
      <div className='flex items-center justify-between'>
        <h2
          id='email-address'
          className='text-text-primary text-lg sm:text-xl font-semibold font-nunito-titles'>
          Email Address
        </h2>
        <div className='bg-card-muted w-fit px-3 py-1 rounded-full text-xs font-medium capitalize text-text-secondary transition-colors'>
          {isEditing ? 'edit mode' : 'view mode'}
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label
          className='text-xs font-semibold uppercase tracking-wider text-text-muted'
          htmlFor='email'>
          Email
        </label>

        {isEditing ? (
          <>
            <input
              id='email'
              type='email'
              value={currentEmail}
              onChange={(e) => {
                setCurrentEmail(e.target.value);
                if (validationError) setValidationError('');
              }}
              required
              disabled={isSaving}
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'email-error' : undefined}
              className='bg-card-muted p-3 sm:p-4 rounded-cozy-sm text-text-primary border border-border focus:border-primary focus:outline-none transition-all'
            />

            {validationError && (
              <p
                id='email-error'
                role='alert'
                className='text-xs text-text-muted'>
                {validationError}
              </p>
            )}
          </>
        ) : (
          <div className='bg-card-muted p-3 sm:p-4 rounded-cozy-sm text-text-primary'>
            {currentEmail}
          </div>
        )}
      </div>

      {/* Action buttons wrapper */}
      <div className='flex flex-col gap-3 pt-2'>
        <div className='flex justify-end gap-3'>
          {isEditing ? (
            <>
              <button
                type='button'
                onClick={handleCancel}
                disabled={isSaving}
                className='rounded-cozy-sm cursor-pointer w-fit px-4 py-2 bg-card-muted text-text-muted hover:text-text-primary transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
                Cancel
              </button>

              <button
                type='button'
                onClick={handleSave}
                disabled={isSaving}
                aria-busy={isSaving}
                className='rounded-cozy-sm cursor-pointer w-fit px-5 py-2 bg-primary text-white hover:opacity-95 transition-all text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'>
                {isSaving ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='h-4 w-4 animate-spin'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      aria-hidden='true'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </>
          ) : (
            <button
              type='button'
              onClick={handleEdit}
              className='rounded-cozy-sm cursor-pointer w-fit px-5 py-2 bg-secondary text-text-primary hover:opacity-90 transition-all text-sm font-semibold shadow-sm'>
              Edit
            </button>
          )}
        </div>

        {isEditing && isSaving && (
          <p role='status' className='text-xs text-text-muted text-right'>
            Saving your profile...
          </p>
        )}
      </div>
    </section>
  );
}
