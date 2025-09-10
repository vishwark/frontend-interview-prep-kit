import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DropdownProps, DropdownOption, isValueArray } from './types';
import { ChevronDown, Search, Check, X } from 'lucide-react';

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  disabled = false,
  searchable = false,
  multiSelect = false,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  size = 'md',
  variant = 'default',
  maxHeight = 300,
  renderOption,
  renderTrigger,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
  
  // Determine selected options
  const selectedOptions = useMemo(() => {
    if (!value) return [];
    
    if (multiSelect && isValueArray(value)) {
      return options.filter(option => {
        const optionValue = option.value;
        const optionId = option.id;
        return value.some(v => v === optionValue || v === optionId);
      });
    } else {
      return options.filter(option => 
        option.value === value || option.id === value
      );
    }
  }, [options, value, multiSelect]);
  
  // Filter options based on search term and group them
  const { filteredOptions, groupedOptions } = useMemo(() => {
    const filtered = searchTerm 
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
    
    // Group options if they have group property
    const grouped: Record<string, DropdownOption[]> = {};
    filtered.forEach(option => {
      const group = option.group || '';
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(option);
    });
    
    return { filteredOptions: filtered, groupedOptions: grouped };
  }, [options, searchTerm]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
          
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          }
          break;
          
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredOptions, highlightedIndex]);
  
  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };
  
  // Handle option selection
  const handleOptionSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    
    if (multiSelect) {
      const isSelected = selectedOptions.some(
        selected => selected.id === option.id
      );
      
      const newValue = isSelected
        ? selectedOptions
            .filter(selected => selected.id !== option.id)
            .map(selected => selected.value)
        : [...selectedOptions.map(selected => selected.value), option.value];
      
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };
  
  // Check if an option is selected
  const isOptionSelected = (option: DropdownOption) => {
    return selectedOptions.some(selected => selected.id === option.id);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };
  
  // Clear selection
  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiSelect ? [] : undefined);
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-2.5 px-4',
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-300 hover:border-gray-400',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-100',
  };
  
  // Render trigger element
  const renderTriggerElement = () => {
    if (renderTrigger) {
      return renderTrigger(selectedOptions, isOpen);
    }
    
    return (
      <div 
        className={`flex items-center justify-between w-full ${sizeClasses[size]} ${variantClasses[variant]} rounded-md cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${triggerClassName}`}
      >
        <div className="flex-grow truncate flex items-center gap-2">
          {selectedOptions.length > 0 ? (
            multiSelect ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map(option => (
                  <span 
                    key={option.id} 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full flex items-center"
                  >
                    {option.label}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionSelect(option);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      aria-label={`Remove ${option.label}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="truncate">
                {selectedOptions[0]?.icon && (
                  <span className="mr-2">{selectedOptions[0].icon}</span>
                )}
                {selectedOptions[0]?.label}
              </span>
            )
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {selectedOptions.length > 0 && (
            <button
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </div>
    );
  };
  
  // Render option element
  const renderOptionElement = (option: DropdownOption, index: number) => {
    const isSelected = isOptionSelected(option);
    const isHighlighted = index === highlightedIndex;
    
    if (renderOption) {
      return renderOption(option, isSelected);
    }
    
    return (
      <li
        ref={(el: HTMLLIElement | null) => { optionsRef.current[index] = el; }}
        key={option.id}
        className={`px-3 py-2 cursor-pointer flex items-center ${
          isHighlighted ? 'bg-gray-100' : ''
        } ${
          isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
        } ${
          option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleOptionSelect(option)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled}
      >
        {multiSelect && (
          <span className="mr-2 flex-shrink-0">
            <span className={`w-4 h-4 border rounded flex items-center justify-center ${
              isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
            }`}>
              {isSelected && <Check size={12} className="text-white" />}
            </span>
          </span>
        )}
        
        {option.icon && (
          <span className="mr-2 flex-shrink-0">{option.icon}</span>
        )}
        
        <span className="truncate">{option.label}</span>
        
        {!multiSelect && isSelected && (
          <Check size={16} className="ml-auto text-blue-500" />
        )}
      </li>
    );
  };
  
  return (
    <div 
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      {/* Trigger element */}
      <div 
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        role="combobox"
      >
        {renderTriggerElement()}
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 ${menuClassName}`}
          role="listbox"
          aria-multiselectable={multiSelect}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="w-full py-1.5 pl-8 pr-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          
          {/* Options list */}
          <div 
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                No options found
              </div>
            ) : (
              <ul className="py-1">
                {Object.keys(groupedOptions).map(group => (
                  <React.Fragment key={group || 'default'}>
                    {group && (
                      <li className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                        {group}
                      </li>
                    )}
                    {groupedOptions[group].map((option, index) => {
                      const globalIndex = filteredOptions.findIndex(o => o.id === option.id);
                      return renderOptionElement(option, globalIndex);
                    })}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
