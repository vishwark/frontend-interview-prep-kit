import React, { useState, useEffect } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import { Sun, Moon } from 'lucide-react';

// Calculator state interface
interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: string | null;
  overwrite: boolean;
  memory: number;
}

const Calculator: React.FC = () => {
  // State for calculator
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operation: null,
    overwrite: true,
    memory: 0,
  });

  // State for theme
  const [darkMode, setDarkMode] = useState(false);

  // Handle digit input
  const handleDigit = (digit: string) => {
    if (state.overwrite) {
      setState({
        ...state,
        currentValue: digit,
        overwrite: false,
      });
    } else {
      // Don't allow multiple decimal points
      if (digit === '.' && state.currentValue.includes('.')) {
        return;
      }
      
      // Don't allow leading zeros unless it's a decimal
      if (state.currentValue === '0' && digit !== '.') {
        setState({
          ...state,
          currentValue: digit,
        });
      } else {
        setState({
          ...state,
          currentValue: state.currentValue + digit,
        });
      }
    }
  };

  // Handle operations
  const handleOperation = (operation: string) => {
    if (state.previousValue && state.operation && !state.overwrite) {
      // Calculate result of previous operation
      const result = calculate();
      setState({
        currentValue: result,
        previousValue: result,
        operation,
        overwrite: true,
        memory: state.memory,
      });
    } else {
      setState({
        ...state,
        previousValue: state.currentValue,
        operation,
        overwrite: true,
      });
    }
  };

  // Calculate result
  const calculate = (): string => {
    const prev = parseFloat(state.previousValue);
    const current = parseFloat(state.currentValue);
    
    if (isNaN(prev) || isNaN(current)) return state.currentValue;
    
    let result = 0;
    switch (state.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          return 'Error';
        }
        result = prev / current;
        break;
      default:
        return state.currentValue;
    }
    
    return result.toString();
  };

  // Handle equals
  const handleEquals = () => {
    if (!state.operation || state.overwrite) return;
    
    const result = calculate();
    setState({
      currentValue: result,
      previousValue: '',
      operation: null,
      overwrite: true,
      memory: state.memory,
    });
  };

  // Handle clear
  const handleClear = () => {
    setState({
      ...state,
      currentValue: '0',
      overwrite: true,
    });
  };

  // Handle all clear
  const handleAllClear = () => {
    setState({
      currentValue: '0',
      previousValue: '',
      operation: null,
      overwrite: true,
      memory: state.memory,
    });
  };

  // Handle percentage
  const handlePercentage = () => {
    const current = parseFloat(state.currentValue);
    if (isNaN(current)) return;
    
    setState({
      ...state,
      currentValue: (current / 100).toString(),
      overwrite: true,
    });
  };

  // Handle positive/negative toggle
  const handleToggleSign = () => {
    const current = parseFloat(state.currentValue);
    if (isNaN(current) || current === 0) return;
    
    setState({
      ...state,
      currentValue: (current * -1).toString(),
    });
  };

  // Handle memory functions
  const handleMemory = (action: 'M+' | 'M-' | 'MR' | 'MC') => {
    const current = parseFloat(state.currentValue);
    
    switch (action) {
      case 'M+':
        setState({
          ...state,
          memory: state.memory + (isNaN(current) ? 0 : current),
          overwrite: true,
        });
        break;
      case 'M-':
        setState({
          ...state,
          memory: state.memory - (isNaN(current) ? 0 : current),
          overwrite: true,
        });
        break;
      case 'MR':
        setState({
          ...state,
          currentValue: state.memory.toString(),
          overwrite: true,
        });
        break;
      case 'MC':
        setState({
          ...state,
          memory: 0,
        });
        break;
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDigit('.');
      } else if (e.key === '+') {
        handleOperation('+');
      } else if (e.key === '-') {
        handleOperation('-');
      } else if (e.key === '*') {
        handleOperation('×');
      } else if (e.key === '/') {
        handleOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape') {
        handleAllClear();
      } else if (e.key === 'Backspace') {
        handleClear();
      } else if (e.key === '%') {
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state]);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`calculator-container max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="p-2 flex justify-between items-center">
        <h2 className="text-lg font-medium">Calculator</h2>
        <button 
          onClick={toggleTheme}
          className={`p-1 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      
      <Display 
        value={state.currentValue} 
        expression={state.previousValue && state.operation ? `${state.previousValue} ${state.operation}` : ''} 
        darkMode={darkMode}
      />
      
      <Keypad 
        onDigit={handleDigit}
        onOperation={handleOperation}
        onEquals={handleEquals}
        onClear={handleClear}
        onAllClear={handleAllClear}
        onPercentage={handlePercentage}
        onToggleSign={handleToggleSign}
        onMemory={handleMemory}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Calculator;
