import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import useDebounce from './useDebounce';

// Define the suggestion item interface
export interface Suggestion {
  id: string | number;
  text: string;
  [key: string]: any; // Allow for additional properties
}

interface TypeaheadProps {
  // Required props
  onSearch: (query: string) => Promise<Suggestion[]>;
  onSelect: (suggestion: Suggestion) => void;
  
  // Optional props with defaults
  placeholder?: string;
  debounceTime?: number;
  minChars?: number;
  noResultsMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  className?: string;
  highlightMatches?: boolean;
}

/**
 * Typeahead/Autocomplete Component
 * 
 * A reusable typeahead component that:
 * - Shows suggestions as the user types
 * - Highlights matching text in suggestions
 * - Supports keyboard navigation
 * - Handles loading states and errors
 * - Implements debouncing to limit API calls
 */
const Typeahead: React.FC<TypeaheadProps> = ({
  onSearch,
  onSelect,
  placeholder = 'Search...',
  debounceTime = 300,
  minChars = 2,
  noResultsMessage = 'No results found',
  errorMessage = 'Error fetching results',
  loadingMessage = 'Loading...',
  className = '',
  highlightMatches = true
}) => {
  // State for the input value
  const [inputValue, setInputValue] = useState('');
  
  // Debounced search query
  const debouncedSearchTerm = useDebounce(inputValue, debounceTime);
  
  // State for suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  // State for UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  
  // Fetch suggestions when the debounced search term changes
  useEffect(() => {
    // Don't search if the input is too short
    if (debouncedSearchTerm.length < minChars) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    
    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await onSearch(debouncedSearchTerm);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [debouncedSearchTerm, minChars, onSearch]);
  
  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setActiveIndex(-1);
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.text);
    setIsOpen(false);
    onSelect(suggestion);
    inputRef.current?.focus();
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If dropdown is not open, don't handle navigation keys
    if (!isOpen && e.key !== 'Escape') return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prevIndex => 
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : -1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[activeIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setInputValue('');
        break;
        
      default:
        break;
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        suggestionsRef.current && 
        !inputRef.current.contains(e.target as Node) && 
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Scroll active suggestion into view
  useEffect(() => {
    if (activeIndex >= 0 && suggestionsRef.current) {
      const activeElement = suggestionsRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [activeIndex]);
  
  // Highlight matching text in suggestions
  const highlightText = (text: string, query: string) => {
    if (!highlightMatches || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <span key={index} className="bg-yellow-200 font-medium">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue.length >= minChars && setIsOpen(true)}
        placeholder={placeholder}
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls="typeahead-suggestions"
        aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {/* Clear button */}
      {inputValue && !isLoading && (
        <button
          type="button"
          onClick={() => {
            setInputValue('');
            setIsOpen(false);
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      
      {/* Suggestions dropdown */}
      {isOpen && (
        <ul
          ref={suggestionsRef}
          id="typeahead-suggestions"
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {/* Loading message */}
          {isLoading && (
            <li className="px-4 py-2 text-gray-500">
              {loadingMessage}
            </li>
          )}
          
          {/* Error message */}
          {error && (
            <li className="px-4 py-2 text-red-500">
              {errorMessage}: {error}
            </li>
          )}
          
          {/* No results message */}
          {!isLoading && !error && suggestions.length === 0 && (
            <li className="px-4 py-2 text-gray-500">
              {noResultsMessage}
            </li>
          )}
          
          {/* Suggestions */}
          {!isLoading && !error && suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`px-4 py-2 cursor-pointer ${
                activeIndex === index
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              {highlightText(suggestion.text, inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Typeahead;
