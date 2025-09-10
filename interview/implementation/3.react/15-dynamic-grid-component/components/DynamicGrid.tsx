import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DynamicGridProps, GridItem as GridItemType } from './types';
import GridItem from './GridItem';

const DynamicGrid: React.FC<DynamicGridProps> = ({
  items,
  columnCountByBreakpoint = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 16,
  className = '',
  itemClassName = '',
  masonryLayout = false,
  animateChanges = true,
  lazyLoadThreshold = 200,
  renderItem,
  onItemClick,
  sortBy,
  filterBy,
}) => {
  // State
  const [visibleItems, setVisibleItems] = useState<Set<string | number>>(new Set());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const gridRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());

  // Determine column count based on window width
  const columnCount = useMemo(() => {
    if (windowWidth < 640) return columnCountByBreakpoint.sm || 1;
    if (windowWidth < 768) return columnCountByBreakpoint.md || 2;
    if (windowWidth < 1024) return columnCountByBreakpoint.lg || 3;
    return columnCountByBreakpoint.xl || 4;
  }, [windowWidth, columnCountByBreakpoint]);

  // Process items (filter and sort)
  const processedItems = useMemo(() => {
    let result = [...items];
    
    // Apply filter if provided
    if (filterBy) {
      result = result.filter(filterBy);
    }
    
    // Apply sort if provided
    if (sortBy) {
      result.sort(sortBy);
    }
    
    return result;
  }, [items, filterBy, sortBy]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers that don't support IntersectionObserver
      setVisibleItems(new Set(processedItems.map(item => item.id)));
      return;
    }
    
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('data-id');
          if (id) {
            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...Array.from(prev), id]));
            }
          }
        });
      },
      {
        rootMargin: `${lazyLoadThreshold}px`,
        threshold: 0.1,
      }
    );
    
    // Observe all item elements
    itemRefs.current.forEach((element, id) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [processedItems, lazyLoadThreshold]);

  // Calculate gap style
  const gapStyle = useMemo(() => {
    if (typeof gap === 'number') {
      return { gap: `${gap}px` };
    }
    return { 
      columnGap: `${gap.x}px`, 
      rowGap: `${gap.y}px` 
    };
  }, [gap]);

  // Calculate grid template columns
  const gridTemplateColumns = useMemo(() => {
    return `repeat(${columnCount}, minmax(0, 1fr))`;
  }, [columnCount]);

  // Render grid items
  const renderGridItems = () => {
    if (masonryLayout) {
      // For masonry layout, organize items into columns
      const columns: GridItemType[][] = Array.from({ length: columnCount }, () => []);
      
      processedItems.forEach((item, index) => {
        const columnIndex = index % columnCount;
        columns[columnIndex].push(item);
      });
      
      return (
        <div 
          className="grid w-full" 
          style={{ 
            gridTemplateColumns,
            ...gapStyle
          }}
        >
          {columns.map((column, colIndex) => (
            <div key={`column-${colIndex}`} className="flex flex-col" style={gapStyle}>
              {column.map(item => (
                <div
                  key={item.id}
                  ref={el => {
                    if (el) {
                      itemRefs.current.set(item.id, el);
                      el.setAttribute('data-id', String(item.id));
                    }
                  }}
                >
                  <GridItem
                    item={item}
                    isVisible={visibleItems.has(item.id)}
                    onClick={onItemClick}
                    className={itemClassName}
                    renderItem={renderItem}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    } else {
      // For standard grid layout
      return (
        <div 
          className="grid w-full" 
          style={{ 
            gridTemplateColumns,
            ...gapStyle
          }}
        >
          {processedItems.map(item => (
            <div
              key={item.id}
              ref={el => {
                if (el) {
                  itemRefs.current.set(item.id, el);
                  el.setAttribute('data-id', String(item.id));
                }
              }}
            >
              <GridItem
                item={item}
                isVisible={visibleItems.has(item.id)}
                onClick={onItemClick}
                className={itemClassName}
                renderItem={renderItem}
              />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div 
      ref={gridRef}
      className={`dynamic-grid ${className}`}
      role="grid"
      aria-label="Dynamic grid"
    >
      {renderGridItems()}
    </div>
  );
};

export default DynamicGrid;
