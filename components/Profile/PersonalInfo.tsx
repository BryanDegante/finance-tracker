'use client';

import { error } from 'console';
import { useState } from 'react';

type PersonalInfoProps = {
  displayName: string;
  fullName: string;
  onSave?: (data: { displayName: string; fullName: string }) => void;
};

export default function PersonalInfo({
  displayName,
  fullName,
  onSave,
}: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDisplayName, setCurrentDisplayName] = useState(displayName);
  const [currentFullName, setCurrentFullName] = useState(fullName);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave({ displayName: currentDisplayName, fullName: currentFullName });
    }
  };

  const handleCancel = () => {
    setCurrentDisplayName(displayName);
    setCurrentFullName(fullName);
    setIsEditing(false);
  };

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
        <div
          className={`bg-card-muted w-fit px-3 py-1 rounded-full text-xs font-medium capitalize text-text-secondary transition-colors`}>
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
            value={currentFullName}
            onChange={(e) => setCurrentFullName(e.target.value)}
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
            value={currentDisplayName}
            onChange={(e) => setCurrentDisplayName(e.target.value)}
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
      <div className='flex justify-end gap-3 pt-2'>
        {isEditing ? (
          <>
            <button
              type='button'
              onClick={handleCancel}
              className='rounded-cozy-sm cursor-pointer w-fit px-4 py-2 bg-card-muted text-text-muted hover:text-text-primary transition-colors text-sm font-medium'>
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSave}
              className='rounded-cozy-sm cursor-pointer w-fit px-5 py-2 bg-primary text-white hover:opacity-95 transition-all text-sm font-semibold shadow-sm'>
              Save Changes
            </button>
          </>
        ) : (
          <button
            type='button'
            onClick={() => setIsEditing(true)}
            className='rounded-cozy-sm cursor-pointer w-fit px-5 py-2 bg-secondary text-text-primary hover:opacity-90 transition-all text-sm font-semibold shadow-sm'>
            Edit
          </button>
        )}
      </div>
    </section>
  );
}
