/**
 * Level 5: Editable Tree
 * 
 * Requirements:
 * 
 * 1. Support Create, Rename, Delete for folders/files.
 * 2. Must update the nested JSON state recursively.
 * 
 * Learning Goals:
 * - Learn how to implement CRUD operations in a nested data structure
 * - Understand immutable state updates in complex hierarchical data
 * - Practice building interactive UI components for editing
 * 
 * Implementation Tips:
 * - Create helper functions for finding and updating nodes in the tree
 * - Implement context menus or buttons for edit operations
 * - Add form components for creating and renaming items
 * - Use immutable update patterns (spread operator, map, filter) to modify the tree
 * - Consider using a reducer pattern to manage the different operations
 */

// Example data structure:
const exampleFileSystem = {
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

// Example helper functions:

// Create a new node (file or folder)
function createNode(parentId, name, type, tree) {
  // Implementation would recursively find the parent and add a new child
  // Return updated tree
}

// Rename a node
function renameNode(nodeId, newName, tree) {
  // Implementation would recursively find the node and update its name
  // Return updated tree
}

// Delete a node
function deleteNode(nodeId, tree) {
  // Implementation would recursively find the node and remove it
  // Return updated tree
}

// Example reducer for managing operations
function fileSystemReducer(state, action) {
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
