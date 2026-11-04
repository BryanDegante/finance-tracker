import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NavModal from '../../components/UI/SideNav/NavModal';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.ComponentProps<'a'> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({
    fill,
    ...props
  }: React.ComponentProps<'img'> & { fill?: boolean }) => (
    <img {...props} />
  ),
}));

vi.mock('@/app/actions/auth', () => ({
  logoutAction: vi.fn(),
}));

describe('NavModal', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    vi.clearAllMocks();
  });

  const openNavigation = () => {
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i })
    );
  };

  const getDialog = () =>
    screen.getByRole('dialog', { name: /budgetier/i });

  it('renders the mobile header', () => {
    render(<NavModal />);

    expect(
      screen.getByRole('button', { name: /open navigation menu/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Budgetier')).toBeInTheDocument();
  });

  it('does not render the drawer initially', () => {
    render(<NavModal />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the navigation drawer when the menu button is clicked', () => {
    render(<NavModal />);

    openNavigation();

    expect(getDialog()).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open navigation menu/i })
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the drawer when the close button is clicked', () => {
    render(<NavModal />);

    openNavigation();

    const dialog = getDialog();

    fireEvent.click(
      within(dialog).getByRole('button', {
        name: /close navigation menu/i,
      })
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the drawer when the backdrop is clicked', () => {
    render(<NavModal />);

    openNavigation();

    const closeButtons = screen.getAllByRole('button', {
      name: /close navigation menu/i,
    });

    // The backdrop is the first button; the drawer close button is second.
    fireEvent.click(closeButtons[0]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the drawer when Escape is pressed', () => {
    render(<NavModal />);

    openNavigation();

    expect(getDialog()).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the drawer when a navigation link is clicked', () => {
    render(<NavModal />);

    openNavigation();

    fireEvent.click(
      screen.getByRole('link', { name: 'Transactions' })
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('locks body scrolling while the drawer is open', () => {
    render(<NavModal />);

    openNavigation();

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores the previous body overflow value when the drawer closes', () => {
    document.body.style.overflow = 'auto';

    render(<NavModal />);

    openNavigation();

    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.body.style.overflow).toBe('auto');
  });

  it('moves focus to the close button when the drawer opens', () => {
    render(<NavModal />);

    openNavigation();

    const closeButton = within(getDialog()).getByRole('button', {
      name: /close navigation menu/i,
    });

    expect(closeButton).toHaveFocus();
  });

  it('returns focus to the menu button when the drawer closes', () => {
    render(<NavModal />);

    const menuButton = screen.getByRole('button', {
      name: /open navigation menu/i,
    });

    openNavigation();

    fireEvent.click(
      within(getDialog()).getByRole('button', {
        name: /close navigation menu/i,
      })
    );

    expect(menuButton).toHaveFocus();
  });

  it('traps forward keyboard focus inside the drawer', () => {
    render(<NavModal />);

    openNavigation();

    const dialog = getDialog();

    const logoutButton = within(dialog).getByRole('button', {
      name: /logout/i,
    });

    const closeButton = within(dialog).getByRole('button', {
      name: /close navigation menu/i,
    });

    logoutButton.focus();

    fireEvent.keyDown(document, { key: 'Tab' });

    expect(closeButton).toHaveFocus();
  });

  it('traps backward keyboard focus inside the drawer', () => {
    render(<NavModal />);

    openNavigation();

    const dialog = getDialog();

    const logoutButton = within(dialog).getByRole('button', {
      name: /logout/i,
    });

    const closeButton = within(dialog).getByRole('button', {
      name: /close navigation menu/i,
    });

    closeButton.focus();

    fireEvent.keyDown(document, {
      key: 'Tab',
      shiftKey: true,
    });

    expect(logoutButton).toHaveFocus();
  });

  it('renders all navigation links', () => {
    render(<NavModal />);

    openNavigation();

    const dialog = getDialog();

    const expectedLinks = [
      'Dashboard',
      'Transactions',
      'Accounts',
      'Budgets',
      'Calendar',
      'Debt',
      'Savings',
      'Profile',
      'Settings',
    ];

    expectedLinks.forEach((label) => {
      expect(
        within(dialog).getByRole('link', { name: label })
      ).toBeInTheDocument();
    });
  });

  it('renders the logout button', () => {
    render(<NavModal />);

    openNavigation();

    expect(
      within(getDialog()).getByRole('button', { name: /logout/i })
    ).toBeInTheDocument();
  });
});