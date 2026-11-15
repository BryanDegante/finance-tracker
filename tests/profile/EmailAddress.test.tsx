
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailAddress from '@/components/Profile/EmailAddress';

describe('EmailAddress', () => {
  const initialEmail = 'user@example.com';

  it('renders the Email Address heading', () => {
    render(<EmailAddress emailAddress={initialEmail} />);

    expect(
      screen.getByRole('heading', { name: /email address/i }),
    ).toBeInTheDocument();
  });

  it('displays the initial email address', () => {
    render(<EmailAddress emailAddress={initialEmail} />);

    expect(screen.getByText(initialEmail)).toBeInTheDocument();
  });

  it('starts in view mode', () => {
    render(<EmailAddress emailAddress={initialEmail} />);

    expect(screen.getByText('view mode')).toBeInTheDocument();
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
  });

  it('does not display the email input until Edit is clicked', () => {
    render(<EmailAddress emailAddress={initialEmail} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('switches to edit mode when Edit is clicked', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByText('edit mode')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('populates the input with the current email', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('textbox')).toHaveValue(initialEmail);
  });

  it('updates the input when the user changes the email', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');

    await user.clear(input);
    await user.type(input, 'new@example.com');

    expect(input).toHaveValue('new@example.com');
  });

  it('restores the original email when Cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

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

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Email address is required.',
    );
  });

  it('displays an error when saving an invalid email', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'invalid-email');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.',
    );
  });

  it('marks the input as invalid when validation fails', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('associates the validation error with the input', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

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

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox'), 'new@example.com');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('trims a valid email and exits edit mode after saving', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');

    await user.clear(input);
    await user.type(input, '  new@example.com  ');

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByText('new@example.com')).toBeInTheDocument();
    expect(screen.getByText('view mode')).toBeInTheDocument();
  });

  it('clears validation errors when Cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<EmailAddress emailAddress={initialEmail} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
