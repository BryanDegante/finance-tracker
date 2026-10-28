type FormButtonProps = {
  label: string;
  variant: 'sage' | 'blush' | 'outline';
	type:'button' | 'submit' | 'reset';
	onClick ?: () => void;
};

export default function FormButton({ label, variant,type,onClick}: FormButtonProps) {
  const variants = {
    sage: `
			bg-secondary text-text-on-primary
			hover:bg-secondary-hover hover:shadow-cozy
			hover:-translate-y-0.5
			focus-visible:ring-secondary
		`,
    blush: `
			bg-primary text-text-on-primary
			hover:bg-primary-hover hover:shadow-cozy
			hover:-translate-y-0.5
			focus-visible:ring-primary
		`,
    outline: `
			border-2 border-secondary text-text-primary bg-transparent
			hover:bg-secondary-light hover:-translate-y-0.5
			focus-visible:ring-secondary
		`,
  };

  return (
    <button
      type={type}
			onClick={onClick}
      className={`group relative inline-flex items-center justify-center
				px-6 py-3 text-sm font-medium rounded-cozy-sm
				transition-all duration-300 ease-out
				active:scale-[0.98] active:translate-y-0
				focus:outline-none focus-visible:ring-2
				focus-visible:ring-offset-2 focus-visible:ring-offset-background
				shadow-cozy-sm ${variants[variant]}`}>
      {label}
    </button>
  );
}
