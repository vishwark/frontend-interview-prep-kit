import React from 'react';
import FileExplorer from './components/FileExplorer';
import { initialFileSystem } from './components/api';

/**
 * Level 4: Lazy Loaded Tree
 * 
 * This is the main component for the lazy loaded tree implementation.
 * It renders a file explorer with a file system structure that is
 * loaded lazily as folders are expanded.
 */
const LazyLoadedTree: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Explorer - Level 4: Lazy Loaded Tree</h1>
      <p className="mb-6 text-gray-600">
        This file explorer loads folder contents only when they are expanded.
        It simulates API calls with a 1-second delay and shows loading indicators.
      </p>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Try this:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Expand the "Documents" folder and observe the loading indicator</li>
          <li>After it loads, expand "Job Applications" to see another loading process</li>
          <li>Notice that once loaded, the contents remain in memory even if you collapse and re-expand</li>
        </ol>
      </div>
      
      <FileExplorer 
        data={initialFileSystem} 
        initialExpandedState={{ "root": true }}
      />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Uses <code>useEffect</code> to trigger data loading when a folder is expanded</li>
          <li>Shows loading indicators while fetching data</li>
          <li>Handles loading errors gracefully with error messages</li>
          <li>Maintains a global file system state that gets updated as data is loaded</li>
          <li>Simulates API calls with <code>setTimeout</code> for demonstration</li>
          <li>Preserves expanded state like in Level 3</li>
        </ul>
      </div>
    </div>
  );
};

export default LazyLoadedTree;
