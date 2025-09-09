import React from 'react';

// Define the types for card variants
type CardVariant = 'bordered' | 'shadowed' | 'flat' | 'elevated';

// Define the props interfaces for Card and its subcomponents
interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface CardMediaProps {
  className?: string;
  src: string;
  alt?: string;
  type?: 'image' | 'video';
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

/**
 * Card Component
 * 
 * A reusable card component with support for:
 * - Header, body, and footer sections
 * - Media content (images, videos)
 * - Hover effects and animations
 * - Different variants (bordered, shadowed, etc.)
 */
const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Media: React.FC<CardMediaProps>;
} = ({
  variant = 'shadowed',
  className = '',
  children,
  hoverEffect = false,
  onClick,
}) => {
  // Base styles for the card
  const baseStyles = 'bg-white rounded-lg overflow-hidden transition-all duration-300';
  
  // Variant styles
  const variantStyles = {
    bordered: 'border border-gray-200',
    shadowed: 'shadow-md',
    flat: 'border border-gray-100',
    elevated: 'shadow-lg',
  };
  
  // Hover effect styles
  const hoverStyles = hoverEffect 
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
    : '';

  // Combine all styles
  const cardStyles = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

  return (
    <div 
      className={cardStyles} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

/**
 * Card.Header Component
 * 
 * Header section of the Card component
 */
const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children }) => {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 font-medium ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card.Body Component
 * 
 * Body section of the Card component
 */
const CardBody: React.FC<CardBodyProps> = ({ className = '', children }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card.Footer Component
 * 
 * Footer section of the Card component
 */
const CardFooter: React.FC<CardFooterProps> = ({ className = '', children }) => {
  return (
    <div className={`px-4 py-3 border-t border-gray-100 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card.Media Component
 * 
 * Media section of the Card component for images and videos
 */
const CardMedia: React.FC<CardMediaProps> = ({ 
  className = '', 
  src, 
  alt = '', 
  type = 'image',
  aspectRatio = 'auto'
}) => {
  // Aspect ratio styles
  const aspectRatioStyles = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    '1:1': 'aspect-square',
    'auto': '',
  };

  // Base media styles
  const mediaStyles = `w-full ${aspectRatioStyles[aspectRatio]} ${className}`;

  return type === 'image' ? (
    <img 
      src={src} 
      alt={alt} 
      className={`object-cover ${mediaStyles}`}
      loading="lazy"
    />
  ) : (
    <video 
      src={src} 
      className={mediaStyles}
      controls
    />
  );
};

// Assign subcomponents to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Media = CardMedia;

export default Card;
