import React from 'react';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  onNavigate?: (path: string) => void;
  className?: string;
}

/**
 * Breadcrumb component that displays a hierarchical navigation path
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  maxItems = 0,
  onNavigate = () => {},
  className = '',
}) => {
  // Handle truncation for long paths
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    // Show first item, ellipsis dropdown, and last few items
    const firstItem = items[0];
    const lastItems = items.slice(-Math.floor(maxItems / 2));
    const middleItems = items.slice(1, -Math.floor(maxItems / 2));
    
    return [
      firstItem,
      { label: '...', path: '', icon: null },
      ...lastItems,
    ];
  }, [items, maxItems]);

  // Handle click on breadcrumb item
  const handleClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';
          
          return (
            <li 
              key={`${item.path}-${index}`} 
              className="flex items-center"
              aria-current={isLast ? 'page' : undefined}
            >
              {isEllipsis ? (
                <div className="relative group">
                  <button className="flex items-center px-2 py-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  <div className="absolute z-10 hidden group-hover:block top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                    <ul className="py-1">
                      {items.slice(1, -Math.floor(maxItems / 2)).map((dropdownItem, dropIdx) => (
                        <li key={`dropdown-${dropIdx}`}>
                          <a 
                            href={dropdownItem.path} 
                            onClick={(e) => handleClick(dropdownItem.path, e)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                          >
                            {dropdownItem.icon || null}
                            <span className="ml-2">{dropdownItem.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {isLast ? (
                    <span className="text-gray-700 font-medium flex items-center">
                      {item.icon || (index === 0 && <Home className="h-4 w-4 mr-1" />)}
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    <a 
                      href={item.path} 
                      onClick={(e) => handleClick(item.path, e)}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors"
                    >
                      {item.icon || (index === 0 && <Home className="h-4 w-4 mr-1" />)}
                      <span>{item.label}</span>
                    </a>
                  )}
                </>
              )}
              
              {!isLast && (
                <span className="mx-2 text-gray-400 flex items-center" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
