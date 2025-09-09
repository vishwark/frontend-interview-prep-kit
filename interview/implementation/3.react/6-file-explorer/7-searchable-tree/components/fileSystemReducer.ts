// Simple function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Define the FileSystemNode interface
export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemNode[];
}

// Define the search result interface
export interface SearchResult {
  id: string;
  name: string;
  type: 'file' | 'folder';
  isMatch: boolean;
  path: string[];
}

// Define the action types
export type FileSystemAction =
  | { type: 'CREATE_NODE'; parentId: string; name: string; nodeType: 'file' | 'folder' }
  | { type: 'RENAME_NODE'; nodeId: string; newName: string }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'MOVE_NODE'; nodeId: string; sourceParentId: string; targetParentId: string }
  | { type: 'TOGGLE_EXPAND'; nodeId: string };

/**
 * Helper function to find a node by ID
 * @param nodeId The ID of the node to find
 * @param tree The current file system tree
 * @returns The node if found, or undefined
 */
export function findNodeById(
  nodeId: string,
  tree: FileSystemNode
): FileSystemNode | undefined {
  if (tree.id === nodeId) {
    return tree;
  }

  if (tree.children) {
    for (const child of tree.children) {
      const found = findNodeById(nodeId, child);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

/**
 * Helper function to find the parent of a node
 * @param nodeId The ID of the node to find the parent for
 * @param tree The current file system tree
 * @returns The parent node if found, or undefined
 */
export function findParentNode(
  nodeId: string,
  tree: FileSystemNode
): FileSystemNode | undefined {
  if (tree.children) {
    for (const child of tree.children) {
      if (child.id === nodeId) {
        return tree;
      }
      const found = findParentNode(nodeId, child);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

/**
 * Helper function to check if a node is a descendant of another node
 * @param nodeId The ID of the node to check
 * @param potentialAncestorId The ID of the potential ancestor
 * @param tree The current file system tree
 * @returns True if nodeId is a descendant of potentialAncestorId, false otherwise
 */
export function isDescendant(
  nodeId: string,
  potentialAncestorId: string,
  tree: FileSystemNode
): boolean {
  if (tree.id === potentialAncestorId) {
    if (tree.children) {
      for (const child of tree.children) {
        if (child.id === nodeId || isDescendant(nodeId, child.id, tree)) {
          return true;
        }
      }
    }
  } else if (tree.children) {
    for (const child of tree.children) {
      if (isDescendant(nodeId, potentialAncestorId, child)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Helper function to create a new node (file or folder)
 * @param parentId The ID of the parent folder
 * @param name The name of the new node
 * @param nodeType The type of the new node ('file' or 'folder')
 * @param tree The current file system tree
 * @returns The updated file system tree
 */
export function createNode(
  parentId: string,
  name: string,
  nodeType: 'file' | 'folder',
  tree: FileSystemNode
): FileSystemNode {
  // If this is the parent node, add the new node to its children
  if (tree.id === parentId) {
    const newNode: FileSystemNode = {
      id: generateId(),
      name,
      type: nodeType,
      ...(nodeType === 'folder' ? { children: [] } : {})
    };

    return {
      ...tree,
      children: [...(tree.children || []), newNode]
    };
  }

  // If this node has children, recursively search for the parent
  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map(child => createNode(parentId, name, nodeType, child))
    };
  }

  // If we get here, the parent wasn't found in this branch
  return tree;
}

/**
 * Helper function to rename a node
 * @param nodeId The ID of the node to rename
 * @param newName The new name for the node
 * @param tree The current file system tree
 * @returns The updated file system tree
 */
export function renameNode(
  nodeId: string,
  newName: string,
  tree: FileSystemNode
): FileSystemNode {
  // If this is the node to rename, update its name
  if (tree.id === nodeId) {
    return {
      ...tree,
      name: newName
    };
  }

  // If this node has children, recursively search for the node to rename
  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map(child => renameNode(nodeId, newName, child))
    };
  }

  // If we get here, the node wasn't found in this branch
  return tree;
}

/**
 * Helper function to delete a node
 * @param nodeId The ID of the node to delete
 * @param tree The current file system tree
 * @returns The updated file system tree
 */
export function deleteNode(
  nodeId: string,
  tree: FileSystemNode
): FileSystemNode {
  // Can't delete the root node
  if (tree.id === nodeId) {
    return tree;
  }

  // If this node has children, filter out the node to delete
  // and recursively search for the node in the remaining children
  if (tree.children) {
    return {
      ...tree,
      children: tree.children
        .filter(child => child.id !== nodeId)
        .map(child => deleteNode(nodeId, child))
    };
  }

  // If we get here, the node wasn't found in this branch
  return tree;
}

/**
 * Helper function to move a node from one parent to another
 * @param nodeId The ID of the node to move
 * @param sourceParentId The ID of the source parent folder
 * @param targetParentId The ID of the target parent folder
 * @param tree The current file system tree
 * @returns The updated file system tree
 */
export function moveNode(
  nodeId: string,
  sourceParentId: string,
  targetParentId: string,
  tree: FileSystemNode
): FileSystemNode {
  // Don't allow moving a node to its own descendant
  if (nodeId === targetParentId || isDescendant(targetParentId, nodeId, tree)) {
    return tree;
  }

  // Find the node to move
  const nodeToMove = findNodeById(nodeId, tree);
  if (!nodeToMove) {
    return tree;
  }

  // First, remove the node from its source parent
  const treeWithoutNode = deleteNode(nodeId, tree);

  // Then, add the node to its target parent
  return createNodeWithId(targetParentId, nodeToMove, treeWithoutNode);
}

/**
 * Helper function to create a node with a specific ID
 * @param parentId The ID of the parent folder
 * @param node The node to add
 * @param tree The current file system tree
 * @returns The updated file system tree
 */
function createNodeWithId(
  parentId: string,
  node: FileSystemNode,
  tree: FileSystemNode
): FileSystemNode {
  // If this is the parent node, add the new node to its children
  if (tree.id === parentId) {
    return {
      ...tree,
      children: [...(tree.children || []), node]
    };
  }

  // If this node has children, recursively search for the parent
  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map(child => createNodeWithId(parentId, node, child))
    };
  }

  // If we get here, the parent wasn't found in this branch
  return tree;
}

/**
 * Search the file system tree for nodes matching the search term
 * @param tree The file system tree to search
 * @param searchTerm The term to search for
 * @returns An array of search results
 */
export function searchFileSystem(
  tree: FileSystemNode,
  searchTerm: string
): SearchResult[] {
  // Convert search term to lowercase for case-insensitive matching
  const term = searchTerm.toLowerCase();
  
  // Recursive function to search the tree
  function searchNode(node: FileSystemNode, path: string[] = []): SearchResult[] {
    // Check if the current node matches
    const nodeName = node.name.toLowerCase();
    const isMatch = nodeName.includes(term);
    
    // For folders, also check children
    if (node.type === 'folder' && node.children) {
      // Search all children
      const childMatches = node.children.flatMap(child => 
        searchNode(child, [...path, node.id])
      );
      
      // If any children match, this folder should be in the results
      // and should be auto-expanded
      if (childMatches.length > 0) {
        return [
          // Include this folder in the path to matches
          { id: node.id, name: node.name, type: node.type, isMatch, path },
          ...childMatches
        ];
      }
    }
    
    // Return this node if it matches
    return isMatch ? [{ id: node.id, name: node.name, type: node.type, isMatch, path }] : [];
  }
  
  // Start the search from the root
  return searchNode(tree);
}

/**
 * Get a set of folder IDs that should be expanded based on search results
 * @param searchResults The search results
 * @returns A set of folder IDs to expand
 */
export function getExpandedFolders(searchResults: SearchResult[]): Set<string> {
  // Collect all folder IDs that should be expanded
  const expandedFolders = new Set<string>();
  
  // For each result, add all folders in its path to the set
  searchResults.forEach(result => {
    result.path.forEach(folderId => {
      expandedFolders.add(folderId);
    });
  });
  
  return expandedFolders;
}

/**
 * Reducer function for managing file system operations
 * @param state The current file system state
 * @param action The action to perform
 * @returns The updated file system state
 */
export function fileSystemReducer(
  state: FileSystemNode,
  action: FileSystemAction
): FileSystemNode {
  switch (action.type) {
    case 'CREATE_NODE':
      return createNode(action.parentId, action.name, action.nodeType, state);
    case 'RENAME_NODE':
      return renameNode(action.nodeId, action.newName, state);
    case 'DELETE_NODE':
      return deleteNode(action.nodeId, state);
    case 'MOVE_NODE':
      return moveNode(action.nodeId, action.sourceParentId, action.targetParentId, state);
    default:
      return state;
  }
}

/**
 * Initial file system data
 */
export const initialFileSystem: FileSystemNode = {
  id: "root",
  name: "Root",
  type: "folder",
  children: [
    {
      id: "folder1",
      name: "Documents",
      type: "folder",
      children: [
        {
          id: "file1",
          name: "resume.pdf",
          type: "file"
        },
        {
          id: "file2",
          name: "cover-letter.docx",
          type: "file"
        },
        {
          id: "folder3",
          name: "Project Reports",
          type: "folder",
          children: [
            {
              id: "file3",
              name: "q1-report.pdf",
              type: "file"
            },
            {
              id: "file4",
              name: "q2-report.pdf",
              type: "file"
            }
          ]
        }
      ]
    },
    {
      id: "folder2",
      name: "Images",
      type: "folder",
      children: [
        {
          id: "file5",
          name: "profile.jpg",
          type: "file"
        },
        {
          id: "file6",
          name: "vacation.png",
          type: "file"
        }
      ]
    }
  ]
};
