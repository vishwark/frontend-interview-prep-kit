/**
 * Level 2: Expandable Tree
 * 
 * Requirements:
 * 
 * 1. Same JSON data structure as Level 1.
 * 2. Add expand/collapse toggle for folders.
 * 3. Each folder maintains its own local isExpanded state.
 * 
 * Learning Goals:
 * - Understand component state management in a recursive structure
 * - Learn how to implement toggle functionality
 * - Practice conditional rendering based on state
 * 
 * Implementation Tips:
 * - Use useState hook to track expanded state for each folder
 * - Add click handlers to toggle the expanded state
 * - Only render children when the folder is expanded
 * - Add visual indicators (like arrows or +/- icons) to show expand/collapse state
 */

// Example data structure you can use:
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
