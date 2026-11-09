'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import AppearanceCard from './AppearanceCard';
import { THEMES, type Theme } from '@/types/theme';

type AppearanceSelectorProps = {
	initialTheme: Theme;
	onSave: (theme: Theme) => Promise<void>;
};

export default function AppearanceSelector({
	initialTheme,
	onSave,
}: AppearanceSelectorProps) {
	const [selectedTheme, setSelectedTheme] = useState<Theme>(initialTheme);
	const [savedTheme, setSavedTheme] = useState<Theme>(initialTheme);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// Keep track of the latest successfully saved theme.
	const savedThemeRef = useRef<Theme>(initialTheme);

	// Live preview the selected theme.
	useEffect(() => {
		const root = document.documentElement;

		root.classList.remove(...THEMES);
		root.classList.add(selectedTheme);
	}, [selectedTheme]);

	// Restore the saved theme when leaving Settings.
	useEffect(() => {
		return () => {
			const root = document.documentElement;

			root.classList.remove(...THEMES);
			root.classList.add(savedThemeRef.current);
		};
	}, []);

	const handleSave = () => {
		setError(null);
		setSuccess(false);

		startTransition(async () => {
			try {
				await onSave(selectedTheme);

				// Update the saved theme only after a successful save.
				savedThemeRef.current = selectedTheme;
				setSavedTheme(selectedTheme);
				setSuccess(true);
			} catch {
				setError(
					'Unable to save your appearance preference. Please try again.',
				);
			}
		});
	};

	return (
		<section className="space-y-6">
			<div className="flex flex-wrap gap-4">
				{THEMES.map((theme) => (
					<AppearanceCard
						key={theme}
						theme={theme}
						isSelected={selectedTheme === theme}
						onClick={() => {
							setSelectedTheme(theme);
							setSuccess(false);
							setError(null);
						}}
						disabled={isPending}
					/>
				))}
			</div>

			<div className="flex flex-col items-end gap-2">
				{error && (
					<p role="alert" className="text-danger text-sm">
						{error}
					</p>
				)}

				{success && (
					<p role="status" className="text-success text-sm">
						Appearance saved successfully!
					</p>
				)}

				<button
					type="button"
					onClick={handleSave}
					disabled={selectedTheme === savedTheme || isPending}
					className="rounded-cozy bg-primary px-6 py-3 text-text-on-primary
            transition-colors hover:bg-primary-hover
            disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isPending ? 'Saving...' : 'Save changes'}
				</button>
			</div>
		</section>
	);
}
