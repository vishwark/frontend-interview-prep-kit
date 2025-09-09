import React, { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';

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

/**
 * ProductListingPage Component
 * 
 * Main component that:
 * - Fetches product data from an API
 * - Implements client-side pagination
 * - Manages state for current page and items per page
 * - Handles loading and error states
 * - Renders the ProductGrid and Pagination components
 */
const ProductListingPage: React.FC = () => {
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Using the Fake Store API for demo purposes
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map the API response to our Product interface
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.title,
          price: item.price,
          description: item.description,
          image: item.image,
          rating: item.rating
        }));
        
        setProducts(mappedProducts);
      } catch (err) {
        setError(`Failed to fetch products: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Calculate pagination values
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    // Scroll to top when changing pages for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    // Reset to first page when changing items per page
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Product Listing</h1>
      <p className="text-gray-600 mb-8">Browse our collection of products</p>
      
      {/* Product Grid */}
      <ProductGrid
        products={getCurrentPageProducts()}
        isLoading={isLoading}
        error={error}
      />
      
      {/* Pagination - only show if we have products and no errors */}
      {!isLoading && !error && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default ProductListingPage;
