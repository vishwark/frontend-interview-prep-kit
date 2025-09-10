import React from 'react';
import Calculator from './components/Calculator';

const CalculatorApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">React Calculator</h1>
          <p className="text-gray-600 mt-2">
            A simple calculator with basic and memory functions
          </p>
        </header>
        
        <Calculator />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <h2 className="font-medium mb-2">Keyboard Shortcuts</h2>
          <ul className="grid grid-cols-2 gap-2">
            <li>Numbers: 0-9</li>
            <li>Decimal: .</li>
            <li>Operations: +, -, *, /</li>
            <li>Equals: Enter or =</li>
            <li>Clear: Backspace</li>
            <li>All Clear: Escape</li>
            <li>Percentage: %</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
