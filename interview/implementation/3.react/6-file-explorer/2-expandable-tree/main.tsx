import React from 'react';
import FileExplorer from './components/FileExplorer';
import { FileSystemNode } from './components/TreeNode';

/**
 * Level 2: Expandable Tree
 * 
 * This is the main component for the expandable tree implementation.
 * It renders a file explorer with a hardcoded file system structure,
 * but now folders can be expanded and collapsed.
 */
const ExpandableTree: React.FC = () => {
  // Example file system data
  const fileSystemData: FileSystemNode = {
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Explorer - Level 2: Expandable Tree</h1>
      <p className="mb-6 text-gray-600">
        This file explorer allows you to expand and collapse folders.
        Click on a folder to toggle its expanded state.
      </p>
      
      <FileExplorer data={fileSystemData} />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Each folder maintains its own local <code>isExpanded</code> state</li>
          <li>Uses the <code>useState</code> hook to track expanded state</li>
          <li>Adds click handlers to toggle the expanded state</li>
          <li>Only renders children when the folder is expanded</li>
          <li>Visual indicators (chevron icons) show expand/collapse state</li>
          <li>Includes proper ARIA attributes for accessibility</li>
        </ul>
      </div>
    </div>
  );
};

export default ExpandableTree;
