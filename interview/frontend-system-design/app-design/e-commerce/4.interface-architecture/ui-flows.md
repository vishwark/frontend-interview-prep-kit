# E-commerce Application UI Flows

This document outlines the user interface flows and navigation patterns for the e-commerce application, detailing how users move through the application to accomplish various tasks.

## Table of Contents

1. [Introduction](#introduction)
2. [Core User Flows](#core-user-flows)
   - [Product Discovery Flow](#product-discovery-flow)
   - [Product Detail Flow](#product-detail-flow)
   - [Cart and Checkout Flow](#cart-and-checkout-flow)
   - [User Account Flow](#user-account-flow)
3. [Navigation Patterns](#navigation-patterns)
   - [Primary Navigation](#primary-navigation)
   - [Secondary Navigation](#secondary-navigation)
   - [Breadcrumb Navigation](#breadcrumb-navigation)
   - [Contextual Navigation](#contextual-navigation)
4. [Responsive Considerations](#responsive-considerations)
5. [User Flow Diagrams](#user-flow-diagrams)
6. [Interaction Patterns](#interaction-patterns)
7. [Error Handling Flows](#error-handling-flows)
8. [Accessibility Considerations](#accessibility-considerations)

## Introduction

User interface flows are critical to the success of an e-commerce application, as they directly impact the user experience and conversion rates. Well-designed UI flows guide users through the application in an intuitive and efficient manner, helping them accomplish their goals with minimal friction.

Our UI flows are designed with the following principles in mind:

1. **Clarity**: Users should always know where they are, what they can do, and how to proceed
2. **Efficiency**: Users should be able to accomplish their goals with minimal steps
3. **Consistency**: Similar patterns and interactions should be used throughout the application
4. **Flexibility**: Users should be able to navigate freely and backtrack when needed
5. **Feedback**: Users should receive clear feedback on their actions
6. **Accessibility**: UI flows should be accessible to users with disabilities

## Core User Flows

### Product Discovery Flow

The product discovery flow is how users find products they are interested in. This flow includes browsing categories, searching for specific products, and filtering and sorting results.

#### Entry Points

- Home page featured products
- Category navigation
- Search bar
- Promotional banners
- Recommended products

#### Flow Steps

1. **Initial Browse/Search**
   - User enters the application and navigates to a product category or uses the search bar
   - System displays a list of products matching the category or search query

2. **Filtering and Sorting**
   - User applies filters (price range, brand, size, color, etc.) to narrow down results
   - User sorts results (price low to high, highest rated, newest, etc.)
   - System updates the product list in real-time based on filters and sorting

3. **Pagination/Infinite Scroll**
   - User scrolls through products or navigates to additional pages
   - System loads more products as needed

4. **Product Selection**
   - User clicks on a product to view details
   - System navigates to the product detail page

#### Implementation Considerations

- Filters should be persistent across page navigation
- Search should support autocomplete and suggestions
- Product list should support both pagination and infinite scroll
- Product cards should provide enough information for users to make a decision
- Loading states should be clear and non-disruptive

#### Code Example: Product Filtering

```tsx
// src/components/organisms/ProductFilters/ProductFilters.tsx
import React from 'react';
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
      
      <div className="product-filters__section">
        <h3 className="product-filters__heading">Brands</h3>
        {/* Brand checkboxes */}
      </div>
      
      {/* Other filter sections */}
    </div>
  );
};
```

### Product Detail Flow

The product detail flow is how users view detailed information about a product and make purchasing decisions.

#### Entry Points

- Product card in product listing
- Search results
- Recommended products
- Recently viewed products
- Shared links

#### Flow Steps

1. **Product Information Review**
   - User views product images, description, specifications, price, and availability
   - User can switch between product variants (size, color, etc.)
   - System updates product information based on selected variants

2. **Additional Information**
   - User can view additional tabs (reviews, specifications, shipping info, etc.)
   - System displays the selected information

3. **Product Actions**
   - User selects quantity and product options
   - User adds the product to cart or wishlist
   - System confirms the action with visual feedback

4. **Related Products**
   - User can view related or recommended products
   - User can navigate to those products

#### Implementation Considerations

- Product images should be zoomable and navigable
- Product variants should be clearly selectable
- Add to cart button should be prominent
- Feedback should be clear when a product is added to cart
- Out-of-stock products should have clear messaging and alternatives

#### Code Example: Product Detail Component

```tsx
// src/components/organisms/ProductDetail/ProductDetail.tsx
import React, { useState } from 'react';
import { ProductGallery } from '../../molecules/ProductGallery';
import { ProductInfo } from '../../molecules/ProductInfo';
import { ProductVariants } from '../../molecules/ProductVariants';
import { AddToCartButton } from '../../molecules/AddToCartButton';
import { ProductTabs } from '../../molecules/ProductTabs';
import { RelatedProducts } from '../../molecules/RelatedProducts';
import './ProductDetail.scss';

interface ProductDetailProps {
  product: any; // Replace with proper type
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  
  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  
  return (
    <div className="product-detail">
      <div className="product-detail__main">
        <div className="product-detail__gallery">
          <ProductGallery images={selectedVariant.images} />
        </div>
        
        <div className="product-detail__info">
          <ProductInfo
            name={product.name}
            price={selectedVariant.price}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
          
          <ProductVariants
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
          />
          
          <div className="product-detail__actions">
            <div className="product-detail__quantity">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
              />
            </div>
            
            <AddToCartButton
              product={selectedVariant}
              quantity={quantity}
            />
          </div>
        </div>
      </div>
      
      <ProductTabs
        description={product.description}
        specifications={product.specifications}
        reviews={product.reviews}
      />
      
      <RelatedProducts
        productId={product.id}
        categoryId={product.categoryId}
      />
    </div>
  );
};
```

### Cart and Checkout Flow

The cart and checkout flow is how users review their selected products, provide shipping and payment information, and complete their purchase.

#### Entry Points

- Add to cart confirmation
- Cart icon in header
- Direct URL to cart page

#### Flow Steps

1. **Cart Review**
   - User views items in cart, quantities, and prices
   - User can update quantities or remove items
   - User can apply promo codes
   - System updates cart totals in real-time

2. **Checkout Initiation**
   - User clicks checkout button
   - System checks if user is logged in
   - If not logged in, user is prompted to log in, register, or continue as guest

3. **Shipping Information**
   - User provides shipping address
   - User selects shipping method
   - System validates address and updates shipping cost

4. **Payment Information**
   - User provides payment information
   - System validates payment information

5. **Order Review**
   - User reviews order details, including items, shipping, and total cost
   - User confirms order
   - System processes payment and creates order

6. **Order Confirmation**
   - System displays order confirmation with order number and details
   - System sends confirmation email

#### Implementation Considerations

- Cart should be persistent across sessions
- Checkout process should be streamlined with minimal steps
- Form validation should be real-time
- Error messages should be clear and actionable
- Progress indicators should show current step and remaining steps
- Users should be able to navigate back to previous steps
- Guest checkout should be available

#### Code Example: Cart Component

```tsx
// src/components/organisms/Cart/Cart.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { CartItem } from '../../molecules/CartItem';
import { PromoCode } from '../../molecules/PromoCode';
import { CartSummary } from '../../molecules/CartSummary';
import { Button } from '../../atoms/Button';
import { EmptyCart } from '../../molecules/EmptyCart';
import './Cart.scss';

export const Cart: React.FC = () => {
  const { items, itemCount, total, updateItemQuantity, removeFromCart } = useCart();
  
  if (itemCount === 0) {
    return <EmptyCart />;
  }
  
  return (
    <div className="cart">
      <h1 className="cart__title">Your Cart ({itemCount} items)</h1>
      
      <div className="cart__content">
        <div className="cart__items">
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={(quantity) => updateItemQuantity(item.id, quantity)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </div>
        
        <div className="cart__sidebar">
          <PromoCode />
          
          <CartSummary
            subtotal={total}
            shipping={total > 50 ? 0 : 5.99}
            tax={total * 0.08}
          />
          
          <Button
            as={Link}
            to="/checkout"
            variant="primary"
            fullWidth
          >
            Proceed to Checkout
          </Button>
          
          <Link to="/products" className="cart__continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
```

### User Account Flow

The user account flow is how users manage their account information, view order history, and manage saved items.

#### Entry Points

- Account icon in header
- Links in order confirmation
- Email links

#### Flow Steps

1. **Authentication**
   - User logs in with email/password or social login
   - System validates credentials and redirects to account dashboard

2. **Account Dashboard**
   - User views account summary, recent orders, and saved items
   - User can navigate to specific account sections

3. **Order History**
   - User views list of past orders
   - User can view details of specific orders
   - User can track shipments or initiate returns

4. **Account Management**
   - User can update personal information
   - User can manage addresses
   - User can manage payment methods
   - User can update communication preferences

5. **Wishlist Management**
   - User can view saved items
   - User can move items to cart or remove from wishlist

#### Implementation Considerations

- Authentication should be secure and follow best practices
- Account sections should be clearly organized
- Users should be able to easily navigate between account sections
- Order history should be searchable and filterable
- Personal information should be editable with proper validation

#### Code Example: Account Dashboard Component

```tsx
// src/components/organisms/AccountDashboard/AccountDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useOrders } from '../../../hooks/useOrders';
import { useWishlist } from '../../../hooks/useWishlist';
import { OrderSummary } from '../../molecules/OrderSummary';
import { WishlistItem } from '../../molecules/WishlistItem';
import './AccountDashboard.scss';

export const AccountDashboard: React.FC = () => {
  const { user } = useAuth();
  const { recentOrders } = useOrders();
  const { wishlistItems } = useWishlist();
  
  return (
    <div className="account-dashboard">
      <div className="account-dashboard__welcome">
        <h1 className="account-dashboard__title">Welcome, {user.firstName}!</h1>
        <p className="account-dashboard__subtitle">
          Here's an overview of your account.
        </p>
      </div>
      
      <div className="account-dashboard__section">
        <div className="account-dashboard__section-header">
          <h2 className="account-dashboard__section-title">Recent Orders</h2>
          <Link to="/account/orders" className="account-dashboard__section-link">
            View All Orders
          </Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="account-dashboard__orders">
            {recentOrders.slice(0, 3).map(order => (
              <OrderSummary key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <p className="account-dashboard__empty-message">
            You haven't placed any orders yet.
          </p>
        )}
      </div>
      
      <div className="account-dashboard__section">
        <div className="account-dashboard__section-header">
          <h2 className="account-dashboard__section-title">Wishlist</h2>
          <Link to="/account/wishlist" className="account-dashboard__section-link">
            View All Wishlist Items
          </Link>
        </div>
        
        {wishlistItems.length > 0 ? (
          <div className="account-dashboard__wishlist">
            {wishlistItems.slice(0, 4).map(item => (
              <WishlistItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="account-dashboard__empty-message">
            Your wishlist is empty.
          </p>
        )}
      </div>
      
      <div className="account-dashboard__section">
        <div className="account-dashboard__section-header">
          <h2 className="account-dashboard__section-title">Account Information</h2>
          <Link to="/account/profile" className="account-dashboard__section-link">
            Edit Profile
          </Link>
        </div>
        
        <div className="account-dashboard__info">
          <div className="account-dashboard__info-item">
            <h3 className="account-dashboard__info-title">Contact Information</h3>
            <p className="account-dashboard__info-text">{user.email}</p>
            <p className="account-dashboard__info-text">{user.phone || 'No phone number added'}</p>
          </div>
          
          <div className="account-dashboard__info-item">
            <h3 className="account-dashboard__info-title">Default Shipping Address</h3>
            {user.defaultShippingAddress ? (
              <>
                <p className="account-dashboard__info-text">{user.defaultShippingAddress.street}</p>
                <p className="account-dashboard__info-text">
                  {user.defaultShippingAddress.city}, {user.defaultShippingAddress.state} {user.defaultShippingAddress.zipCode}
                </p>
              </>
            ) : (
              <p className="account-dashboard__info-text">No default shipping address added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Navigation Patterns

### Primary Navigation

Primary navigation is the main navigation system that allows users to browse the application's main sections.

#### Components

- **Header Navigation**: Main categories, search, cart, and account links
- **Footer Navigation**: Additional links to important pages
- **Mobile Navigation**: Hamburger menu with expandable sections

#### Implementation Considerations

- Header should be sticky on desktop
- Mobile navigation should be collapsible
- Active states should be clear
- Dropdown menus should be accessible

#### Code Example: Header Navigation

```tsx
// src/components/organisms/Header/Header.tsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { Logo } from '../../atoms/Logo';
import { SearchBar } from '../../molecules/SearchBar';
import { CartIcon } from '../../atoms/CartIcon';
import { UserIcon } from '../../atoms/UserIcon';
import { MobileMenu } from '../../molecules/MobileMenu';
import './Header.scss';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <NavLink
                to="/products/clothing"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                }
              >
                Clothing
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/products/shoes"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                }
              >
                Shoes
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/products/accessories"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                }
              >
                Accessories
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/products/sale"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                }
              >
                Sale
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="header__search">
          <SearchBar />
        </div>
        
        <div className="header__actions">
          <Link to="/cart" className="header__action">
            <CartIcon count={itemCount} />
          </Link>
          
          <Link to={isAuthenticated ? '/account' : '/login'} className="header__action">
            <UserIcon />
          </Link>
          
          <button
            className="header__mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Menu</span>
            <span className="header__mobile-menu-icon"></span>
          </button>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};
```

### Secondary Navigation

Secondary navigation provides access to subsections within a main section.

#### Components

- **Category Filters**: Subcategories within a main category
- **Account Navigation**: Links to different account sections
- **Product Tabs**: Tabs for different product information sections

#### Implementation Considerations

- Secondary navigation should be contextual to the current section
- Active states should be clear
- Navigation should be responsive

#### Code Example: Account Navigation

```tsx
// src/components/molecules/AccountNav/AccountNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AccountNav.scss';

export const AccountNav: React.FC = () => {
  return (
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
  );
};
```

### Breadcrumb Navigation

Breadcrumb navigation shows the user's current location in the application hierarchy and provides a way to navigate back to higher levels.

#### Implementation Considerations

- Breadcrumbs should be consistent across the application
- Breadcrumbs should be responsive
- Last item should be non-clickable and represent the current page

#### Code Example: Breadcrumb Component

```tsx
// src/components/molecules/Breadcrumbs/Breadcrumbs.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.scss';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to="/" className="breadcrumbs__link">
            Home
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li
              key={item.label}
              className="breadcrumbs__item"
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                <span className="breadcrumbs__current">{item.label}</span>
              ) : (
                <Link to={item.url || '#'} className="breadcrumbs__link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
```

### Contextual Navigation

Contextual navigation provides links to related content based on the current context.

#### Components

- **Related Products**: Links to similar or complementary products
- **Recently Viewed**: Links to recently viewed products
- **Recommended for You**: Personalized product recommendations

#### Implementation Considerations

- Contextual navigation should be relevant to the current content
- Recommendations should be personalized when possible
- Navigation should not be intrusive

#### Code Example: Related Products Component

```tsx
// src/components/molecules/RelatedProducts/RelatedProducts.tsx
import React from 'react';
import { useGetRelatedProductsQuery } from '../../../store/services/productApi';
import { ProductCard } from '../../molecules/ProductCard';
import { LoadingSpinner } from '../../atoms/LoadingSpinner';
import './RelatedProducts.scss';

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  categoryId,
}) => {
  const { data, isLoading } = useGetRelatedProductsQuery({
    productId,
    categoryId,
    limit: 4,
  });
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!data || data.products.length === 0) {
    return null;
  }
  
  return (
    <section className="related-products">
      <h2 className="related-products__title">You May Also Like</h2>
      
      <div className="related-products__grid">
        {data.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
```

## Responsive Considerations

Our UI flows are designed to work across a range of devices, from mobile phones to desktop computers.

### Mobile Considerations

- **Simplified Navigation**: Hamburger menu for primary navigation
- **Touch-Friendly Targets**: Larger touch targets for buttons and links
- **Streamlined Flows**: Simplified checkout process with fewer fields
- **Vertical Layout**: Content stacked vertically for easier scrolling

### Tablet Considerations

- **Hybrid Navigation**: Combination of mobile and desktop navigation patterns
- **Adaptive Layout**: Grid layouts that adapt to the available space
- **Touch and Pointer Support**: Support for both touch and pointer interactions

### Desktop Considerations

- **Expanded Navigation**: Full navigation with dropdowns
- **Multi-Column Layout**: Content organized in multiple columns
- **Hover States**: Interactive elements with hover states
- **Keyboard Navigation**: Full support for keyboard navigation

## User Flow Diagrams

### Product Discovery to Purchase Flow

```
Home Page
    │
    ├─── Category Navigation
    │        │
    │        v
    │    Category Page
    │        │
    │        ├─── Filter/Sort
    │        │        │
    │        │        v
    │        │    Filtered Results
    │        │
    │        v
    └─── Product Detail Page
             │
             ├─── Select Options
             │        │
             │        v
             │    Add to Cart
             │        │
             │        v
             └─── Cart Page
                     │
                     ├─── Update Quantities
                     │        │
                     │        v
                     │    Apply Promo Code
                     │        │
                     │        v
                     └─── Checkout
                              │
                              ├─── Login/Register/Guest
                              │        │
                              │        v
                              │    Shipping Information
                              │        │
                              │        v
                              │    Payment Information
                              │        │
                              │        v
                              │    Order Review
                              │        │
                              │        v
                              └─── Order Confirmation
```

### User Account Flow

```
Login Page
    │
    ├─── Login
    │        │
    │        v
    │    Account Dashboard
    │        │
    │        ├─── Order History
    │        │        │
    │        │        v
    │        │    Order Details
    │        │
    │        ├─── Profile Management
    │        │        │
    │        │        v
    │        │    Update Profile
    │        │
    │        ├─── Address Management
    │        │        │
    │        │        v
    │        │    Add/Edit/Delete Address
    │        │
    │        ├─── Payment Method Management
    │        │        │
    │        │        v
    │        │    Add/Edit/Delete Payment Method
    │        │
    │        └─── Wishlist
    │                 │
    │                 v
    │             Add to Cart/Remove
    │
    └─── Logout
```

## Interaction Patterns

### Form Interactions

- **Real-time Validation**: Validate form fields as users type
- **Error Messages**: Display clear error messages next to the relevant fields
- **Auto-completion**: Provide auto-completion for common fields
- **Progressive Disclosure**: Show additional fields only when needed

### Button Interactions

- **Loading States**: Show loading indicators when actions are in progress
- **Disabled States**: Disable buttons when actions are not available
- **
