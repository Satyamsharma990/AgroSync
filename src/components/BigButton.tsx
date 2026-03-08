import React from 'react';

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
}

const BigButton: React.FC<BigButtonProps> = ({ icon, label, variant = 'primary', className = '', ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary': return 'bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200 hover:bg-white';
      case 'accent': return 'bg-gradient-to-r from-accent-yellow to-yellow-500 text-gray-900 border-none';
      case 'danger': return 'bg-gradient-to-r from-alert-red to-red-600 text-white border-none';
      case 'success': return 'bg-gradient-to-r from-secondary-green to-green-500 text-white border-none';
      case 'primary':
      default: return 'bg-gradient-to-r from-primary-green to-[#1B5E20] text-white border-none';
    }
  };

  return (
    <button 
      className={`big-button ${getVariantClasses()} ${className}`}
      {...props}
    >
      {icon && <span className="flex">{icon}</span>}
      {label}
    </button>
  );
};

export default BigButton;
