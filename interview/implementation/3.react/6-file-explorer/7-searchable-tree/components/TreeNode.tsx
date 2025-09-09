import React, { useState, useRef } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Edit2, Trash2, Plus, X, Check } from 'lucide-react';
import { FileSystemNode } from './fileSystemReducer';

interface TreeNodeProps {
  node: FileSystemNode;
  expandedNodes: Record<string, boolean>;
  onToggleExpand: (nodeId: string) => void;
  onCreateNode: (parentId: string, name: string, type: 'file' | 'folder') => void;
  onRenameNode: (nodeId: string, newName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onMoveNode: (nodeId: string, sourceParentId: string, targetParentId: string) => void;
  parentId?: string;
  searchTerm?: string;
  matchingNodes?: Set<string>;
}

/**
 * TreeNode Component
 * 
 * Renders a single node in the file system tree.
 * Supports expanding/collapsing folders, CRUD operations, drag-and-drop,
 * and highlighting nodes that match the search term.
 */
const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  expandedNodes,
  onToggleExpand,
  onCreateNode,
  onRenameNode,
  onDeleteNode,
  onMoveNode,
  parentId = 'root',
  searchTerm = '',
  matchingNodes = new Set()
}) => {
  // Determine if the node is a folder
  const isFolder = node.type === 'folder';
  
  // Get expanded state from the global map
  const isExpanded = expandedNodes[node.id] || false;
  
  // Check if this node matches the search term
  const isMatch = matchingNodes.has(node.id);
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  
  // State for creating new nodes
  const [isCreating, setIsCreating] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [createName, setCreateName] = useState('');
  
  // State for drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Reference to the node element
  const nodeRef = useRef<HTMLLIElement>(null);
  
  // Toggle expanded state for folders
  const toggleExpand = (e: React.MouseEvent) => {
    if (isFolder) {
      e.stopPropagation();
      onToggleExpand(node.id);
    }
  };
  
  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(node.name);
  };
  
  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${node.name}?`)) {
      onDeleteNode(node.id);
    }
  };
  
  // Handle create button click
  const handleCreateClick = (e: React.MouseEvent, type: 'file' | 'folder') => {
    e.stopPropagation();
    setIsCreating(true);
    setCreateType(type);
    setCreateName('');
    
    // Ensure the folder is expanded
    if (!isExpanded && isFolder) {
      onToggleExpand(node.id);
    }
  };
  
  // Handle save edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      onRenameNode(node.id, editName.trim());
      setIsEditing(false);
    }
  };
  
  // Handle save create
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (createName.trim()) {
      onCreateNode(node.id, createName.trim(), createType);
      setIsCreating(false);
    }
  };
  
  // Handle cancel edit/create
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    // Set the data to be transferred
    e.dataTransfer.setData('application/json', JSON.stringify({
      nodeId: node.id,
      parentId: parentId
    }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a delay to allow the drag image to be set
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    // Only allow dropping into folders
    if (isFolder) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Only allow dropping into folders
    if (!isFolder) {
      return;
    }
    
    try {
      // Get the data from the drag event
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const draggedNodeId = data.nodeId;
      const sourceParentId = data.parentId;
      
      // Don't allow dropping onto itself or its parent
      if (draggedNodeId === node.id || sourceParentId === node.id) {
        return;
      }
      
      // Move the node
      onMoveNode(draggedNodeId, sourceParentId, node.id);
      
      // Ensure the target folder is expanded
      if (!isExpanded) {
        onToggleExpand(node.id);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };
  
  // Highlight matching text in node name
  const highlightMatchingText = (text: string, term: string) => {
    if (!term || !isMatch) {
      return text;
    }
    
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);
    
    if (index === -1) {
      return text;
    }
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + term.length);
    const after = text.substring(index + term.length);
    
    return (
      <>
        {before}
        <span className="bg-yellow-200 font-medium">{match}</span>
        {after}
      </>
    );
  };

  return (
    <li 
      ref={nodeRef}
      className={`py-1 ${isDragging ? 'opacity-50' : ''} ${isMatch ? 'bg-yellow-50' : ''}`}
      draggable={!isEditing && !isCreating}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Node display */}
      <div 
        className={`flex items-center group ${isDragOver ? 'bg-blue-100 border border-blue-300 rounded' : ''}`}
        onClick={!isEditing && !isCreating ? toggleExpand : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Expand/collapse icon for folders */}
        {isFolder && !isEditing && (
          <span className="mr-1 text-gray-500">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        
        {/* Icon based on node type */}
        {!isEditing && (
          <span className="mr-2">
            {isFolder ? (
              <Folder className={`w-5 h-5 ${isDragOver ? 'text-blue-600' : isMatch ? 'text-blue-600' : 'text-blue-500'}`} />
            ) : (
              <File className={`w-5 h-5 ${isMatch ? 'text-gray-700' : 'text-gray-500'}`} />
            )}
          </span>
        )}
        
        {/* Node name or edit form */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="flex items-center">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm mr-2"
              autoFocus
            />
            <button 
              type="submit" 
              className="p-1 bg-green-100 rounded hover:bg-green-200 mr-1"
              title="Save"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="p-1 bg-red-100 rounded hover:bg-red-200"
              title="Cancel"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </form>
        ) : (
          <span className={isFolder ? 'font-medium' : ''}>
            {searchTerm ? highlightMatchingText(node.name, searchTerm) : node.name}
          </span>
        )}
        
        {/* Action buttons */}
        {!isEditing && !isCreating && (
          <div className="ml-auto hidden group-hover:flex">
            <button 
              onClick={handleEditClick}
              className="p-1 bg-gray-100 rounded hover:bg-gray-200 mr-1"
              title="Rename"
            >
              <Edit2 className="w-3 h-3 text-gray-600" />
            </button>
            <button 
              onClick={handleDeleteClick}
              className="p-1 bg-gray-100 rounded hover:bg-gray-200 mr-1"
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-gray-600" />
            </button>
            {isFolder && (
              <>
                <button 
                  onClick={(e) => handleCreateClick(e, 'file')}
                  className="p-1 bg-gray-100 rounded hover:bg-gray-200 mr-1"
                  title="New File"
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                  <File className="w-3 h-3 text-gray-600" />
                </button>
                <button 
                  onClick={(e) => handleCreateClick(e, 'folder')}
                  className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                  title="New Folder"
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                  <Folder className="w-3 h-3 text-gray-600" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Create new node form */}
      {isCreating && isFolder && (
        <div className="pl-6 mt-1">
          <form onSubmit={handleSaveCreate} className="flex items-center">
            <span className="mr-2">
              {createType === 'folder' ? (
                <Folder className="w-5 h-5 text-blue-500" />
              ) : (
                <File className="w-5 h-5 text-gray-500" />
              )}
            </span>
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder={`New ${createType}`}
              className="border border-gray-300 rounded px-2 py-1 text-sm mr-2"
              autoFocus
            />
            <button 
              type="submit" 
              className="p-1 bg-green-100 rounded hover:bg-green-200 mr-1"
              title="Save"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="p-1 bg-red-100 rounded hover:bg-red-200"
              title="Cancel"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </form>
        </div>
      )}
      
      {/* Render children recursively if it's a folder and it's expanded */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <ul className="pl-6 mt-1 border-l border-gray-200">
          {node.children.map(childNode => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              onCreateNode={onCreateNode}
              onRenameNode={onRenameNode}
              onDeleteNode={onDeleteNode}
              onMoveNode={onMoveNode}
              parentId={node.id}
              searchTerm={searchTerm}
              matchingNodes={matchingNodes}
            />
          ))}
        </ul>
      )}
      
      {/* Empty folder message */}
      {isFolder && isExpanded && (!node.children || node.children.length === 0) && !isCreating && (
        <div className="pl-6 mt-1 text-sm text-gray-500">
          This folder is empty
        </div>
      )}
    </li>
  );
};

export default TreeNode;
