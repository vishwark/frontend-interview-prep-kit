# E-commerce Application API Payloads

This document provides examples of request and response payloads for key API endpoints in the e-commerce application. These examples illustrate the structure and format of data exchanged between the frontend and backend systems.

## Table of Contents

1. [Authentication](#authentication)
   - [Register](#register)
   - [Login](#login)
   - [Refresh Token](#refresh-token)

2. [Products](#products)
   - [Get Products](#get-products)
   - [Get Product Details](#get-product-details)
   - [Search Products](#search-products)

3. [Cart](#cart)
   - [Get Cart](#get-cart)
   - [Add to Cart](#add-to-cart)
   - [Update Cart Item](#update-cart-item)
   - [Apply Discount](#apply-discount)

4. [Checkout](#checkout)
   - [Create Order](#create-order)
   - [Process Payment](#process-payment)
   - [Order Confirmation](#order-confirmation)

5. [User Profile](#user-profile)
   - [Get User Profile](#get-user-profile)
   - [Update User Profile](#update-user-profile)
   - [Add Address](#add-address)

6. [Reviews](#reviews)
   - [Get Product Reviews](#get-product-reviews)
   - [Submit Review](#submit-review)

## Authentication

### Register

**Request: `POST /api/v1/auth/register`**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "acceptsMarketing": true
}
```

**Response: `201 Created`**

```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-09-15T14:30:00Z"
}
```

### Login

**Request: `POST /api/v1/auth/login`**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response: `200 OK`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["customer"]
  }
}
```

### Refresh Token

**Request: `POST /api/v1/auth/refresh`**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response: `200 OK`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

## Products

### Get Products

**Request: `GET /api/v1/products?category=electronics&page=1&limit=20&sort=price&order=asc`**

**Response: `200 OK`**

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
    },
    // Additional products...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 200,
    "totalPages": 10
  },
  "filters": {
    "price": {
      "min": 19.99,
      "max": 499.99
    },
    "brands": ["Sony", "Bose", "JBL", "Sennheiser"],
    "colors": ["Black", "White", "Blue", "Red"]
  }
}
```

### Get Product Details

**Request: `GET /api/v1/products/prod123`**

**Response: `200 OK`**

```json
{
  "id": "prod123",
  "name": "Wireless Headphones",
  "slug": "wireless-headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "detailedDescription": "<p>Experience crystal clear sound with our premium wireless headphones featuring advanced noise cancellation technology, comfortable ear cups, and long battery life.</p><ul><li>Active noise cancellation</li><li>20-hour battery life</li><li>Bluetooth 5.0 connectivity</li><li>Comfortable over-ear design</li></ul>",
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
    },
    {
      "id": "img125",
      "url": "https://example.com/images/headphones-3.jpg",
      "alt": "Wireless Headphones - Folded View"
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
    },
    {
      "name": "Noise Cancellation",
      "value": "Active"
    },
    {
      "name": "Weight",
      "value": "250g"
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
    },
    {
      "id": "prod789",
      "name": "Headphone Case",
      "slug": "headphone-case",
      "price": 19.99,
      "thumbnail": {
        "url": "https://example.com/images/case-thumb.jpg",
        "alt": "Headphone Case - Thumbnail"
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
  "specifications": [
    {
      "group": "Technical Specifications",
      "items": [
        {
          "name": "Driver Size",
          "value": "40mm"
        },
        {
          "name": "Frequency Response",
          "value": "20Hz - 20kHz"
        },
        {
          "name": "Impedance",
          "value": "32 Ohms"
        }
      ]
    },
    {
      "group": "Connectivity",
      "items": [
        {
          "name": "Bluetooth Version",
          "value": "5.0"
        },
        {
          "name": "Wireless Range",
          "value": "10m (33ft)"
        },
        {
          "name": "Audio Codecs",
          "value": "SBC, AAC, aptX"
        }
      ]
    }
  ],
  "createdAt": "2023-09-01T10:00:00Z",
  "updatedAt": "2023-09-10T15:30:00Z"
}
```

### Search Products

**Request: `GET /api/v1/products/search?query=wireless+headphones&page=1&limit=20`**

**Response: `200 OK`**

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
      "thumbnail": {
        "url": "https://example.com/images/headphones-1-thumb.jpg",
        "alt": "Wireless Headphones - Thumbnail"
      },
      "rating": {
        "average": 4.5,
        "count": 128
      }
    },
    {
      "id": "prod456",
      "name": "Premium Wireless Headphones",
      "slug": "premium-wireless-headphones",
      "description": "Premium wireless headphones with studio-quality sound",
      "price": 199.99,
      "compareAtPrice": null,
      "currency": "USD",
      "thumbnail": {
        "url": "https://example.com/images/premium-headphones-thumb.jpg",
        "alt": "Premium Wireless Headphones - Thumbnail"
      },
      "rating": {
        "average": 4.8,
        "count": 85
      }
    }
    // Additional products...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 45,
    "totalPages": 3
  },
  "searchMetadata": {
    "query": "wireless headphones",
    "suggestedQueries": ["bluetooth headphones", "noise cancelling headphones"],
    "categories": [
      {
        "id": "cat456",
        "name": "Audio",
        "count": 45
      }
    ]
  }
}
```

## Cart

### Get Cart

**Request: `GET /api/v1/cart`**

**Response: `200 OK`**

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
    },
    {
      "id": "item456",
      "productId": "prod789",
      "variantId": null,
      "name": "Headphone Case",
      "sku": "HC-001",
      "quantity": 1,
      "price": 19.99,
      "compareAtPrice": null,
      "attributes": [],
      "image": {
        "url": "https://example.com/images/case.jpg",
        "alt": "Headphone Case"
      },
      "subtotal": 19.99
    }
  ],
  "itemCount": 2,
  "subtotal": 119.98,
  "discounts": [
    {
      "code": "SUMMER10",
      "type": "percentage",
      "value": 10,
      "amount": 12.00
    }
  ],
  "shipping": {
    "method": "standard",
    "cost": 5.99
  },
  "tax": {
    "rate": 8.25,
    "amount": 9.39
  },
  "total": 123.36,
  "currency": "USD",
  "createdAt": "2023-09-15T10:00:00Z",
  "updatedAt": "2023-09-15T10:05:00Z"
}
```

### Add to Cart

**Request: `POST /api/v1/cart/items`**

```json
{
  "productId": "prod123",
  "variantId": "var123",
  "quantity": 1
}
```

**Response: `200 OK`**

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

### Update Cart Item

**Request: `PUT /api/v1/cart/items/item123`**

```json
{
  "quantity": 2
}
```

**Response: `200 OK`**

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

### Apply Discount

**Request: `POST /api/v1/cart/discounts`**

```json
{
  "code": "SUMMER10"
}
```

**Response: `200 OK`**

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

## Checkout

### Create Order

**Request: `POST /api/v1/orders`**

```json
{
  "cartId": "cart123",
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
    "sameAsShipping": true
  },
  "shippingMethod": "standard",
  "paymentMethod": "stripe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "notes": "Please leave at the front door"
}
```

**Response: `201 Created`**

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

### Process Payment

**Request: `POST /api/v1/orders/order123/payments`**

```json
{
  "paymentMethodId": "pm_card_visa",
  "paymentIntentId": "pi_3NqLkKLkdIwHh6Es1SYqB8WN"
}
```

**Response: `200 OK`**

```json
{
  "orderId": "order123",
  "paymentStatus": "paid",
  "transactionId": "txn_3NqLkKLkdIwHh6Es1SYqB8WN",
  "amount": 103.90,
  "currency": "USD",
  "paymentMethod": "stripe",
  "paymentMethodDetails": {
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2025
    }
  },
  "timestamp": "2023-09-15T11:05:00Z"
}
```

### Order Confirmation

**Request: `GET /api/v1/orders/order123`**

**Response: `200 OK`**

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
    "method": "standard",
    "cost": 5.99,
    "carrier": "USPS",
    "estimatedDelivery": "2023-09-20T00:00:00Z"
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
  "paymentStatus": "paid",
  "paymentMethod": "stripe",
  "paymentDetails": {
    "transactionId": "txn_3NqLkKLkdIwHh6Es1SYqB8WN",
    "card": {
      "brand": "visa",
      "last4": "4242"
    }
  },
  "timeline": [
    {
      "status": "pending",
      "timestamp": "2023-09-15T11:00:00Z",
      "description": "Order created"
    },
    {
      "status": "paid",
      "timestamp": "2023-09-15T11:05:00Z",
      "description": "Payment received"
    },
    {
      "status": "processing",
      "timestamp": "2023-09-15T11:10:00Z",
      "description": "Order processing started"
    }
  ],
  "email": "user@example.com",
  "phone": "+1234567890",
  "notes": "Please leave at the front door",
  "createdAt": "2023-09-15T11:00:00Z",
  "updatedAt": "2023-09-15T11:10:00Z"
}
```

## User Profile

### Get User Profile

**Request: `GET /api/v1/users/me`**

**Response: `200 OK`**

```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "preferences": {
    "language": "en-US",
    "currency": "USD",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  },
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
    },
    {
      "id": "addr456",
      "type": "billing",
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
  ],
  "paymentMethods": [
    {
      "id": "pm123",
      "type": "card",
      "isDefault": true,
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expiryMonth": 12,
        "expiryYear": 2025
      }
    }
  ],
  "createdAt": "2023-09-01T10:00:00Z",
  "updatedAt": "2023-09-15T14:30:00Z"
}
```

### Update User Profile

**Request: `PUT /api/v1/users/me`**

```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "phone": "+1234567890",
  "preferences": {
    "language": "en-US",
    "currency": "USD",
    "notifications": {
      "email": true,
      "sms": true,
      "push": true
    }
  }
}
```

**Response: `200 OK`**

```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "Johnny",
  "lastName": "Doe",
  "phone": "+1234567890",
  "preferences": {
    "language": "en-US",
    "currency": "USD",
    "notifications": {
      "email": true,
      "sms": true,
      "push": true
    }
  },
  "updatedAt": "2023-09-15T15:30:00Z"
}
```

### Add Address

**Request: `POST /api/v1/users/me/addresses`**

```json
{
  "type": "shipping",
  "isDefault": true,
  "firstName": "John",
  "lastName": "Doe",
  "line1": "456 New St",
  "line2": "",
  "city": "Brooklyn",
  "state": "NY",
  "postalCode": "11201",
  "country": "US",
  "phone": "+
