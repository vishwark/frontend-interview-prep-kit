import React, { useState, useEffect, useRef } from 'react';
import { GridItemComponentProps } from './types';

const GridItem: React.FC<GridItemComponentProps> = ({
  item,
  isVisible,
  onClick,
  className = '',
  renderItem,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Handle item visibility (lazy loading)
  useEffect(() => {
    if (isVisible && !isLoaded) {
      setIsLoaded(true);
      setIsAnimating(true);
      
      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match this with CSS animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

  // Handle item click
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  // Custom rendering or default rendering
  const renderContent = () => {
    if (renderItem) {
      return renderItem(item);
    }
    
    return (
      <div className="w-full h-full">
        {item.content}
      </div>
    );
  };

  return (
    <div
      ref={itemRef}
      className={`
        grid-item
        ${isLoaded ? 'opacity-100' : 'opacity-0'} 
        ${isAnimating ? 'animate-fade-in' : ''}
        transition-opacity duration-300 ease-in-out
        ${className}
        ${item.className || ''}
      `}
      style={{
        height: item.height ? `${item.height}px` : 'auto',
        width: item.width ? `${item.width}px` : '100%',
      }}
      onClick={handleClick}
      role="gridcell"
      tabIndex={0}
      aria-label={`Grid item ${item.id}`}
    >
      {isLoaded && renderContent()}
    </div>
  );
};

export default GridItem;
