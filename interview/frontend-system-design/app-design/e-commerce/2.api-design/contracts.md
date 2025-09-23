# E-commerce Application API Contracts

This document outlines the API contracts for the e-commerce application, detailing the REST endpoints and GraphQL operations that form the interface between the frontend and backend systems.

## Table of Contents

1. [REST API Endpoints](#rest-api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#user-endpoints)
   - [Products](#product-endpoints)
   - [Categories](#category-endpoints)
   - [Cart](#cart-endpoints)
   - [Orders](#order-endpoints)
   - [Reviews](#review-endpoints)
   - [Wishlist](#wishlist-endpoints)
   - [Search](#search-endpoints)
   - [Payments](#payment-endpoints)
   - [Shipping](#shipping-endpoints)

2. [GraphQL API](#graphql-api)
   - [Queries](#queries)
   - [Mutations](#mutations)
   - [Subscriptions](#subscriptions)
   - [Custom Types](#custom-types)

## REST API Endpoints

All REST endpoints are prefixed with `/api/v1` to support versioning. Authentication is required for protected endpoints and is handled via JWT tokens in the Authorization header.

### Authentication Endpoints

#### Register a new user

```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-09-15T14:30:00Z"
}
```

#### Login

```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Refresh Token

```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```
POST /api/v1/auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (204 No Content)**

#### Reset Password Request

```
POST /api/v1/auth/reset-password-request
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If the email exists in our system, a password reset link has been sent."
}
```

#### Reset Password

```
POST /api/v1/auth/reset-password
```

**Request Body:**
```json
{
  "token": "resetToken123",
  "password": "newSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password has been reset successfully."
}
```

### User Endpoints

#### Get Current User

```
GET /api/v1/users/me
```

**Response (200 OK):**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "createdAt": "2023-09-15T14:30:00Z",
  "updatedAt": "2023-09-15T14:30:00Z"
}
```

#### Update User Profile

```
PUT /api/v1/users/me
```

**Request Body:**
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "Johnny",
  "lastName": "Doe",
  "phone": "+1234567890",
  "updatedAt": "2023-09-15T15:30:00Z"
}
```

#### Get User Addresses

```
GET /api/v1/users/me/addresses
```

**Response (200 OK):**
```json
{
  "addresses": [
    {
      "id": "addr123",
      "type": "shipping",
      "isDefault": true,
      "firstName": "John",
      "lastName": "Doe",
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US",
      "phone": "+1234567890"
    }
  ]
}
```

#### Add User Address

```
POST /api/v1/users/me/addresses
```

**Request Body:**
```json
{
  "type": "shipping",
  "isDefault": true,
  "firstName": "John",
  "lastName": "Doe",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "US",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "id": "addr123",
  "type": "shipping",
  "isDefault": true,
  "firstName": "John",
  "lastName": "Doe",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "US",
  "phone": "+1234567890"
}
```

#### Update User Address

```
PUT /api/v1/users/me/addresses/{addressId}
```

**Request Body:**
```json
{
  "isDefault": true,
  "line1": "456 New St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10002",
  "country": "US"
}
```

**Response (200 OK):**
```json
{
  "id": "addr123",
  "type": "shipping",
  "isDefault": true,
  "firstName": "John",
  "lastName": "Doe",
  "line1": "456 New St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10002",
  "country": "US",
  "phone": "+1234567890"
}
```

#### Delete User Address

```
DELETE /api/v1/users/me/addresses/{addressId}
```

**Response (204 No Content)**

### Product Endpoints

#### Get Products

```
GET /api/v1/products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort field (default: "createdAt")
- `order` (optional): Sort order ("asc" or "desc", default: "desc")
- `category` (optional): Filter by category ID
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search term

**Response (200 OK):**
```json
{
  "products": [
    {
      "id": "prod123",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 99.99,
      "compareAtPrice": 129.99,
      "currency": "USD",
      "sku": "WH-001",
      "inventory": {
        "available": 50,
        "inStock": true
      },
      "images": [
        {
          "id": "img123",
          "url": "https://example.com/images/headphones-1.jpg",
          "alt": "Wireless Headphones - Front View"
        }
      ],
      "thumbnail": {
        "url": "https://example.com/images/headphones-1-thumb.jpg",
        "alt": "Wireless Headphones - Thumbnail"
      },
      "categories": [
        {
          "id": "cat123",
          "name": "Electronics",
          "slug": "electronics"
        }
      ],
      "attributes": [
        {
          "name": "Color",
          "value": "Black"
        },
        {
          "name": "Connectivity",
          "value": "Bluetooth 5.0"
        }
      ],
      "rating": {
        "average": 4.5,
        "count": 128
      },
      "createdAt": "2023-09-01T10:00:00Z",
      "updatedAt": "2023-09-10T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 200,
    "totalPages": 10
  }
}
```

#### Get Product by ID

```
GET /api/v1/products/{productId}
```

**Response (200 OK):**
```json
{
  "id": "prod123",
  "name": "Wireless Headphones",
  "slug": "wireless-headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "detailedDescription": "<p>Experience crystal clear sound with our premium wireless headphones...</p>",
  "price": 99.99,
  "compareAtPrice": 129.99,
  "currency": "USD",
  "sku": "WH-001",
  "inventory": {
    "available": 50,
    "inStock": true,
    "managementType": "tracked"
  },
  "images": [
    {
      "id": "img123",
      "url": "https://example.com/images/headphones-1.jpg",
      "alt": "Wireless Headphones - Front View"
    },
    {
      "id": "img124",
      "url": "https://example.com/images/headphones-2.jpg",
      "alt": "Wireless Headphones - Side View"
    }
  ],
  "thumbnail": {
    "url": "https://example.com/images/headphones-1-thumb.jpg",
    "alt": "Wireless Headphones - Thumbnail"
  },
  "categories": [
    {
      "id": "cat123",
      "name": "Electronics",
      "slug": "electronics"
    },
    {
      "id": "cat456",
      "name": "Audio",
      "slug": "audio"
    }
  ],
  "attributes": [
    {
      "name": "Color",
      "value": "Black"
    },
    {
      "name": "Connectivity",
      "value": "Bluetooth 5.0"
    },
    {
      "name": "Battery Life",
      "value": "20 hours"
    }
  ],
  "variants": [
    {
      "id": "var123",
      "sku": "WH-001-BLK",
      "attributes": [
        {
          "name": "Color",
          "value": "Black"
        }
      ],
      "price": 99.99,
      "inventory": {
        "available": 30,
        "inStock": true
      },
      "image": {
        "url": "https://example.com/images/headphones-black.jpg",
        "alt": "Wireless Headphones - Black"
      }
    },
    {
      "id": "var124",
      "sku": "WH-001-WHT",
      "attributes": [
        {
          "name": "Color",
          "value": "White"
        }
      ],
      "price": 99.99,
      "inventory": {
        "available": 20,
        "inStock": true
      },
      "image": {
        "url": "https://example.com/images/headphones-white.jpg",
        "alt": "Wireless Headphones - White"
      }
    }
  ],
  "relatedProducts": [
    {
      "id": "prod456",
      "name": "Wireless Earbuds",
      "slug": "wireless-earbuds",
      "price": 79.99,
      "thumbnail": {
        "url": "https://example.com/images/earbuds-thumb.jpg",
        "alt": "Wireless Earbuds - Thumbnail"
      }
    }
  ],
  "rating": {
    "average": 4.5,
    "count": 128,
    "distribution": {
      "5": 80,
      "4": 30,
      "3": 10,
      "2": 5,
      "1": 3
    }
  },
  "seo": {
    "title": "Premium Wireless Headphones with Noise Cancellation",
    "description": "Experience crystal clear sound with our premium wireless headphones with 20-hour battery life and noise cancellation.",
    "keywords": ["headphones", "wireless", "noise cancellation", "audio"]
  },
  "createdAt": "2023-09-01T10:00:00Z",
  "updatedAt": "2023-09-10T15:30:00Z"
}
```

#### Get Product by Slug

```
GET /api/v1/products/slug/{productSlug}
```

**Response:** Same as Get Product by ID

#### Get Product Reviews

```
GET /api/v1/products/{productId}/reviews
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort field (default: "createdAt")
- `order` (optional): Sort order ("asc" or "desc", default: "desc")
- `rating` (optional): Filter by rating (1-5)

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": "rev123",
      "productId": "prod123",
      "userId": "user456",
      "userName": "Jane D.",
      "rating": 5,
      "title": "Amazing sound quality!",
      "content": "These headphones have incredible sound quality and the noise cancellation works perfectly.",
      "verified": true,
      "helpful": 15,
      "createdAt": "2023-09-05T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 128,
    "totalPages": 7
  }
}
```

### Category Endpoints

#### Get Categories

```
GET /api/v1/categories
```

**Query Parameters:**
- `parent` (optional): Filter by parent category ID
- `includeProducts` (optional): Include product counts (default: false)
- `depth` (optional): Depth of subcategories to include (default: 1)

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "cat123",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and accessories",
      "image": {
        "url": "https://example.com/images/electronics.jpg",
        "alt": "Electronics Category"
      },
      "parent": null,
      "level": 0,
      "productCount": 1500,
      "subcategories": [
        {
          "id": "cat456",
          "name": "Audio",
          "slug": "audio",
          "description": "Audio devices and accessories",
          "image": {
            "url": "https://example.com/images/audio.jpg",
            "alt": "Audio Category"
          },
          "parent": "cat123",
          "level": 1,
          "productCount": 300
        }
      ]
    }
  ]
}
```

#### Get Category by ID

```
GET /api/v1/categories/{categoryId}
```

**Query Parameters:**
- `includeProducts` (optional): Include sample products (default: false)
- `productLimit` (optional): Number of sample products to include (default: 5)

**Response (200 OK):**
```json
{
  "id": "cat456",
  "name": "Audio",
  "slug": "audio",
  "description": "Audio devices and accessories",
  "detailedDescription": "<p>Explore our range of high-quality audio devices...</p>",
  "image": {
    "url": "https://example.com/images/audio.jpg",
    "alt": "Audio Category"
  },
  "banner": {
    "url": "https://example.com/images/audio-banner.jpg",
    "alt": "Audio Category Banner"
  },
  "parent": {
    "id": "cat123",
    "name": "Electronics",
    "slug": "electronics"
  },
  "level": 1,
  "productCount": 300,
  "subcategories": [
    {
      "id": "cat789",
      "name": "Headphones",
      "slug": "headphones",
      "image": {
        "url": "https://example.com/images/headphones-category.jpg",
        "alt": "Headphones Category"
      },
      "productCount": 100
    }
  ],
  "sampleProducts": [
    {
      "id": "prod123",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "price": 99.99,
      "thumbnail": {
        "url": "https://example.com/images/headphones-1-thumb.jpg",
        "alt": "Wireless Headphones - Thumbnail"
      }
    }
  ],
  "filters": [
    {
      "name": "Brand",
      "type": "select",
      "options": ["Sony", "Bose", "JBL", "Sennheiser"]
    },
    {
      "name": "Price",
      "type": "range",
      "min": 19.99,
      "max": 499.99
    }
  ],
  "seo": {
    "title": "Audio Equipment - Headphones, Speakers & More",
    "description": "Shop our wide selection of premium audio equipment including headphones, speakers, and accessories.",
    "keywords": ["audio", "headphones", "speakers", "sound"]
  }
}
```

#### Get Category by Slug

```
GET /api/v1/categories/slug/{categorySlug}
```

**Response:** Same as Get Category by ID

### Cart Endpoints

#### Get Cart

```
GET /api/v1/cart
```

**Response (200 OK):**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item123",
      "productId": "prod123",
      "variantId": "var123",
      "name": "Wireless Headphones",
      "sku": "WH-001-BLK",
      "quantity": 1,
      "price": 99.99,
      "compareAtPrice": 129.99,
      "attributes": [
        {
          "name": "Color",
          "value": "Black"
        }
      ],
      "image": {
        "url": "https://example.com/images/headphones-black.jpg",
        "alt": "Wireless Headphones - Black"
      },
      "subtotal": 99.99
    }
  ],
  "itemCount": 1,
  "subtotal": 99.99,
  "discounts": [
    {
      "code": "SUMMER10",
      "type": "percentage",
      "value": 10,
      "amount": 10.00
    }
  ],
  "shipping": {
    "method": "standard",
    "cost": 5.99
  },
  "tax": {
    "rate": 8.25,
    "amount": 7.92
  },
  "total": 103.90,
  "currency": "USD",
  "createdAt": "2023-09-15T10:00:00Z",
  "updatedAt": "2023-09-15T10:05:00Z"
}
```

#### Add Item to Cart

```
POST /api/v1/cart/items
```

**Request Body:**
```json
{
  "productId": "prod123",
  "variantId": "var123",
  "quantity": 1
}
```

**Response (200 OK):**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item123",
      "productId": "prod123",
      "variantId": "var123",
      "name": "Wireless Headphones",
      "sku": "WH-001-BLK",
      "quantity": 1,
      "price": 99.99,
      "compareAtPrice": 129.99,
      "attributes": [
        {
          "name": "Color",
          "value": "Black"
        }
      ],
      "image": {
        "url": "https://example.com/images/headphones-black.jpg",
        "alt": "Wireless Headphones - Black"
      },
      "subtotal": 99.99
    }
  ],
  "itemCount": 1,
  "subtotal": 99.99,
  "total": 99.99,
  "currency": "USD"
}
```

#### Update Cart Item

```
PUT /api/v1/cart/items/{itemId}
```

**Request Body:**
```json
{
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item123",
      "productId": "prod123",
      "variantId": "var123",
      "name": "Wireless Headphones",
      "sku": "WH-001-BLK",
      "quantity": 2,
      "price": 99.99,
      "compareAtPrice": 129.99,
      "attributes": [
        {
          "name": "Color",
          "value": "Black"
        }
      ],
      "image": {
        "url": "https://example.com/images/headphones-black.jpg",
        "alt": "Wireless Headphones - Black"
      },
      "subtotal": 199.98
    }
  ],
  "itemCount": 2,
  "subtotal": 199.98,
  "total": 199.98,
  "currency": "USD"
}
```

#### Remove Cart Item

```
DELETE /api/v1/cart/items/{itemId}
```

**Response (200 OK):**
```json
{
  "id": "cart123",
  "items": [],
  "itemCount": 0,
  "subtotal": 0,
  "total": 0,
  "currency": "USD"
}
```

#### Apply Discount Code

```
POST /api/v1/cart/discounts
```

**Request Body:**
```json
{
  "code": "SUMMER10"
}
```

**Response (200 OK):**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item123",
      "productId": "prod123",
      "variantId": "var123",
      "name": "Wireless Headphones",
      "quantity": 1,
      "price": 99.99,
      "subtotal": 99.99
    }
  ],
  "itemCount": 1,
  "subtotal": 99.99,
  "discounts": [
    {
      "code": "SUMMER10",
      "type": "percentage",
      "value": 10,
      "amount": 10.00
    }
  ],
  "total": 89.99,
  "currency": "USD"
}
```

#### Remove Discount Code

```
DELETE /api/v1/cart/discounts/{code}
```

**Response (200 OK):**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item123",
      "productId": "prod123",
      "variantId": "var123",
      "name": "Wireless Headphones",
      "quantity": 1,
      "price": 99.99,
      "subtotal": 99.99
    }
  ],
  "itemCount": 1,
  "subtotal": 99.99,
  "discounts": [],
  "total": 99.99,
  "currency": "USD"
}
```

### Order Endpoints

#### Create Order

```
POST /api/v1/orders
```

**Request Body:**
```json
{
  "cartId": "cart123",
  "shippingAddressId": "addr123",
  "billingAddressId": "addr456",
  "shippingMethod": "standard",
  "paymentMethod": "stripe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "notes": "Please leave at the front door"
}
```

**Response (201 Created):**
```json
{
  "id": "order123",
  "number": "ORD-10001",
  "status": "pending",
  "items": [
    {
      "id": "item123",
      "productId": "prod123",
      "variantId": "var123",
      "name": "Wireless Headphones",
      "sku": "WH-001-BLK",
      "quantity": 1,
      "price": 99.99,
      "attributes": [
        {
          "name": "Color",
          "value": "Black"
        }
      ],
      "image": {
        "url": "https://example.com/images/headphones-black.jpg",
        "alt": "Wireless Headphones - Black"
      },
      "subtotal": 99.99
    }
  ],
  "itemCount": 1,
  "subtotal": 99.99,
  "discounts": [
    {
      "code": "SUMMER10",
      "type": "percentage",
      "value": 10,
      "amount": 10.00
    }
  ],
  "shipping": {
    "method": "standard",
    "cost": 5.99
  },
  "tax": {
    "rate": 8.25,
    "amount": 7.92
  },
  "total": 103.90,
  "currency": "USD",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "paymentStatus": "pending",
  "paymentMethod": "stripe",
  "paymentDetails": {
    "clientSecret": "pi_3NqLkKLkdIwHh6Es1SYqB8WN_secret_YWJjMTIzYWJjMTIzYWJjMTIzYWJj"
  },
  "email": "user@example.com",
  "phone": "+1234567890",
  "notes": "Please leave at the front door",
  "createdAt": "2023-09-15T11:00:00Z"
}
```

#### Get Orders

```
GET /api/v1/orders
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response (200 OK):**
```json
{
  "orders": [
    {
      "id": "order123",
      "number": "ORD-10001",
      "status": "processing",
      "itemCount": 1,
      "total": 103.90,
      "currency": "USD",
      "paymentStatus": "paid",
      "createdAt": "2023-09-15T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 5,
    "totalPages": 1
  }
}
```

#### Get Order by ID

```
GET /api/v1/orders/{orderId}
```

**Response (200 OK):**
```json
{
  "id": "order123",
  "number": "ORD-10001",
  "status": "processing",
  "items": [
    {
      "id": "item123",
      "productId": "prod123",
      "variantId": "var123",
      "name": "Wireless Headphones",
      "sku": "WH-001-BLK",
      "quantity": 1,
      "price": 99.99,
      "attributes": [
        {
          "name": "Color",
          "value": "Black"
        }
      ],
      "image": {
        "url": "https://example.com/images/headphones-black.jpg",
        "alt": "Wireless Headphones - Black"
      },
      "subtotal": 99.99
    }
  ],
  "itemCount": 1,
  "subtotal": 99.99,
  "discounts": [
    {
      "code": "SUMMER10",
      "type": "percentage",
      "value": 10,
      "amount": 10.00
    }
  ],
  "shipping": {
    "method":
