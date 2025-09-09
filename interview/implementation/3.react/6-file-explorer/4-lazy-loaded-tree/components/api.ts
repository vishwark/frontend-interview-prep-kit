/**
 * API Service for Lazy Loaded Tree
 * 
 * This file contains functions to simulate API calls for fetching folder contents.
 * In a real application, these would be actual API calls to a server.
 */

// Define the FileSystemNode interface
export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  hasChildren?: boolean;
  children?: FileSystemNode[];
  error?: string;
}

/**
 * Simulates an API call to fetch folder contents
 * @param folderId The ID of the folder to fetch contents for
 * @returns A promise that resolves to an array of FileSystemNode objects
 */
export function fetchFolderContents(folderId: string): Promise<FileSystemNode[]> {
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

/**
 * Initial file system data structure (without children loaded)
 */
export const initialFileSystem: FileSystemNode = {
  id: "root",
  name: "Root",
  type: "folder",
  hasChildren: true
};
