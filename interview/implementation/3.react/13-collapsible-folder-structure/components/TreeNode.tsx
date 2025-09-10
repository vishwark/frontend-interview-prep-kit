import React, { useRef, useEffect } from 'react';
import { TreeNodeProps } from './types';
import { ChevronRight, ChevronDown, Folder, File, FileText, FileImage, FileCode } from 'lucide-react';

const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  level,
  onSelect,
  selectedId,
  expandedIds,
  toggleExpand
}) => {
  const isFolder = item.type === 'folder';
  const isExpanded = isFolder && expandedIds.has(item.id);
  const isSelected = selectedId === item.id;
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (isSelected && nodeRef.current) {
      nodeRef.current.focus();
    }
  }, [isSelected]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isFolder) {
        toggleExpand(item.id);
      } else if (onSelect) {
        onSelect(item);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      toggleExpand(item.id);
    }
    if (onSelect) {
      onSelect(item);
    }
  };

  // Get the appropriate icon based on file type
  const getFileIcon = () => {
    if (!isFolder) {
      switch (item.fileType) {
        case 'image':
          return <FileImage className="h-4 w-4 text-blue-500" />;
        case 'code':
          return <FileCode className="h-4 w-4 text-green-500" />;
        case 'document':
          return <FileText className="h-4 w-4 text-amber-500" />;
        default:
          return <File className="h-4 w-4 text-gray-500" />;
      }
    }
    return isExpanded ? 
      <Folder className="h-4 w-4 text-yellow-500" /> : 
      <Folder className="h-4 w-4 text-yellow-400" />;
  };

  return (
    <div>
      <div 
        ref={nodeRef}
        className={`flex items-center py-1 px-1 rounded-md cursor-pointer ${
          isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role={isFolder ? 'button' : 'treeitem'}
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
      >
        {isFolder && (
          <span className="mr-1 flex items-center text-gray-500">
            {isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </span>
        )}
        
        <span className="mr-2 flex items-center">
          {getFileIcon()}
        </span>
        
        <span className="flex-grow truncate">{item.name}</span>
        
        {isFolder && item.itemCount !== undefined && (
          <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {item.itemCount}
          </span>
        )}
      </div>
      
      {/* Render children with animation */}
      {isFolder && isExpanded && item.children && (
        <div className="overflow-hidden transition-all duration-200 ease-in-out">
          {item.children.map(child => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
