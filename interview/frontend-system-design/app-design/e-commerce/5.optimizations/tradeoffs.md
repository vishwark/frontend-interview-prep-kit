# E-commerce Application Tradeoffs

This document outlines the key tradeoffs made in the design and implementation of our e-commerce application, explaining the reasoning behind our decisions and the implications for the application's performance, user experience, maintainability, and scalability.

## Table of Contents

1. [Introduction](#introduction)
2. [Rendering Strategy Tradeoffs](#rendering-strategy-tradeoffs)
   - [Client-Side Rendering vs. Server-Side Rendering](#client-side-rendering-vs-server-side-rendering)
   - [Static Site Generation vs. Dynamic Rendering](#static-site-generation-vs-dynamic-rendering)
   - [Hybrid Approaches](#hybrid-approaches)
3. [Performance Tradeoffs](#performance-tradeoffs)
   - [Bundle Size vs. Feature Richness](#bundle-size-vs-feature-richness)
   - [Image Quality vs. Loading Speed](#image-quality-vs-loading-speed)
   - [Caching vs. Fresh Content](#caching-vs-fresh-content)
4. [User Experience Tradeoffs](#user-experience-tradeoffs)
   - [Simplicity vs. Functionality](#simplicity-vs-functionality)
   - [Aesthetics vs. Performance](#aesthetics-vs-performance)
   - [Personalization vs. Privacy](#personalization-vs-privacy)
5. [Architecture Tradeoffs](#architecture-tradeoffs)
   - [Monolithic vs. Microservices](#monolithic-vs-microservices)
   - [Tightly Coupled vs. Loosely Coupled](#tightly-coupled-vs-loosely-coupled)
   - [Custom Solutions vs. Third-Party Services](#custom-solutions-vs-third-party-services)
6. [State Management Tradeoffs](#state-management-tradeoffs)
   - [Centralized vs. Component-Level State](#centralized-vs-component-level-state)
   - [Client State vs. Server State](#client-state-vs-server-state)
   - [Normalized vs. Denormalized Data](#normalized-vs-denormalized-data)
7. [Security Tradeoffs](#security-tradeoffs)
   - [Security vs. Convenience](#security-vs-convenience)
   - [Privacy vs. Personalization](#privacy-vs-personalization)
8. [Development Tradeoffs](#development-tradeoffs)
   - [Development Speed vs. Code Quality](#development-speed-vs-code-quality)
   - [Flexibility vs. Standardization](#flexibility-vs-standardization)
   - [Innovation vs. Stability](#innovation-vs-stability)
9. [Conclusion](#conclusion)

## Introduction

Building a modern e-commerce application involves making numerous tradeoffs that balance competing concerns such as performance, user experience, maintainability, and development speed. This document explains the key tradeoffs we've made in our e-commerce application and the reasoning behind these decisions.

## Rendering Strategy Tradeoffs

### Client-Side Rendering vs. Server-Side Rendering

**Decision:** We've implemented a hybrid approach, using Server-Side Rendering (SSR) for critical pages and Client-Side Rendering (CSR) for interactive features.

**Tradeoff Analysis:**

| Client-Side Rendering | Server-Side Rendering |
|------------------------|------------------------|
| ✅ Rich interactivity | ✅ Better SEO |
| ✅ Reduced server load | ✅ Faster initial page load |
| ✅ Smoother transitions | ✅ Better performance on low-end devices |
| ❌ Slower initial load | ❌ Increased server load |
| ❌ SEO challenges | ❌ Less interactive without hydration |
| ❌ Performance issues on low-end devices | ❌ More complex development |

**Implementation:**

```tsx
// pages/product/[id].tsx (Next.js example)
import { GetServerSideProps } from 'next';
import { ProductDetail } from '../../components/organisms/ProductDetail';
import { fetchProduct, fetchRelatedProducts } from '../../services/productService';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  
  try {
    // SSR for critical product data
    const product = await fetchProduct(id);
    
    return {
      props: {
        product,
        initialLoadComplete: true,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const ProductPage = ({ product, initialLoadComplete }) => {
  // Client-side fetching for non-critical data
  const { data: relatedProducts, isLoading } = useQuery(
    ['relatedProducts', product.id],
    () => fetchRelatedProducts(product.id),
    {
      enabled: initialLoadComplete,
    }
  );
  
  return (
    <div className="product-page">
      <ProductDetail product={product} />
      
      <div className="related-products">
        <h2>Related Products</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ProductGrid products={relatedProducts} />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
```

**Reasoning:**
- We use SSR for product detail pages, category pages, and the homepage to optimize for SEO and initial load performance.
- We use CSR for interactive features like the shopping cart, user account management, and product filtering to provide a smooth user experience.
- This hybrid approach gives us the best of both worlds: good SEO and initial load performance, combined with rich interactivity where needed.

### Static Site Generation vs. Dynamic Rendering

**Decision:** We use Static Site Generation (SSG) for stable content and dynamic rendering for frequently changing content.

**Tradeoff Analysis:**

| Static Site Generation | Dynamic Rendering |
|------------------------|-------------------|
| ✅ Extremely fast page loads | ✅ Always up-to-date content |
| ✅ Reduced server load | ✅ Personalized content |
| ✅ Better reliability | ✅ Dynamic features |
| ❌ Content can become stale | ❌ Slower page loads |
| ❌ Build time increases with content | ❌ Higher server load |
| ❌ Limited personalization | ❌ More complex caching |

**Implementation:**

```tsx
// pages/category/[slug].tsx (Next.js example)
import { GetStaticProps, GetStaticPaths } from 'next';
import { CategoryPage } from '../../components/templates/CategoryPage';
import { fetchCategories, fetchCategoryBySlug } from '../../services/categoryService';

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate static pages for top categories
  const categories = await fetchCategories();
  const topCategories = categories.filter(category => category.isTopLevel);
  
  return {
    paths: topCategories.map(category => ({
      params: { slug: category.slug },
    })),
    fallback: 'blocking', // Generate other pages on demand
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string };
  
  try {
    const category = await fetchCategoryBySlug(slug);
    
    return {
      props: {
        category,
        products: category.featuredProducts,
      },
      revalidate: 3600, // Revalidate once per hour
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const Category = ({ category, products }) => {
  return <CategoryPage category={category} initialProducts={products} />;
};

export default Category;
```

**Reasoning:**
- We use SSG with Incremental Static Regeneration (ISR) for category pages, blog posts, and static content to maximize performance.
- We use dynamic rendering for product detail pages with real-time inventory and pricing, search results, and personalized recommendations.
- This approach balances performance with content freshness, ensuring fast page loads while keeping critical information up-to-date.

### Hybrid Approaches

**Decision:** We implement Incremental Static Regeneration (ISR) for semi-dynamic content and client-side data fetching for real-time updates.

**Implementation:**

```tsx
// pages/blog/[slug].tsx (Next.js example)
import { GetStaticProps, GetStaticPaths } from 'next';
import { BlogPost } from '../../components/templates/BlogPost';
import { fetchBlogPosts, fetchBlogPostBySlug } from '../../services/blogService';

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate static pages for popular blog posts
  const posts = await fetchBlogPosts({ sort: 'popularity', limit: 20 });
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug },
    })),
    fallback: 'blocking', // Generate other pages on demand
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string };
  
  try {
    const post = await fetchBlogPostBySlug(slug);
    
    return {
      props: {
        post,
      },
      revalidate: 86400, // Revalidate once per day
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const BlogPostPage = ({ post }) => {
  // Client-side fetching for comments
  const { data: comments, isLoading } = useQuery(
    ['comments', post.id],
    () => fetchComments(post.id),
    {
      refetchInterval: 30000, // Refetch comments every 30 seconds
    }
  );
  
  return <BlogPost post={post} comments={comments} commentsLoading={isLoading} />;
};

export default BlogPostPage;
```

**Reasoning:**
- ISR gives us the performance benefits of static generation while ensuring content is periodically refreshed.
- Client-side data fetching for real-time elements like comments, inventory status, and user-specific data ensures the most current information.
- This hybrid approach provides an optimal balance between performance and freshness.

## Performance Tradeoffs

### Bundle Size vs. Feature Richness

**Decision:** We prioritize core features in the initial bundle and lazy-load non-critical features.

**Tradeoff Analysis:**

| Small Bundle Size | Feature Richness |
|-------------------|------------------|
| ✅ Faster initial load | ✅ More functionality |
| ✅ Better performance on low-end devices | ✅ Richer user experience |
| ✅ Lower bandwidth usage | ✅ Competitive advantage |
| ❌ Limited functionality | ❌ Larger bundle size |
| ❌ More complex code splitting | ❌ Slower initial load |
| ❌ Potential for UI jumps | ❌ Higher bandwidth usage |

**Implementation:**

```tsx
// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from './components/atoms/LoadingSpinner';

// Critical components loaded eagerly
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';

// Non-critical components loaded lazily
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));

export const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Critical routes loaded eagerly */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* Non-critical routes loaded lazily */}
          <Route
            path="/checkout/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CheckoutPage />
              </Suspense>
            }
          />
          <Route
            path="/account/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AccountPage />
              </Suspense>
            }
          />
          <Route
            path="/wishlist"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <WishlistPage />
              </Suspense>
            }
          />
          <Route
            path="/blog/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BlogPage />
              </Suspense>
            }
          />
          <Route
            path="/support/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SupportPage />
              </Suspense>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
};
```

**Reasoning:**
- We prioritize the critical purchase path (home, product listing, product detail, cart) in the initial bundle.
- We lazy-load non-critical features like account management, wishlist, blog, and support pages.
- This approach ensures fast initial load times while still providing a feature-rich experience.

### Image Quality vs. Loading Speed

**Decision:** We implement responsive images with progressive loading and quality optimization.

**Tradeoff Analysis:**

| High Image Quality | Fast Loading Speed |
|-------------------|-------------------|
| ✅ Better visual experience | ✅ Faster page loads |
| ✅ Higher conversion rates | ✅ Lower bounce rates |
| ✅ Better product representation | ✅ Better performance on slow connections |
| ❌ Larger file sizes | ❌ Lower visual quality |
| ❌ Slower loading | ❌ Potential for pixelation |
| ❌ Higher bandwidth usage | ❌ Less detailed product representation |

**Implementation:**

```tsx
// src/components/molecules/ProductImage/ProductImage.tsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import './ProductImage.scss';

interface ProductImageProps {
  product: {
    id: string;
    name: string;
    images: {
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
    };
  };
  size?: 'thumbnail' | 'small' | 'medium' | 'large';
  lazyLoad?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  size = 'medium',
  lazyLoad = true,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  
  const imageSizes = {
    thumbnail: { width: 100, height: 100 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
  };
  
  const { width, height } = imageSizes[size];
  
  return (
    <div
      ref={lazyLoad ? ref : undefined}
      className={`product-image product-image--${size}`}
      style={{ width, height }}
    >
      {(!lazyLoad || inView) ? (
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={size === 'large' ? product.images.medium : product.images[size]}
          />
          <source
            media="(min-width: 768px)"
            srcSet={product.images[size]}
          />
          <img
            src={product.images[size]}
            alt={product.name}
            width={width}
            height={height}
            loading={lazyLoad ? 'lazy' : 'eager'}
            className="product-image__img"
          />
        </picture>
      ) : (
        <div className="product-image__placeholder" />
      )}
    </div>
  );
};
```

**Reasoning:**
- We use responsive images to serve appropriately sized images based on the device and viewport.
- We implement lazy loading for images below the fold to prioritize critical content.
- We use modern image formats (WebP with JPEG fallback) and appropriate compression to balance quality and file size.
- This approach ensures fast loading while maintaining good visual quality.

### Caching vs. Fresh Content

**Decision:** We implement a tiered caching strategy with different TTLs based on content type.

**Tradeoff Analysis:**

| Aggressive Caching | Always Fresh Content |
|-------------------|----------------------|
| ✅ Faster page loads | ✅ Always up-to-date information |
| ✅ Reduced server load | ✅ Accurate inventory and pricing |
| ✅ Lower bandwidth usage | ✅ Consistent user experience |
| ❌ Potentially stale content | ❌ Higher server load |
| ❌ Cache invalidation complexity | ❌ Slower page loads |
| ❌ Inconsistent user experience | ❌ Higher bandwidth usage |

**Implementation:**

```tsx
// src/services/api.ts
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

// Create cache adapter with different TTLs based on endpoint
const cache = setupCache({
  maxAge: 15 * 60 * 1000, // Default cache TTL: 15 minutes
  exclude: { query: false },
  key: (req) => {
    // Include authentication status in cache key to separate guest/user caches
    const isAuthenticated = !!localStorage.getItem('token');
    return `${req.url}${req.params ? JSON.stringify(req.params) : ''}${isAuthenticated ? '-auth' : '-guest'}`;
  },
  invalidate: async (config, request) => {
    // Invalidate product cache when cart is updated
    if (request.method === 'post' && request.url?.includes('/cart')) {
      const productId = request.data?.productId;
      if (productId) {
        await cache.store.removeItem(`/products/${productId}`);
      }
    }
  },
});

// Create API instance with cache adapter
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  adapter: cache.adapter,
});

// Configure cache TTLs for different endpoints
api.interceptors.request.use((config) => {
  // Static content: 1 day
  if (config.url?.includes('/content/') || config.url?.includes('/blog/')) {
    config.cache = {
      maxAge: 24 * 60 * 60 * 1000,
    };
  }
  
  // Product listings: 1 hour
  else if (config.url?.includes('/products') && !config.url?.includes('/products/')) {
    config.cache = {
      maxAge: 60 * 60 * 1000,
    };
  }
  
  // Product details: 15 minutes
  else if (config.url?.includes('/products/')) {
    config.cache = {
      maxAge: 15 * 60 * 1000,
    };
  }
  
  // User-specific data: No cache
  else if (
    config.url?.includes('/user/') ||
    config.url?.includes('/cart') ||
    config.url?.includes('/checkout') ||
    config.url?.includes('/orders')
  ) {
    config.cache = {
      maxAge: 0,
    };
  }
  
  return config;
});
```

**Reasoning:**
- We cache static content (blog posts, marketing content) for longer periods (1 day).
- We cache semi-static content (product listings, categories) for medium periods (1 hour).
- We cache dynamic content (product details with inventory) for shorter periods (15 minutes).
- We don't cache user-specific data (cart, account, orders) to ensure accuracy.
- This tiered approach balances performance with content freshness based on the volatility of each content type.

## User Experience Tradeoffs

### Simplicity vs. Functionality

**Decision:** We implement a progressive disclosure pattern, showing essential functionality by default and revealing advanced features as needed.

**Tradeoff Analysis:**

| Simplicity | Rich Functionality |
|------------|-------------------|
| ✅ Easier to use | ✅ More powerful |
| ✅ Lower cognitive load | ✅ Supports advanced users |
| ✅ Higher conversion rates | ✅ Competitive advantage |
| ❌ Limited functionality | ❌ Complexity can overwhelm |
| ❌ May frustrate power users | ❌ Steeper learning curve |
| ❌ Less competitive for advanced needs | ❌ Lower conversion rates |

**Implementation:**

```tsx
// src/components/organisms/ProductFilters/ProductFilters.tsx
import React, { useState } from 'react';
import { Accordion } from '../../molecules/Accordion';
import { Checkbox } from '../../atoms/Checkbox';
import { RangeSlider } from '../../molecules/RangeSlider';
import { Button } from '../../atoms/Button';
import './ProductFilters.scss';

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  onFilterChange: (filters: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  brands,
  priceRange,
  onFilterChange,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRange);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  
  // Handle basic filter changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newCategories);
    applyFilters({ categories: newCategories });
  };
  
  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brand]
      : selectedBrands.filter(b => b !== brand);
    
    setSelectedBrands(newBrands);
    applyFilters({ brands: newBrands });
  };
  
  const handlePriceChange = (range: { min: number; max: number }) => {
    setSelectedPriceRange(range);
    applyFilters({ priceRange: range });
  };
  
  // Handle advanced filter changes
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    applyFilters({ rating });
  };
  
  const handleInStockChange = (checked: boolean) => {
    setInStock(checked);
    applyFilters({ inStock: checked });
  };
  
  const handleOnSaleChange = (checked: boolean) => {
    setOnSale(checked);
    applyFilters({ onSale: checked });
  };
  
  // Apply all filters
  const applyFilters = (changedFilters: any) => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: selectedPriceRange,
      rating: selectedRating,
      inStock,
      onSale,
      ...changedFilters,
    });
  };
  
  return (
    <div className="product-filters">
      {/* Basic filters (always visible) */}
      <Accordion title="Categories" defaultOpen>
        <div className="product-filters__group">
          {categories.slice(0, 5).map(category => (
            <Checkbox
              key={category}
              label={category}
              checked={selectedCategories.includes(category)}
              onChange={(e) => handleCategoryChange(category, e.target.checked)}
            />
          ))}
          
          {categories.length > 5 && (
            <Button
              variant="text"
              onClick={() => setShowAdvancedFilters(true)}
              className="product-filters__more-button"
            >
              Show more categories
            </Button>
          )}
        </div>
      </Accordion>
      
      <Accordion title="Price Range" defaultOpen>
        <RangeSlider
          min={priceRange.min}
          max={priceRange.max}
          value={selectedPriceRange}
          onChange={handlePriceChange}
          formatLabel={(value) => `$${value}`}
        />
      </Accordion>
      
      {/* Advanced filters (hidden by default) */}
      {showAdvancedFilters && (
        <>
          <Accordion title="Brands">
            <div className="product-filters__group">
              {brands.map(brand => (
                <Checkbox
                  key={brand}
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                />
              ))}
            </div>
          </Accordion>
          
          <Accordion title="Rating">
            <div className="product-filters__rating">
              {[5, 4, 3, 2, 1].map(rating => (
                <div
                  key={rating}
                  className={`product-filters__rating-option ${
                    selectedRating === rating ? 'product-filters__rating-option--selected' : ''
                  }`}
                  onClick={() => handleRatingChange(rating)}
                >
                  {Array(rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="product-filters__star">★</span>
                    ))}
                  {Array(5 - rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="product-filters__star product-filters__star--empty">☆</span>
                    ))}
                  <span className="product-filters__rating-text">& Up</span>
                </div>
              ))}
            </div>
          </Accordion>
          
          <Accordion title="Availability">
            <div className="product-filters__group">
              <Checkbox
                label="In Stock Only"
                checked={inStock}
                onChange={(e) => handleInStockChange(e.target.checked)}
              />
              <Checkbox
                label="On Sale"
                checked={onSale}
                onChange={(e) => handleOnSaleChange(e.target.checked)}
              />
            </div>
          </Accordion>
        </>
      )}
      
      {!showAdvancedFilters && (
        <Button
          variant="secondary"
          onClick={() => setShowAdvancedFilters(true)}
          className="product-filters__advanced-button"
        >
          Show Advanced Filters
        </Button>
      )}
    </div>
  );
};
```

**Reasoning:**
- We show essential filters (categories, price range) by default to avoid overwhelming users.
- We provide access to advanced filters (brands, ratings, availability) through progressive disclosure.
- This approach balances simplicity for casual users with power for advanced users.

### Aesthetics vs. Performance

**Decision:** We prioritize performance while maintaining good aesthetics through optimized assets and selective use of visual effects.

**Tradeoff Analysis:**

| Rich Aesthetics | High Performance |
|-----------------|------------------|
| ✅ Visually appealing | ✅ Faster page loads |
| ✅ Better brand perception | ✅ Lower bounce rates |
| ✅ Higher engagement | ✅ Better SEO |
| ❌ Larger assets | ❌ Simpler visuals |
| ❌ Slower loading | ❌ Less visual impact |
| ❌ Higher resource usage | ❌ Potential brand impact |

**Implementation:**

```scss
// src/styles/components/_button.scss
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  text-align: center;
  transition: 
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.1s ease;
  cursor: pointer;
  
  // Use transform for hover effect instead of box-shadow
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  // Use solid colors instead of gradients
  &--primary {
    background-color: var(--color-primary);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-dark);
    }
  }
  
  &--secondary {
    background-color: var(--color-secondary);
    color: white;
    
    &:hover {
      background-color: var(--color-secondary-dark);
    }
  }
  
  // Use border instead of box-shadow for outline style
  &--outline {
    background-color: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    
    &:hover {
      background-color: var(--color-primary-light);
    }
  }
  
  // Use CSS variables for theming
  &--success {
    background-color: var(--color-success);
    color: white;
    
    &:hover {
      background-color: var(--color-success-dark);
    }
  }
  
  // Use ::before for loading spinner instead of additional elements
  &--loading {
    color: transparent;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1rem;
      height: 1rem;
      margin: -0.5rem 0 0 -0.5rem;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-top-color: transparent;
      animation: button-spinner 0.8s linear infinite;
    }
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
  
  // Use CSS for icon alignment instead of additional wrapper elements
  &__icon {
    display: inline-flex;
    margin-right: 0.5rem;
    
    &--right {
      margin
