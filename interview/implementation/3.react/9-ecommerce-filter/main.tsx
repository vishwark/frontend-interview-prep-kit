import React, { useState } from 'react';
import { 
  products, 
  categories, 
  brands, 
  colors, 
  sizes, 
  defaultFilterState, 
  filterProducts,
  getFilteredProductCount,
  priceRange
} from './components/mockData';
import { FilterState, SortOption, Product } from './components/types';

const EcommerceFilter: React.FC = () => {
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    filterProducts(defaultFilterState)
  );
  const [totalCount, setTotalCount] = useState<number>(
    getFilteredProductCount(defaultFilterState)
  );

  // Update filters
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    const newFilterState = { ...filterState, [key]: value };
    setFilterState(newFilterState);
    setFilteredProducts(filterProducts(newFilterState));
    setTotalCount(getFilteredProductCount(newFilterState));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filterState.categories.includes(categoryId)
      ? filterState.categories.filter(id => id !== categoryId)
      : [...filterState.categories, categoryId];
    updateFilter('categories', newCategories);
  };

  // Handle brand selection
  const handleBrandChange = (brandId: string) => {
    const newBrands = filterState.brands.includes(brandId)
      ? filterState.brands.filter(id => id !== brandId)
      : [...filterState.brands, brandId];
    updateFilter('brands', newBrands);
  };

  // Handle color selection
  const handleColorChange = (colorId: string) => {
    const newColors = filterState.colors.includes(colorId)
      ? filterState.colors.filter(id => id !== colorId)
      : [...filterState.colors, colorId];
    updateFilter('colors', newColors);
  };

  // Handle size selection
  const handleSizeChange = (sizeId: string) => {
    const newSizes = filterState.sizes.includes(sizeId)
      ? filterState.sizes.filter(id => id !== sizeId)
      : [...filterState.sizes, sizeId];
    updateFilter('sizes', newSizes);
  };

  // Handle price range change
  const handlePriceRangeChange = (newRange: [number, number]) => {
    updateFilter('priceRange', newRange);
  };

  // Handle rating change
  const handleRatingChange = (rating: number | null) => {
    updateFilter('rating', rating);
  };

  // Handle in-stock filter change
  const handleInStockChange = (inStock: boolean | null) => {
    updateFilter('inStock', inStock);
  };

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    updateFilter('sort', sort);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    updateFilter('page', page);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterState(defaultFilterState);
    setFilteredProducts(filterProducts(defaultFilterState));
    setTotalCount(getFilteredProductCount(defaultFilterState));
  };

  // Render active filter tags
  const renderFilterTags = () => {
    const tags = [];

    // Category tags
    filterState.categories.forEach(categoryId => {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        tags.push(
          <div key={`category-${categoryId}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
            <span>Category: {category.name}</span>
            <button 
              onClick={() => handleCategoryChange(categoryId)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </div>
        );
      }
    });

    // Brand tags
    filterState.brands.forEach(brandId => {
      const brand = brands.find(b => b.id === brandId);
      if (brand) {
        tags.push(
          <div key={`brand-${brandId}`} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
            <span>Brand: {brand.name}</span>
            <button 
              onClick={() => handleBrandChange(brandId)}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        );
      }
    });

    // Color tags
    filterState.colors.forEach(colorId => {
      const color = colors.find(c => c.id === colorId);
      if (color) {
        tags.push(
          <div key={`color-${colorId}`} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
            <span>Color: {color.name}</span>
            <button 
              onClick={() => handleColorChange(colorId)}
              className="ml-2 text-purple-500 hover:text-purple-700"
            >
              ×
            </button>
          </div>
        );
      }
    });

    // Size tags
    filterState.sizes.forEach(sizeId => {
      const size = sizes.find(s => s.id === sizeId);
      if (size) {
        tags.push(
          <div key={`size-${sizeId}`} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
            <span>Size: {size.name}</span>
            <button 
              onClick={() => handleSizeChange(sizeId)}
              className="ml-2 text-yellow-500 hover:text-yellow-700"
            >
              ×
            </button>
          </div>
        );
      }
    });

    // Price range tag
    if (
      filterState.priceRange[0] !== priceRange[0] ||
      filterState.priceRange[1] !== priceRange[1]
    ) {
      tags.push(
        <div key="price-range" className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
          <span>Price: ${filterState.priceRange[0]} - ${filterState.priceRange[1]}</span>
          <button 
            onClick={() => handlePriceRangeChange(priceRange)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      );
    }

    // Rating tag
    if (filterState.rating !== null) {
      tags.push(
        <div key="rating" className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
          <span>Rating: {filterState.rating}+ stars</span>
          <button 
            onClick={() => handleRatingChange(null)}
            className="ml-2 text-orange-500 hover:text-orange-700"
          >
            ×
          </button>
        </div>
      );
    }

    // In-stock tag
    if (filterState.inStock !== null) {
      tags.push(
        <div key="in-stock" className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
          <span>{filterState.inStock ? 'In Stock Only' : 'Include Out of Stock'}</span>
          <button 
            onClick={() => handleInStockChange(null)}
            className="ml-2 text-teal-500 hover:text-teal-700"
          >
            ×
          </button>
        </div>
      );
    }

    return tags;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">E-commerce Filter System</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button 
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={filterState.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filterState.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), filterState.priceRange[1]])}
                  className="w-20 p-1 border rounded text-sm"
                  min={priceRange[0]}
                  max={filterState.priceRange[1]}
                />
                <span>to</span>
                <input
                  type="number"
                  value={filterState.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange([filterState.priceRange[0], parseInt(e.target.value)])}
                  className="w-20 p-1 border rounded text-sm"
                  min={filterState.priceRange[0]}
                  max={priceRange[1]}
                />
              </div>
            </div>
            
            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Brands</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <div key={brand.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`brand-${brand.id}`}
                      checked={filterState.brands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`brand-${brand.id}`} className="text-sm">
                      {brand.name} ({brand.count})
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rating */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      id={`rating-${rating}`}
                      checked={filterState.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      name="rating"
                      className="mr-2"
                    />
                    <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                      {rating}+ stars
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-any"
                    checked={filterState.rating === null}
                    onChange={() => handleRatingChange(null)}
                    name="rating"
                    className="mr-2"
                  />
                  <label htmlFor="rating-any" className="text-sm">Any rating</label>
                </div>
              </div>
            </div>
            
            {/* Colors */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      filterState.colors.includes(color.id)
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            {/* Sizes */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeChange(size.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                      filterState.sizes.includes(size.id)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Availability */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Availability</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="in-stock"
                    checked={filterState.inStock === true}
                    onChange={() => handleInStockChange(true)}
                    name="availability"
                    className="mr-2"
                  />
                  <label htmlFor="in-stock" className="text-sm">In stock only</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-items"
                    checked={filterState.inStock === null}
                    onChange={() => handleInStockChange(null)}
                    name="availability"
                    className="mr-2"
                  />
                  <label htmlFor="all-items" className="text-sm">All items</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products area */}
        <div className="w-full lg:w-3/4">
          {/* Sort and filter tags */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="mb-2 sm:mb-0">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <select
                  value={filterState.sort}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="p-2 border rounded"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {totalCount} products
              </div>
            </div>
            
            {/* Active filter tags */}
            <div className="flex flex-wrap">
              {renderFilterTags()}
              {renderFilterTags().length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Sale
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalCount > filterState.perPage && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                {Array.from(
                  { length: Math.ceil(totalCount / filterState.perPage) },
                  (_, i) => i + 1
                ).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      filterState.page === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcommerceFilter;
