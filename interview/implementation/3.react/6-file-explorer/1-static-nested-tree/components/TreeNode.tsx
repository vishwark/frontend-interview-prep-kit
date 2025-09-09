import React from 'react';
import { Folder, File } from 'lucide-react';

// Define the FileSystemNode interface
export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemNode[];
}

interface TreeNodeProps {
  node: FileSystemNode;
}

/**
 * TreeNode Component
 * 
 * Renders a single node in the file system tree.
 * If the node is a folder, it recursively renders its children.
 */
const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  // Determine if the node is a folder
  const isFolder = node.type === 'folder';
  
  return (
    <li className="py-1">
      <div className="flex items-center">
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
      
      {/* Render children recursively if it's a folder */}
      {isFolder && node.children && node.children.length > 0 && (
        <ul className="pl-6 mt-1 border-l border-gray-200">
          {node.children.map(childNode => (
            <TreeNode key={childNode.id} node={childNode} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
