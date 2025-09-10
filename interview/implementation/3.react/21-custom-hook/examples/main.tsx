import React, { useState } from 'react';
import { 
  Database, 
  Clock, 
  Hourglass, 
  Globe, 
  Eye, 
  FileText, 
  Maximize2, 
  MousePointer, 
  Palette,
  Layers
} from 'lucide-react';

import LocalStorageExample from './LocalStorageExample';
import DebounceExample from './DebounceExample';
import ThrottleExample from './ThrottleExample';
import FetchExample from './FetchExample';
import IntersectionObserverExample from './IntersectionObserverExample';
import FormExample from './FormExample';
import WindowSizeExample from './WindowSizeExample';
import AsyncExample from './AsyncExample';
import ClickOutsideExample from './ClickOutsideExample';
import MediaQueryExample from './MediaQueryExample';

// Define tab data
interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description: string;
}

const CustomHookExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('localStorage');
  
  // Define tabs with their components
  const tabs: TabData[] = [
    {
      id: 'localStorage',
      label: 'useLocalStorage',
      icon: <Database size={16} />,
      component: <LocalStorageExample />,
      description: 'Persist state in localStorage with automatic serialization/deserialization'
    },
    {
      id: 'debounce',
      label: 'useDebounce',
      icon: <Clock size={16} />,
      component: <DebounceExample />,
      description: 'Delay function execution until after a specified time has elapsed'
    },
    {
      id: 'throttle',
      label: 'useThrottle',
      icon: <Hourglass size={16} />,
      component: <ThrottleExample />,
      description: 'Limit the rate at which a function can be executed'
    },
    {
      id: 'fetch',
      label: 'useFetch',
      icon: <Globe size={16} />,
      component: <FetchExample />,
      description: 'Fetch data from APIs with loading, error, and success states'
    },
    {
      id: 'intersectionObserver',
      label: 'useIntersectionObserver',
      icon: <Eye size={16} />,
      component: <IntersectionObserverExample />,
      description: 'Detect when elements enter or exit the viewport'
    },
    {
      id: 'form',
      label: 'useForm',
      icon: <FileText size={16} />,
      component: <FormExample />,
      description: 'Handle form state, validation, and submission'
    },
    {
      id: 'windowSize',
      label: 'useWindowSize',
      icon: <Maximize2 size={16} />,
      component: <WindowSizeExample />,
      description: 'Track window dimensions and respond to resize events'
    },
    {
      id: 'async',
      label: 'useAsync',
      icon: <Layers size={16} />,
      component: <AsyncExample />,
      description: 'Manage async operations with loading, error, and success states'
    },
    {
      id: 'clickOutside',
      label: 'useClickOutside',
      icon: <MousePointer size={16} />,
      component: <ClickOutsideExample />,
      description: 'Detect clicks outside of a specified element'
    },
    {
      id: 'mediaQuery',
      label: 'useMediaQuery',
      icon: <Palette size={16} />,
      component: <MediaQueryExample />,
      description: 'Respond to CSS media queries in JavaScript'
    }
  ];
  
  // Find the active tab
  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">React Custom Hooks</h1>
      <p className="text-gray-600 mb-8">
        A collection of reusable custom hooks for React applications with practical examples.
      </p>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with tabs */}
        <div className="md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Hooks</h2>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                {activeTabData.icon}
              </span>
              <h2 className="text-xl font-bold text-gray-800">{activeTabData.label}</h2>
            </div>
            <p className="text-gray-600 mb-4">{activeTabData.description}</p>
          </div>
          
          {/* Component content */}
          <div className="bg-white rounded-lg shadow-md">
            {activeTabData.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomHookExamples;
