import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { THEMES } from '@/types/theme';
import AppearanceSelector from '@/components/UI/Appearance Selector/AppearanceSelector';

afterEach(() => {
	document.documentElement.classList.remove(...THEMES);
});

describe('AppearanceSelector', () => {
	// 1. Renders all available themes.
	it('renders all six appearance cards', () => {
		render(<AppearanceSelector initialTheme="light" onSave={vi.fn()} />);

		THEMES.forEach((theme) => {
			expect(
				screen.getByRole('button', {
					name: new RegExp(`preview ${theme} mode`, 'i'),
				}),
			).toBeInTheDocument();
		});
	});

	// 2. Displays the initial selected theme.
	it('selects the initial theme', () => {
		render(<AppearanceSelector initialTheme="dark" onSave={vi.fn()} />);

		expect(
			screen.getByRole('button', {
				name: /preview dark mode/i,
			}),
		).toHaveAttribute('aria-pressed', 'true');
	});

	// 3. Updates the selected theme and live preview.
	it('updates the selected theme and document preview', async () => {
		render(<AppearanceSelector initialTheme="light" onSave={vi.fn()} />);

		fireEvent.click(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		);

		expect(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		).toHaveAttribute('aria-pressed', 'true');

		await waitFor(() => {
			expect(document.documentElement.classList.contains('forest')).toBe(
				true,
			);
		});
	});

	// 4. Disables saving when there are no unsaved changes.
	it('disables saving when the selected theme matches the saved theme', () => {
		render(<AppearanceSelector initialTheme="light" onSave={vi.fn()} />);

		expect(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		).toBeDisabled();
	});

	// 5. Saves the selected theme.
	it('calls onSave with the selected theme', async () => {
		const mockSave = vi.fn().mockResolvedValue(undefined);

		render(<AppearanceSelector initialTheme="light" onSave={mockSave} />);

		fireEvent.click(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		);

		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		await waitFor(() => {
			expect(mockSave).toHaveBeenCalledWith('forest');
		});
	});

	// 6. Displays the loading state while saving.
	it('disables theme selection and shows loading while saving', async () => {
		let resolveSave!: () => void;

		const mockSave = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolveSave = resolve;
				}),
		);

		render(<AppearanceSelector initialTheme="light" onSave={mockSave} />);

		fireEvent.click(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		);

		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		expect(
			screen.getByRole('button', {
				name: /saving/i,
			}),
		).toBeDisabled();

		expect(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		).toBeDisabled();

		resolveSave();

		await screen.findByRole('status');
	});

	// 7. Displays success and updates the saved state.
	it('displays success after saving and disables further saving', async () => {
		const mockSave = vi.fn().mockResolvedValue(undefined);

		render(<AppearanceSelector initialTheme="light" onSave={mockSave} />);

		fireEvent.click(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		);

		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		expect(await screen.findByRole('status')).toHaveTextContent(
			'Appearance saved successfully!',
		);

		expect(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		).toBeDisabled();
	});

	// 8. Handles a failed save and allows retrying.
	it('displays an error after a failed save and allows retrying', async () => {
		const mockSave = vi
			.fn()
			.mockRejectedValueOnce(new Error('Database update failed'))
			.mockResolvedValueOnce(undefined);

		render(<AppearanceSelector initialTheme="light" onSave={mockSave} />);

		fireEvent.click(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		);

		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		expect(await screen.findByRole('alert')).toHaveTextContent(
			'Unable to save your appearance preference. Please try again.',
		);

		expect(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		).toHaveAttribute('aria-pressed', 'true');

		expect(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		).toBeEnabled();

		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		await waitFor(() => {
			expect(mockSave).toHaveBeenCalledTimes(2);
		});

		expect(await screen.findByRole('status')).toHaveTextContent(
			'Appearance saved successfully!',
		);
	});

	// 9. Clears feedback when selecting another theme.
	it('clears success and error messages when selecting another theme', async () => {
		const mockSave = vi
			.fn()
			.mockResolvedValueOnce(undefined)
			.mockRejectedValueOnce(new Error('Database update failed'));

		render(<AppearanceSelector initialTheme="light" onSave={mockSave} />);

		// First, generate a success message.
		fireEvent.click(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		);

		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		await screen.findByRole('status');

		// Selecting another theme clears success feedback.
		fireEvent.click(
			screen.getByRole('button', {
				name: /preview ocean mode/i,
			}),
		);

		expect(screen.queryByRole('status')).not.toBeInTheDocument();

		// Generate an error message.
		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		await screen.findByRole('alert');

		// Selecting another theme clears error feedback.
		fireEvent.click(
			screen.getByRole('button', {
				name: /preview honey mode/i,
			}),
		);

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	// 10. Restores the last saved theme when unmounted.
	it('restores the last saved theme when leaving Settings', async () => {
		const mockSave = vi.fn().mockResolvedValue(undefined);

		const { unmount } = render(
			<AppearanceSelector initialTheme="light" onSave={mockSave} />,
		);

		// Preview Forest and save it.
		fireEvent.click(
			screen.getByRole('button', {
				name: /preview forest mode/i,
			}),
		);

		fireEvent.click(
			screen.getByRole('button', {
				name: /save changes/i,
			}),
		);

		await screen.findByRole('status');

		// Preview Ocean without saving it.
		fireEvent.click(
			screen.getByRole('button', {
				name: /preview ocean mode/i,
			}),
		);

		// Leave Settings.
		unmount();

		expect(document.documentElement.classList.contains('forest')).toBe(
			true,
		);

		expect(document.documentElement.classList.contains('ocean')).toBe(
			false,
		);
	});
});
