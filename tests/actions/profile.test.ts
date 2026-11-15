
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

import { updateProfileAction } from '@/app/actions/profile';

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
        user: { id: 'user-123' },
      },
      error: null,
    });

    mockMaybeSingle.mockResolvedValue({
      data: { id: 'user-123' },
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
