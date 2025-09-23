# E-commerce Application JSON Schemas and Validation Rules

This document defines the JSON schemas and validation rules for the core entities in the e-commerce application. These schemas are used for data validation, documentation, and ensuring data consistency across the application.

## Table of Contents

1. [Introduction](#introduction)
2. [User Schema](#user-schema)
3. [Product Schema](#product-schema)
4. [Category Schema](#category-schema)
5. [Cart Schema](#cart-schema)
6. [Order Schema](#order-schema)
7. [Review Schema](#review-schema)
8. [Discount Schema](#discount-schema)
9. [Validation Strategies](#validation-strategies)

## Introduction

JSON Schema is used to define the structure, content, and validation rules for JSON data in the application. These schemas serve multiple purposes:

- **Data Validation**: Ensuring that data conforms to expected formats and constraints
- **Documentation**: Providing clear specifications for API consumers
- **Code Generation**: Enabling automatic generation of TypeScript interfaces
- **Testing**: Supporting automated testing of data structures
- **Form Generation**: Facilitating dynamic form generation based on schema definitions

## User Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "description": "A registered user of the e-commerce application",
  "type": "object",
  "required": ["id", "email", "firstName", "lastName", "isActive", "isEmailVerified", "roles", "preferences", "createdAt", "updatedAt"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the user"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "User's email address"
    },
    "firstName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "description": "User's first name"
    },
    "lastName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "description": "User's last name"
    },
    "phone": {
      "type": "string",
      "pattern": "^\\+?[0-9\\s\\-\\(\\)]+$",
      "description": "User's phone number"
    },
    "isActive": {
      "type": "boolean",
      "description": "Whether the user account is active"
    },
    "isEmailVerified": {
      "type": "boolean",
      "description": "Whether the user's email has been verified"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["customer", "admin", "support", "partner"]
      },
      "minItems": 1,
      "description": "User roles for permission management"
    },
    "preferences": {
      "type": "object",
      "required": ["language", "currency", "notifications", "marketing"],
      "properties": {
        "language": {
          "type": "string",
          "pattern": "^[a-z]{2}(-[A-Z]{2})?$",
          "description": "User's preferred language code (e.g., 'en-US')"
        },
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$",
          "description": "User's preferred currency code (e.g., 'USD')"
        },
        "notifications": {
          "type": "object",
          "required": ["email", "sms", "push"],
          "properties": {
            "email": {
              "type": "boolean"
            },
            "sms": {
              "type": "boolean"
            },
            "push": {
              "type": "boolean"
            }
          }
        },
        "marketing": {
          "type": "object",
          "required": ["email", "sms"],
          "properties": {
            "email": {
              "type": "boolean"
            },
            "sms": {
              "type": "boolean"
            }
          }
        }
      }
    },
    "addresses": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Address"
      }
    },
    "paymentMethods": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/PaymentMethod"
      }
    },
    "lastLoginAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of the user's last login"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the user was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the user was last updated"
    }
  },
  "definitions": {
    "Address": {
      "type": "object",
      "required": ["id", "userId", "type", "isDefault", "firstName", "lastName", "line1", "city", "state", "postalCode", "country", "createdAt", "updatedAt"],
      "properties": {
        "id": {
          "type": "string"
        },
        "userId": {
          "type": "string"
        },
        "type": {
          "type": "string",
          "enum": ["shipping", "billing"]
        },
        "isDefault": {
          "type": "boolean"
        },
        "firstName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "lastName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "line1": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100
        },
        "line2": {
          "type": "string",
          "maxLength": 100
        },
        "city": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "state": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "postalCode": {
          "type": "string",
          "minLength": 1,
          "maxLength": 20
        },
        "country": {
          "type": "string",
          "minLength": 2,
          "maxLength": 2,
          "pattern": "^[A-Z]{2}$"
        },
        "phone": {
          "type": "string",
          "pattern": "^\\+?[0-9\\s\\-\\(\\)]+$"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "PaymentMethod": {
      "type": "object",
      "required": ["id", "userId", "type", "isDefault", "createdAt", "updatedAt"],
      "properties": {
        "id": {
          "type": "string"
        },
        "userId": {
          "type": "string"
        },
        "type": {
          "type": "string",
          "enum": ["card", "paypal", "bank_account"]
        },
        "isDefault": {
          "type": "boolean"
        },
        "card": {
          "type": "object",
          "required": ["brand", "last4", "expiryMonth", "expiryYear"],
          "properties": {
            "brand": {
              "type": "string"
            },
            "last4": {
              "type": "string",
              "pattern": "^[0-9]{4}$"
            },
            "expiryMonth": {
              "type": "integer",
              "minimum": 1,
              "maximum": 12
            },
            "expiryYear": {
              "type": "integer",
              "minimum": 2000
            }
          }
        },
        "paypal": {
          "type": "object",
          "required": ["email"],
          "properties": {
            "email": {
              "type": "string",
              "format": "email"
            }
          }
        },
        "bankAccount": {
          "type": "object",
          "required": ["bankName", "accountLast4", "accountType"],
          "properties": {
            "bankName": {
              "type": "string"
            },
            "accountLast4": {
              "type": "string",
              "pattern": "^[0-9]{4}$"
            },
            "accountType": {
              "type": "string"
            }
          }
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
}
```

## Product Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Product",
  "description": "A product available for purchase in the e-commerce store",
  "type": "object",
  "required": ["id", "name", "slug", "description", "price", "currency", "sku", "inventory", "images", "thumbnail", "categories", "attributes", "seo", "isActive", "isVisible", "createdAt", "updatedAt"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the product"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Product name"
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      "description": "URL-friendly version of the product name"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500,
      "description": "Short product description"
    },
    "detailedDescription": {
      "type": "string",
      "description": "Detailed HTML description of the product"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true,
      "description": "Current product price"
    },
    "compareAtPrice": {
      "type": "number",
      "minimum": 0,
      "description": "Original price for showing discounts"
    },
    "currency": {
      "type": "string",
      "pattern": "^[A-Z]{3}$",
      "description": "Currency code (e.g., 'USD')"
    },
    "sku": {
      "type": "string",
      "minLength": 1,
      "description": "Stock keeping unit"
    },
    "inventory": {
      "type": "object",
      "required": ["available", "inStock", "managementType"],
      "properties": {
        "available": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of items available"
        },
        "inStock": {
          "type": "boolean",
          "description": "Whether the product is in stock"
        },
        "managementType": {
          "type": "string",
          "enum": ["tracked", "untracked"],
          "description": "How inventory is managed"
        },
        "lowStockThreshold": {
          "type": "integer",
          "minimum": 1,
          "description": "Threshold for low stock alerts"
        }
      }
    },
    "images": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Image"
      },
      "minItems": 1,
      "description": "Product images"
    },
    "thumbnail": {
      "$ref": "#/definitions/Image",
      "description": "Product thumbnail image"
    },
    "categories": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/CategoryReference"
      },
      "minItems": 1,
      "description": "Categories the product belongs to"
    },
    "attributes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "value"],
        "properties": {
          "name": {
            "type": "string"
          },
          "value": {
            "type": "string"
          }
        }
      },
      "description": "Product attributes"
    },
    "variants": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ProductVariant"
      },
      "description": "Product variants"
    },
    "relatedProducts": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/RelatedProduct"
      },
      "description": "Related products"
    },
    "rating": {
      "type": "object",
      "required": ["average", "count"],
      "properties": {
        "average": {
          "type": "number",
          "minimum": 0,
          "maximum": 5,
          "description": "Average rating (0-5)"
        },
        "count": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of ratings"
        },
        "distribution": {
          "type": "object",
          "patternProperties": {
            "^[1-5]$": {
              "type": "integer",
              "minimum": 0
            }
          },
          "description": "Distribution of ratings"
        }
      },
      "description": "Product rating information"
    },
    "seo": {
      "$ref": "#/definitions/SEOMetadata",
      "description": "SEO metadata"
    },
    "specifications": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["group", "items"],
        "properties": {
          "group": {
            "type": "string"
          },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["name", "value"],
              "properties": {
                "name": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "description": "Product specifications grouped by category"
    },
    "isActive": {
      "type": "boolean",
      "description": "Whether the product is active"
    },
    "isVisible": {
      "type": "boolean",
      "description": "Whether the product is visible in listings"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the product was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the product was last updated"
    }
  },
  "definitions": {
    "Image": {
      "type": "object",
      "required": ["url", "alt"],
      "properties": {
        "id": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "alt": {
          "type": "string"
        },
        "width": {
          "type": "integer",
          "minimum": 1
        },
        "height": {
          "type": "integer",
          "minimum": 1
        },
        "isPrimary": {
          "type": "boolean"
        },
        "displayOrder": {
          "type": "integer",
          "minimum": 0
        }
      }
    },
    "CategoryReference": {
      "type": "object",
      "required": ["id", "name", "slug"],
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    },
    "ProductVariant": {
      "type": "object",
      "required": ["id", "productId", "sku", "attributes", "price", "inventory", "createdAt", "updatedAt"],
      "properties": {
        "id": {
          "type": "string"
        },
        "productId": {
          "type": "string"
        },
        "sku": {
          "type": "string"
        },
        "attributes": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "value"],
            "properties": {
              "name": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            }
          },
          "minItems": 1
        },
        "price": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "compareAtPrice": {
          "type": "number",
          "minimum": 0
        },
        "inventory": {
          "type": "object",
          "required": ["available", "inStock"],
          "properties": {
            "available": {
              "type": "integer",
              "minimum": 0
            },
            "inStock": {
              "type": "boolean"
            }
          }
        },
        "image": {
          "$ref": "#/definitions/Image"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "RelatedProduct": {
      "type": "object",
      "required": ["id", "name", "slug", "price", "thumbnail"],
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        },
        "price": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "thumbnail": {
          "$ref": "#/definitions/Image"
        }
      }
    },
    "SEOMetadata": {
      "type": "object",
      "required": ["title", "description"],
      "properties": {
        "title": {
          "type": "string",
          "maxLength": 60
        },
        "description": {
          "type": "string",
          "maxLength": 160
        },
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "canonicalUrl": {
          "type": "string",
          "format": "uri"
        },
        "ogImage": {
          "type": "string",
          "format": "uri"
        }
      }
    }
  }
}
```

## Category Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Category",
  "description": "A product category in the e-commerce store",
  "type": "object",
  "required": ["id", "name", "slug", "level", "seo", "isActive", "displayOrder", "createdAt", "updatedAt"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the category"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "description": "Category name"
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      "description": "URL-friendly version of the category name"
    },
    "description": {
      "type": "string",
      "maxLength": 500,
      "description": "Short category description"
    },
    "detailedDescription": {
      "type": "string",
      "description": "Detailed HTML description of the category"
    },
    "image": {
      "$ref": "#/definitions/Image",
      "description": "Category image"
    },
    "banner": {
      "$ref": "#/definitions/Image",
      "description": "Category banner image"
    },
    "parentId": {
      "type": "string",
      "description": "ID of the parent category"
    },
    "level": {
      "type": "integer",
      "minimum": 0,
      "description": "Nesting level in the category hierarchy (0 for root)"
    },
    "productCount": {
      "type": "integer",
      "minimum": 0,
      "description": "Number of products in this category"
    },
    "subcategories": {
      "type": "array",
      "items": {
        "$ref": "#"
      },
      "description": "Subcategories within this category"
    },
    "seo": {
      "$ref": "#/definitions/SEOMetadata",
      "description": "SEO metadata"
    },
    "isActive": {
      "type": "boolean",
      "description": "Whether the category is active"
    },
    "displayOrder": {
      "type": "integer",
      "minimum": 0,
      "description": "Order for displaying categories"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the category was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the category was last updated"
    }
  },
  "definitions": {
    "Image": {
      "type": "object",
      "required": ["url", "alt"],
      "properties": {
        "id": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "alt": {
          "type": "string"
        },
        "width": {
          "type": "integer",
          "minimum": 1
        },
        "height": {
          "type": "integer",
          "minimum": 1
        }
      }
    },
    "SEOMetadata": {
      "type": "object",
      "required": ["title", "description"],
      "properties": {
        "title": {
          "type": "string",
          "maxLength": 60
        },
        "description": {
          "type": "string",
          "maxLength": 160
        },
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "canonicalUrl": {
          "type": "string",
          "format": "uri"
        },
        "ogImage": {
          "type": "string",
          "format": "uri"
        }
      }
    }
  }
}
```

## Cart Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Cart",
  "description": "A shopping cart in the e-commerce store",
  "type": "object",
  "required": ["id", "items", "itemCount", "subtotal", "total", "currency", "createdAt", "updatedAt"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the cart"
    },
    "userId": {
      "type": "string",
      "description": "ID of the user who owns the cart (for authenticated users)"
    },
    "guestId": {
      "type": "string",
      "description": "ID for guest users (non-authenticated)"
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/CartItem"
      },
      "description": "Items in the cart"
    },
    "itemCount": {
      "type": "integer",
      "minimum": 0,
      "description": "Total number of items in the cart"
    },
    "subtotal": {
      "type": "number",
      "minimum": 0,
      "description": "Subtotal of all items before discounts, shipping, and taxes"
    },
    "discounts": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Discount"
      },
      "description": "Applied discounts"
    },
    "shipping": {
      "$ref": "#/definitions/ShippingInfo",
      "description": "Shipping information"
    },
    "tax": {
      "$ref": "#/definitions/TaxInfo",
      "description": "Tax information"
    },
    "total": {
      "type": "number",
      "minimum": 0,
      "description": "Total price including discounts, shipping, and taxes"
    },
    "currency": {
      "type": "string",
      "pattern": "^[A-Z]{3}$",
      "description": "Currency code (e.g., 'USD')"
    },
    "expiresAt": {
      "type": "string",
      "format": "date-time",
      "description": "Expiration timestamp for the cart"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the cart was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the cart was last updated"
    }
  },
  "definitions": {
    "CartItem": {
      "type": "object",
      "required": ["id", "cartId", "productId", "name", "sku", "quantity", "price", "subtotal", "createdAt", "updatedAt"],
      "properties": {
        "id": {
          "type": "string"
        },
        "cartId": {
          "type": "string"
        },
        "productId": {
          "type": "string"
        },
        "variantId": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "sku": {
          "type": "string"
        },
        "quantity": {
          "type": "integer",
          "minimum": 1
        },
        "price": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "compareAtPrice": {
          "type": "number",
          "minimum": 0
        },
        "attributes": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "value"],
            "properties": {
              "name": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            }
          }
        },
        "image": {
          "$ref": "#/definitions/Image"
        },
        "subtotal": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "Discount": {
      "type": "object",
      "required": ["code", "type", "value", "amount"],
      "properties": {
        "code": {
          "type": "string"
        },
        "type": {
          "type": "string",
          "enum": ["percentage", "fixed", "free_shipping"]
        },
        "value": {
          "type": "number",
          "minimum": 0
        },
        "amount": {
          "type": "number",
          "minimum": 0
        }
      }
    },
    "ShippingInfo": {
      "type": "object",
      "required": ["method", "cost"],
      "properties": {
        "method": {
          "type": "string"
        },
        "cost": {
          "type": "number",
          "minimum": 0
        }
      }
    },
    "TaxInfo": {
      "type": "object",
      "required": ["rate", "amount"],
      "properties": {
        "rate": {
          "type": "number",
          "minimum": 0
        },
        "amount": {
          "type": "number",
          "minimum": 0
        }
      }
    },
    "Image": {
      "type": "object",
      "required": ["url", "alt"],
      "properties": {
        "url": {
          "type": "string",
          "format": "uri"
        },
        "alt": {
          "type": "string"
        }
      }
    }
  }
}
```

## Order Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Order",
  "description": "A customer order in the e-commerce store",
  "type": "object",
  "required": ["id", "number", "status", "items", "itemCount", "subtotal", "shipping", "tax", "total", "currency", "shippingAddress", "billingAddress", "paymentStatus", "paymentMethod", "timeline", "email", "createdAt", "updatedAt"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the order"
    },
    "userId": {
      "type": "string",
      "description": "ID of the user who placed the order (for authenticated users)"
    },
    "number": {
      "type": "string",
      "description": "Human-readable order number"
    },
    "status": {
      "type": "string",
      "enum": ["pending", "processing", "shipped", "delivered", "cancelled", "refunded", "on_hold"],
      "description": "Current status of the order"
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/OrderItem"
      },
      "minItems": 1,
      "description": "Items in the order"
    },
    "itemCount": {
      "type": "integer",
      "minimum": 1,
      "description": "Total number of items in the order"
    },
    "subtotal": {
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true,
      "description": "Subtotal of all items before discounts, shipping
