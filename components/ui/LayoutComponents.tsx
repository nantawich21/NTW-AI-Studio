import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-sm shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary'
}> = ({ onClick, disabled, children, variant = 'primary' }) => {
  const baseStyle = "px-6 py-2 rounded-sm transition-all duration-300 ease-out font-medium text-sm tracking-wide";
  const variants = {
    primary: "bg-muji-accent text-white hover:bg-opacity-90 disabled:bg-gray-300",
    secondary: "bg-muji-light text-muji-text hover:bg-gray-200 disabled:bg-gray-100"
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
  <div className="flex gap-2 mt-2">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-4 py-2 text-xs rounded-sm border ${
          value === opt.value
            ? 'border-muji-accent text-muji-accent bg-muji-accent/10'
            : 'border-gray-200 text-gray-500 hover:border-gray-300'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const Spinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-muji-accent"></div>
  </div>
);