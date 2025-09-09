/**
 * File Explorer Implementation Challenge
 * 
 * This directory contains a progressive series of file explorer implementation challenges,
 * each building on the skills learned in the previous level. Start from Level 1 and work
 * your way up to more complex implementations.
 * 
 * Each level has its own folder with specific requirements and example code.
 * 
 * Level Progression:
 * 
 * 🟢 Level 1: Static Nested Tree
 * - Hardcoded JSON with folders/files
 * - Render recursively with <ul><li>
 * - No expand/collapse
 * 
 * 🟡 Level 2: Expandable Tree
 * - Same JSON
 * - Add expand/collapse toggle for folders
 * - Each folder maintains its own local isExpanded state
 * 
 * 🟠 Level 3: Persistent Expandable Tree
 * - Folders expand/collapse like Level 2
 * - Preserve nested states when a parent is collapsed
 * - Use a global expand state map keyed by node IDs
 * 
 * 🔵 Level 4: Lazy Loaded Tree
 * - Children are not loaded until the folder is expanded
 * - Simulate API call with setTimeout
 * - Show loading indicator while fetching
 * 
 * 🟣 Level 5: Editable Tree
 * - Support Create, Rename, Delete for folders/files
 * - Must update the nested JSON state recursively
 * 
 * 🟤 Level 6: Draggable Tree
 * - Drag a file/folder and drop it into another folder
 * - Update JSON structure accordingly
 * - Show drop feedback (highlight target folder)
 * 
 * ⚫️ Level 7: Searchable Tree
 * - Add a search input
 * - Highlight matching items
 * - Auto-expand folders that contain matches
 * 
 * Learning Goals:
 * - Understand recursive component rendering
 * - Master state management in nested structures
 * - Learn asynchronous data loading patterns
 * - Practice CRUD operations on tree structures
 * - Implement drag and drop functionality
 * - Create search functionality for hierarchical data
 * 
 * Implementation Tips:
 * - Focus on one level at a time
 * - Reuse code from previous levels when possible
 * - Test thoroughly before moving to the next level
 * - Consider edge cases for each feature
 * - Pay attention to performance with large trees
 * - Ensure accessibility for keyboard users
 */

// Base file system structure for reference:
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
        },
        {
          id: "file4",
          name: "vacation.png",
          type: "file"
        }
      ]
    },
    {
      id: "file5",
      name: "notes.txt",
      type: "file"
    }
  ]
};
