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

// Define the action types
export type FileSystemAction =
  | { type: 'CREATE_NODE'; parentId: string; name: string; nodeType: 'file' | 'folder' }
  | { type: 'RENAME_NODE'; nodeId: string; newName: string }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'TOGGLE_EXPAND'; nodeId: string };

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
        }
      ]
    },
    {
      id: "folder2",
      name: "Images",
      type: "folder",
      children: [
        {
          id: "file3",
          name: "profile.jpg",
          type: "file"
        }
      ]
    }
  ]
};
