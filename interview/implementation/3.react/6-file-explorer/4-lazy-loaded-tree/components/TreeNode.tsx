import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { FileSystemNode, fetchFolderContents } from './api';

interface TreeNodeProps {
  node: FileSystemNode;
  expandedNodes: Record<string, boolean>;
  onToggleExpand: (nodeId: string) => void;
  onLoadChildren: (nodeId: string, children: FileSystemNode[]) => void;
}

/**
 * TreeNode Component
 * 
 * Renders a single node in the file system tree.
 * Lazy loads children when a folder is expanded for the first time.
 * Shows a loading indicator while fetching children.
 */
const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  expandedNodes,
  onToggleExpand,
  onLoadChildren
}) => {
  // Determine if the node is a folder
  const isFolder = node.type === 'folder';
  
  // Get expanded state from the global map
  const isExpanded = expandedNodes[node.id] || false;
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect to load children when a folder is expanded for the first time
  useEffect(() => {
    // Only fetch if it's a folder, it's expanded, has children, but children aren't loaded yet
    if (isFolder && isExpanded && node.hasChildren && !node.children) {
      setIsLoading(true);
      setError(null);
      
      fetchFolderContents(node.id)
        .then(children => {
          onLoadChildren(node.id, children);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [isFolder, isExpanded, node.id, node.hasChildren, node.children, onLoadChildren]);
  
  // Toggle expanded state for folders
  const toggleExpand = (e: React.MouseEvent) => {
    if (isFolder) {
      e.stopPropagation();
      onToggleExpand(node.id);
    }
  };

  return (
    <li className="py-1">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={toggleExpand}
        role={isFolder ? "button" : undefined}
        aria-expanded={isFolder ? isExpanded : undefined}
      >
        {/* Expand/collapse icon for folders */}
        {isFolder && (
          <span className="mr-1 text-gray-500">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        
        {/* Icon based on node type */}
        <span className="mr-2">
          {isFolder ? (
            <Folder className="w-5 h-5 text-blue-500" />
          ) : (
            <File className="w-5 h-5 text-gray-500" />
          )}
        </span>
        
        {/* Node name */}
        <span className={isFolder ? 'font-medium' : ''}>
          {node.name}
        </span>
        
        {/* Error indicator */}
        {error && (
          <span className="ml-2 text-red-500 flex items-center" title={error}>
            <AlertCircle className="w-4 h-4" />
          </span>
        )}
      </div>
      
      {/* Loading indicator */}
      {isFolder && isExpanded && isLoading && (
        <div className="pl-6 mt-1 flex items-center text-sm text-gray-500">
          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
          Loading...
        </div>
      )}
      
      {/* Error message */}
      {isFolder && isExpanded && error && (
        <div className="pl-6 mt-1 text-sm text-red-500">
          Failed to load: {error}
        </div>
      )}
      
      {/* Render children recursively if it's a folder, it's expanded, and children are loaded */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <ul className="pl-6 mt-1 border-l border-gray-200">
          {node.children.map(childNode => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              onLoadChildren={onLoadChildren}
            />
          ))}
        </ul>
      )}
      
      {/* Empty folder message */}
      {isFolder && isExpanded && node.children && node.children.length === 0 && !isLoading && !error && (
        <div className="pl-6 mt-1 text-sm text-gray-500">
          This folder is empty
        </div>
      )}
    </li>
  );
};

export default TreeNode;
