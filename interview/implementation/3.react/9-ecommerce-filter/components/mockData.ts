import { Category, Brand, Color, Size, Product, DefaultFilterState, SortOption } from './types';

/**
 * Mock data for the E-commerce Filter System
 */

// Categories with hierarchical structure
export const categories: Category[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    children: [
      {
        id: 'mens',
        name: "Men's Clothing",
        parentId: 'clothing',
        children: [
          { id: 'mens-shirts', name: 'Shirts', parentId: 'mens' },
          { id: 'mens-pants', name: 'Pants', parentId: 'mens' },
          { id: 'mens-jackets', name: 'Jackets', parentId: 'mens' },
        ],
      },
      {
        id: 'womens',
        name: "Women's Clothing",
        parentId: 'clothing',
        children: [
          { id: 'womens-dresses', name: 'Dresses', parentId: 'womens' },
          { id: 'womens-tops', name: 'Tops', parentId: 'womens' },
          { id: 'womens-pants', name: 'Pants', parentId: 'womens' },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    children: [
      { id: 'bags', name: 'Bags', parentId: 'accessories' },
      { id: 'jewelry', name: 'Jewelry', parentId: 'accessories' },
      { id: 'watches', name: 'Watches', parentId: 'accessories' },
    ],
  },
  {
    id: 'footwear',
    name: 'Footwear',
    children: [
      { id: 'mens-shoes', name: "Men's Shoes", parentId: 'footwear' },
      { id: 'womens-shoes', name: "Women's Shoes", parentId: 'footwear' },
    ],
  },
];

// Brands
export const brands: Brand[] = [
  { id: 'nike', name: 'Nike', count: 12 },
  { id: 'adidas', name: 'Adidas', count: 10 },
  { id: 'puma', name: 'Puma', count: 8 },
  { id: 'reebok', name: 'Reebok', count: 6 },
  { id: 'levis', name: "Levi's", count: 15 },
  { id: 'gap', name: 'GAP', count: 9 },
  { id: 'zara', name: 'Zara', count: 14 },
  { id: 'hm', name: 'H&M', count: 11 },
];

// Colors
export const colors: Color[] = [
  { id: 'black', name: 'Black', hex: '#000000', count: 20 },
  { id: 'white', name: 'White', hex: '#FFFFFF', count: 18 },
  { id: 'red', name: 'Red', hex: '#FF0000', count: 12 },
  { id: 'blue', name: 'Blue', hex: '#0000FF', count: 15 },
  { id: 'green', name: 'Green', hex: '#00FF00', count: 8 },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00', count: 6 },
  { id: 'purple', name: 'Purple', hex: '#800080', count: 5 },
  { id: 'gray', name: 'Gray', hex: '#808080', count: 10 },
];

// Sizes
export const sizes: Size[] = [
  { id: 'xs', name: 'XS', count: 10 },
  { id: 's', name: 'S', count: 15 },
  { id: 'm', name: 'M', count: 20 },
  { id: 'l', name: 'L', count: 18 },
  { id: 'xl', name: 'XL', count: 12 },
  { id: 'xxl', name: 'XXL', count: 8 },
];

// Products
export const products: Product[] = [
  {
    id: 'p1',
    name: 'Classic T-Shirt',
    description: 'A comfortable cotton t-shirt for everyday wear.',
    price: 19.99,
    rating: 4.5,
    reviewCount: 120,
    categoryId: 'mens-shirts',
    brandId: 'nike',
    colors: ['black', 'white', 'blue'],
    sizes: ['s', 'm', 'l', 'xl'],
    imageUrl: 'https://example.com/images/classic-tshirt.jpg',
    inStock: true,
    dateAdded: '2023-01-15T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch fabric for comfort.',
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.2,
    reviewCount: 85,
    categoryId: 'mens-pants',
    brandId: 'levis',
    colors: ['blue'],
    sizes: ['s', 'm', 'l', 'xl', 'xxl'],
    imageUrl: 'https://example.com/images/slim-fit-jeans.jpg',
    inStock: true,
    dateAdded: '2023-02-10T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Summer Dress',
    description: 'Light and flowy summer dress with floral pattern.',
    price: 39.99,
    rating: 4.7,
    reviewCount: 65,
    categoryId: 'womens-dresses',
    brandId: 'zara',
    colors: ['red', 'blue', 'yellow'],
    sizes: ['xs', 's', 'm', 'l'],
    imageUrl: 'https://example.com/images/summer-dress.jpg',
    inStock: true,
    dateAdded: '2023-03-05T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned soles.',
    price: 89.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 210,
    categoryId: 'mens-shoes',
    brandId: 'adidas',
    colors: ['black', 'white', 'red'],
    sizes: ['m', 'l', 'xl'],
    imageUrl: 'https://example.com/images/running-shoes.jpg',
    inStock: true,
    dateAdded: '2023-01-20T00:00:00Z',
  },
  {
    id: 'p5',
    name: 'Leather Handbag',
    description: 'Elegant leather handbag with multiple compartments.',
    price: 129.99,
    rating: 4.6,
    reviewCount: 45,
    categoryId: 'bags',
    brandId: 'zara',
    colors: ['black', 'brown'],
    sizes: [],
    imageUrl: 'https://example.com/images/leather-handbag.jpg',
    inStock: false,
    dateAdded: '2023-04-12T00:00:00Z',
  },
  {
    id: 'p6',
    name: 'Winter Jacket',
    description: 'Warm winter jacket with water-resistant outer shell.',
    price: 149.99,
    originalPrice: 179.99,
    rating: 4.4,
    reviewCount: 78,
    categoryId: 'mens-jackets',
    brandId: 'nike',
    colors: ['black', 'blue', 'green'],
    sizes: ['m', 'l', 'xl', 'xxl'],
    imageUrl: 'https://example.com/images/winter-jacket.jpg',
    inStock: true,
    dateAdded: '2023-05-18T00:00:00Z',
  },
  {
    id: 'p7',
    name: 'Casual Blouse',
    description: 'Lightweight blouse perfect for casual or office wear.',
    price: 34.99,
    rating: 4.1,
    reviewCount: 52,
    categoryId: 'womens-tops',
    brandId: 'hm',
    colors: ['white', 'blue', 'purple'],
    sizes: ['xs', 's', 'm', 'l'],
    imageUrl: 'https://example.com/images/casual-blouse.jpg',
    inStock: true,
    dateAdded: '2023-02-28T00:00:00Z',
  },
  {
    id: 'p8',
    name: 'Analog Watch',
    description: 'Classic analog watch with leather strap.',
    price: 79.99,
    rating: 4.3,
    reviewCount: 30,
    categoryId: 'watches',
    brandId: 'reebok',
    colors: ['black', 'brown'],
    sizes: [],
    imageUrl: 'https://example.com/images/analog-watch.jpg',
    inStock: true,
    dateAdded: '2023-03-22T00:00:00Z',
  },
  {
    id: 'p9',
    name: 'High Heels',
    description: 'Elegant high heels for special occasions.',
    price: 69.99,
    rating: 4.0,
    reviewCount: 40,
    categoryId: 'womens-shoes',
    brandId: 'zara',
    colors: ['black', 'red'],
    sizes: ['s', 'm', 'l'],
    imageUrl: 'https://example.com/images/high-heels.jpg',
    inStock: false,
    dateAdded: '2023-04-05T00:00:00Z',
  },
  {
    id: 'p10',
    name: 'Cargo Pants',
    description: 'Durable cargo pants with multiple pockets.',
    price: 54.99,
    originalPrice: 64.99,
    rating: 4.2,
    reviewCount: 65,
    categoryId: 'mens-pants',
    brandId: 'gap',
    colors: ['green', 'gray', 'black'],
    sizes: ['m', 'l', 'xl', 'xxl'],
    imageUrl: 'https://example.com/images/cargo-pants.jpg',
    inStock: true,
    dateAdded: '2023-05-10T00:00:00Z',
  },
  {
    id: 'p11',
    name: 'Silver Necklace',
    description: 'Elegant silver necklace with pendant.',
    price: 49.99,
    rating: 4.7,
    reviewCount: 28,
    categoryId: 'jewelry',
    brandId: 'zara',
    colors: ['white'],
    sizes: [],
    imageUrl: 'https://example.com/images/silver-necklace.jpg',
    inStock: true,
    dateAdded: '2023-06-15T00:00:00Z',
  },
  {
    id: 'p12',
    name: 'Sports Bra',
    description: 'High-impact sports bra for intense workouts.',
    price: 29.99,
    rating: 4.5,
    reviewCount: 95,
    categoryId: 'womens-tops',
    brandId: 'nike',
    colors: ['black', 'white', 'purple'],
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    imageUrl: 'https://example.com/images/sports-bra.jpg',
    inStock: true,
    dateAdded: '2023-01-30T00:00:00Z',
  },
];

// Get all categories flattened (for easier lookup)
export const flattenedCategories: Category[] = (() => {
  const result: Category[] = [];
  
  const flatten = (categories: Category[]) => {
    for (const category of categories) {
      result.push(category);
      if (category.children) {
        flatten(category.children);
      }
    }
  };
  
  flatten(categories);
  return result;
})();

// Get price range
export const priceRange: [number, number] = (() => {
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  
  for (const product of products) {
    min = Math.min(min, product.price);
    max = Math.max(max, product.price);
  }
  
  return [Math.floor(min), Math.ceil(max)];
})();

// Default filter state
export const defaultFilterState: DefaultFilterState = {
  categories: [],
  priceRange,
  brands: [],
  rating: null,
  colors: [],
  sizes: [],
  inStock: null,
  sort: 'popularity' as const,
  page: 1,
  perPage: 12,
};

// Filter products based on filter state
export const filterProducts = (filterState: DefaultFilterState): Product[] => {
  return products.filter((product) => {
    // Filter by category
    if (filterState.categories.length > 0) {
      // Get all child categories of selected categories
      const selectedCategoryIds = new Set(filterState.categories);
      let matchesCategory = selectedCategoryIds.has(product.categoryId);
      
      if (!matchesCategory) {
        // Check if product's category is a child of any selected category
        const productCategory = flattenedCategories.find(c => c.id === product.categoryId);
        if (productCategory?.parentId) {
          let parentId = productCategory.parentId || undefined;
          while (parentId) {
            if (selectedCategoryIds.has(parentId)) {
              matchesCategory = true;
              break;
            }
            const parentCategory = flattenedCategories.find(c => c.id === parentId);
            parentId = parentCategory?.parentId;
          }
        }
      }
      
      if (!matchesCategory) {
        return false;
      }
    }
    
    // Filter by price range
    if (product.price < filterState.priceRange[0] || product.price > filterState.priceRange[1]) {
      return false;
    }
    
    // Filter by brand
    if (filterState.brands.length > 0 && !filterState.brands.includes(product.brandId)) {
      return false;
    }
    
    // Filter by rating
    if (filterState.rating !== null && product.rating < filterState.rating) {
      return false;
    }
    
    // Filter by color
    if (filterState.colors.length > 0) {
      const hasMatchingColor = product.colors.some(color => filterState.colors.includes(color));
      if (!hasMatchingColor) {
        return false;
      }
    }
    
    // Filter by size
    if (filterState.sizes.length > 0) {
      const hasMatchingSize = product.sizes.some(size => filterState.sizes.includes(size));
      if (!hasMatchingSize) {
        return false;
      }
    }
    
    // Filter by availability
    if (filterState.inStock !== null && product.inStock !== filterState.inStock) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort products
    switch (filterState.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'popularity':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  }).slice(
    (filterState.page - 1) * filterState.perPage,
    filterState.page * filterState.perPage
  );
};

// Get total count of filtered products
export const getFilteredProductCount = (filterState: DefaultFilterState): number => {
  // Same as filterProducts but without pagination
  return products.filter((product) => {
    // Filter by category
    if (filterState.categories.length > 0) {
      // Get all child categories of selected categories
      const selectedCategoryIds = new Set(filterState.categories);
      let matchesCategory = selectedCategoryIds.has(product.categoryId);
      
      if (!matchesCategory) {
        // Check if product's category is a child of any selected category
        const productCategory = flattenedCategories.find(c => c.id === product.categoryId);
        if (productCategory?.parentId) {
          let parentId = productCategory.parentId || undefined;
          while (parentId) {
            if (selectedCategoryIds.has(parentId)) {
              matchesCategory = true;
              break;
            }
            const parentCategory = flattenedCategories.find(c => c.id === parentId);
            parentId = parentCategory?.parentId;
          }
        }
      }
      
      if (!matchesCategory) {
        return false;
      }
    }
    
    // Filter by price range
    if (product.price < filterState.priceRange[0] || product.price > filterState.priceRange[1]) {
      return false;
    }
    
    // Filter by brand
    if (filterState.brands.length > 0 && !filterState.brands.includes(product.brandId)) {
      return false;
    }
    
    // Filter by rating
    if (filterState.rating !== null && product.rating < filterState.rating) {
      return false;
    }
    
    // Filter by color
    if (filterState.colors.length > 0) {
      const hasMatchingColor = product.colors.some(color => filterState.colors.includes(color));
      if (!hasMatchingColor) {
        return false;
      }
    }
    
    // Filter by size
    if (filterState.sizes.length > 0) {
      const hasMatchingSize = product.sizes.some(size => filterState.sizes.includes(size));
      if (!hasMatchingSize) {
        return false;
      }
    }
    
    // Filter by availability
    if (filterState.inStock !== null && product.inStock !== filterState.inStock) {
      return false;
    }
    
    return true;
  }).length;
};
