import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Laptop, 
  LayoutGrid, 
  LayoutList, 
  Sun, 
  Moon, 
  Palette,
  ScreenShare
} from 'lucide-react';

// Define useMediaQuery hook types
type MediaQueryCallback = (matches: boolean) => void;

// Implement useMediaQuery hook
function useMediaQuery(query: string, callback?: MediaQueryCallback): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Create a MediaQueryList object
    const mediaQueryList = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQueryList.matches);
    
    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
      if (callback) {
        callback(event.matches);
      }
    };
    
    // Add the callback as a listener for changes to the media query
    try {
      // Modern browsers
      mediaQueryList.addEventListener('change', handleChange);
    } catch (e) {
      // Older browsers
      mediaQueryList.addListener(handleChange);
    }
    
    // Clean up
    return () => {
      try {
        // Modern browsers
        mediaQueryList.removeEventListener('change', handleChange);
      } catch (e) {
        // Older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, callback]);
  
  return matches;
}

// Predefined media query hooks
function useIsMobile() {
  return useMediaQuery('(max-width: 639px)');
}

function useIsTablet() {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

function useIsLandscape() {
  return useMediaQuery('(orientation: landscape)');
}

function useIsPortrait() {
  return useMediaQuery('(orientation: portrait)');
}

function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

const MediaQueryExample: React.FC = () => {
  // Example 1: Basic Media Queries
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  // Example 2: Orientation
  const isLandscape = useIsLandscape();
  const isPortrait = useIsPortrait();
  
  // Example 3: User Preferences
  const prefersDarkMode = usePrefersDarkMode();
  const prefersReducedMotion = useReducedMotion();
  
  // Example 4: Custom Media Query
  const [customQuery, setCustomQuery] = useState('(min-width: 768px)');
  const customQueryMatches = useMediaQuery(customQuery);
  
  // Example 5: Responsive Layout
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  // Update layout based on screen size
  useEffect(() => {
    if (isMobile) {
      setLayout('list');
    } else {
      setLayout('grid');
    }
  }, [isMobile]);
  
  // Sample items for responsive layout
  const items = [
    { id: 1, title: 'Item 1', description: 'This is the first item' },
    { id: 2, title: 'Item 2', description: 'This is the second item' },
    { id: 3, title: 'Item 3', description: 'This is the third item' },
    { id: 4, title: 'Item 4', description: 'This is the fourth item' },
    { id: 5, title: 'Item 5', description: 'This is the fifth item' },
    { id: 6, title: 'Item 6', description: 'This is the sixth item' }
  ];
  
  // Get device icon
  const getDeviceIcon = () => {
    if (isMobile) {
      return <Smartphone size={24} className="text-blue-500" />;
    } else if (isTablet) {
      return <Tablet size={24} className="text-green-500" />;
    } else {
      return <Monitor size={24} className="text-purple-500" />;
    }
  };
  
  // Get orientation icon
  const getOrientationIcon = () => {
    return isLandscape 
      ? <LayoutGrid size={24} className="text-amber-500" /> 
      : <LayoutList size={24} className="text-amber-500" />;
  };
  
  // Get theme icon
  const getThemeIcon = () => {
    return prefersDarkMode 
      ? <Moon size={24} className="text-indigo-500" /> 
      : <Sun size={24} className="text-yellow-500" />;
  };
  
  // Handle custom query change
  const handleCustomQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomQuery(e.target.value);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useMediaQuery Hook Examples</h2>
      
      {/* Example 1: Basic Media Queries */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <ScreenShare size={20} className="text-blue-500" />
          Example 1: Basic Media Queries
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${isMobile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={20} className={isMobile ? 'text-blue-500' : 'text-gray-400'} />
              <h4 className={`font-medium ${isMobile ? 'text-blue-700' : 'text-gray-500'}`}>Mobile</h4>
            </div>
            <p className={`text-sm ${isMobile ? 'text-blue-600' : 'text-gray-500'}`}>
              <code className="bg-gray-100 px-1 rounded">(max-width: 639px)</code>
            </p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isMobile ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{isMobile ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${isTablet ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Tablet size={20} className={isTablet ? 'text-green-500' : 'text-gray-400'} />
              <h4 className={`font-medium ${isTablet ? 'text-green-700' : 'text-gray-500'}`}>Tablet</h4>
            </div>
            <p className={`text-sm ${isTablet ? 'text-green-600' : 'text-gray-500'}`}>
              <code className="bg-gray-100 px-1 rounded">(min-width: 640px) and (max-width: 1023px)</code>
            </p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isTablet ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{isTablet ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${isDesktop ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Monitor size={20} className={isDesktop ? 'text-purple-500' : 'text-gray-400'} />
              <h4 className={`font-medium ${isDesktop ? 'text-purple-700' : 'text-gray-500'}`}>Desktop</h4>
            </div>
            <p className={`text-sm ${isDesktop ? 'text-purple-600' : 'text-gray-500'}`}>
              <code className="bg-gray-100 px-1 rounded">(min-width: 1024px)</code>
            </p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isDesktop ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{isDesktop ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Current Device:</span>
            <div className="flex items-center gap-1">
              {getDeviceIcon()}
              <span className="text-gray-700">
                {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates basic usage of <code className="bg-blue-100 px-1 rounded">useMediaQuery</code> to 
            detect different device types based on screen width. Resize your browser window to see the active state change.
          </p>
        </div>
      </div>
      
      {/* Example 2: Orientation */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <LayoutGrid size={20} className="text-blue-500" />
          Example 2: Orientation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${isLandscape ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid size={20} className={isLandscape ? 'text-amber-500' : 'text-gray-400'} />
              <h4 className={`font-medium ${isLandscape ? 'text-amber-700' : 'text-gray-500'}`}>Landscape</h4>
            </div>
            <p className={`text-sm ${isLandscape ? 'text-amber-600' : 'text-gray-500'}`}>
              <code className="bg-gray-100 px-1 rounded">(orientation: landscape)</code>
            </p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isLandscape ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{isLandscape ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${isPortrait ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <LayoutList size={20} className={isPortrait ? 'text-pink-500' : 'text-gray-400'} />
              <h4 className={`font-medium ${isPortrait ? 'text-pink-700' : 'text-gray-500'}`}>Portrait</h4>
            </div>
            <p className={`text-sm ${isPortrait ? 'text-pink-600' : 'text-gray-500'}`}>
              <code className="bg-gray-100 px-1 rounded">(orientation: portrait)</code>
            </p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isPortrait ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{isPortrait ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Current Orientation:</span>
            <div className="flex items-center gap-1">
              {getOrientationIcon()}
              <span className="text-gray-700">
                {isLandscape ? 'Landscape' : 'Portrait'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <p>Try rotating your device or resizing your browser window to change the orientation.</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates using <code className="bg-blue-100 px-1 rounded">useMediaQuery</code> to 
            detect the orientation of the device or browser window. This is useful for adapting layouts based on orientation.
          </p>
        </div>
      </div>
      
      {/* Example 3: User Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Palette size={20} className="text-blue-500" />
          Example 3: User Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${prefersDarkMode ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Moon size={20} className={prefersDarkMode ? 'text-indigo-500' : 'text-gray-400'} />
              <h4 className={`font-medium ${prefersDarkMode ? 'text-indigo-700' : 'text-gray-500'}`}>Dark Mode</h4>
            </div>
            <p className={`text-sm ${prefersDarkMode ? 'text-indigo-600' : 'text-gray-500'}`}>
              <code className="bg-gray-100 px-1 rounded">(prefers-color-scheme: dark)</code>
            </p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${prefersDarkMode ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{prefersDarkMode ? 'Preferred' : 'Not preferred'}</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${prefersReducedMotion ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <LayoutList size={20} className={prefersReducedMotion ? 'text-orange-500' : 'text-gray-400'} />
              <h4 className={`font-medium ${prefersReducedMotion ? 'text-orange-700' : 'text-gray-500'}`}>Reduced Motion</h4>
            </div>
            <p className={`text-sm ${prefersReducedMotion ? 'text-orange-600' : 'text-gray-500'}`}>
              <code className="bg-gray-100 px-1 rounded">(prefers-reduced-motion: reduce)</code>
            </p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${prefersReducedMotion ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{prefersReducedMotion ? 'Preferred' : 'Not preferred'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Theme Preference:</span>
            <div className="flex items-center gap-1">
              {getThemeIcon()}
              <span className="text-gray-700">
                {prefersDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <p>These preferences are based on your system settings. Change your system theme or reduced motion settings to see the changes.</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates using <code className="bg-blue-100 px-1 rounded">useMediaQuery</code> to 
            detect user preferences like dark mode and reduced motion. This allows you to adapt your UI to match user preferences.
          </p>
        </div>
      </div>
      
      {/* Example 4: Custom Media Query */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <ScreenShare size={20} className="text-blue-500" />
          Example 4: Custom Media Query
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="customQuery" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Media Query:
              </label>
              <input
                type="text"
                id="customQuery"
                value={customQuery}
                onChange={handleCustomQueryChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Try different queries like <code>(min-width: 768px)</code>, <code>(max-width: 1024px)</code>, or <code>(prefers-color-scheme: dark)</code>
              </p>
            </div>
            <div className="md:w-64 flex items-end">
              <div className={`w-full p-4 rounded-lg border ${customQueryMatches ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Result:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customQueryMatches ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {customQueryMatches ? 'Matches' : 'No match'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates using <code className="bg-blue-100 px-1 rounded">useMediaQuery</code> with 
            custom media queries. You can enter any valid media query and see if it matches the current viewport.
          </p>
        </div>
      </div>
      
      {/* Example 5: Responsive Layout */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <LayoutGrid size={20} className="text-blue-500" />
          Example 5: Responsive Layout
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Current Layout:</span>
              {layout === 'grid' ? (
                <span className="inline-flex items-center gap-1 text-green-700">
                  <LayoutGrid size={18} className="text-green-500" /> Grid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-blue-700">
                  <LayoutList size={18} className="text-blue-500" /> List
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-md ${layout === 'grid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded-md ${layout === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>
          
          {layout === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-blue-700">{item.id}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates using <code className="bg-blue-100 px-1 rounded">useMediaQuery</code> to 
            automatically switch between grid and list layouts based on screen size. On mobile devices, the layout 
            automatically switches to a list view for better readability.
          </p>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useMediaQuery hook implementation
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create a MediaQueryList object
    const mediaQueryList = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQueryList.matches);
    
    // Define a callback function to handle changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // Add the callback as a listener for changes to the media query
    try {
      // Modern browsers
      mediaQueryList.addEventListener('change', handleChange);
    } catch (e) {
      // Older browsers
      mediaQueryList.addListener(handleChange);
    }
    
    // Clean up
    return () => {
      try {
        // Modern browsers
        mediaQueryList.removeEventListener('change', handleChange);
      } catch (e) {
        // Older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);
  
  return matches;
}

// Predefined media query hooks
function useIsMobile() {
  return useMediaQuery('(max-width: 639px)');
}

function useIsTablet() {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}`}
        </pre>
      </div>
    </div>
  );
};

export default MediaQueryExample;
