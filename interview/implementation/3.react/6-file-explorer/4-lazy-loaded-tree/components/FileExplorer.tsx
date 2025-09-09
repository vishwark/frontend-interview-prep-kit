import React, { useState } from 'react';
import TreeNode from './TreeNode';
import { FileSystemNode } from './api';

interface FileExplorerProps {
  data: FileSystemNode;
  initialExpandedState?: Record<string, boolean>;
}

/**
 * FileExplorer Component
 * 
 * Main component for the file explorer that maintains a global
 * expanded state map for all folders and handles loading children
 * for folders when they are expanded.
 */
const FileExplorer: React.FC<FileExplorerProps> = ({ 
  data, 
  initialExpandedState = { "root": true } 
}) => {
  // Global expanded state map for all folders
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(initialExpandedState);
  
  // State to store the file system tree with loaded children
  const [fileSystem, setFileSystem] = useState<FileSystemNode>(data);
  
  // Toggle expanded state for a folder
  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prevState => ({
      ...prevState,
      [nodeId]: !prevState[nodeId]
    }));
  };
  
  // Update the file system tree with loaded children
  const handleLoadChildren = (nodeId: string, children: FileSystemNode[]) => {
    // Helper function to recursively update a node in the tree
    const updateNodeWithChildren = (node: FileSystemNode): FileSystemNode => {
      if (node.id === nodeId) {
        // Update this node with the loaded children
        return {
          ...node,
          children
        };
      } else if (node.children) {
        // Recursively update children
        return {
          ...node,
          children: node.children.map(updateNodeWithChildren)
        };
      }
      // No change for other nodes
      return node;
    };
    
    // Update the file system tree
    setFileSystem(prevFileSystem => updateNodeWithChildren(prevFileSystem));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      <div className="border rounded-md p-4">
        <ul className="space-y-1">
          <TreeNode 
            node={fileSystem} 
            expandedNodes={expandedNodes}
            onToggleExpand={handleToggleExpand}
            onLoadChildren={handleLoadChildren}
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
