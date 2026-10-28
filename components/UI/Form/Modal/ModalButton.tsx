type ModalButtonProps = {
  label: string;
};

export default function ModalButton({ label}: ModalButtonProps) {
 
  return (
    <button
      type='button'
      className='group relative inline-flex items-center justify-center
				px-6 py-3 text-sm font-medium rounded-cozy-sm
				transition-all duration-300 ease-out
				active:scale-[0.98] active:translate-y-0
				focus:outline-none focus-visible:ring-2
				focus-visible:ring-offset-2 focus-visible:ring-offset-background
				shadow-cozy-sm  bg-primary text-text-on-primary
			hover:bg-primary-hover hover:shadow-cozy
			hover:-translate-y-0.5
			focus-visible:ring-primary'>
      {label}
    </button>
  );
}
