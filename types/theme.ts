export const THEMES = ['light', 'dark', 'forest', 'ocean','honey', 'brick' ] as const;

export type Theme = (typeof THEMES)[number];

export function isTheme(value: unknown): value is Theme {
	return THEMES.includes(value as Theme);
}
