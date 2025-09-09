import React, { useState } from 'react';
import Typeahead, { Suggestion } from './components/Typeahead';

// Mock data for suggestions
const COUNTRIES = [
  { id: 1, name: 'United States', capital: 'Washington D.C.' },
  { id: 2, name: 'United Kingdom', capital: 'London' },
  { id: 3, name: 'Canada', capital: 'Ottawa' },
  { id: 4, name: 'Australia', capital: 'Canberra' },
  { id: 5, name: 'Germany', capital: 'Berlin' },
  { id: 6, name: 'France', capital: 'Paris' },
  { id: 7, name: 'Japan', capital: 'Tokyo' },
  { id: 8, name: 'China', capital: 'Beijing' },
  { id: 9, name: 'India', capital: 'New Delhi' },
  { id: 10, name: 'Brazil', capital: 'Brasília' },
  { id: 11, name: 'Mexico', capital: 'Mexico City' },
  { id: 12, name: 'South Africa', capital: 'Pretoria' },
  { id: 13, name: 'Russia', capital: 'Moscow' },
  { id: 14, name: 'Italy', capital: 'Rome' },
  { id: 15, name: 'Spain', capital: 'Madrid' },
  { id: 16, name: 'South Korea', capital: 'Seoul' },
  { id: 17, name: 'Netherlands', capital: 'Amsterdam' },
  { id: 18, name: 'Sweden', capital: 'Stockholm' },
  { id: 19, name: 'Switzerland', capital: 'Bern' },
  { id: 20, name: 'Argentina', capital: 'Buenos Aires' },
];

/**
 * TypeaheadDemo Component
 * 
 * Demonstrates the usage of the Typeahead component with:
 * - Mock API for fetching country suggestions
 * - Handling selection of suggestions
 * - Displaying selected country details
 */
const TypeaheadDemo: React.FC = () => {
  // State for the selected country
  const [selectedCountry, setSelectedCountry] = useState<{
    id: number;
    name: string;
    capital: string;
  } | null>(null);

  // Mock API call to search for countries
  const searchCountries = async (query: string): Promise<Suggestion[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter countries based on the query
    const filteredCountries = COUNTRIES.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Map to the Suggestion interface
    return filteredCountries.map(country => ({
      id: country.id,
      text: country.name,
      capital: country.capital
    }));
  };

  // Handle selection of a country
  const handleSelectCountry = (suggestion: Suggestion) => {
    setSelectedCountry({
      id: suggestion.id as number,
      name: suggestion.text,
      capital: suggestion.capital
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Typeahead/Autocomplete Demo</h1>
      <p className="text-gray-600 mb-8">
        Start typing a country name to see suggestions. Use arrow keys to navigate and Enter to select.
      </p>
      
      {/* Typeahead component */}
      <div className="mb-8">
        <label htmlFor="country-search" className="block text-sm font-medium text-gray-700 mb-2">
          Search for a country:
        </label>
        <Typeahead
          onSearch={searchCountries}
          onSelect={handleSelectCountry}
          placeholder="Type a country name..."
          debounceTime={300}
          minChars={2}
          highlightMatches={true}
          className="w-full"
        />
        <p className="mt-2 text-sm text-gray-500">
          Try typing "united", "in", or "an" to see matching results
        </p>
      </div>
      
      {/* Display selected country */}
      {selectedCountry && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Selected Country</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Name:</div>
            <div>{selectedCountry.name}</div>
            <div className="font-medium">Capital:</div>
            <div>{selectedCountry.capital}</div>
          </div>
        </div>
      )}
      
      {/* Usage instructions */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Keyboard Navigation</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-mono bg-gray-200 px-1 rounded">↑</span> / <span className="font-mono bg-gray-200 px-1 rounded">↓</span> - Navigate through suggestions</li>
          <li><span className="font-mono bg-gray-200 px-1 rounded">Enter</span> - Select the highlighted suggestion</li>
          <li><span className="font-mono bg-gray-200 px-1 rounded">Escape</span> - Clear the input and close suggestions</li>
        </ul>
      </div>
      
      {/* Component features */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Component Features</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Debounced API calls to limit requests while typing</li>
          <li>Highlighted matching text in suggestions</li>
          <li>Keyboard navigation support</li>
          <li>Loading state indicator</li>
          <li>Error handling</li>
          <li>Accessible design with ARIA attributes</li>
          <li>Responsive and mobile-friendly</li>
        </ul>
      </div>
    </div>
  );
};

export default TypeaheadDemo;
