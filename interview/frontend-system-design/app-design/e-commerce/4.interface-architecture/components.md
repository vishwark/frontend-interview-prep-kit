# E-commerce Application Component Hierarchy

This document outlines the component hierarchy for the e-commerce application, detailing the structure and organization of UI components.

## Table of Contents

1. [Introduction](#introduction)
2. [Component Design Principles](#component-design-principles)
3. [Component Organization](#component-organization)
4. [Core Components](#core-components)
5. [Layout Components](#layout-components)
6. [Page Components](#page-components)
7. [Feature Components](#feature-components)
8. [Component Communication](#component-communication)
9. [Component Reusability](#component-reusability)
10. [Component Documentation](#component-documentation)
11. [Component Testing](#component-testing)

## Introduction

Our e-commerce application follows a component-based architecture, where the UI is broken down into reusable, self-contained components. This approach promotes code reusability, maintainability, and a consistent user experience across the application.

The component hierarchy is organized following the Atomic Design methodology, which categorizes components into atoms, molecules, organisms, templates, and pages. This structure helps us manage complexity and ensures that components are properly encapsulated and reusable.

## Component Design Principles

Our component design follows these key principles:

1. **Single Responsibility**: Each component should have a single responsibility and do it well
2. **Encapsulation**: Components should encapsulate their own state and behavior
3. **Composability**: Complex components are built by composing simpler components
4. **Reusability**: Components are designed to be reused across the application
5. **Testability**: Components are designed to be easily testable in isolation
6. **Accessibility**: Components are designed with accessibility in mind
7. **Performance**: Components are optimized for performance

## Component Organization

Our components are organized following the Atomic Design methodology:

### Atoms

Atoms are the basic building blocks of the application. They are the smallest, indivisible components that serve as the foundation for all other components.

Examples:
- Button
- Input
- Icon
- Typography
- Badge

### Molecules

Molecules are groups of atoms bonded together to form a functional unit. They are relatively simple combinations of UI elements that work together.

Examples:
- Form Field (Label + Input + Error Message)
- Search Bar (Input + Button)
- Product Card (Image + Title + Price + Button)
- Rating (Stars + Count)

### Organisms

Organisms are complex UI components composed of groups of molecules and/or atoms. They form distinct sections of the interface.

Examples:
- Navigation Bar
- Product Grid
- Filter Panel
- Checkout Form
- Footer

### Templates

Templates are page-level objects that place components into a layout and articulate the design's underlying content structure.

Examples:
- Product Listing Template
- Product Detail Template
- Checkout Template
- Account Template

### Pages

Pages are specific instances of templates that show what a UI looks like with real representative content in place.

Examples:
- Home Page
- Product Listing Page
- Product Detail Page
- Cart Page
- Checkout Page

## Core Components

These are the fundamental building blocks of our application, corresponding to the "atoms" in Atomic Design.

### Button

The Button component is used for actions and navigation throughout the application.

```tsx
// src/components/atoms/Button/Button.tsx
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const buttonClasses = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    {
      'button--full-width': fullWidth,
      'button--loading': isLoading,
      'button--disabled': disabled,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="button__spinner" />}
      {!isLoading && leftIcon && <span className="button__left-icon">{leftIcon}</span>}
      <span className="button__text">{children}</span>
      {!isLoading && rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button>
  );
};
```

### Input

The Input component is used for text input throughout the application.

```tsx
// src/components/atoms/Input/Input.tsx
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import './Input.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, hint, ...props }, ref) => {
    const inputClasses = classNames(
      'input',
      {
        'input--error': !!error,
      },
      className
    );

    return (
      <div className="input-container">
        <input className={inputClasses} ref={ref} {...props} />
        {error && <div className="input__error">{error}</div>}
        {!error && hint && <div className="input__hint">{hint}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### Typography

The Typography component is used for text display throughout the application.

```tsx
// src/components/atoms/Typography/Typography.tsx
import React from 'react';
import classNames from 'classnames';
import './Typography.scss';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

export interface TypographyProps {
  variant?: TypographyVariant;
  component?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  component,
  className,
  children,
  ...props
}) => {
  const Component = component || getDefaultComponent(variant);
  
  const classes = classNames(
    'typography',
    `typography--${variant}`,
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

function getDefaultComponent(variant: TypographyVariant): React.ElementType {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'subtitle1':
    case 'subtitle2':
      return 'h6';
    case 'body1':
    case 'body2':
      return 'p';
    case 'caption':
    case 'overline':
      return 'span';
    default:
      return 'p';
  }
}
```

### Icon

The Icon component is used to display icons throughout the application.

```tsx
// src/components/atoms/Icon/Icon.tsx
import React from 'react';
import classNames from 'classnames';
import './Icon.scss';

export type IconSize = 'small' | 'medium' | 'large';

export interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  color,
  className,
  ...props
}) => {
  const iconClasses = classNames(
    'icon',
    `icon--${size}`,
    className
  );

  const style = color ? { color } : undefined;

  return (
    <span className={iconClasses} style={style} {...props}>
      <i className={`icon-${name}`} aria-hidden="true" />
    </span>
  );
};
```

## Layout Components

These components define the overall structure and layout of the application.

### MainLayout

The MainLayout component is the main layout for the application, used for most pages.

```tsx
// src/components/templates/MainLayout/MainLayout.tsx
import React from 'react';
import { Header } from '../../organisms/Header/Header';
import { Footer } from '../../organisms/Footer/Footer';
import './MainLayout.scss';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout__content">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

### CheckoutLayout

The CheckoutLayout component is used for the checkout flow.

```tsx
// src/components/templates/CheckoutLayout/CheckoutLayout.tsx
import React from 'react';
import { CheckoutHeader } from '../../organisms/CheckoutHeader/CheckoutHeader';
import { CheckoutSidebar } from '../../organisms/CheckoutSidebar/CheckoutSidebar';
import './CheckoutLayout.scss';

export interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ children }) => {
  return (
    <div className="checkout-layout">
      <CheckoutHeader />
      <div className="checkout-layout__content">
        <div className="checkout-layout__main">
          {children}
        </div>
        <CheckoutSidebar />
      </div>
    </div>
  );
};
```

### AccountLayout

The AccountLayout component is used for the user account pages.

```tsx
// src/components/templates/AccountLayout/AccountLayout.tsx
import React from 'react';
import { Header } from '../../organisms/Header/Header';
import { Footer } from '../../organisms/Footer/Footer';
import { AccountSidebar } from '../../organisms/AccountSidebar/AccountSidebar';
import './AccountLayout.scss';

export interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  return (
    <div className="account-layout">
      <Header />
      <div className="account-layout__content">
        <AccountSidebar />
        <main className="account-layout__main">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
```

## Page Components

These components represent the different pages of the application.

### HomePage

The HomePage component is the landing page of the application.

```tsx
// src/pages/HomePage/HomePage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../../components/organisms/Hero/Hero';
import { FeaturedProducts } from '../../components/organisms/FeaturedProducts/FeaturedProducts';
import { CategoryGrid } from '../../components/organisms/CategoryGrid/CategoryGrid';
import { PromoBanner } from '../../components/organisms/PromoBanner/PromoBanner';
import { Newsletter } from '../../components/organisms/Newsletter/Newsletter';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home | E-commerce Store</title>
        <meta name="description" content="Welcome to our e-commerce store. Shop the latest products." />
      </Helmet>
      
      <div className="home-page">
        <Hero />
        <CategoryGrid />
        <FeaturedProducts title="New Arrivals" />
        <PromoBanner />
        <FeaturedProducts title="Best Sellers" />
        <Newsletter />
      </div>
    </>
  );
};
```

### ProductListingPage

The ProductListingPage component displays a list of products with filtering and sorting options.

```tsx
// src/pages/ProductListingPage/ProductListingPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/molecules/Breadcrumbs/Breadcrumbs';
import { ProductGrid } from '../../components/organisms/ProductGrid/ProductGrid';
import { FilterPanel } from '../../components/organisms/FilterPanel/FilterPanel';
import { SortDropdown } from '../../components/molecules/SortDropdown/SortDropdown';
import { Pagination } from '../../components/molecules/Pagination/Pagination';
import { useGetProductsQuery } from '../../services/productApi';
import './ProductListingPage.scss';

export const ProductListingPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  
  const { data, isLoading, error } = useGetProductsQuery({
    categoryId,
    page,
    sort,
    // Other filter params
  });
  
  const handleSortChange = (newSort: string) => {
    searchParams.set('sort', newSort);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };
  
  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };
  
  return (
    <>
      <Helmet>
        <title>{data?.category?.name || 'Products'} | E-commerce Store</title>
        <meta name="description" content={`Shop our collection of ${data?.category?.name || 'products'}.`} />
      </Helmet>
      
      <div className="product-listing-page">
        <Breadcrumbs />
        
        <div className="product-listing-page__header">
          <h1>{data?.category?.name || 'Products'}</h1>
          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>
        
        <div className="product-listing-page__content">
          <FilterPanel />
          
          <div className="product-listing-page__main">
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error loading products</div>
            ) : (
              <>
                <ProductGrid products={data?.products || []} />
                
                <Pagination
                  currentPage={page}
                  totalPages={data?.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
```

### ProductDetailPage

The ProductDetailPage component displays detailed information about a product.

```tsx
// src/pages/ProductDetailPage/ProductDetailPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/molecules/Breadcrumbs/Breadcrumbs';
import { ProductGallery } from '../../components/organisms/ProductGallery/ProductGallery';
import { ProductInfo } from '../../components/organisms/ProductInfo/ProductInfo';
import { ProductTabs } from '../../components/organisms/ProductTabs/ProductTabs';
import { RelatedProducts } from '../../components/organisms/RelatedProducts/RelatedProducts';
import { useGetProductByIdQuery } from '../../services/productApi';
import './ProductDetailPage.scss';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId!);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error || !product) {
    return <div>Product not found</div>;
  }
  
  return (
    <>
      <Helmet>
        <title>{product.name} | E-commerce Store</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.images[0]?.url} />
      </Helmet>
      
      <div className="product-detail-page">
        <Breadcrumbs />
        
        <div className="product-detail-page__content">
          <ProductGallery images={product.images} />
          
          <ProductInfo
            name={product.name}
            price={product.price}
            rating={product.rating}
            variants={product.variants}
            availability={product.availability}
          />
        </div>
        
        <ProductTabs
          description={product.description}
          specifications={product.specifications}
          reviews={product.reviews}
        />
        
        <RelatedProducts productId={product.id} />
      </div>
    </>
  );
};
```

### CartPage

The CartPage component displays the user's shopping cart.

```tsx
// src/pages/CartPage/CartPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Typography } from '../../components/atoms/Typography/Typography';
import { Button } from '../../components/atoms/Button/Button';
import { CartItemList } from '../../components/organisms/CartItemList/CartItemList';
import { CartSummary } from '../../components/organisms/CartSummary/CartSummary';
import { useAppSelector } from '../../hooks/useAppSelector';
import './CartPage.scss';

export const CartPage: React.FC = () => {
  const { items, isLoading } = useAppSelector(state => state.cart);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <Helmet>
          <title>Shopping Cart | E-commerce Store</title>
        </Helmet>
        
        <Typography variant="h1">Your Cart</Typography>
        <Typography>Your cart is empty.</Typography>
        <Button as={Link} to="/products">Continue Shopping</Button>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <Helmet>
        <title>Shopping Cart | E-commerce Store</title>
      </Helmet>
      
      <Typography variant="h1">Your Cart</Typography>
      
      <div className="cart-page__content">
        <CartItemList items={items} />
        <CartSummary />
      </div>
      
      <div className="cart-page__actions">
        <Button variant="secondary" as={Link} to="/products">
          Continue Shopping
        </Button>
        <Button as={Link} to="/checkout">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};
```

## Feature Components

These components implement specific features of the application.

### ProductCard

The ProductCard component displays a product in a grid or list.

```tsx
// src/components/molecules/ProductCard/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '../../atoms/Typography/Typography';
import { Button } from '../../atoms/Button/Button';
import { Rating } from '../../atoms/Rating/Rating';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { addItem } from '../../../features/cart/cartSlice';
import './ProductCard.scss';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem({ product, quantity: 1 }));
  };
  
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        <div className="product-card__image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image"
          />
        </div>
        
        <div className="product-card__content">
          <Typography variant="body2" className="product-card__name">
            {product.name}
          </Typography>
          
          <Typography variant="subtitle1" className="product-card__price">
            ${product.price.toFixed(2)}
          </Typography>
          
          <div className="product-card__rating">
            <Rating value={product.rating} />
            <Typography variant="caption">
              ({product.reviewCount})
            </Typography>
          </div>
        </div>
      </Link>
      
      <Button
        variant="primary"
        size="small"
        onClick={handleAddToCart}
        className="product-card__button"
      >
        Add to Cart
      </Button>
    </div>
  );
};
```

### CartItem

The CartItem component displays an item in the shopping cart.

```tsx
// src/components/molecules/CartItem/CartItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '../../atoms/Typography/Typography';
import { QuantitySelector } from '../../atoms/QuantitySelector/QuantitySelector';
import { Icon } from '../../atoms/Icon/Icon';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { removeItem, updateQuantity } from '../../../features/cart/cartSlice';
import './CartItem.scss';

export interface CartItemProps {
  item: {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variantId?: string;
    variantName?: string;
  };
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  
  const handleQuantityChange = (quantity: number) => {
    dispatch(updateQuantity({ id: item.id, quantity }));
  };
  
  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };
  
  return (
    <div className="cart-item">
      <div className="cart-item__image-container">
        <img
          src={item.image}
          alt={item.name}
          className="cart-item__image"
        />
      </div>
      
      <div className="cart-item__details">
        <Typography
          variant="subtitle1"
          component={Link}
          to={`/products/${item.productId}`}
          className="cart-item__name"
        >
          {item.name}
        </Typography>
        
        {item.variantName && (
          <Typography variant="body2" className="cart-item__variant">
            {item.variantName}
          </Typography>
        )}
        
        <Typography variant="body2" className="cart-item__price">
          ${item.price.toFixed(2)}
        </Typography>
      </div>
      
      <div className="cart-item__quantity">
        <QuantitySelector
          value={item.quantity}
          onChange={handleQuantityChange}
          min={1}
          max={10}
        />
      </div>
      
      <div className="cart-item__subtotal">
        <Typography variant="subtitle2">
          ${(item.price * item.quantity).toFixed(2)}
        </Typography>
      </div>
      
      <button
        className="cart-item__remove"
        onClick={handleRemove}
        aria-label="Remove item"
      >
        <Icon name="trash" />
      </button>
    </div>
  );
};
```

### FilterPanel

The FilterPanel component provides filtering options for product listings.

```tsx
// src/components/organisms/FilterPanel/FilterPanel.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography } from '../../atoms/Typography/Typography';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { RangeSlider } from '../../atoms/RangeSlider/RangeSlider';
import { Accordion } from '../../molecules/Accordion/Accordion';
import { useGetFiltersQuery } from '../../../services/productApi';
import './FilterPanel.scss';

export const FilterPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: filters, isLoading } = useGetFiltersQuery();
  
  const selectedCategories = searchParams.getAll('category');
  const selectedBrands = searchParams.getAll('brand');
  const priceMin = searchParams.get('price_min') || '';
  const priceMax = searchParams.get('price_max') || '';
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    const categories = new Set(selectedCategories);
    
    if (checked) {
      categories.add(category);
    } else {
      categories.delete(category);
    }
    
    updateFilters('category', Array.from(categories));
  };
  
  const handleBrandChange = (brand: string, checked: boolean) => {
    const brands = new Set(selectedBrands);
    
    if (checked) {
      brands.add(brand);
    } else {
      brands.delete(brand);
    }
    
    updateFilters('brand', Array.from(brands));
  };
  
  const handlePriceChange = (min: number, max: number) => {
    searchParams.set('price_min', min.toString());
    searchParams.set('price_max', max.toString());
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };
  
  const updateFilters = (name: string, values: string[]) => {
    searchParams.delete(name);
    values.forEach(value => searchParams.append(name, value));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };
  
  if (isLoading) {
    return <div>Loading filters...</div>;
  }
  
  return (
    <div className="filter-panel">
      <Typography variant="h3">Filters</Typography>
      
      <Accordion title="Categories" defaultOpen>
        <div className="filter-panel__group">
          {filters?.categories.map(category => (
            <Checkbox
              key={category.id}
              label={`${category.name} (${category.count})`}
              checked={selectedCategories.includes(category.id)}
              onChange={e => handleCategoryChange(category.id, e.target.checked)}
            />
          ))}
        </div>
      </Accordion>
      
      <Accordion title="Brands" defaultOpen>
        <div className="filter-panel__group">
          {filters?.brands.map(brand => (
            <Checkbox
              key={brand.id}
              label={`${brand.name} (${brand.count})`}
              checked={selectedBrands.includes(brand.id)}
              onChange={e => handleBrandChange(brand.id, e.target.checked)}
            />
          ))}
        </div>
      </Accordion>
      
      <Accordion title="Price" defaultOpen>
        <div className="filter-panel__group">
          <RangeSlider
            min={filters?.price.min || 0}
            max={filters?.price.max || 1000}
            value={[
              priceMin ? parseInt(priceMin, 10) : filters?.price.min || 0,
              priceMax ? parseInt(priceMax, 10) : filters?.price.max || 1000,
            ]}
            onChange={handlePriceChange}
          />
          
          <div className="filter-panel__price-inputs">
            <input
              type="number"
              value={priceMin}
              onChange={e => handlePriceChange(
                parseInt(e.target.value, 10),
                priceMax ? parseInt(priceMax, 10) : filters?.price.max || 1000
              )}
              placeholder={`${filters?.price.min || 0}`}
            />
            <span>to</span>
            <input
              type="number"
              value={priceMax}
              onChange={e => handlePriceChange(
                priceMin ? parseInt(priceMin, 10) : filters?.price.min || 0,
                parseInt(e.target.value, 10)
              )}
              placeholder={`${filters?.price.max || 1000}`}
            />
          </div>
        </div>
      </Accordion>
    </div>
  );
};
```

## Component Communication

Components communicate with each other through various mechanisms:

### Props

The most basic form of communication is through props, where parent components pass data and callbacks to child components.

```tsx
// Parent component passing props to child
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  isWishlisted={isProductWishlisted(product.id)}
  onToggleWishlist={handleToggleWishlist}
/>
```

### Context

Context is used for sharing state that is required by many components at different levels of the component tree.

```tsx
// Creating a context
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
