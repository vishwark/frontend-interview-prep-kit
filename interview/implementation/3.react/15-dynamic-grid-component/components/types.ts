// Define the structure for grid items
export interface GridItem {
  id: string | number;
  content: React.ReactNode;
  height?: number; // Optional height for masonry layout
  width?: number; // Optional width for custom sizing
  className?: string;
  metadata?: Record<string, any>; // Additional data for filtering/sorting
}

// Props for the DynamicGrid component
export interface DynamicGridProps {
  items: GridItem[];
  columnCountByBreakpoint?: {
    sm?: number; // Small screens (e.g., mobile)
    md?: number; // Medium screens (e.g., tablet)
    lg?: number; // Large screens (e.g., desktop)
    xl?: number; // Extra large screens
  };
  gap?: number | { x: number; y: number }; // Gap between items
  className?: string;
  itemClassName?: string;
  masonryLayout?: boolean; // Whether to use masonry layout
  animateChanges?: boolean; // Whether to animate changes
  lazyLoadThreshold?: number; // Pixels before viewport to start loading
  renderItem?: (item: GridItem) => React.ReactNode; // Custom item renderer
  onItemClick?: (item: GridItem) => void;
  sortBy?: (a: GridItem, b: GridItem) => number; // Custom sort function
  filterBy?: (item: GridItem) => boolean; // Custom filter function
}

// Props for the GridItemComponent
export interface GridItemComponentProps {
  item: GridItem;
  isVisible: boolean;
  onClick?: (item: GridItem) => void;
  className?: string;
  renderItem?: (item: GridItem) => React.ReactNode;
}
