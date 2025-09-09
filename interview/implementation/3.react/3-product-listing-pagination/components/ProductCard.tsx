import React from 'react';

// Define the Product interface
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard Component
 * 
 * Displays a single product with:
 * - Product image
 * - Product name
 * - Price
 * - Short description
 * - Rating (if available)
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Function to render star ratings
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-400">★</span>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">★</span>
      );
    }

    // Add empty stars to make 5 stars total
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      {/* Product Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain p-4"
          loading="lazy" // For better performance
        />
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center">
              <div className="flex mr-1">
                {renderRating(product.rating.rate)}
              </div>
              <span className="text-xs text-gray-500">
                ({product.rating.count})
              </span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3" title={product.description}>
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
