import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-apple-canvas rounded-apple p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-apple-hover ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  onClick?: () => void; 
  disabled?: boolean; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' 
}> = ({ onClick, disabled, children, variant = 'primary' }) => {
  const baseStyle = "px-6 py-2.5 rounded-full transition-all duration-300 ease-out font-medium text-[15px] tracking-tight inline-flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-apple-blue text-white hover:bg-apple-blueHover disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
    secondary: "bg-gray-200 text-apple-headline hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export const SelectRatio: React.FC<{
  value: string;
  onChange: (val: any) => void;
  options: { label: string; value: string }[];
}> = ({ value, onChange, options }) => (
  <div className="flex bg-gray-200/60 p-1 rounded-xl w-max mt-2">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          value === opt.value
            ? 'bg-white text-apple-headline shadow-sm'
            : 'text-apple-text hover:text-apple-headline'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const Spinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue"></div>
  </div>
);