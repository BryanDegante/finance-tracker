'use client';

import { useEffect, useState } from 'react';

type PersonalInfoProps = {
  displayName: string;
  fullName: string;
  onSave?: (data: { displayName: string; fullName: string }) => Promise<void>;
};

export default function PersonalInfo({
  displayName,
  fullName,
  onSave,
}: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [currentDisplayName, setCurrentDisplayName] = useState(displayName);
  const [currentFullName, setCurrentFullName] = useState(fullName);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setCurrentDisplayName(displayName);
      setCurrentFullName(fullName);
    }
  }, [displayName, fullName, isEditing]);

  function validateProfile(full: string, display: string): string | null {
    const checkFull = full.trim();
    const checkDisplay = display.trim();

    if (!checkFull) {
      return 'Full name is required.';
    }

    if (checkFull.length > 60) {
      return 'Full name must be 60 characters or fewer.';
    }

    if (checkDisplay.length > 60) {
      return 'Display name must be 60 characters or fewer.';
    }

    return null;
  }

  const handleSave = async () => {
    if (isSaving) return;

    const error = validateProfile(currentFullName, currentDisplayName);

    if (error) {
      setValidationError(error);
      return;
    }

    if (!onSave) {
      setValidationError(
        'Saving is currently unavailable. Please try again later.',
      );
      return;
    }

    setValidationError(null);
    setIsSaving(true);

    const updatedProfile = {
      fullName: currentFullName.trim(),
      displayName: currentDisplayName.trim(),
    };

    try {
      await onSave(updatedProfile);

      setCurrentFullName(updatedProfile.fullName);
      setCurrentDisplayName(updatedProfile.displayName);

      setIsEditing(false);
    } catch {
      setValidationError('Unable to save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;

    setCurrentDisplayName(displayName);
    setCurrentFullName(fullName);

    setValidationError(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setValidationError(null);
    setIsEditing(true);
  };

  const handleNameChange = (
    field: 'fullName' | 'displayName',
    value: string,
  ) => {
    if (field === 'fullName') {
      setCurrentFullName(value);
    } else {
      setCurrentDisplayName(value);
    }

    setValidationError(null);
  };

  return (
    <section
      aria-labelledby='personal-info-heading'
      className='flex flex-col gap-5 my-6 bg-card p-6 sm:p-8 rounded-cozy border border-border shadow-sm'>
      {/* Header wrapper */}
      <div className='flex items-center justify-between'>
        <h2
          id='personal-info-heading'
          className='text-text-primary text-lg sm:text-xl font-semibold font-nunito-titles'>
          Personal Information
        </h2>

        <div className='bg-card-muted w-fit px-3 py-1 rounded-full text-xs font-medium capitalize text-text-secondary transition-colors'>
          {isEditing ? 'edit mode' : 'view mode'}
        </div>
      </div>

      {/* Full name wrapper */}
      <div className='flex flex-col gap-1.5'>
        <label
          className='text-xs font-semibold uppercase tracking-wider text-text-muted'
          htmlFor='fullName'>
          Full Name
        </label>

        {isEditing ? (
          <input
            id='fullName'
            type='text'
            autoComplete='name'
            maxLength={60}
            required
            disabled={isSaving}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'profile-error' : undefined}
            value={currentFullName}
            onChange={(e) => handleNameChange('fullName', e.target.value)}
            className='bg-card-muted p-3 sm:p-4 rounded-cozy-sm text-text-primary border border-border focus:border-primary focus:outline-none transition-all'
          />
        ) : (
          <div className='bg-card-muted p-3 sm:p-4 rounded-cozy-sm text-text-primary'>
            {currentFullName || (
              <span className='text-text-muted italic'>Not provided</span>
            )}
          </div>
        )}
      </div>

      {/* Display name wrapper */}
      <div className='flex flex-col gap-1.5'>
        <label
          className='text-xs font-semibold uppercase tracking-wider text-text-muted'
          htmlFor='displayName'>
          Display Name
        </label>

        {isEditing ? (
          <input
            id='displayName'
            type='text'
            autoComplete='nickname'
            maxLength={60}
            disabled={isSaving}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'profile-error' : undefined}
            value={currentDisplayName}
            onChange={(e) => handleNameChange('displayName', e.target.value)}
            className='bg-card-muted p-3 sm:p-4 rounded-cozy-sm text-text-primary border border-border focus:border-primary focus:outline-none transition-all'
          />
        ) : (
          <div className='bg-card-muted p-3 sm:p-4 rounded-cozy-sm text-text-primary'>
            {currentDisplayName || (
              <span className='text-text-muted italic'>Not provided</span>
            )}
          </div>
        )}
      </div>

      {/* Action buttons wrapper */}
      <div className='flex flex-col gap-3 pt-2'>
        {isEditing && validationError && (
          <p id='profile-error' role='alert' className='text-sm text-red-600'>
            {validationError}
          </p>
        )}

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
