import React, { useState } from 'react';
import DynamicGrid from './components/DynamicGrid';
import { GridItem } from './components/types';
import { Image, FileText, Code, Folder } from 'lucide-react';

const DynamicGridDemo: React.FC = () => {
  // Sample data with different types of content
  const initialItems: GridItem[] = [
    {
      id: '1',
      content: (
        <div className="aspect-video bg-blue-100 p-4 rounded-lg">
          <Image className="w-8 h-8 mb-2" />
          <h3 className="font-medium">Image Item</h3>
          <p className="text-sm text-gray-600">An example image item</p>
        </div>
      ),
      height: 200,
      metadata: { type: 'image' }
    },
    {
      id: '2',
      content: (
        <div className="aspect-square bg-green-100 p-4 rounded-lg">
          <FileText className="w-8 h-8 mb-2" />
          <h3 className="font-medium">Document Item</h3>
          <p className="text-sm text-gray-600">A document example</p>
        </div>
      ),
      height: 250,
      metadata: { type: 'document' }
    },
    {
      id: '3',
      content: (
        <div className="h-full bg-purple-100 p-4 rounded-lg">
          <Code className="w-8 h-8 mb-2" />
          <h3 className="font-medium">Code Item</h3>
          <p className="text-sm text-gray-600">A code snippet example</p>
        </div>
      ),
      height: 180,
      metadata: { type: 'code' }
    },
    {
      id: '4',
      content: (
        <div className="aspect-video bg-yellow-100 p-4 rounded-lg">
          <Folder className="w-8 h-8 mb-2" />
          <h3 className="font-medium">Folder Item</h3>
          <p className="text-sm text-gray-600">A folder example</p>
        </div>
      ),
      height: 220,
      metadata: { type: 'folder' }
    },
  ];

  // Add more items for demonstration
  const allItems = [
    ...initialItems,
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `extra-${i + 1}`,
      content: (
        <div className={`aspect-video bg-gray-100 p-4 rounded-lg`}>
          <h3 className="font-medium">Item {i + 5}</h3>
          <p className="text-sm text-gray-600">Additional item example</p>
        </div>
      ),
      height: 180 + Math.floor(Math.random() * 100),
      metadata: { type: 'extra' }
    }))
  ];

  const [items] = useState<GridItem[]>(allItems);
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter function
  const filterByType = (item: GridItem) => {
    if (selectedType === 'all') return true;
    return item.metadata?.type === selectedType;
  };

  // Sort function
  const sortByHeight = (a: GridItem, b: GridItem) => {
    return (a.height || 0) - (b.height || 0);
  };

  // Handle item click
  const handleItemClick = (item: GridItem) => {
    console.log('Clicked item:', item);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dynamic Grid Component</h1>
      
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => setLayout('grid')}
            className={`px-4 py-2 rounded ${
              layout === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Grid Layout
          </button>
          <button
            onClick={() => setLayout('masonry')}
            className={`px-4 py-2 rounded ${
              layout === 'masonry' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Masonry Layout
          </button>
        </div>
        
        <div className="flex gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
            <option value="code">Code</option>
            <option value="folder">Folders</option>
            <option value="extra">Extra</option>
          </select>
        </div>
      </div>
      
      {/* Grid */}
      <DynamicGrid
        items={items}
        columnCountByBreakpoint={{
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4
        }}
        gap={16}
        masonryLayout={layout === 'masonry'}
        animateChanges
        lazyLoadThreshold={200}
        onItemClick={handleItemClick}
        filterBy={filterByType}
        sortBy={sortByHeight}
        className="min-h-[500px]"
        itemClassName="transition-all duration-300 hover:scale-[1.02]"
      />
      
      {/* Features List */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Implemented Features</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <li>✓ Responsive grid layout with configurable columns</li>
          <li>✓ Masonry layout support</li>
          <li>✓ Lazy loading with intersection observer</li>
          <li>✓ Filtering by item type</li>
          <li>✓ Sorting by item height</li>
          <li>✓ Smooth animations on layout changes</li>
          <li>✓ Configurable gap between items</li>
          <li>✓ Support for items with different heights</li>
          <li>✓ Hover animations on items</li>
          <li>✓ Accessible keyboard navigation</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicGridDemo;
