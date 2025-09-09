/**
 * Level 1: Static Nested Tree
 * 
 * Requirements:
 * 
 * 1. Hardcoded JSON with folders/files.
 * 2. Render recursively with <ul><li> structure.
 * 3. No expand/collapse functionality.
 * 
 * Learning Goals:
 * - Understand basic recursion in React components
 * - Learn how to render tree structures using nested components
 * - Practice working with hierarchical data structures
 * 
 * Implementation Tips:
 * - Create a recursive component that renders itself for child folders
 * - Use different styling/icons for files vs folders
 * - Focus on clean component structure before adding interactivity
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
