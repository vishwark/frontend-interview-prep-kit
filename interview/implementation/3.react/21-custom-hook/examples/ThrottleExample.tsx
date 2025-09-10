import React, { useState, useEffect, useRef } from 'react';
import useThrottle from '../3.useThrottle';
import { 
  MousePointer, 
  Zap, 
  Activity, 
  Cpu, 
  ArrowRight 
} from 'lucide-react';

const ThrottleExample: React.FC = () => {
  // Example 1: Mouse Move
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [moveCount, setMoveCount] = useState(0);
  const throttledMousePosition = useThrottle(mousePosition, 100);
  const [throttledMoveCount, setThrottledMoveCount] = useState(0);
  const mouseMoveAreaRef = useRef<HTMLDivElement>(null);
  
  // Example 2: Scroll Event
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);
  const throttledScrollPosition = useThrottle(scrollPosition, 200);
  const [throttledScrollCount, setThrottledScrollCount] = useState(0);
  
  // Example 3: Button Click
  const [clickCount, setClickCount] = useState(0);
  const throttledClickCount = useThrottle(clickCount, 1000);
  const [actionLog, setActionLog] = useState<string[]>([]);
  
  // Example 4: Real-time Data
  const [sensorData, setSensorData] = useState(0);
  const throttledSensorData = useThrottle(sensorData, 500);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [throttledDataPoints, setThrottledDataPoints] = useState<number[]>([]);
  
  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseMoveAreaRef.current) return;
      
      const rect = mouseMoveAreaRef.current.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setMousePosition({ x, y });
        setMoveCount(prev => prev + 1);
      }
    };
    
    const element = mouseMoveAreaRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  // Track throttled mouse move
  useEffect(() => {
    setThrottledMoveCount(prev => prev + 1);
  }, [throttledMousePosition]);
  
  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setScrollCount(prev => prev + 1);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track throttled scroll
  useEffect(() => {
    setThrottledScrollCount(prev => prev + 1);
  }, [throttledScrollPosition]);
  
  // Button click handler
  const handleButtonClick = () => {
    const timestamp = new Date().toLocaleTimeString();
    setClickCount(prev => prev + 1);
    setActionLog(prev => [`${timestamp}: Button clicked (${clickCount + 1})`, ...prev.slice(0, 9)]);
  };
  
  // Track throttled click
  useEffect(() => {
    if (throttledClickCount > 0) {
      const timestamp = new Date().toLocaleTimeString();
      setActionLog(prev => [
        ...prev,
        `${timestamp}: Action executed (throttled to ${throttledClickCount})`
      ]);
    }
  }, [throttledClickCount]);
  
  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 100);
      setSensorData(newValue);
      setDataPoints(prev => [...prev.slice(-19), newValue]);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Track throttled data
  useEffect(() => {
    if (throttledSensorData !== 0) {
      setThrottledDataPoints(prev => [...prev.slice(-19), throttledSensorData]);
    }
  }, [throttledSensorData]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useThrottle Hook Examples</h2>
      
      {/* Example 1: Mouse Move */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <MousePointer size={20} className="text-blue-500" />
          Example 1: Throttled Mouse Movement
        </h3>
        <div className="space-y-4">
          <div 
            ref={mouseMoveAreaRef}
            className="relative h-64 bg-gray-100 rounded-md border border-gray-200 overflow-hidden"
          >
            {/* Real-time cursor */}
            <div 
              className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-50"
              style={{ 
                left: `${mousePosition.x}px`, 
                top: `${mousePosition.y}px` 
              }}
            />
            
            {/* Throttled cursor */}
            <div 
              className="absolute w-6 h-6 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"
              style={{ 
                left: `${throttledMousePosition.x}px`, 
                top: `${throttledMousePosition.y}px` 
              }}
            />
            
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded text-sm">
              <div className="text-blue-500">Real-time: ({mousePosition.x}, {mousePosition.y})</div>
              <div className="text-red-500">Throttled: ({throttledMousePosition.x}, {throttledMousePosition.y})</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Real-time events: <span className="font-medium">{moveCount}</span></p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Throttled events: <span className="font-medium">{throttledMoveCount}</span></p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Move your mouse over the gray area to see the difference between real-time (blue) and 
            throttled (red) cursor positions. The throttled position updates at most once every 100ms.
          </p>
        </div>
      </div>
      
      {/* Example 2: Scroll Event */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Activity size={20} className="text-blue-500" />
          Example 2: Throttled Scroll Events
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Real-time Scroll</h4>
              <p className="text-gray-600">Position: <span className="font-medium">{scrollPosition}px</span></p>
              <p className="text-gray-600">Event count: <span className="font-medium">{scrollCount}</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Throttled Scroll</h4>
              <p className="text-gray-600">Position: <span className="font-medium">{throttledScrollPosition}px</span></p>
              <p className="text-gray-600">Event count: <span className="font-medium">{throttledScrollCount}</span></p>
            </div>
          </div>
          
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-blue-500"
              style={{ width: `${Math.min((scrollPosition / document.body.scrollHeight) * 100, 100)}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Scroll the page to see the difference between real-time and throttled scroll positions.
            The throttled position updates at most once every 200ms, reducing the number of calculations.
          </p>
        </div>
      </div>
      
      {/* Example 3: Button Click */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Zap size={20} className="text-blue-500" />
          Example 3: Throttled Button Clicks
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Click Rapidly
            </button>
            <div className="text-gray-600">
              Click count: <span className="font-medium">{clickCount}</span>
            </div>
            <div className="text-gray-600">
              Throttled count: <span className="font-medium">{throttledClickCount}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md h-64 overflow-y-auto">
            <h4 className="font-medium text-gray-700 mb-2">Event Log</h4>
            <ul className="space-y-1 text-sm">
              {actionLog.map((log, index) => (
                <li 
                  key={index} 
                  className={`py-1 px-2 rounded ${
                    log.includes('Action executed') 
                      ? 'bg-green-100 text-green-800' 
                      : 'text-gray-600'
                  }`}
                >
                  {log}
                </li>
              ))}
            </ul>
          </div>
          
          <p className="text-sm text-gray-500">
            Click the button rapidly to see how throttling limits the execution rate.
            Every click is logged, but the throttled action only executes once per second.
          </p>
        </div>
      </div>
      
      {/* Example 4: Real-time Data */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Cpu size={20} className="text-blue-500" />
          Example 4: Throttled Data Processing
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              Current value: <span className="font-medium">{sensorData}</span>
            </div>
            <div className="text-gray-600">
              Throttled value: <span className="font-medium">{throttledSensorData}</span>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
            <div className="text-gray-600">
              Update frequency: <span className="font-medium">100ms</span> <ArrowRight className="inline text-gray-400" size={16} /> <span className="font-medium">500ms</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Raw Data (100ms)</h4>
              <div className="h-40 bg-gray-50 rounded-md p-2 flex items-end gap-1">
                {dataPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="bg-blue-500 w-full"
                    style={{ height: `${point}%` }}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Throttled Data (500ms)</h4>
              <div className="h-40 bg-gray-50 rounded-md p-2 flex items-end gap-1">
                {throttledDataPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="bg-green-500 w-full"
                    style={{ height: `${point}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            This example simulates a sensor sending data every 100ms, but we only process and 
            visualize it every 500ms. Throttling reduces CPU load and improves performance.
          </p>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useThrottle hook implementation
function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      if (now >= lastRan.current + limit) {
        setThrottledValue(value);
        lastRan.current = now;
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}`}
        </pre>
      </div>
    </div>
  );
};

export default ThrottleExample;
