# E-commerce Application State Management

This document outlines the state management strategy for the e-commerce application, detailing how application state is organized, accessed, and updated.

## Table of Contents

1. [Introduction](#introduction)
2. [State Management Requirements](#state-management-requirements)
3. [State Management Architecture](#state-management-architecture)
4. [Global State Management](#global-state-management)
5. [Local State Management](#local-state-management)
6. [Server State Management](#server-state-management)
7. [Form State Management](#form-state-management)
8. [URL State Management](#url-state-management)
9. [Persistence](#persistence)
10. [State Synchronization](#state-synchronization)
11. [Performance Considerations](#performance-considerations)
12. [Testing Strategies](#testing-strategies)

## Introduction

State management is a critical aspect of our e-commerce application, as it determines how data flows through the application and how components interact with each other. Our approach to state management is designed to be scalable, maintainable, and performant, while providing a good developer experience.

We use a combination of global state management (Redux), local component state (React's useState and useReducer), server state management (RTK Query), form state management (React Hook Form), and URL state management (React Router) to handle different types of state in the application.

## State Management Requirements

Our state management strategy addresses the following key requirements:

1. **Scalability**: The ability to handle a large number of state slices and components
2. **Performance**: Efficient updates and rendering to ensure a responsive user experience
3. **Developer Experience**: Clear patterns and tools to make state management intuitive
4. **Testability**: Easy testing of state logic and components that depend on state
5. **Debugging**: Tools and patterns to make debugging state issues straightforward
6. **Persistence**: Ability to persist state across page reloads and browser sessions
7. **Server Synchronization**: Keeping client state in sync with server state
8. **Optimistic Updates**: Supporting optimistic UI updates for a better user experience
9. **Caching**: Efficient caching of server data to reduce network requests
10. **Type Safety**: Strong typing of state to catch errors at compile time

## State Management Architecture

Our state management architecture is built on several key technologies and patterns:

### Technology Stack

- **Redux Toolkit**: For global application state
- **RTK Query**: For server state management (data fetching, caching, and synchronization)
- **React Context**: For feature-specific state that doesn't need to be global
- **React Hooks**: For component-local state
- **React Hook Form**: For form state management
- **React Router**: For URL-based state

### State Categories

We categorize our application state into several types, each managed differently:

1. **Global State**: State that is needed by many components across the application
2. **Server State**: Data fetched from the server that needs to be cached and synchronized
3. **Local State**: Component-specific state that doesn't need to be shared
4. **Form State**: State related to forms, including validation and submission
5. **URL State**: State that is reflected in the URL for bookmarking and sharing
6. **Ephemeral State**: Short-lived state that doesn't need to be persisted

## Global State Management

We use Redux Toolkit for global state management, which provides a standardized way to write Redux logic with less boilerplate.

### Store Configuration

```tsx
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { cartReducer } from './slices/cartSlice';
import { authReducer } from './slices/authSlice';
import { wishlistReducer } from './slices/wishlistSlice';
import { uiReducer } from './slices/uiSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Redux Slices

We organize our Redux state into slices, each responsible for a specific domain of the application:

#### Cart Slice

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
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Handle async actions if needed
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
```

#### Auth Slice

```tsx
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { authApi } from '../../services/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
```

### Custom Hooks for Redux

We provide custom hooks to access Redux state and dispatch actions:

```tsx
// src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```tsx
// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
```

### Usage Example

```tsx
// src/components/molecules/AddToCartButton/AddToCartButton.tsx
import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { addItem } from '../../../store/slices/cartSlice';
import { Button } from '../../atoms/Button';

interface AddToCartButtonProps {
  product: any;
  quantity?: number;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
}) => {
  const dispatch = useAppDispatch();
  
  const handleAddToCart = () => {
    dispatch(addItem({ product, quantity }));
  };
  
  return (
    <Button onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
};
```

## Local State Management

For component-specific state that doesn't need to be shared globally, we use React's built-in state management hooks:

### useState

For simple state:

```tsx
// src/components/molecules/QuantitySelector/QuantitySelector.tsx
import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './QuantitySelector.scss';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
}) => {
  const [localValue, setLocalValue] = useState(value);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    
    if (isNaN(newValue)) {
      setLocalValue(min);
      return;
    }
    
    const clampedValue = Math.min(Math.max(newValue, min), max);
    setLocalValue(clampedValue);
    onChange(clampedValue);
  };
  
  const handleIncrement = () => {
    if (localValue < max) {
      const newValue = localValue + 1;
      setLocalValue(newValue);
      onChange(newValue);
    }
  };
  
  const handleDecrement = () => {
    if (localValue > min) {
      const newValue = localValue - 1;
      setLocalValue(newValue);
      onChange(newValue);
    }
  };
  
  return (
    <div className="quantity-selector">
      <Button
        variant="secondary"
        onClick={handleDecrement}
        disabled={localValue <= min}
        aria-label="Decrease quantity"
      >
        -
      </Button>
      
      <Input
        type="number"
        value={localValue.toString()}
        onChange={handleChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
      
      <Button
        variant="secondary"
        onClick={handleIncrement}
        disabled={localValue >= max}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
};
```

### useReducer

For more complex state:

```tsx
// src/components/organisms/ProductFilters/ProductFilters.tsx
import React, { useReducer } from 'react';
import { Checkbox } from '../../atoms/Checkbox';
import { RangeSlider } from '../../atoms/RangeSlider';
import './ProductFilters.scss';

interface FiltersState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  ratings: number[];
}

type FiltersAction =
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'TOGGLE_BRAND'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'TOGGLE_RATING'; payload: number }
  | { type: 'RESET_FILTERS' };

const initialState: FiltersState = {
  categories: [],
  brands: [],
  priceRange: [0, 1000],
  ratings: [],
};

const filtersReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
  switch (action.type) {
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        categories: state.categories.includes(action.payload)
          ? state.categories.filter(category => category !== action.payload)
          : [...state.categories, action.payload],
      };
    case 'TOGGLE_BRAND':
      return {
        ...state,
        brands: state.brands.includes(action.payload)
          ? state.brands.filter(brand => brand !== action.payload)
          : [...state.brands, action.payload],
      };
    case 'SET_PRICE_RANGE':
      return {
        ...state,
        priceRange: action.payload,
      };
    case 'TOGGLE_RATING':
      return {
        ...state,
        ratings: state.ratings.includes(action.payload)
          ? state.ratings.filter(rating => rating !== action.payload)
          : [...state.ratings, action.payload],
      };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
};

interface ProductFiltersProps {
  onFiltersChange: (filters: FiltersState) => void;
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  priceRange: { min: number; max: number };
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFiltersChange,
  categories,
  brands,
  priceRange,
}) => {
  const [filters, dispatch] = useReducer(filtersReducer, initialState);
  
  // Update parent component when filters change
  React.useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);
  
  const handleCategoryChange = (categoryId: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: categoryId });
  };
  
  const handleBrandChange = (brandId: string) => {
    dispatch({ type: 'TOGGLE_BRAND', payload: brandId });
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    dispatch({ type: 'SET_PRICE_RANGE', payload: range });
  };
  
  const handleRatingChange = (rating: number) => {
    dispatch({ type: 'TOGGLE_RATING', payload: rating });
  };
  
  const handleResetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };
  
  return (
    <div className="product-filters">
      <div className="product-filters__section">
        <h3>Categories</h3>
        {categories.map(category => (
          <Checkbox
            key={category.id}
            label={category.name}
            checked={filters.categories.includes(category.id)}
            onChange={() => handleCategoryChange(category.id)}
          />
        ))}
      </div>
      
      <div className="product-filters__section">
        <h3>Brands</h3>
        {brands.map(brand => (
          <Checkbox
            key={brand.id}
            label={brand.name}
            checked={filters.brands.includes(brand.id)}
            onChange={() => handleBrandChange(brand.id)}
          />
        ))}
      </div>
      
      <div className="product-filters__section">
        <h3>Price Range</h3>
        <RangeSlider
          min={priceRange.min}
          max={priceRange.max}
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
        />
        <div className="product-filters__price-display">
          ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </div>
      </div>
      
      <div className="product-filters__section">
        <h3>Rating</h3>
        {[5, 4, 3, 2, 1].map(rating => (
          <Checkbox
            key={rating}
            label={`${rating} Stars & Up`}
            checked={filters.ratings.includes(rating)}
            onChange={() => handleRatingChange(rating)}
          />
        ))}
      </div>
      
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

### Custom Hooks

We create custom hooks to encapsulate reusable state logic:

```tsx
// src/hooks/useDisclosure.ts
import { useState, useCallback } from 'react';

export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  return { isOpen, open, close, toggle };
};
```

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return [storedValue, setValue] as const;
}
```

## Server State Management

We use RTK Query for server state management, which provides a standardized way to fetch, cache, and update data from the server.

### API Slice

```tsx
// src/store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './index';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.example.com',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Cart', 'Order', 'User'],
  endpoints: () => ({}),
});
```

### Product API

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
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        params.append('sort', sort);
        
        if (categoryId) {
          params.append('categoryId', categoryId);
        }
        
        return {
          url: '/products',
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
} = productApi;
```

### Usage Example

```tsx
// src/pages/ProductDetailPage/ProductDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../store/services/productApi';
import { ProductGallery } from '../../components/organisms/ProductGallery';
import { ProductInfo } from '../../components/organisms/ProductInfo';
import { ProductTabs } from '../../components/organisms/ProductTabs';
import { RelatedProducts } from '../../components/organisms/RelatedProducts';
import { LoadingSpinner } from '../../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../../components/molecules/ErrorMessage';
import './ProductDetailPage.scss';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId!);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !product) {
    return <ErrorMessage message="Product not found" />;
  }
  
  return (
    <div className="product-detail-page">
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
  );
};
```

## Form State Management

We use React Hook Form for form state management, which provides a performant and flexible way to handle forms.

### Checkout Form

```tsx
// src/components/organisms/CheckoutForm/CheckoutForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Button } from '../../atoms/Button';
import { useSubmitOrderMutation } from '../../../store/services/orderApi';
import './CheckoutForm.scss';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
}

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
  paymentMethod: yup.string().required('Payment method is required'),
});

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      paymentMethod: 'credit-card',
    },
  });
  
  const [submitOrder, { isLoading }] = useSubmitOrderMutation();
  
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const result = await submitOrder(data).unwrap();
      onSuccess(result.orderId);
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };
  
  return (
    <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="checkout-form__section">
        <h2>Contact Information</h2>
        
        <div className="checkout-form__row">
          <div className="checkout-form__field">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  label="First Name"
                  error={errors.firstName?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="checkout-form__field">
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Last Name"
                  error={errors.lastName?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
        </div>
        
        <div className="checkout-form__row">
          <div className="checkout-form__field">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  label="Email"
                  type="email"
                  error={errors.email?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="checkout-form__field">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  label="Phone"
                  type="tel"
                  error={errors.phone?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </div>
      
      <div className="checkout-form__section">
        <h2>Shipping Address</h2>
        
        <div className="checkout-form__field">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                label="Address"
                error={errors.address?.message}
                required
                {...field}
              />
            )}
          />
        </div>
        
        <div className="checkout-form__row">
          <div className="checkout-form__field">
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  label="City"
                  error={errors.city?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="checkout-form__field">
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Input
                  label="State"
                  error={errors.state?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="checkout-form__field">
            <Controller
              name="zipCode"
              control={
