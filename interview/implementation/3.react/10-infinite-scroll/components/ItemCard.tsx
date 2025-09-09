import React from 'react';
import { Item } from './types';

interface ItemCardProps {
  item: Item;
}

/**
 * ItemCard Component
 * 
 * Renders different types of items (text, image, card) in the infinite scroll list
 */
const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  // Format date to a readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render tags
  const renderTags = () => {
    if (!item.tags || item.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {item.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Render based on item type
  switch (item.type) {
    case 'text':
      return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 transition-all hover:shadow-lg">
          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
          <p className="text-gray-600 mt-2">{item.description}</p>
          {renderTags()}
          <div className="text-gray-400 text-sm mt-2">
            {formatDate(item.createdAt)}
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden transition-all hover:shadow-lg">
          {item.imageUrl && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                loading="lazy" // Lazy load images for better performance
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
            {renderTags()}
            <div className="text-gray-400 text-sm mt-2">
              {formatDate(item.createdAt)}
            </div>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden transition-all hover:shadow-lg flex flex-col md:flex-row">
          {item.imageUrl && (
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-4 md:w-2/3">
            <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
            {renderTags()}
            <div className="text-gray-400 text-sm mt-2">
              {formatDate(item.createdAt)}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
          <p className="text-gray-600 mt-2">{item.description}</p>
        </div>
      );
  }
};

export default ItemCard;
