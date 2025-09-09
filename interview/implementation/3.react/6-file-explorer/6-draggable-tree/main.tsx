import React from 'react';
import FileExplorer from './components/FileExplorer';

/**
 * Level 6: Draggable Tree
 * 
 * This is the main component for the draggable tree implementation.
 * It renders a file explorer with drag-and-drop functionality for files and folders.
 */
const DraggableTree: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Explorer - Level 6: Draggable Tree</h1>
      <p className="mb-6 text-gray-600">
        This file explorer supports drag-and-drop operations for files and folders.
        You can drag any file or folder and drop it into another folder to move it.
      </p>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Try this:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Drag a file from one folder to another</li>
          <li>Notice how the target folder highlights when you drag over it</li>
          <li>Try to drag a folder into one of its own children (it should be prevented)</li>
          <li>Observe how the file system structure updates after a successful drop</li>
        </ol>
      </div>
      
      <FileExplorer />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Uses the HTML5 Drag and Drop API</li>
          <li>Implements helper functions for moving nodes between folders</li>
          <li>Provides visual feedback during drag operations</li>
          <li>Prevents invalid operations (like dropping a folder into its own descendant)</li>
          <li>Maintains all functionality from previous levels</li>
          <li>Uses immutable update patterns to modify the tree structure</li>
        </ul>
      </div>
    </div>
  );
};

export default DraggableTree;
