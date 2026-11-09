type AppearanceCardProps = {
  theme: 'light' | 'dark';
  isSelected: boolean;
  onClick: () => void;
};


export default function AppearanceCard({ theme,isSelected,onClick }: AppearanceCardProps) {
  return (
    <button className={`${theme !=='light' && theme} border-3 border-border bg-card-muted flex flex-col w-60 px-8 py-4 cursor-pointer gap-4`} onClick={onClick}>
      {/* Input wrapper */}
      <div>
        <div className="w-4 h-4 flex items-center justify-center border-primary border-2 bg-background rounded-full">
          {isSelected && (<div className="w-1.5 h-1.5 rounded-full bg-secondary"/>) }
        </div>
        <label htmlFor={`${theme} theme`} className="">{theme.toUpperCase()}</label>
      </div>
      {/* Examples wrapper */}
      <div>
        <div className='bg-background'>Background</div>
        {/* Text */}
        <div className='gap-3'>
          <p className='font-bold text-xl text-text-primary'>AaBbCc</p>
          <p className='font-semibold text-xl text-text-secondary'>AaBbCc</p>
          <p className='font-light text-xl text-text-muted'>AaBbCc</p>
        </div>
        {/* Buttons */}
        <div>
          <div className='py-2 px-6 bg-primary rounded-cozy w-fit'>Button</div>
          <div className='py-2 px-6 bg-secondary rounded-cozy w-fit'>
            Button
          </div>
        </div>
      </div>
    </button>
  );
}
