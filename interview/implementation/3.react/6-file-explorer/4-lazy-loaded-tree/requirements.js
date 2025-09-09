/**
 * Level 4: Lazy Loaded Tree
 * 
 * Requirements:
 * 
 * 1. Children are not loaded until the folder is expanded.
 * 2. Simulate API call with setTimeout.
 * 3. Show loading indicator while fetching.
 * 
 * Learning Goals:
 * - Understand asynchronous data loading in React
 * - Learn how to handle loading states
 * - Practice working with simulated API calls
 * 
 * Implementation Tips:
 * - Modify the data structure to only include basic folder info initially
 * - Create a function that simulates fetching children with setTimeout
 * - Add loading state for each folder
 * - Show spinner/loading indicator while children are being fetched
 * - Handle potential errors in the fetch process
 */

// Example initial data structure (without children loaded):
const exampleFileSystem = {
  id: "root",
  name: "Root",
  type: "folder",
  // No children array initially - will be loaded on demand
  hasChildren: true
};

// Example function to simulate API call:
function fetchFolderContents(folderId) {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Mock data based on folder ID
      if (folderId === "root") {
        resolve([
          {
            id: "folder1",
            name: "Documents",
            type: "folder",
            hasChildren: true
          },
          {
            id: "folder2",
            name: "Images",
            type: "folder",
            hasChildren: true
          },
          {
            id: "file1",
            name: "notes.txt",
            type: "file"
          }
        ]);
      } else if (folderId === "folder1") {
        resolve([
          {
            id: "file2",
            name: "resume.pdf",
            type: "file"
          },
          {
            id: "folder3",
            name: "Job Applications",
            type: "folder",
            hasChildren: true
          }
        ]);
      } else if (folderId === "folder2") {
        resolve([
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
        ]);
      } else if (folderId === "folder3") {
        resolve([
          {
            id: "folder4",
            name: "Company A",
            type: "folder",
            hasChildren: true
          },
          {
            id: "folder5",
            name: "Company B",
            type: "folder",
            hasChildren: true
          }
        ]);
      } else if (folderId === "folder4" || folderId === "folder5") {
        resolve([
          {
            id: `file-${folderId}-1`,
            name: "application.pdf",
            type: "file"
          },
          {
            id: `file-${folderId}-2`,
            name: "interview-notes.docx",
            type: "file"
          }
        ]);
      } else {
        // Simulate error for unknown folder
        reject(new Error(`Folder with id ${folderId} not found`));
      }
    }, 1000); // 1 second delay
  });
}
