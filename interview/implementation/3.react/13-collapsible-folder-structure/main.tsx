import React, { useState } from 'react';
import FolderStructure from './components/FolderStructure';
import { TreeItem } from './components/types';

// Sample folder structure data
const folderData: TreeItem[] = [
  {
    id: 'root',
    name: 'Project Files',
    type: 'folder',
    itemCount: 5,
    children: [
      {
        id: 'docs',
        name: 'Documentation',
        type: 'folder',
        itemCount: 3,
        children: [
          {
            id: 'readme',
            name: 'README.md',
            type: 'file',
            fileType: 'document'
          },
          {
            id: 'contributing',
            name: 'CONTRIBUTING.md',
            type: 'file',
            fileType: 'document'
          },
          {
            id: 'license',
            name: 'LICENSE',
            type: 'file',
            fileType: 'document'
          }
        ]
      },
      {
        id: 'src',
        name: 'Source Code',
        type: 'folder',
        itemCount: 4,
        children: [
          {
            id: 'components',
            name: 'Components',
            type: 'folder',
            itemCount: 2,
            children: [
              {
                id: 'app',
                name: 'App.tsx',
                type: 'file',
                fileType: 'code'
              },
              {
                id: 'header',
                name: 'Header.tsx',
                type: 'file',
                fileType: 'code'
              }
            ]
          },
          {
            id: 'utils',
            name: 'Utils',
            type: 'folder',
            itemCount: 1,
            children: [
              {
                id: 'helpers',
                name: 'helpers.ts',
                type: 'file',
                fileType: 'code'
              }
            ]
          },
          {
            id: 'index',
            name: 'index.tsx',
            type: 'file',
            fileType: 'code'
          }
        ]
      },
      {
        id: 'assets',
        name: 'Assets',
        type: 'folder',
        itemCount: 2,
        children: [
          {
            id: 'logo',
            name: 'logo.png',
            type: 'file',
            fileType: 'image'
          },
          {
            id: 'banner',
            name: 'banner.jpg',
            type: 'file',
            fileType: 'image'
          }
        ]
      },
      {
        id: 'package',
        name: 'package.json',
        type: 'file',
        fileType: 'code'
      },
      {
        id: 'tsconfig',
        name: 'tsconfig.json',
        type: 'file',
        fileType: 'code'
      }
    ]
  }
];

const FolderStructureDemo: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);

  const handleSelect = (item: TreeItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Collapsible Folder Structure</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FolderStructure 
            data={folderData}
            onSelect={handleSelect}
            selectedId={selectedItem?.id}
            className="min-h-[400px]"
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Keyboard Navigation:</strong></p>
            <ul className="list-disc pl-5 mt-2">
              <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">↑</kbd> and <kbd className="px-1 py-0.5 bg-gray-100 rounded">↓</kbd> to navigate between items</li>
              <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">→</kbd> to expand a folder or navigate into it</li>
              <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">←</kbd> to collapse a folder or navigate to parent</li>
              <li>Use <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd> to select or toggle a folder</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-3">Selected Item</h2>
          {selectedItem ? (
            <div>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Type:</strong> {selectedItem.type}</p>
              {selectedItem.type === 'folder' && (
                <p><strong>Items:</strong> {selectedItem.itemCount}</p>
              )}
              {selectedItem.type === 'file' && selectedItem.fileType && (
                <p><strong>File Type:</strong> {selectedItem.fileType}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">ID: {selectedItem.id}</p>
            </div>
          ) : (
            <p className="text-gray-500">No item selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderStructureDemo;
