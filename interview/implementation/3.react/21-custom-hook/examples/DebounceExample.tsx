import React, { useState, useEffect } from 'react';
import useDebounce from '../2.useDebounce';
import { Search, Clock, Keyboard, BarChart } from 'lucide-react';

const DebounceExample: React.FC = () => {
  // Example 1: Search Input
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Example 2: Window Resize
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [resizeCount, setResizeCount] = useState(0);
  const [debouncedResizeCount, setDebouncedResizeCount] = useState(0);
  const debouncedWindowSize = useDebounce(windowSize, 500);
  
  // Example 3: Input Validation
  const [username, setUsername] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const debouncedUsername = useDebounce(username, 800);
  
  // Example 4: Analytics Event
  const [clickCount, setClickCount] = useState(0);
  const debouncedClickCount = useDebounce(clickCount, 2000);
  const [analyticsEvents, setAnalyticsEvents] = useState<string[]>([]);
  
  // Mock search API call
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        setSearchResults(
          ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape']
            .filter(item => item.includes(debouncedSearchTerm.toLowerCase()))
        );
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);
  
  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setResizeCount(prev => prev + 1);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Track debounced resize
  useEffect(() => {
    setDebouncedResizeCount(prev => prev + 1);
  }, [debouncedWindowSize]);
  
  // Username validation
  useEffect(() => {
    if (debouncedUsername) {
      // Simulate API call to check username availability
      setTimeout(() => {
        if (debouncedUsername.length < 3) {
          setValidationMessage('Username must be at least 3 characters');
        } else if (/[^a-zA-Z0-9_]/.test(debouncedUsername)) {
          setValidationMessage('Username can only contain letters, numbers, and underscores');
        } else if (['admin', 'root', 'user'].includes(debouncedUsername.toLowerCase())) {
          setValidationMessage('This username is already taken');
        } else {
          setValidationMessage('Username is available');
        }
      }, 300);
    } else {
      setValidationMessage('');
    }
  }, [debouncedUsername]);
  
  // Analytics tracking
  useEffect(() => {
    if (debouncedClickCount > 0) {
      const event = `Tracked ${debouncedClickCount} clicks at ${new Date().toLocaleTimeString()}`;
      setAnalyticsEvents(prev => [event, ...prev].slice(0, 5));
    }
  }, [debouncedClickCount]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useDebounce Hook Examples</h2>
      
      {/* Example 1: Search Input */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Search size={20} className="text-blue-500" />
          Example 1: Debounced Search
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fruits..."
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="min-h-[100px] bg-gray-50 rounded-md p-4">
            {isSearching ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="space-y-1">
                {searchResults.map((result, index) => (
                  <li key={index} className="px-2 py-1 hover:bg-gray-100 rounded">
                    {result}
                  </li>
                ))}
              </ul>
            ) : searchTerm ? (
              <p className="text-gray-500 text-center">No results found</p>
            ) : (
              <p className="text-gray-500 text-center">Type to search</p>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Current search term: <span className="font-medium">{searchTerm}</span></p>
            <p>Debounced search term: <span className="font-medium">{debouncedSearchTerm}</span></p>
          </div>
        </div>
      </div>
      
      {/* Example 2: Window Resize */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Clock size={20} className="text-blue-500" />
          Example 2: Debounced Window Resize
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Real-time Size</h4>
              <p className="text-gray-600">Width: {windowSize.width}px</p>
              <p className="text-gray-600">Height: {windowSize.height}px</p>
              <p className="text-gray-600 mt-2">Resize events: {resizeCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Debounced Size</h4>
              <p className="text-gray-600">Width: {debouncedWindowSize.width}px</p>
              <p className="text-gray-600">Height: {debouncedWindowSize.height}px</p>
              <p className="text-gray-600 mt-2">Debounced events: {debouncedResizeCount}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Resize your browser window to see the difference between real-time and debounced values.
            The debounced values only update after you stop resizing for 500ms.
          </p>
        </div>
      </div>
      
      {/* Example 3: Input Validation */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Keyboard size={20} className="text-blue-500" />
          Example 3: Debounced Input Validation
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {validationMessage && (
            <div className={`text-sm ${
              validationMessage === 'Username is available' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {validationMessage}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Current input: <span className="font-medium">{username}</span></p>
            <p>Debounced input: <span className="font-medium">{debouncedUsername}</span></p>
          </div>
          <p className="text-sm text-gray-500">
            Validation only runs after you stop typing for 800ms to avoid unnecessary validation calls.
          </p>
        </div>
      </div>
      
      {/* Example 4: Analytics Event */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <BarChart size={20} className="text-blue-500" />
          Example 4: Debounced Analytics Events
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setClickCount(prev => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Click Me Multiple Times
            </button>
            <div className="text-gray-600">
              Click count: <span className="font-medium">{clickCount}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">Analytics Events (Debounced)</h4>
            {analyticsEvents.length > 0 ? (
              <ul className="space-y-1 text-sm text-gray-600">
                {analyticsEvents.map((event, index) => (
                  <li key={index} className="border-b border-gray-200 pb-1 last:border-0">
                    {event}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No events tracked yet</p>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            Events are only sent after 2 seconds of inactivity to batch multiple clicks together,
            reducing the number of analytics calls.
          </p>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useDebounce hook implementation
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`}
        </pre>
      </div>
    </div>
  );
};

export default DebounceExample;
