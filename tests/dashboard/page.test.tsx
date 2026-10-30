import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DashboardPage from '@/app/dashboard/page';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

vi.mock('@/utils/supabase/server', () => ({
	createClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
	cookies: vi.fn(),
}));

vi.mock('next/navigation', () => ({
	redirect: vi.fn((path: string) => {
		throw new Error(`NEXT_REDIRECT:${path}`);
	}),
}));

vi.mock('@/components/UI/Logout/LogoutButton', () => ({
	default: () => <button>Log out</button>,
}));

describe('DashboardPage', () => {
	const mockGetClaims = vi.fn();
	const mockMaybeSingle = vi.fn();
	const mockSelect = vi.fn();
	const mockEq = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(cookies).mockResolvedValue({
			getAll: vi.fn(),
			set: vi.fn(),
		} as never);

		vi.mocked(createClient).mockReturnValue({
			auth: {
				getClaims: mockGetClaims,
			},
			from: vi.fn(() => ({
				select: mockSelect,
			})),
		} as never);

		mockSelect.mockReturnValue({
			eq: mockEq,
		});

		mockEq.mockReturnValue({
			maybeSingle: mockMaybeSingle,
		});
	});

	it('redirects unauthenticated visitors without querying the profile', async () => {
		mockGetClaims.mockResolvedValue({
			data: { claims: null },
			error: null,
		});

		await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/');

		expect(redirect).toHaveBeenCalledWith('/');
		expect(mockGetClaims).toHaveBeenCalledOnce();
		expect(mockSelect).not.toHaveBeenCalled();
	});

	it('redirects when checking authentication fails', async () => {
		mockGetClaims.mockResolvedValue({
			data: { claims: null },
			error: { message: 'Authentication check failed' },
		});

		await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/');

		expect(redirect).toHaveBeenCalledWith('/');
		expect(mockSelect).not.toHaveBeenCalled();
	});

	it('shows the authenticated user profile', async () => {
		mockGetClaims.mockResolvedValue({
			data: {
				claims: { sub: 'test-user-id' },
			},
			error: null,
		});

		mockMaybeSingle.mockResolvedValue({
			data: {
				display_name: 'Test User',
				currency_code: 'USD',
			},
			error: null,
		});

		const page = await DashboardPage();
		render(page);

		expect(
			screen.getByRole('heading', { name: 'Welcome, Test User' }),
		).toBeInTheDocument();

		expect(screen.getByText('Preferred currency: USD')).toBeInTheDocument();

		expect(mockEq).toHaveBeenCalledWith('id', 'test-user-id');
		expect(mockSelect).toHaveBeenCalledWith(
			'display_name, currency_code',
		);
	});

	it('shows USD when the profile has no currency value', async () => {
		mockGetClaims.mockResolvedValue({
			data: {
				claims: { sub: 'test-user-id' },
			},
			error: null,
		});

		mockMaybeSingle.mockResolvedValue({
			data: {
				display_name: null,
				currency_code: null,
			},
			error: null,
		});

		const page = await DashboardPage();
		render(page);

		expect(screen.getByText('Preferred currency: USD')).toBeInTheDocument();
	});

	it('throws when the profile query fails', async () => {
		mockGetClaims.mockResolvedValue({
			data: {
				claims: { sub: 'test-user-id' },
			},
			error: null,
		});

		mockMaybeSingle.mockResolvedValue({
			data: null,
			error: { message: 'Database query failed' },
		});

		await expect(DashboardPage()).rejects.toThrow(
			'Unable to load your profile.',
		);
	});
});