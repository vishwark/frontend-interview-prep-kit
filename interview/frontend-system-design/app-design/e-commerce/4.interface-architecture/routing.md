# E-commerce Application Routing Strategy

This document outlines the routing strategy for the e-commerce application, detailing how navigation is structured, how routes are defined, and how deep linking and URL parameters are handled.

## Table of Contents

1. [Introduction](#introduction)
2. [Routing Requirements](#routing-requirements)
3. [Routing Architecture](#routing-architecture)
4. [Route Structure](#route-structure)
5. [Route Parameters](#route-parameters)
6. [Nested Routes](#nested-routes)
7. [Route Guards](#route-guards)
8. [Code Splitting](#code-splitting)
9. [Deep Linking](#deep-linking)
10. [URL Parameters and Query Strings](#url-parameters-and-query-strings)
11. [Route Transitions](#route-transitions)
12. [SEO Considerations](#seo-considerations)
13. [Mobile Routing Considerations](#mobile-routing-considerations)
14. [Testing Routes](#testing-routes)

## Introduction

Routing is a critical aspect of our e-commerce application, as it determines how users navigate through the application and how URLs are structured. Our routing strategy is designed to be intuitive, SEO-friendly, and performant, while providing a good user experience.

We use React Router for client-side routing, which allows us to create a single-page application with multiple views that are rendered based on the current URL. This approach provides a smooth user experience without full page reloads, while still maintaining the ability to bookmark and share URLs.

## Routing Requirements

Our routing strategy addresses the following key requirements:

1. **Intuitive URLs**: URLs should be human-readable and reflect the content they represent
2. **SEO-friendly**: URLs should be optimized for search engines
3. **Deep linking**: Users should be able to share links to specific pages and states
4. **Performance**: Routes should be code-split to minimize initial load time
5. **Authentication**: Some routes should be protected and require authentication
6. **Nested routes**: Complex views should be able to have nested routes
7. **Query parameters**: Routes should support query parameters for filtering and sorting
8. **History management**: The browser's back and forward buttons should work as expected
9. **Route transitions**: Route changes should have smooth transitions
10. **Mobile support**: Routing should work well on mobile devices

## Routing Architecture

Our routing architecture is built on React Router, which provides a declarative way to define routes and navigate between them.

### Router Setup

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import './App.scss';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="app__main">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};
```

### Route Definitions

```tsx
// src/routes/index.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/HomePage';

// Lazy-loaded routes
const ProductListingPage = lazy(() => import('../pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:categoryId" element={<ProductListingPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};
```

### Protected Routes

```tsx
// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  return <>{children}</>;
};
```

## Route Structure

Our application uses a hierarchical route structure that reflects the content hierarchy and user flow:

### Main Routes

- `/`: Home page
- `/products`: Product listing page
- `/products/:categoryId`: Product listing page filtered by category
- `/product/:productId`: Product detail page
- `/cart`: Shopping cart page
- `/checkout`: Checkout page
- `/order-confirmation/:orderId`: Order confirmation page
- `/account/*`: Account pages (nested routes)
- `/login`: Login page
- `/register`: Registration page
- `/404`: Not found page

### Account Routes

- `/account`: Account dashboard
- `/account/orders`: Order history
- `/account/orders/:orderId`: Order details
- `/account/profile`: User profile
- `/account/addresses`: Saved addresses
- `/account/payment-methods`: Saved payment methods
- `/account/wishlist`: Wishlist

### Implementation Example

```tsx
// src/pages/AccountPage/AccountPage.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AccountLayout } from '../../components/templates/AccountLayout';
import { AccountDashboard } from './AccountDashboard';
import { OrderHistory } from './OrderHistory';
import { OrderDetails } from './OrderDetails';
import { UserProfile } from './UserProfile';
import { SavedAddresses } from './SavedAddresses';
import { PaymentMethods } from './PaymentMethods';
import { Wishlist } from './Wishlist';

const AccountPage: React.FC = () => {
  return (
    <AccountLayout>
      <Routes>
        <Route path="/" element={<AccountDashboard />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/addresses" element={<SavedAddresses />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<Navigate to="/account" replace />} />
      </Routes>
    </AccountLayout>
  );
};

export default AccountPage;
```

## Route Parameters

We use route parameters to pass data between routes and to identify specific resources:

### Product ID Parameter

```tsx
// src/pages/ProductDetailPage/ProductDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../store/services/productApi';
import { ProductDetail } from '../../components/organisms/ProductDetail';
import { LoadingSpinner } from '../../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../../components/molecules/ErrorMessage';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId!);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !product) {
    return <ErrorMessage message="Product not found" />;
  }
  
  return <ProductDetail product={product} />;
};

export default ProductDetailPage;
```

### Category ID Parameter

```tsx
// src/pages/ProductListingPage/ProductListingPage.tsx
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../store/services/productApi';
import { ProductGrid } from '../../components/organisms/ProductGrid';
import { ProductFilters } from '../../components/organisms/ProductFilters';
import { LoadingSpinner } from '../../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../../components/molecules/ErrorMessage';

const ProductListingPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [searchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  
  const { data, isLoading, error } = useGetProductsQuery({
    page,
    categoryId,
    sort,
  });
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !data) {
    return <ErrorMessage message="Failed to load products" />;
  }
  
  return (
    <div className="product-listing-page">
      <ProductFilters />
      <ProductGrid products={data.products} />
    </div>
  );
};

export default ProductListingPage;
```

## Nested Routes

We use nested routes for complex views that have multiple sub-views:

### Account Page Nested Routes

```tsx
// src/components/templates/AccountLayout/AccountLayout.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AccountLayout.scss';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  return (
    <div className="account-layout">
      <aside className="account-layout__sidebar">
        <nav className="account-nav">
          <ul className="account-nav__list">
            <li className="account-nav__item">
              <NavLink
                to="/account"
                end
                className={({ isActive }) =>
                  `account-nav__link ${isActive ? 'account-nav__link--active' : ''}`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li className="account-nav__item">
              <NavLink
                to="/account/orders"
                className={({ isActive }) =>
                  `account-nav__link ${isActive ? 'account-nav__link--active' : ''}`
                }
              >
                Orders
              </NavLink>
            </li>
            <li className="account-nav__item">
              <NavLink
                to="/account/profile"
                className={({ isActive }) =>
                  `account-nav__link ${isActive ? 'account-nav__link--active' : ''}`
                }
              >
                Profile
              </NavLink>
            </li>
            <li className="account-nav__item">
              <NavLink
                to="/account/addresses"
                className={({ isActive }) =>
                  `account-nav__link ${isActive ? 'account-nav__link--active' : ''}`
                }
              >
                Addresses
              </NavLink>
            </li>
            <li className="account-nav__item">
              <NavLink
                to="/account/payment-methods"
                className={({ isActive }) =>
                  `account-nav__link ${isActive ? 'account-nav__link--active' : ''}`
                }
              >
                Payment Methods
              </NavLink>
            </li>
            <li className="account-nav__item">
              <NavLink
                to="/account/wishlist"
                className={({ isActive }) =>
                  `account-nav__link ${isActive ? 'account-nav__link--active' : ''}`
                }
              >
                Wishlist
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      
      <div className="account-layout__content">
        {children}
      </div>
    </div>
  );
};
```

## Route Guards

We use route guards to protect routes that require authentication:

### Authentication Guard

```tsx
// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  return <>{children}</>;
};
```

### Checkout Guard

```tsx
// src/routes/CheckoutRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ProtectedRoute } from './ProtectedRoute';

interface CheckoutRouteProps {
  children: React.ReactNode;
}

export const CheckoutRoute: React.FC<CheckoutRouteProps> = ({ children }) => {
  const { items } = useCart();
  
  // Check if cart is empty
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }
  
  // If cart is not empty, use the protected route to check authentication
  return <ProtectedRoute>{children}</ProtectedRoute>;
};
```

## Code Splitting

We use code splitting to improve performance by loading only the code needed for the current route:

### Lazy Loading Routes

```tsx
// src/routes/index.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';

// Eager-loaded routes
import { HomePage } from '../pages/HomePage';

// Lazy-loaded routes
const ProductListingPage = lazy(() => import('../pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Route definitions */}
      </Routes>
    </Suspense>
  );
};
```

## Deep Linking

We support deep linking to allow users to share links to specific pages and states:

### Product Sharing

```tsx
// src/components/molecules/ShareButton/ShareButton.tsx
import React from 'react';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import './ShareButton.scss';

interface ShareButtonProps {
  url: string;
  title: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, title }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(url);
      // Show a toast notification
      // ...
    }
  };
  
  return (
    <Button
      variant="secondary"
      onClick={handleShare}
      className="share-button"
    >
      <Icon name="share" className="share-button__icon" />
      Share
    </Button>
  );
};
```

### Filter State in URL

```tsx
// src/hooks/useFilterParams.ts
import { useSearchParams } from 'react-router-dom';

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = {
    page: parseInt(searchParams.get('page') || '1', 10),
    sort: searchParams.get('sort') || 'relevance',
    minPrice: parseInt(searchParams.get('minPrice') || '0', 10),
    maxPrice: parseInt(searchParams.get('maxPrice') || '1000', 10),
    brands: searchParams.getAll('brand'),
    colors: searchParams.getAll('color'),
    sizes: searchParams.getAll('size'),
  };
  
  const setFilters = (newFilters: Partial<typeof filters>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Update page
    if (newFilters.page !== undefined) {
      if (newFilters.page === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', newFilters.page.toString());
      }
    }
    
    // Update sort
    if (newFilters.sort !== undefined) {
      if (newFilters.sort === 'relevance') {
        newSearchParams.delete('sort');
      } else {
        newSearchParams.set('sort', newFilters.sort);
      }
    }
    
    // Update price range
    if (newFilters.minPrice !== undefined) {
      if (newFilters.minPrice === 0) {
        newSearchParams.delete('minPrice');
      } else {
        newSearchParams.set('minPrice', newFilters.minPrice.toString());
      }
    }
    
    if (newFilters.maxPrice !== undefined) {
      if (newFilters.maxPrice === 1000) {
        newSearchParams.delete('maxPrice');
      } else {
        newSearchParams.set('maxPrice', newFilters.maxPrice.toString());
      }
    }
    
    // Update brands
    if (newFilters.brands !== undefined) {
      newSearchParams.delete('brand');
      newFilters.brands.forEach(brand => {
        newSearchParams.append('brand', brand);
      });
    }
    
    // Update colors
    if (newFilters.colors !== undefined) {
      newSearchParams.delete('color');
      newFilters.colors.forEach(color => {
        newSearchParams.append('color', color);
      });
    }
    
    // Update sizes
    if (newFilters.sizes !== undefined) {
      newSearchParams.delete('size');
      newFilters.sizes.forEach(size => {
        newSearchParams.append('size', size);
      });
    }
    
    setSearchParams(newSearchParams);
  };
  
  return { filters, setFilters };
};
```

## URL Parameters and Query Strings

We use URL parameters and query strings to represent the state of the application:

### Product Listing Filters

```tsx
// src/components/organisms/ProductFilters/ProductFilters.tsx
import React, { useEffect } from 'react';
import { useFilterParams } from '../../../hooks/useFilterParams';
import { Checkbox } from '../../atoms/Checkbox';
import { RangeSlider } from '../../atoms/RangeSlider';
import { Select } from '../../atoms/Select';
import './ProductFilters.scss';

export const ProductFilters: React.FC = () => {
  const { filters, setFilters } = useFilterParams();
  
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ sort: event.target.value, page: 1 });
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    setFilters({ minPrice: range[0], maxPrice: range[1], page: 1 });
  };
  
  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    
    setFilters({ brands: newBrands, page: 1 });
  };
  
  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter(c => c !== color);
    
    setFilters({ colors: newColors, page: 1 });
  };
  
  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...filters.sizes, size]
      : filters.sizes.filter(s => s !== size);
    
    setFilters({ sizes: newSizes, page: 1 });
  };
  
  const handleResetFilters = () => {
    setFilters({
      page: 1,
      sort: 'relevance',
      minPrice: 0,
      maxPrice: 1000,
      brands: [],
      colors: [],
      sizes: [],
    });
  };
  
  return (
    <div className="product-filters">
      <div className="product-filters__section">
        <h3 className="product-filters__heading">Sort By</h3>
        <Select
          value={filters.sort}
          onChange={handleSortChange}
          options={[
            { value: 'relevance', label: 'Relevance' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'rating-desc', label: 'Highest Rated' },
            { value: 'newest', label: 'Newest Arrivals' },
          ]}
        />
      </div>
      
      <div className="product-filters__section">
        <h3 className="product-filters__heading">Price Range</h3>
        <RangeSlider
          min={0}
          max={1000}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={handlePriceRangeChange}
        />
        <div className="product-filters__price-display">
          ${filters.minPrice} - ${filters.maxPrice}
        </div>
      </div>
      
      {/* Brand filters */}
      {/* Color filters */}
      {/* Size filters */}
      
      <button
        className="product-filters__reset"
        onClick={handleResetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};
```

### Pagination

```tsx
// src/components/molecules/Pagination/Pagination.tsx
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Pagination.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const [searchParams] = useSearchParams();
  
  // Create a function to generate the URL for a page
  const getPageUrl = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (page === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', page.toString());
    }
    
    return `?${newSearchParams.toString()}`;
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a subset of pages
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page and 2 pages before and after
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className="pagination" aria-label="Pagination">
      <ul className="pagination__list">
        {/* Previous page button */}
        <li className="pagination__item">
          <Link
            to={getPageUrl(currentPage - 1)}
            className={`pagination__link ${currentPage === 1 ? 'pagination__link--disabled' : ''}`}
            aria-disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </Link>
        </li>
        
        {/* First page button (if not in the current set) */}
        {!pageNumbers.includes(1) && (
          <>
            <li className="pagination__item">
              <Link
                to={getPageUrl(1)}
                className="pagination__link"
                aria-label="Page 1"
              >
                1
              </Link>
            </li>
            <li className="pagination__item pagination__ellipsis">...</li>
          </>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map(page => (
          <li key={page} className="pagination__item">
            <Link
              to={getPageUrl(page)}
              className={`pagination__link ${page === currentPage ? 'pagination__link--active' : ''}`}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Link>
          </li>
        ))}
        
        {/* Last page button (if not in the current set) */}
        {!pageNumbers.includes(totalPages) && (
          <>
            <li className="pagination__item pagination__ellipsis">...</li>
            <li className="pagination__item">
              <Link
                to={getPageUrl(totalPages)}
                className="pagination__link"
                aria-label={`Page ${totalPages}`}
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}
        
        {/* Next page button */}
        <li className="pagination__item">
          <Link
            to={getPageUrl(currentPage + 1)}
            className={`pagination__link ${currentPage === totalPages ? 'pagination__link--disabled' : ''}`}
            aria-disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </Link>
        </li>
      </ul>
    </nav>
  );
};
```

## Route Transitions

We implement smooth transitions between routes to improve the user experience:

### Transition Component

```tsx
// src/components/atoms/PageTransition/PageTransition.tsx
import React from 'react';
import { motion } from 'framer-motion';
import './PageTransition.scss';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="page-transition"
    >
      {children}
    </motion.div>
  );
};
```

### AnimatePresence for Route Transitions

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppRoutes } from './routes';
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import './App.scss';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <AppRoutes key={location.pathname} />
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="app__main">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};
```

## SEO Considerations

We implement SEO best practices to ensure that our routes are search engine friendly:

### Meta Tags

```tsx
// src/components/atoms/SEO/SEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
}) => {
  const siteTitle = 'E-commerce Store';
  const fullTitle = `${title} | ${siteTitle}`;
