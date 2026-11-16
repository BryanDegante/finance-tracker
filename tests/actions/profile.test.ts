
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockCreateClient,
  mockCookies,
  mockRevalidatePath,
  mockGetUser,
  mockFrom,
  mockUpdate,
  mockEq,
  mockSelect,
  mockMaybeSingle,
  mockUpdateUser,
} = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
  mockCookies: vi.fn(),
  mockRevalidatePath: vi.fn(),
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockUpdate: vi.fn(),
  mockEq: vi.fn(),
  mockSelect: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockUpdateUser: vi.fn(),
}));

vi.mock('@/utils/supabase/server', () => ({
  createClient: mockCreateClient,
}));

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

import {
  updateProfileAction,
  updateEmailAction,
} from '@/app/actions/profile';

describe('updateProfileAction', () => {
  const validInput = {
    fullName: 'Bryan Degante',
    displayName: 'Bryan',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockCookies.mockResolvedValue({});

    mockCreateClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
        updateUser: mockUpdateUser,
      },
      from: mockFrom,
    });

    mockFrom.mockReturnValue({
      update: mockUpdate,
    });

    mockUpdate.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      select: mockSelect,
    });

    mockSelect.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    });

    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'old@example.com' },
      },
      error: null,
    });

    mockMaybeSingle.mockResolvedValue({
      data: { id: 'user-123' },
      error: null,
    });

    mockUpdateUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
  });

  describe('Validation', () => {
    it('rejects missing input', async () => {
      await expect(
        updateProfileAction(null as never),
      ).rejects.toThrow('Invalid profile information.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('rejects a missing full name', async () => {
      await expect(
        updateProfileAction({
          ...validInput,
          fullName: '   ',
        }),
      ).rejects.toThrow('Please enter a valid full name.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('rejects a full name longer than 60 characters', async () => {
      await expect(
        updateProfileAction({
          ...validInput,
          fullName: 'a'.repeat(61),
        }),
      ).rejects.toThrow('Please enter a valid full name.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('rejects a display name longer than 60 characters', async () => {
      await expect(
        updateProfileAction({
          ...validInput,
          displayName: 'a'.repeat(61),
        }),
      ).rejects.toThrow(
        'Display name cannot exceed 60 characters.',
      );

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('accepts an empty display name', async () => {
      await expect(
        updateProfileAction({
          ...validInput,
          displayName: '',
        }),
      ).resolves.toBeUndefined();

      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'Bryan Degante',
        display_name: null,
      });
    });
  });

  describe('Authentication', () => {
    it('rejects unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(
        updateProfileAction(validInput),
      ).rejects.toThrow(
        'You must be signed in to update your profile.',
      );

      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe('Database updates', () => {
    it('updates the authenticated user profile', async () => {
      await updateProfileAction(validInput);

      expect(mockFrom).toHaveBeenCalledWith('profiles');

      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'Bryan Degante',
        display_name: 'Bryan',
      });

      expect(mockEq).toHaveBeenCalledWith(
        'id',
        'user-123',
      );

      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockMaybeSingle).toHaveBeenCalledOnce();
    });

    it('trims whitespace before updating the profile', async () => {
      await updateProfileAction({
        fullName: '  Bryan Degante  ',
        displayName: '  Bryan  ',
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'Bryan Degante',
        display_name: 'Bryan',
      });
    });

    it('revalidates the profile page after a successful update', async () => {
      await updateProfileAction(validInput);

      expect(mockRevalidatePath).toHaveBeenCalledWith('/profile');
    });

    it('does not revalidate when the database update fails', async () => {
      mockMaybeSingle.mockResolvedValue({
        data: null,
        error: { code: 'UPDATE_FAILED' },
      });

      await expect(
        updateProfileAction(validInput),
      ).rejects.toThrow(
        'Unable to save your profile. Please try again.',
      );

      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it('handles a missing profile row', async () => {
      mockMaybeSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(
        updateProfileAction(validInput),
      ).rejects.toThrow('Unable to find your profile.');

      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });
});

describe('updateEmailAction', () => {
  const currentEmail = 'old@example.com';
  const newEmail = 'new@example.com';

  beforeEach(() => {
    vi.clearAllMocks();

    mockCookies.mockResolvedValue({});

    mockCreateClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
        updateUser: mockUpdateUser,
      },
      from: mockFrom,
    });

    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'user-123', email: currentEmail },
      },
      error: null,
    });

    mockUpdateUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
  });

  describe('Validation', () => {
    it('rejects an empty email', async () => {
      await expect(
        updateEmailAction(''),
      ).rejects.toThrow('Please enter a valid email address.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('rejects whitespace-only input', async () => {
      await expect(
        updateEmailAction('   '),
      ).rejects.toThrow('Please enter a valid email address.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('rejects an invalid email format', async () => {
      await expect(
        updateEmailAction('not-an-email'),
      ).rejects.toThrow('Please enter a valid email address.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('rejects an email longer than 254 characters', async () => {
      const longEmail = `${'a'.repeat(243)}@example.com`;

      await expect(
        updateEmailAction(longEmail),
      ).rejects.toThrow('Email address is too long.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('rejects a non-string value', async () => {
      await expect(
        updateEmailAction(null as never),
      ).rejects.toThrow('Please enter a valid email address.');

      expect(mockCreateClient).not.toHaveBeenCalled();
    });
  });

  describe('Authentication', () => {
    it('rejects unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(
        updateEmailAction(newEmail),
      ).rejects.toThrow(
        'You must be signed in to change your email.',
      );

      expect(mockUpdateUser).not.toHaveBeenCalled();
    });
  });

  describe('Email updates', () => {
    it('rejects the current email address', async () => {
      await expect(
        updateEmailAction(currentEmail),
      ).rejects.toThrow(
        'This is already your current email address.',
      );

      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('compares the current email case-insensitively', async () => {
      await expect(
        updateEmailAction('OLD@EXAMPLE.COM'),
      ).rejects.toThrow(
        'This is already your current email address.',
      );

      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('updates the email through Supabase Auth', async () => {
      await updateEmailAction(newEmail);

      expect(mockUpdateUser).toHaveBeenCalledWith({
        email: newEmail,
      });
    });

    it('trims whitespace before updating the email', async () => {
      await updateEmailAction('  new@example.com  ');

      expect(mockUpdateUser).toHaveBeenCalledWith({
        email: newEmail,
      });
    });

    it('handles Supabase email update errors', async () => {
      mockUpdateUser.mockResolvedValue({
        data: { user: null },
        error: { code: 'EMAIL_UPDATE_FAILED' },
      });

      await expect(
        updateEmailAction(newEmail),
      ).rejects.toThrow(
        'Unable to update your email. Please try again.',
      );

      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it('revalidates the profile page after a successful request', async () => {
      await updateEmailAction(newEmail);

      expect(mockRevalidatePath).toHaveBeenCalledWith('/profile');
    });
  });
});
