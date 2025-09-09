import React from 'react';
import FileExplorer from './components/FileExplorer';
import { FileSystemNode } from './components/TreeNode';

/**
 * Level 3: Persistent Expandable Tree
 * 
 * This is the main component for the persistent expandable tree implementation.
 * It renders a file explorer with a hardcoded file system structure,
 * and maintains a global expanded state map for all folders.
 */
const PersistentExpandableTree: React.FC = () => {
  // Example file system data with deeper nesting
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
            id: "folder3",
            name: "Job Applications",
            type: "folder",
            children: [
              {
                id: "folder4",
                name: "Company A",
                type: "folder",
                children: [
                  {
                    id: "file2",
                    name: "position-details.docx",
                    type: "file"
                  }
                ]
              },
              {
                id: "folder5",
                name: "Company B",
                type: "folder",
                children: [
                  {
                    id: "file3",
                    name: "application-status.txt",
                    type: "file"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "folder2",
        name: "Images",
        type: "folder",
        children: [
          {
            id: "file4",
            name: "profile.jpg",
            type: "file"
          }
        ]
      }
    ]
  };

  // Initial expanded state
  const initialExpandedState = {
    "root": true,
    "folder1": true,
    "folder3": true,
    "folder4": false,
    "folder5": false,
    "folder2": false
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Explorer - Level 3: Persistent Expandable Tree</h1>
      <p className="mb-6 text-gray-600">
        This file explorer maintains a global expanded state map for all folders.
        When you collapse a parent folder and then expand it again, the expanded state
        of its children is preserved.
      </p>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Try this:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Expand "Company A" under Job Applications</li>
          <li>Collapse "Documents" folder</li>
          <li>Re-expand "Documents" folder</li>
          <li>Notice that "Job Applications" is still expanded and "Company A" maintains its previous state</li>
        </ol>
      </div>
      
      <FileExplorer 
        data={fileSystemData} 
        initialExpandedState={initialExpandedState}
      />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Uses a global expanded state map keyed by node IDs</li>
          <li>State is lifted to the FileExplorer component</li>
          <li>TreeNode components receive the expanded state and toggle functions as props</li>
          <li>Expanded state persists even when parent folders are collapsed</li>
          <li>Debug view shows the current expanded state map</li>
        </ul>
      </div>
    </div>
  );
};

export default PersistentExpandableTree;
