/**
 * Level 6: Draggable Tree
 * 
 * Requirements:
 * 
 * 1. Drag a file/folder and drop it into another folder.
 * 2. Update JSON structure accordingly.
 * 3. Show drop feedback (highlight target folder).
 * 
 * Learning Goals:
 * - Learn how to implement drag and drop in React
 * - Understand how to provide visual feedback during interactions
 * - Practice updating complex nested data structures
 * 
 * Implementation Tips:
 * - Use the HTML5 Drag and Drop API or a library like react-dnd
 * - Create helper functions for moving nodes between folders
 * - Add visual indicators for drag operations (highlight drop targets)
 * - Consider edge cases like dropping a folder into its own descendant
 * - Implement validation to prevent invalid operations
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

// Example helper function for moving a node:
function moveNode(nodeId, sourceParentId, targetParentId, tree) {
  // 1. Find and remove the node from its source parent
  // 2. Find the target parent and add the node to its children
  // 3. Return the updated tree
  
  // Implementation would handle:
  // - Finding nodes by ID
  // - Removing from source
  // - Adding to target
  // - Validating the operation (e.g., prevent dropping into descendant)
  
  return updatedTree;
}

// Example drag and drop handlers:

// When drag starts
function handleDragStart(e, nodeId) {
  e.dataTransfer.setData('application/json', JSON.stringify({
    nodeId: nodeId
  }));
  e.dataTransfer.effectAllowed = 'move';
}

// When dragging over a potential drop target
function handleDragOver(e, nodeId, nodeType) {
  // Only allow dropping into folders
  if (nodeType === 'folder') {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
    // Add visual feedback (e.g., highlight the folder)
  }
}

// When dropping
function handleDrop(e, targetFolderId) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('application/json'));
  const draggedNodeId = data.nodeId;
  
  // Find source parent ID (would need to be tracked or found in the tree)
  const sourceParentId = findParentId(draggedNodeId, tree);
  
  // Update the tree structure
  const updatedTree = moveNode(draggedNodeId, sourceParentId, targetFolderId, tree);
  
  // Update state with the new tree
  setFileSystem(updatedTree);
}
