import React, { useReducer, useState, useCallback, useMemo } from 'react';
import TreeNode from './TreeNode';
import SearchInput from './SearchInput';
import { 
  FileSystemNode, 
  fileSystemReducer, 
  initialFileSystem, 
  searchFileSystem, 
  getExpandedFolders 
} from './fileSystemReducer';

interface FileExplorerProps {
  initialData?: FileSystemNode;
}

/**
 * FileExplorer Component
 * 
 * Main component for the file explorer that manages the file system state,
 * handles CRUD operations, drag-and-drop, and search functionality.
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
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Compute search results
  const searchResults = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    return searchFileSystem(fileSystem, searchTerm);
  }, [fileSystem, searchTerm]);
  
  // Create a set of matching node IDs for quick lookup
  const matchingNodes = useMemo(() => {
    const nodeIds = new Set<string>();
    searchResults.forEach(result => {
      if (result.isMatch) {
        nodeIds.add(result.id);
      }
    });
    return nodeIds;
  }, [searchResults]);
  
  // Auto-expand folders that contain matches
  useMemo(() => {
    if (searchTerm && searchResults.length > 0) {
      const foldersToExpand = getExpandedFolders(searchResults);
      setExpandedNodes(prevState => {
        const newState = { ...prevState };
        foldersToExpand.forEach(folderId => {
          newState[folderId] = true;
        });
        return newState;
      });
    }
  }, [searchTerm, searchResults]);
  
  // Toggle expanded state for a folder
  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prevState => ({
      ...prevState,
      [nodeId]: !prevState[nodeId]
    }));
  }, []);
  
  // Create a new node (file or folder)
  const handleCreateNode = useCallback((parentId: string, name: string, type: 'file' | 'folder') => {
    dispatch({
      type: 'CREATE_NODE',
      parentId,
      name,
      nodeType: type
    });
  }, []);
  
  // Rename a node
  const handleRenameNode = useCallback((nodeId: string, newName: string) => {
    dispatch({
      type: 'RENAME_NODE',
      nodeId,
      newName
    });
  }, []);
  
  // Delete a node
  const handleDeleteNode = useCallback((nodeId: string) => {
    dispatch({
      type: 'DELETE_NODE',
      nodeId
    });
  }, []);
  
  // Move a node from one parent to another
  const handleMoveNode = useCallback((nodeId: string, sourceParentId: string, targetParentId: string) => {
    dispatch({
      type: 'MOVE_NODE',
      nodeId,
      sourceParentId,
      targetParentId
    });
  }, []);
  
  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      
      {/* Search input */}
      <SearchInput onSearch={handleSearch} />
      
      {/* Search results summary */}
      {searchTerm && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded">
          <p className="text-sm">
            {searchResults.length > 0 
              ? `Found ${matchingNodes.size} matches for "${searchTerm}"`
              : `No matches found for "${searchTerm}"`
            }
          </p>
        </div>
      )}
      
      {/* File explorer tree */}
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
            searchTerm={searchTerm}
            matchingNodes={matchingNodes}
          />
        </ul>
      </div>
      
      {/* Debug view of file system state */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-64">
        <p className="font-semibold mb-1">File System State:</p>
        <pre>{JSON.stringify(fileSystem, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FileExplorer;
