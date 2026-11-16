import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailAddress from '@/components/Profile/EmailAddress';

describe('EmailAddress', () => {
  const initialEmail = 'user@example.com';
  const mockOnSave = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockOnSave.mockReset();
    mockOnSave.mockResolvedValue(undefined);
  });

  const renderEmailAddress = () =>
    render(<EmailAddress emailAddress={initialEmail} onSave={mockOnSave} />);

  it('renders the Email Address heading', () => {
    renderEmailAddress();

    expect(
      screen.getByRole('heading', { name: /email address/i }),
    ).toBeInTheDocument();
  });

  it('displays the initial email address', () => {
    renderEmailAddress();

    expect(screen.getByText(initialEmail)).toBeInTheDocument();
  });

  it('starts in view mode', () => {
    renderEmailAddress();

    expect(screen.getByText('view mode')).toBeInTheDocument();
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
  });

  it('does not display the email input until Edit is clicked', () => {
    renderEmailAddress();

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('switches to edit mode when Edit is clicked', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByText('edit mode')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('populates the input with the current email', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('textbox')).toHaveValue(initialEmail);
  });

  it('updates the input when the user changes the email', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');

    await user.clear(input);
    await user.type(input, 'new@example.com');

    expect(input).toHaveValue('new@example.com');
  });

  it('restores the original email when Cancel is clicked', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');

    await user.clear(input);
    await user.type(input, 'new@example.com');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText(initialEmail)).toBeInTheDocument();
    expect(screen.getByText('view mode')).toBeInTheDocument();
  });

  it('displays an error when saving an empty email', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Email address is required.',
    );
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('displays an error when saving an invalid email', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'invalid-email');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.',
    );
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('marks the input as invalid when validation fails', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates the validation error with the input', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'email-error',
    );
  });

  it('clears the validation error when the user changes the input', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox'), 'new@example.com');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('trims a valid email, calls onSave, and exits edit mode', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');

    await user.clear(input);
    await user.type(input, '  new@example.com  ');

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(mockOnSave).toHaveBeenCalledWith('new@example.com');

    expect(
      await screen.findByText(
        'Check your inbox to confirm your new email address.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(initialEmail)).toBeInTheDocument();
    expect(screen.getByText('view mode')).toBeInTheDocument();
  });

  it('clears validation errors when Cancel is clicked', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('displays an error when onSave fails', async () => {
    const user = userEvent.setup();

    mockOnSave.mockRejectedValueOnce(
      new Error('Unable to update your email. Please try again.'),
    );

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'new@example.com');

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to update your email. Please try again.',
    );

    expect(screen.getByText('edit mode')).toBeInTheDocument();
  });

  it('does not show a confirmation message when onSave fails', async () => {
    const user = userEvent.setup();

    mockOnSave.mockRejectedValueOnce(new Error('Update failed.'));

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'new@example.com');

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Update failed.',
    );

    expect(
      screen.queryByText('Check your inbox to confirm your new email address.'),
    ).not.toBeInTheDocument();
  });

  it('shows a saving state while onSave is pending', async () => {
    const user = userEvent.setup();

    let resolveSave!: () => void;

    mockOnSave.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'new@example.com');

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();

    resolveSave();

    expect(
      await screen.findByText(
        'Check your inbox to confirm your new email address.',
      ),
    ).toBeInTheDocument();
  });

  it('prevents saving an email longer than 254 characters', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');
    const longEmail = `${'a'.repeat(245)}@example.com`;

    await user.clear(input);
    await user.type(input, longEmail);

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Email address is too long.',
    );

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('does not call onSave when the email is unchanged', async () => {
    const user = userEvent.setup();

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('does not allow repeated submissions while saving', async () => {
    const user = userEvent.setup();

    let resolveSave!: () => void;

    mockOnSave.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );

    renderEmailAddress();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'new@example.com');

    const saveButton = screen.getByRole('button', {
      name: 'Save Changes',
    });

    await user.click(saveButton);

    expect(saveButton).toBeDisabled();

    resolveSave();

    await screen.findByText(
      'Check your inbox to confirm your new email address.',
    );

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });
});
