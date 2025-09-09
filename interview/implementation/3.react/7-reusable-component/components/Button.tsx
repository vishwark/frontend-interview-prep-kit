import React, { ButtonHTMLAttributes } from 'react';

// Define the types for button variants, sizes, and icon positions
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
type ButtonSize = 'small' | 'medium' | 'large';
type IconPosition = 'left' | 'right' | 'only';

// Define the props interface for the Button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * Button Component
 * 
 * A reusable button component with support for:
 * - Different variants (primary, secondary, danger, etc.)
 * - Different sizes (small, medium, large)
 * - Icons (left, right, or icon-only)
 * - Loading state with spinner
 * - Disabled state
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  // Base styles for the button
  const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
  };
  
  // Size styles
  const sizeStyles = {
    small: 'text-xs px-2.5 py-1.5',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-6 py-3',
  };
  
  // Disabled and loading styles
  const stateStyles = (disabled || isLoading) 
    ? 'opacity-60 cursor-not-allowed' 
    : 'cursor-pointer';

  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${stateStyles} ${className}`;

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Render icon based on position
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <LoadingSpinner />
          {iconPosition !== 'only' && children}
        </>
      );
    }

    if (iconPosition === 'only' && icon) {
      return icon;
    }

    if (iconPosition === 'left' && icon) {
      return (
        <>
          <span className="mr-2">{icon}</span>
          {children}
        </>
      );
    }

    if (iconPosition === 'right' && icon) {
      return (
        <>
          {children}
          <span className="ml-2">{icon}</span>
        </>
      );
    }

    return children;
  };

  return (
    <button
      className={buttonStyles}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
