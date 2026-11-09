import type { Theme } from '@/types/theme';

type AppearanceCardProps = {
	theme: Theme;
	isSelected: boolean;
	onClick: () => void;
	disabled?: boolean;
};

export default function AppearanceCard({
	theme,
	isSelected,
	onClick,
	disabled,
}: AppearanceCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-pressed={isSelected}
			aria-label={`Preview ${theme} mode`}
			className={`
				disabled:cursor-not-allowed
				disabled:opacity-60
				disabled:hover:translate-y-0
				disabled:hover:border-border
				disabled:hover:shadow-none
				w-full sm:max-w-64
				flex flex-col gap-4
				rounded-cozy p-5
				border-2 text-left
				cursor-pointer
				transition-all duration-200 
				bg-card-muted
				hover:-translate-y-0.5 hover:shadow-cozy
				focus-visible:outline-none
				focus-visible:ring-2 focus-visible:ring-primary
				focus-visible:ring-offset-2
				${
					isSelected
						? 'border-primary ring-2 ring-primary/30'
						: 'border-border hover:border-primary/50'
				}
			`}
		>
			{/* Card Header */}
			<div className="flex items-center gap-3">
				<div
					className={`
						w-5 h-5 shrink-0 rounded-full
						flex items-center justify-center
						border-2
						${isSelected ? 'border-primary' : 'border-border-hover'}
					`}
				>
					{isSelected && (
						<div className="w-2.5 h-2.5 rounded-full bg-primary" />
					)}
				</div>

				<p className="font-nunito font-bold text-text-primary capitalize">
					{theme}
				</p>

				{isSelected && (
					<span className="ml-auto text-xs font-semibold text-primary">
						Selected
					</span>
				)}
			</div>

			{/* Theme Preview */}
			<div
				className={`
					${theme}
					w-full rounded-cozy-sm
					border border-border
					bg-background p-4
					flex flex-col gap-4
				`}
			>
				{/* Preview Label */}
				<div className="flex items-center justify-between">
					<p className="text-xs font-semibold text-text-muted">
						Preview
					</p>
					<div className="flex gap-1">
						<div className="w-2 h-2 rounded-full bg-primary" />
						<div className="w-2 h-2 rounded-full bg-secondary" />
					</div>
				</div>

				<div className="space-y-1">
					<p className="font-bold text-lg text-text-primary">
						AaBbCc
					</p>
					<p className="font-semibold text-sm text-text-secondary">
						AaBbCc
					</p>
					<p className="font-light text-xs text-text-muted">AaBbCc</p>
				</div>

				{/* Buttons */}
				<div className="flex flex-wrap gap-2">
					<div className="rounded-cozy-sm bg-primary px-3 py-1.5 text-xs font-semibold text-text-on-primary">
						Primary
					</div>

					<div className="rounded-cozy-sm bg-secondary px-3 py-1.5 text-xs font-semibold text-text-on-primary">
						Secondary
					</div>
				</div>
			</div>
		</button>
	);
}
