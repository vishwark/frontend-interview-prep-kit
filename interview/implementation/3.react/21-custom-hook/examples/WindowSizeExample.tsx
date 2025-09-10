import React, { useState, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  LayoutGrid 
} from 'lucide-react';

// Define useWindowSize hook types
interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Implement useWindowSize hook
function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'landscape',
    breakpoint: 'lg'
  });
  
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Get current window dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine device type based on width
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Determine orientation
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Determine breakpoint (using Tailwind's default breakpoints)
      let breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
      if (width < 640) breakpoint = 'xs';
      else if (width < 768) breakpoint = 'sm';
      else if (width < 1024) breakpoint = 'md';
      else if (width < 1280) breakpoint = 'lg';
      else if (width < 1536) breakpoint = 'xl';
      else breakpoint = '2xl';
      
      // Update state
      setWindowSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        breakpoint
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount
  
  return windowSize;
}

const WindowSizeExample: React.FC = () => {
  const windowSize = useWindowSize();
  const [resizeCount, setResizeCount] = useState(0);
  const [resizeHistory, setResizeHistory] = useState<{ width: number; height: number; timestamp: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Update resize count and history when window size changes
  useEffect(() => {
    setResizeCount(prev => prev + 1);
    
    const timestamp = new Date().toLocaleTimeString();
    setResizeHistory(prev => [
      { width: windowSize.width, height: windowSize.height, timestamp },
      ...prev.slice(0, 9) // Keep only the last 10 entries
    ]);
  }, [windowSize.width, windowSize.height]);
  
  // Get device icon based on current size
  const getDeviceIcon = () => {
    if (windowSize.isMobile) {
      return <Smartphone size={24} className="text-blue-500" />;
    } else if (windowSize.isTablet) {
      return <Tablet size={24} className="text-green-500" />;
    } else {
      return <Laptop size={24} className="text-purple-500" />;
    }
  };
  
  // Get orientation icon
  const getOrientationIcon = () => {
    return windowSize.orientation === 'landscape' 
      ? <Maximize2 size={24} className="text-amber-500" /> 
      : <Minimize2 size={24} className="text-amber-500" />;
  };
  
  // Get breakpoint color
  const getBreakpointColor = () => {
    switch (windowSize.breakpoint) {
      case 'xs': return 'bg-red-100 text-red-800 border-red-200';
      case 'sm': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'md': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lg': return 'bg-green-100 text-green-800 border-green-200';
      case 'xl': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '2xl': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useWindowSize Hook Examples</h2>
      
      {/* Example 1: Current Window Size */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Monitor size={20} className="text-blue-500" />
          Example 1: Current Window Size
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getDeviceIcon()}
                <span className="font-medium text-gray-700">
                  {windowSize.isMobile ? 'Mobile' : windowSize.isTablet ? 'Tablet' : 'Desktop'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getOrientationIcon()}
                <span className="font-medium text-gray-700 capitalize">
                  {windowSize.orientation}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Width:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{windowSize.width}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{windowSize.height}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Aspect Ratio:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {(windowSize.width / windowSize.height).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Breakpoint:</span>
                <span className={`font-medium px-2 py-1 rounded border ${getBreakpointColor()}`}>
                  {windowSize.breakpoint}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col">
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Resize Events</h4>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Count: {resizeCount}
                </div>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>
              </div>
            </div>
            
            {showHistory && (
              <div className="overflow-y-auto flex-1">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left">Time</th>
                      <th className="py-2 px-3 text-right">Width</th>
                      <th className="py-2 px-3 text-right">Height</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resizeHistory.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-600">{entry.timestamp}</td>
                        <td className="py-2 px-3 text-right font-mono">{entry.width}px</td>
                        <td className="py-2 px-3 text-right font-mono">{entry.height}px</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            Resize your browser window to see the values update in real-time. The <code className="bg-blue-100 px-1 rounded">useWindowSize</code> hook 
            automatically detects changes to the window dimensions and provides useful derived values.
          </p>
        </div>
      </div>
      
      {/* Example 2: Responsive Layout */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <LayoutGrid size={20} className="text-blue-500" />
          Example 2: Responsive Layout
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm"
              >
                <div className="h-20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-400">{index + 1}</span>
                </div>
                <div className="mt-2 text-center text-sm text-gray-600">
                  Item {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Current Layout</h4>
            <div className="flex flex-wrap gap-2">
              <div className="hidden xs:block sm:hidden">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  1 column (xs)
                </span>
              </div>
              <div className="hidden sm:block md:hidden">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  2 columns (sm)
                </span>
              </div>
              <div className="hidden md:block lg:hidden">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  3 columns (md)
                </span>
              </div>
              <div className="hidden lg:block xl:hidden">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  4 columns (lg)
                </span>
              </div>
              <div className="hidden xl:block">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  5 columns (xl)
                </span>
              </div>
              <div className="block sm:hidden">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  1 column (xs)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates how <code className="bg-blue-100 px-1 rounded">useWindowSize</code> can be used to create 
            responsive layouts that adapt to different screen sizes. The grid automatically adjusts the number of columns 
            based on the current breakpoint.
          </p>
        </div>
      </div>
      
      {/* Example 3: Conditional Rendering */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Monitor size={20} className="text-blue-500" />
          Example 3: Conditional Rendering
        </h3>
        
        <div className="space-y-4">
          {windowSize.isMobile ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={20} className="text-red-500" />
                <h4 className="font-medium text-red-700">Mobile View</h4>
              </div>
              <p className="text-red-600">
                This content is optimized for small screens. Some features may be simplified or hidden.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-full max-w-xs bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-32 bg-red-100 rounded-md mb-2"></div>
                  <div className="h-4 bg-red-100 rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-red-100 rounded-md w-1/2"></div>
                </div>
              </div>
            </div>
          ) : windowSize.isTablet ? (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <Tablet size={20} className="text-yellow-500" />
                <h4 className="font-medium text-yellow-700">Tablet View</h4>
              </div>
              <p className="text-yellow-600">
                This content is optimized for medium-sized screens with touch interfaces.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-full max-w-md grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-24 bg-yellow-100 rounded-md mb-2"></div>
                    <div className="h-4 bg-yellow-100 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-yellow-100 rounded-md w-1/2"></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-24 bg-yellow-100 rounded-md mb-2"></div>
                    <div className="h-4 bg-yellow-100 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-yellow-100 rounded-md w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Laptop size={20} className="text-green-500" />
                <h4 className="font-medium text-green-700">Desktop View</h4>
              </div>
              <p className="text-green-600">
                This content is optimized for large screens with full features and functionality.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-full max-w-4xl grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-20 bg-green-100 rounded-md mb-2"></div>
                    <div className="h-4 bg-green-100 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-green-100 rounded-md w-1/2"></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-20 bg-green-100 rounded-md mb-2"></div>
                    <div className="h-4 bg-green-100 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-green-100 rounded-md w-1/2"></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-20 bg-green-100 rounded-md mb-2"></div>
                    <div className="h-4 bg-green-100 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-green-100 rounded-md w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates how <code className="bg-blue-100 px-1 rounded">useWindowSize</code> can be used for 
            conditional rendering based on device type. Different content is displayed for mobile, tablet, and desktop views.
            Resize your browser to see the changes.
          </p>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useWindowSize hook implementation
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'landscape',
    breakpoint: 'lg'
  });
  
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Get current window dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine device type based on width
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Determine orientation
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Determine breakpoint (using Tailwind's default breakpoints)
      let breakpoint;
      if (width < 640) breakpoint = 'xs';
      else if (width < 768) breakpoint = 'sm';
      else if (width < 1024) breakpoint = 'md';
      else if (width < 1280) breakpoint = 'lg';
      else if (width < 1536) breakpoint = 'xl';
      else breakpoint = '2xl';
      
      // Update state
      setWindowSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        breakpoint
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount
  
  return windowSize;
}`}
        </pre>
      </div>
    </div>
  );
};

export default WindowSizeExample;
