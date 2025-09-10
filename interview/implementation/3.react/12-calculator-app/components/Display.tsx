import React from 'react';

interface DisplayProps {
  value: string;
  expression: string;
  darkMode: boolean;
}

const Display: React.FC<DisplayProps> = ({ value, expression, darkMode }) => {
  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Expression display (previous value and operation) */}
      <div className={`text-right text-sm mb-1 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {expression}
      </div>
      
      {/* Current value display */}
      <div 
        className={`text-right text-3xl font-medium overflow-x-auto whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </div>
    </div>
  );
};

export default Display;
