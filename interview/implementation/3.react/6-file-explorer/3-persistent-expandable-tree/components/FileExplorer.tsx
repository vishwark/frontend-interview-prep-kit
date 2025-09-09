import React, { useState } from 'react';
import TreeNode, { FileSystemNode } from './TreeNode';

interface FileExplorerProps {
  data: FileSystemNode;
  initialExpandedState?: Record<string, boolean>;
}

/**
 * FileExplorer Component
 * 
 * Main component for the file explorer that maintains a global
 * expanded state map for all folders. This allows for persistent
 * expand/collapse states even when parent folders are collapsed.
 */
const FileExplorer: React.FC<FileExplorerProps> = ({ 
  data, 
  initialExpandedState = { "root": true } 
}) => {
  // Global expanded state map for all folders
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(initialExpandedState);
  
  // Toggle expanded state for a folder
  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prevState => ({
      ...prevState,
      [nodeId]: !prevState[nodeId]
    }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      <div className="border rounded-md p-4">
        <ul className="space-y-1">
          <TreeNode 
            node={data} 
            expandedNodes={expandedNodes}
            onToggleExpand={handleToggleExpand}
          />
        </ul>
      </div>
      
      {/* Debug view of expanded state (useful for demonstration) */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-32">
        <p className="font-semibold mb-1">Expanded State Map:</p>
        <pre>{JSON.stringify(expandedNodes, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FileExplorer;
