import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
}

/**
 * SearchInput Component
 * 
 * A search input component with debouncing for the file explorer.
 */
const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);
  
  // Call onSearch when debounced search term changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Clear search
  const handleClear = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);
  
  return (
    <div className="relative mb-4">
      <div className="flex items-center border rounded-md overflow-hidden">
        <div className="pl-3 pr-2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search files and folders..."
          className="py-2 px-2 w-full outline-none"
          aria-label="Search files and folders"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="pr-3 pl-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {debouncedSearchTerm && (
        <div className="absolute right-0 top-full mt-1 text-xs text-gray-500">
          Searching for: "{debouncedSearchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchInput;
