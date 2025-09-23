# E-commerce Application Frontend Architecture

This document outlines the frontend architecture for the e-commerce application, detailing the overall structure, patterns, and organization of the codebase.

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Core Technologies](#core-technologies)
5. [Design Patterns](#design-patterns)
6. [Code Organization](#code-organization)
7. [Data Flow](#data-flow)
8. [Error Handling](#error-handling)
9. [Internationalization](#internationalization)
10. [Theming](#theming)
11. [Testing Strategy](#testing-strategy)
12. [Build and Deployment](#build-and-deployment)
13. [Performance Considerations](#performance-considerations)
14. [Security Considerations](#security-considerations)

## Introduction

The frontend architecture of our e-commerce application is designed to be scalable, maintainable, and performant. It follows modern best practices and patterns to ensure a good developer experience and a high-quality user experience.

The architecture is built on React and TypeScript, with a focus on component-based development, strong typing, and clear separation of concerns. It uses Redux for global state management, RTK Query for data fetching, and a variety of other libraries and tools to provide a comprehensive solution for building a complex e-commerce application.

## Architecture Overview

Our frontend architecture follows a layered approach with clear separation of concerns:

### Presentation Layer

The presentation layer is responsible for rendering the UI and handling user interactions. It consists of:

- **Components**: Reusable UI elements organized using Atomic Design principles
- **Pages**: Top-level components that represent different routes in the application
- **Layouts**: Components that define the overall structure of different sections of the application

### Application Layer

The application layer contains the business logic and state management:

- **State Management**: Redux store, slices, and selectors
- **Services**: API clients, data transformation, and business logic
- **Hooks**: Custom hooks for reusable logic

### Data Layer

The data layer handles data fetching, caching, and persistence:

- **API**: RTK Query endpoints for data fetching and mutations
- **Models**: TypeScript interfaces and types for data structures
- **Storage**: Local storage, session storage, and other persistence mechanisms

### Infrastructure Layer

The infrastructure layer provides cross-cutting concerns and utilities:

- **Routing**: React Router configuration and route definitions
- **Internationalization**: i18n setup and translations
- **Theming**: Theme configuration and styling utilities
- **Error Handling**: Global error handling and error boundaries
- **Analytics**: Analytics tracking and reporting
- **Logging**: Logging utilities and configuration

## Project Structure

Our project follows a feature-based structure, with shared components and utilities organized in a modular way:

```
src/
├── assets/                 # Static assets (images, fonts, etc.)
├── components/             # Shared components
│   ├── atoms/              # Basic building blocks (Button, Input, etc.)
│   ├── molecules/          # Combinations of atoms (Form Field, Card, etc.)
│   ├── organisms/          # Complex components (Header, Footer, etc.)
│   └── templates/          # Page layouts
├── config/                 # Configuration files
├── features/               # Feature modules
│   ├── auth/               # Authentication feature
│   │   ├── components/     # Feature-specific components
│   │   ├── hooks/          # Feature-specific hooks
│   │   ├── services/       # Feature-specific services
│   │   ├── slices/         # Redux slices
│   │   └── types/          # TypeScript types
│   ├── cart/               # Shopping cart feature
│   ├── checkout/           # Checkout feature
│   ├── products/           # Product catalog feature
│   └── ...                 # Other features
├── hooks/                  # Shared hooks
├── pages/                  # Page components
├── routes/                 # Route definitions
├── services/               # Shared services
├── store/                  # Redux store configuration
│   ├── slices/             # Redux slices
│   └── api.ts              # RTK Query API
├── styles/                 # Global styles and theme
├── types/                  # Shared TypeScript types
├── utils/                  # Utility functions
├── App.tsx                 # Root component
└── index.tsx               # Entry point
```

## Core Technologies

Our frontend architecture is built on the following core technologies:

### Framework and Language

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript

### State Management

- **Redux Toolkit**: A toolset for efficient Redux development
- **RTK Query**: A data fetching and caching tool built into Redux Toolkit

### Routing

- **React Router**: A collection of navigational components for React applications

### Styling

- **Sass**: A CSS preprocessor with variables, nesting, and more
- **CSS Modules**: Locally scoped CSS for components
- **Tailwind CSS**: A utility-first CSS framework (optional)

### Form Management

- **React Hook Form**: A performant, flexible, and extensible form library
- **Yup**: A schema validation library

### Testing

- **Jest**: A JavaScript testing framework
- **React Testing Library**: A testing utility for React components
- **Cypress**: An end-to-end testing framework

### Build Tools

- **Webpack**: A module bundler for JavaScript applications
- **Babel**: A JavaScript compiler
- **ESLint**: A tool for identifying and reporting on patterns in JavaScript
- **Prettier**: An opinionated code formatter

### Other Libraries

- **Axios**: A promise-based HTTP client
- **date-fns**: A modern JavaScript date utility library
- **lodash**: A utility library for JavaScript
- **react-helmet-async**: A component for managing the document head
- **react-error-boundary**: A component for catching JavaScript errors

## Design Patterns

Our architecture incorporates several design patterns to ensure code quality, maintainability, and scalability:

### Component Patterns

#### Atomic Design

We organize our components following the Atomic Design methodology:

- **Atoms**: Basic building blocks (Button, Input, Typography, etc.)
- **Molecules**: Combinations of atoms (Form Field, Card, etc.)
- **Organisms**: Complex components (Header, Footer, Product Card, etc.)
- **Templates**: Page layouts
- **Pages**: Specific instances of templates with real content

#### Component Composition

We use component composition to build complex UIs from simpler components:

```tsx
// src/components/molecules/FormField/FormField.tsx
import React from 'react';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { ErrorMessage } from '../../atoms/ErrorMessage';
import './FormField.scss';

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  children,
}) => {
  return (
    <div className="form-field">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
```

#### Render Props

We use render props for components that need to share behavior:

```tsx
// src/components/molecules/Dropdown/Dropdown.tsx
import React, { useState } from 'react';
import './Dropdown.scss';

interface DropdownProps {
  renderTrigger: (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
  renderContent: (props: { isOpen: boolean; close: () => void }) => React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  renderTrigger,
  renderContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);
  
  return (
    <div className="dropdown">
      <div className="dropdown__trigger">
        {renderTrigger({ isOpen, toggle })}
      </div>
      {isOpen && (
        <div className="dropdown__content">
          {renderContent({ isOpen, close })}
        </div>
      )}
    </div>
  );
};
```

#### Compound Components

We use compound components for complex components with multiple parts:

```tsx
// src/components/organisms/Tabs/Tabs.tsx
import React, { createContext, useContext, useState } from 'react';
import './Tabs.scss';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || '');
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabProps {
  id: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ id, children }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;
  
  return (
    <button
      className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''}`}
      onClick={() => setActiveTab(id)}
      aria-selected={isActive}
      role="tab"
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ id, children }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  const isActive = activeTab === id;
  
  if (!isActive) {
    return null;
  }
  
  return (
    <div className="tabs__panel" role="tabpanel">
      {children}
    </div>
  );
};
```

### State Management Patterns

#### Slice Pattern

We organize our Redux state into slices, each responsible for a specific domain:

```tsx
// src/store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ product: any; quantity: number }>) => {
      // Implementation
    },
    removeItem: (state, action: PayloadAction<string>) => {
      // Implementation
    },
    // Other reducers
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
```

#### Selector Pattern

We use selectors to extract and derive data from the Redux store:

```tsx
// src/store/selectors/cartSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = createSelector(
  selectCartItems,
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);
```

#### Custom Hooks for State

We encapsulate state logic in custom hooks:

```tsx
// src/hooks/useCart.ts
import { useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { addItem, removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { selectCartItems, selectCartItemCount, selectCartTotal } from '../store/selectors/cartSelectors';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);
  
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch(addItem({ product, quantity }));
  }, [dispatch]);
  
  const removeFromCart = useCallback((itemId) => {
    dispatch(removeItem(itemId));
  }, [dispatch]);
  
  const updateItemQuantity = useCallback((itemId, quantity) => {
    dispatch(updateQuantity({ id: itemId, quantity }));
  }, [dispatch]);
  
  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);
  
  return {
    items,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    emptyCart,
  };
};
```

### API Patterns

#### API Slice Pattern

We organize our API endpoints into slices using RTK Query:

```tsx
// src/store/services/productApi.ts
import { api } from '../api';
import { Product, Category } from '../../types';

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      { products: Product[]; totalCount: number; totalPages: number },
      { page?: number; limit?: number; sort?: string; categoryId?: string }
    >({
      query: ({ page = 1, limit = 12, sort = 'relevance', categoryId }) => {
        // Implementation
      },
      providesTags: (result) => {
        // Implementation
      },
    }),
    
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    // Other endpoints
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  // Other hooks
} = productApi;
```

#### API Error Handling

We handle API errors consistently across the application:

```tsx
// src/utils/apiErrorHandler.ts
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const isErrorWithMessage = (
  error: unknown
): error is { message: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error
  );
};

export const isSerializedError = (
  error: unknown
): error is SerializedError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'message' in error
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isFetchBaseQueryError(error)) {
    return 'error' in error
      ? (error.error as string)
      : JSON.stringify(error.data);
  } else if (isSerializedError(error)) {
    return error.message || 'An error occurred';
  } else if (isErrorWithMessage(error)) {
    return error.message;
  }
  return 'An unknown error occurred';
};
```

## Code Organization

### Feature-Based Organization

We organize our code by feature, with each feature containing its own components, hooks, services, and state:

```
src/features/
├── auth/                   # Authentication feature
│   ├── components/         # Feature-specific components
│   ├── hooks/              # Feature-specific hooks
│   ├── services/           # Feature-specific services
│   ├── slices/             # Redux slices
│   └── types/              # TypeScript types
├── cart/                   # Shopping cart feature
├── checkout/               # Checkout feature
├── products/               # Product catalog feature
└── ...                     # Other features
```

### Shared Code

We organize shared code in top-level directories:

```
src/
├── components/             # Shared components
├── hooks/                  # Shared hooks
├── services/               # Shared services
├── store/                  # Redux store configuration
├── styles/                 # Global styles and theme
├── types/                  # Shared TypeScript types
└── utils/                  # Utility functions
```

### Component Organization

Each component is organized in its own directory with related files:

```
src/components/atoms/Button/
├── Button.tsx              # Component implementation
├── Button.scss             # Component styles
├── Button.test.tsx         # Component tests
└── index.ts                # Re-export for easier imports
```

## Data Flow

Our application follows a unidirectional data flow pattern:

1. **User Interaction**: User interacts with a component
2. **Action Dispatch**: Component dispatches an action
3. **State Update**: Reducer updates the state based on the action
4. **Re-render**: Components re-render with the new state

### Example Data Flow

1. User clicks "Add to Cart" button on a product card
2. The `addToCart` function from the `useCart` hook is called
3. The function dispatches the `addItem` action with the product and quantity
4. The cart reducer updates the state by adding the item to the cart
5. Components that use the cart state (e.g., cart icon, cart page) re-render with the updated state

## Error Handling

We implement a comprehensive error handling strategy:

### Error Boundaries

We use error boundaries to catch JavaScript errors in the component tree:

```tsx
// src/components/ErrorBoundary/ErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react';
import { ErrorPage } from '../../pages/ErrorPage';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### API Error Handling

