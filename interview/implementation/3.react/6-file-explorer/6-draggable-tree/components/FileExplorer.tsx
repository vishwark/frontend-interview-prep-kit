import React, { useReducer, useState } from 'react';
import TreeNode from './TreeNode';
import { FileSystemNode, fileSystemReducer, initialFileSystem, findParentNode } from './fileSystemReducer';

interface FileExplorerProps {
  initialData?: FileSystemNode;
}

/**
 * FileExplorer Component
 * 
 * Main component for the file explorer that manages the file system state
 * and handles CRUD operations and drag-and-drop.
 */
const FileExplorer: React.FC<FileExplorerProps> = ({ 
  initialData = initialFileSystem
}) => {
  // Use reducer to manage file system state
  const [fileSystem, dispatch] = useReducer(fileSystemReducer, initialData);
  
  // Global expanded state map for all folders
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "root": true
  });
  
  // Toggle expanded state for a folder
  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prevState => ({
      ...prevState,
      [nodeId]: !prevState[nodeId]
    }));
  };
  
  // Create a new node (file or folder)
  const handleCreateNode = (parentId: string, name: string, type: 'file' | 'folder') => {
    dispatch({
      type: 'CREATE_NODE',
      parentId,
      name,
      nodeType: type
    });
  };
  
  // Rename a node
  const handleRenameNode = (nodeId: string, newName: string) => {
    dispatch({
      type: 'RENAME_NODE',
      nodeId,
      newName
    });
  };
  
  // Delete a node
  const handleDeleteNode = (nodeId: string) => {
    dispatch({
      type: 'DELETE_NODE',
      nodeId
    });
  };
  
  // Move a node from one parent to another
  const handleMoveNode = (nodeId: string, sourceParentId: string, targetParentId: string) => {
    dispatch({
      type: 'MOVE_NODE',
      nodeId,
      sourceParentId,
      targetParentId
    });
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
            onCreateNode={handleCreateNode}
            onRenameNode={handleRenameNode}
            onDeleteNode={handleDeleteNode}
            onMoveNode={handleMoveNode}
          />
        </ul>
      </div>
      
      {/* Debug view of file system state */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-64">
        <p className="font-semibold mb-1">File System State:</p>
        <pre>{JSON.stringify(fileSystem, null, 2)}</pre>
      </div>
      
      {/* Instructions for drag and drop */}
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="font-semibold mb-1">Drag and Drop Instructions:</p>
        <ul className="list-disc pl-5 text-sm">
          <li>Drag any file or folder by clicking and holding</li>
          <li>Drop onto a folder to move the item into that folder</li>
          <li>Folders will highlight in blue when you drag over them</li>
          <li>You cannot drop a folder into itself or its descendants</li>
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
