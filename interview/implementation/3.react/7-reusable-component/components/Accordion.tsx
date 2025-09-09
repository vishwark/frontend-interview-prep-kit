import React, { useState, useRef, useEffect } from 'react';

// Define the types for accordion items and behavior
type AccordionType = 'single' | 'multiple';

interface AccordionItemProps {
  header: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

interface AccordionProps {
  type?: AccordionType;
  defaultIndex?: number | number[];
  children: React.ReactNode;
  className?: string;
}

/**
 * AccordionItem Component
 * 
 * Individual expandable/collapsible section within the Accordion
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  header,
  children,
  isOpen = false,
  onToggle,
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(isOpen ? 'auto' : 0);

  // Update height when isOpen changes
  useEffect(() => {
    if (!contentRef.current) return;
    
    if (isOpen) {
      // Get the scroll height to use for animation
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
      
      // After animation completes, set height to auto
      const timer = setTimeout(() => {
        setHeight('auto');
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // Set fixed height before collapsing for smooth animation
      if (contentRef.current.offsetHeight !== 0) {
        setHeight(contentRef.current.scrollHeight);
        
        // Force a reflow
        contentRef.current.offsetHeight;
        
        // Then set height to 0
        setHeight(0);
      } else {
        setHeight(0);
      }
    }
  }, [isOpen]);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <button
        className={`w-full text-left py-3 px-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${headerClassName}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <span>{header}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        aria-hidden={!isOpen}
      >
        <div className={`py-3 px-4 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Accordion Component
 * 
 * A reusable accordion component with support for:
 * - Expandable/collapsible sections
 * - Support for single or multiple open sections
 * - Custom header and content
 * - Smooth animations
 */
const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  defaultIndex = type === 'single' ? -1 : [],
  children,
  className = '',
}) => {
  // State to track which items are open
  const [openIndexes, setOpenIndexes] = useState<number[]>(() => {
    if (type === 'single') {
      return typeof defaultIndex === 'number' && defaultIndex >= 0 ? [defaultIndex] : [];
    } else {
      return Array.isArray(defaultIndex) ? defaultIndex : [];
    }
  });

  // Toggle function for accordion items
  const handleToggle = (index: number) => {
    if (type === 'single') {
      setOpenIndexes(openIndexes.includes(index) ? [] : [index]);
    } else {
      setOpenIndexes(
        openIndexes.includes(index)
          ? openIndexes.filter(i => i !== index)
          : [...openIndexes, index]
      );
    }
  };

  // Filter and map only AccordionItem children
  const accordionItems = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.type === AccordionItem)
    .map((child, index) => {
      if (!React.isValidElement(child)) return null;
      
      return React.cloneElement(child, {
        isOpen: openIndexes.includes(index),
        onToggle: () => handleToggle(index),
      });
    });

  return (
    <div className={`rounded-lg border border-gray-200 ${className}`} role="tablist">
      {accordionItems}
    </div>
  );
};

export default Accordion;
