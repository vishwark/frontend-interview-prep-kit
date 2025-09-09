import React from 'react';
import FileExplorer from './components/FileExplorer';
import { FileSystemNode } from './components/TreeNode';

/**
 * Level 1: Static Nested Tree
 * 
 * This is the main component for the static nested tree implementation.
 * It renders a file explorer with a hardcoded file system structure.
 */
const StaticNestedTree: React.FC = () => {
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
      <h1 className="text-3xl font-bold mb-6">File Explorer - Level 1: Static Nested Tree</h1>
      <p className="mb-6 text-gray-600">
        This is a simple file explorer that renders a static nested tree structure.
        The tree is rendered recursively using a TreeNode component.
      </p>
      
      <FileExplorer data={fileSystemData} />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Uses recursive rendering with the TreeNode component</li>
          <li>Different styling for files and folders</li>
          <li>Simple UI with nested &lt;ul&gt; and &lt;li&gt; elements</li>
          <li>No interactivity in this level (no expand/collapse)</li>
        </ul>
      </div>
    </div>
  );
};

export default StaticNestedTree;
