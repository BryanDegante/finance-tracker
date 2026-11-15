
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PersonalInfo from '@/components/Profile/PersonalInfo';

describe('PersonalInfo', () => {
  const mockOnSave = vi.fn().mockResolvedValue(undefined);

  const defaultProps = {
    fullName: 'Bryan Degante',
    displayName: 'Bryan',
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Initial rendering
  describe('Rendering', () => {
    it('displays the profile information passed through props', () => {
      render(<PersonalInfo {...defaultProps} />);

      expect(screen.getByText('Bryan Degante')).toBeInTheDocument();
      expect(screen.getByText('Bryan')).toBeInTheDocument();
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    it('starts in view mode', () => {
      render(<PersonalInfo {...defaultProps} />);

      expect(screen.getByText('view mode')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('updates displayed values when props change outside edit mode', async () => {
      const { rerender } = render(<PersonalInfo {...defaultProps} />);

      rerender(
        <PersonalInfo
          {...defaultProps}
          fullName="Updated Name"
          displayName="Updated Display"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Updated Name')).toBeInTheDocument();
        expect(screen.getByText('Updated Display')).toBeInTheDocument();
      });
    });
  });

  // Editing
  describe('Editing', () => {
    it('enters edit mode when Edit is clicked', () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      expect(screen.getByText('edit mode')).toBeInTheDocument();
      expect(screen.getByLabelText('Full Name')).toHaveValue('Bryan Degante');
      expect(screen.getByLabelText('Display Name')).toHaveValue('Bryan');
    });

    it('allows the user to update both names', () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'New Full Name' },
      });

      fireEvent.change(screen.getByLabelText('Display Name'), {
        target: { value: 'New Display Name' },
      });

      expect(screen.getByLabelText('Full Name')).toHaveValue('New Full Name');
      expect(screen.getByLabelText('Display Name')).toHaveValue('New Display Name');
    });

    it('restores the original values when Cancel is clicked', () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Changed Name' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Bryan Degante')).toBeInTheDocument();
      expect(screen.getByText('view mode')).toBeInTheDocument();
    });
  });

  // Validation
  describe('Validation', () => {
    it('displays an error when full name is empty', () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: '   ' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Full name is required.'
      );

      expect(mockOnSave).not.toHaveBeenCalled();
      expect(screen.getByText('edit mode')).toBeInTheDocument();
    });

    it('allows an empty display name', async () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Display Name'), {
        target: { value: '' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          fullName: 'Bryan Degante',
          displayName: '',
        });
      });
    });

    it('clears the validation error when the user changes an input', () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: '' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(screen.getByRole('alert')).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Bryan Degante' },
      });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  // Saving
  describe('Saving', () => {
    it('trims whitespace before passing values to onSave', async () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: '  Bryan Degante  ' },
      });

      fireEvent.change(screen.getByLabelText('Display Name'), {
        target: { value: '  Bryan  ' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          fullName: 'Bryan Degante',
          displayName: 'Bryan',
        });
      });
    });

    it('exits edit mode after a successful save', async () => {
      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Updated Name' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      await waitFor(() => {
        expect(screen.getByText('Updated Name')).toBeInTheDocument();
        expect(screen.getByText('view mode')).toBeInTheDocument();
      });
    });

    it('displays an error and stays in edit mode when saving fails', async () => {
      mockOnSave.mockRejectedValueOnce(new Error('Database error'));

      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Updated Name' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Unable to save your changes. Please try again.'
      );

      expect(screen.getByText('edit mode')).toBeInTheDocument();
      expect(screen.getByLabelText('Full Name')).toHaveValue('Updated Name');
    });

    it('disables controls while saving', async () => {
      let resolveSave!: () => void;

      const pendingSave = new Promise<void>((resolve) => {
        resolveSave = resolve;
      });

      mockOnSave.mockReturnValueOnce(pendingSave);

      render(<PersonalInfo {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
      expect(screen.getByLabelText('Full Name')).toBeDisabled();

      expect(screen.getByRole('status')).toHaveTextContent(
        'Saving your profile...'
      );

      resolveSave();

      await waitFor(() => {
        expect(screen.getByText('view mode')).toBeInTheDocument();
      });
    });
  });
});
