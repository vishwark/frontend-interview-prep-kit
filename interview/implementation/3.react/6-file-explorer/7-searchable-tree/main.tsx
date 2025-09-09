import React from 'react';
import FileExplorer from './components/FileExplorer';

/**
 * Level 7: Searchable Tree
 * 
 * This is the main component for the searchable tree implementation.
 * It renders a file explorer with search functionality that highlights
 * matching nodes and auto-expands folders containing matches.
 */
const SearchableTree: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Explorer - Level 7: Searchable Tree</h1>
      <p className="mb-6 text-gray-600">
        This file explorer supports searching through files and folders.
        Matching items are highlighted, and folders containing matches are automatically expanded.
      </p>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Try this:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Type "report" in the search box to find all report files</li>
          <li>Notice how folders containing matches are automatically expanded</li>
          <li>See how matching text is highlighted in yellow</li>
          <li>Try searching for file extensions like ".pdf" or ".docx"</li>
          <li>Clear the search to return to the normal view</li>
        </ol>
      </div>
      
      <FileExplorer />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Uses a debounced search input to prevent excessive updates</li>
          <li>Implements recursive search through the file system tree</li>
          <li>Highlights matching text within node names</li>
          <li>Auto-expands folders that contain matching items</li>
          <li>Maintains all functionality from previous levels</li>
          <li>Shows search results count and feedback</li>
        </ul>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Features Implemented</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Level 1: Static Nested Tree ✓</li>
          <li>Level 2: Expandable Tree ✓</li>
          <li>Level 3: Persistent Expandable Tree ✓</li>
          <li>Level 4: Lazy Loaded Tree ✓</li>
          <li>Level 5: Editable Tree ✓</li>
          <li>Level 6: Draggable Tree ✓</li>
          <li>Level 7: Searchable Tree ✓</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchableTree;
