import React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

// Define the FileSystemNode interface
export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemNode[];
}

interface TreeNodeProps {
  node: FileSystemNode;
  expandedNodes: Record<string, boolean>;
  onToggleExpand: (nodeId: string) => void;
}

/**
 * TreeNode Component
 * 
 * Renders a single node in the file system tree.
 * Uses a global expanded state map to maintain folder states,
 * allowing for persistent expand/collapse states even when
 * parent folders are collapsed.
 */
const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  expandedNodes,
  onToggleExpand
}) => {
  // Determine if the node is a folder
  const isFolder = node.type === 'folder';
  
  // Get expanded state from the global map
  const isExpanded = expandedNodes[node.id] || false;
  
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
            {isExpanded ? (
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
      </div>
      
      {/* Render children recursively if it's a folder and it's expanded */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <ul className="pl-6 mt-1 border-l border-gray-200">
          {node.children.map(childNode => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
