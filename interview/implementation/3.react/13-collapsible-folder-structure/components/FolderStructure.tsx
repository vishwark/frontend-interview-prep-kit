import React, { useState, useCallback, useEffect } from 'react';
import { FolderStructureProps, TreeItem } from './types';
import TreeNode from './TreeNode';

const FolderStructure: React.FC<FolderStructureProps> = ({
  data,
  onSelect,
  selectedId,
  className = '',
}) => {
  // State to track expanded folder IDs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Toggle expand/collapse state of a folder
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prevState => {
      const newState = new Set(prevState);
      if (newState.has(id)) {
        newState.delete(id);
      } else {
        newState.add(id);
      }
      return newState;
    });
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedId) return;
    
    // Find the current item and its siblings
    const findItemAndSiblings = (
      items: TreeItem[],
      id: string,
      parent: TreeItem | null = null
    ): { item: TreeItem | null; siblings: TreeItem[]; parent: TreeItem | null } => {
      for (const item of items) {
        if (item.id === id) {
          return { item, siblings: items, parent };
        }
        
        if (item.children) {
          const result = findItemAndSiblings(item.children, id, item);
          if (result.item) {
            return result;
          }
        }
      }
      
      return { item: null, siblings: [], parent: null };
    };
    
    const { item, siblings, parent } = findItemAndSiblings(data, selectedId);
    if (!item) return;
    
    const currentIndex = siblings.findIndex(sibling => sibling.id === selectedId);
    
    switch (e.key) {
      case 'ArrowDown':
        // Move to next sibling or first child if expanded
        if (item.type === 'folder' && expandedIds.has(item.id) && item.children?.length) {
          onSelect?.(item.children[0]);
        } else if (currentIndex < siblings.length - 1) {
          onSelect?.(siblings[currentIndex + 1]);
        }
        break;
        
      case 'ArrowUp':
        // Move to previous sibling
        if (currentIndex > 0) {
          onSelect?.(siblings[currentIndex - 1]);
        } else if (parent) {
          onSelect?.(parent);
        }
        break;
        
      case 'ArrowRight':
        // Expand folder if collapsed, or move to first child if expanded
        if (item.type === 'folder') {
          if (!expandedIds.has(item.id)) {
            toggleExpand(item.id);
          } else if (item.children?.length) {
            onSelect?.(item.children[0]);
          }
        }
        break;
        
      case 'ArrowLeft':
        // Collapse folder if expanded, or move to parent if collapsed
        if (item.type === 'folder' && expandedIds.has(item.id)) {
          toggleExpand(item.id);
        } else if (parent) {
          onSelect?.(parent);
        }
        break;
    }
  }, [data, selectedId, expandedIds, toggleExpand, onSelect]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div 
      className={`folder-structure border rounded-md p-2 ${className}`}
      role="tree"
      aria-label="Folder structure"
    >
      {data.map(item => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          onSelect={onSelect}
          selectedId={selectedId}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
        />
      ))}
    </div>
  );
};

export default FolderStructure;
