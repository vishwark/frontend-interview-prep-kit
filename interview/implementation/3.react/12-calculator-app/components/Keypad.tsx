import React from 'react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperation: (operation: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onAllClear: () => void;
  onPercentage: () => void;
  onToggleSign: () => void;
  onMemory: (action: 'M+' | 'M-' | 'MR' | 'MC') => void;
  darkMode: boolean;
}

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'operation' | 'equals' | 'clear';
  className?: string;
  darkMode: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'default',
  className = '',
  darkMode
}) => {
  const baseClasses = "flex items-center justify-center text-lg font-medium rounded transition-colors duration-150 h-14";
  
  let variantClasses = '';
  
  if (darkMode) {
    switch (variant) {
      case 'operation':
        variantClasses = "bg-blue-600 hover:bg-blue-700 text-white";
        break;
      case 'equals':
        variantClasses = "bg-green-600 hover:bg-green-700 text-white";
        break;
      case 'clear':
        variantClasses = "bg-red-600 hover:bg-red-700 text-white";
        break;
      default:
        variantClasses = "bg-gray-700 hover:bg-gray-600 text-white";
    }
  } else {
    switch (variant) {
      case 'operation':
        variantClasses = "bg-blue-100 hover:bg-blue-200 text-blue-800";
        break;
      case 'equals':
        variantClasses = "bg-green-100 hover:bg-green-200 text-green-800";
        break;
      case 'clear':
        variantClasses = "bg-red-100 hover:bg-red-200 text-red-800";
        break;
      default:
        variantClasses = "bg-gray-100 hover:bg-gray-200 text-gray-800";
    }
  }
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperation,
  onEquals,
  onClear,
  onAllClear,
  onPercentage,
  onToggleSign,
  onMemory,
  darkMode
}) => {
  return (
    <div className="grid grid-cols-4 gap-1 p-2">
      {/* Row 1 */}
      <Button onClick={onAllClear} variant="clear" darkMode={darkMode}>AC</Button>
      <Button onClick={onClear} variant="clear" darkMode={darkMode}>C</Button>
      <Button onClick={onPercentage} variant="operation" darkMode={darkMode}>%</Button>
      <Button onClick={() => onOperation('÷')} variant="operation" darkMode={darkMode}>÷</Button>
      
      {/* Row 2 */}
      <Button onClick={() => onDigit('7')} darkMode={darkMode}>7</Button>
      <Button onClick={() => onDigit('8')} darkMode={darkMode}>8</Button>
      <Button onClick={() => onDigit('9')} darkMode={darkMode}>9</Button>
      <Button onClick={() => onOperation('×')} variant="operation" darkMode={darkMode}>×</Button>
      
      {/* Row 3 */}
      <Button onClick={() => onDigit('4')} darkMode={darkMode}>4</Button>
      <Button onClick={() => onDigit('5')} darkMode={darkMode}>5</Button>
      <Button onClick={() => onDigit('6')} darkMode={darkMode}>6</Button>
      <Button onClick={() => onOperation('-')} variant="operation" darkMode={darkMode}>-</Button>
      
      {/* Row 4 */}
      <Button onClick={() => onDigit('1')} darkMode={darkMode}>1</Button>
      <Button onClick={() => onDigit('2')} darkMode={darkMode}>2</Button>
      <Button onClick={() => onDigit('3')} darkMode={darkMode}>3</Button>
      <Button onClick={() => onOperation('+')} variant="operation" darkMode={darkMode}>+</Button>
      
      {/* Row 5 */}
      <Button onClick={onToggleSign} darkMode={darkMode}>+/-</Button>
      <Button onClick={() => onDigit('0')} darkMode={darkMode}>0</Button>
      <Button onClick={() => onDigit('.')} darkMode={darkMode}>.</Button>
      <Button onClick={onEquals} variant="equals" darkMode={darkMode}>=</Button>
      
      {/* Row 6 - Memory Functions */}
      <Button onClick={() => onMemory('MC')} className="text-sm" darkMode={darkMode}>MC</Button>
      <Button onClick={() => onMemory('MR')} className="text-sm" darkMode={darkMode}>MR</Button>
      <Button onClick={() => onMemory('M-')} className="text-sm" darkMode={darkMode}>M-</Button>
      <Button onClick={() => onMemory('M+')} className="text-sm" darkMode={darkMode}>M+</Button>
    </div>
  );
};

export default Keypad;
