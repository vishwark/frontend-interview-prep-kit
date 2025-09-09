import React from 'react';
import TreeNode, { FileSystemNode } from './TreeNode';

interface FileExplorerProps {
  data: FileSystemNode;
}

/**
 * FileExplorer Component
 * 
 * Main component for the file explorer that renders the root node
 * and its children using the TreeNode component.
 */
const FileExplorer: React.FC<FileExplorerProps> = ({ data }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      <div className="border rounded-md p-4">
        <ul className="space-y-1">
          <TreeNode node={data} />
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