We handle API errors consistently across the application:

```tsx
// src/components/organisms/ProductList/ProductList.tsx
import React from 'react';
import { useGetProductsQuery } from '../../../store/services/productApi';
import { ProductCard } from '../../molecules/ProductCard';
import { LoadingSpinner } from '../../atoms/LoadingSpinner';
import { ErrorMessage } from '../../molecules/ErrorMessage';
import { getErrorMessage } from '../../../utils/apiErrorHandler';
import './ProductList.scss';

export const ProductList: React.FC = () => {
  const { data, isLoading, error } = useGetProductsQuery({});
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={getErrorMessage(error)} />;
  }
  
  return (
    <div className="product-list">
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Form Validation

We use Yup for form validation:

```tsx
// src/features/checkout/components/CheckoutForm/CheckoutForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../../../components/atoms/Button';
import { FormField } from '../../../../components/molecules/FormField';
import { Input } from '../../../../components/atoms/Input';
import './CheckoutForm.scss';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  // Other validations
});

export const CheckoutForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = (data) => {
    // Handle form submission
  };
  
  return (
    <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="First Name" name="firstName" error={errors.firstName?.message}>
        <Input {...register('firstName')} />
      </FormField>
      
      <FormField label="Last Name" name="lastName" error={errors.lastName?.message}>
        <Input {...register('lastName')} />
      </FormField>
      
      <FormField label="Email" name="email" error={errors.email?.message}>
        <Input type="email" {...register('email')} />
      </FormField>
      
      {/* Other form fields */}
      
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

## Internationalization

We use i18next for internationalization:

```tsx
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for React
    },
  });

export default i18n;
```

```tsx
// src/components/atoms/Button/Button.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Props
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  const { t } = useTranslation();
  
  return (
    <button className="button" {...props}>
      {typeof children === 'string' ? t(children) : children}
    </button>
  );
};
```

## Theming

We implement a theming system using CSS variables:

```scss
// src/styles/theme.scss
:root {
  // Colors
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  --color-light: #f8f9fa;
  --color-dark: #343a40;
  
  // Typography
  --font-family-base: 'Roboto', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
  
  // Spacing
  --spacing-unit: 8px;
  --spacing-xs: calc(var(--spacing-unit) * 0.5);
  --spacing-sm: var(--spacing-unit);
  --spacing-md: calc(var(--spacing-unit) * 2);
  --spacing-lg: calc(var(--spacing-unit) * 3);
  --spacing-xl: calc(var(--spacing-unit) * 4);
  
  // Border
  --border-radius: 4px;
  --border-width: 1px;
  --border-color: #dee2e6;
  
  // Shadows
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  // Transitions
  --transition-duration: 0.2s;
  --transition-timing-function: ease-in-out;
}

// Dark theme
.theme-dark {
  --color-primary: #0d6efd;
  --color-secondary: #6c757d;
  --color-success: #198754;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #0dcaf0;
  --color-light: #f8f9fa;
  --color-dark: #212529;
  
  // Dark theme specific variables
  --body-bg: #121212;
  --body-color: #f8f9fa;
  --border-color: #495057;
}
```

```tsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'light';
  });
  
  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
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
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
```

## Testing Strategy

We implement a comprehensive testing strategy:

### Unit Tests

We use Jest and React Testing Library for unit tests:

```tsx
// src/components/atoms/Button/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('applies the correct class for variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('button--primary');
  });
});
```

### Integration Tests

We use React Testing Library for integration tests:

```tsx
// src/features/cart/components/CartItem/CartItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from '../../../../store/slices/cartSlice';
import { CartItem } from './CartItem';

const mockItem = {
  id: '1',
  productId: '1',
  name: 'Test Product',
  price: 10,
  image: 'test.jpg',
  quantity: 1,
};

const renderWithStore = (ui, initialState = {}) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: {
        items: [mockItem],
        isLoading: false,
        error: null,
        ...initialState,
      },
    },
  });
  
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe('CartItem', () => {
  it('renders correctly', () => {
    renderWithStore(<CartItem item={mockItem} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });
  
  it('updates quantity when quantity selector is used', () => {
    const { store } = renderWithStore(<CartItem item={mockItem} />);
    fireEvent.click(screen.getByLabelText('Increase quantity'));
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });
  
  it('removes item when remove button is clicked', () => {
    const { store } = renderWithStore(<CartItem item={mockItem} />);
    fireEvent.click(screen.getByLabelText('Remove item'));
    expect(store.getState().cart.items).toHaveLength(0);
  });
});
```

### End-to-End Tests

We use Cypress for end-to-end tests:

```js
// cypress/integration/checkout.spec.js
describe('Checkout Flow', () => {
  beforeEach(() => {
    // Set up test data
    cy.intercept('GET', '/api/products*', { fixture: 'products.json' });
    cy.intercept('POST', '/api/cart', { statusCode: 200 });
    cy.intercept('
