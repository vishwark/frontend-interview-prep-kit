import React from 'react';
import FileExplorer from './components/FileExplorer';

/**
 * Level 5: Editable Tree
 * 
 * This is the main component for the editable tree implementation.
 * It renders a file explorer with CRUD operations for files and folders.
 */
const EditableTree: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Explorer - Level 5: Editable Tree</h1>
      <p className="mb-6 text-gray-600">
        This file explorer supports Create, Rename, and Delete operations for files and folders.
        Hover over a node to see the available actions.
      </p>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Try this:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Hover over a folder and click the "+" icon to create a new file or folder</li>
          <li>Hover over any node and click the edit icon to rename it</li>
          <li>Hover over any node and click the trash icon to delete it</li>
          <li>Notice how the file system state updates in real-time</li>
        </ol>
      </div>
      
      <FileExplorer />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Uses the reducer pattern to manage file system state</li>
          <li>Implements recursive functions for creating, renaming, and deleting nodes</li>
          <li>Uses immutable update patterns to modify the tree structure</li>
          <li>Provides a clean UI for editing operations</li>
          <li>Maintains expanded state like in previous levels</li>
          <li>Shows a debug view of the current file system state</li>
        </ul>
      </div>
    </div>
  );
};

export default EditableTree;
