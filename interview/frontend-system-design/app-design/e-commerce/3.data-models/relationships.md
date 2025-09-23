# E-commerce Application Entity Relationships

This document outlines the relationships between entities in the e-commerce application, providing a comprehensive view of how different data models interact with each other.

## Table of Contents

1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [Core Entity Relationships](#core-entity-relationships)
3. [One-to-One Relationships](#one-to-one-relationships)
4. [One-to-Many Relationships](#one-to-many-relationships)
5. [Many-to-Many Relationships](#many-to-many-relationships)
6. [Hierarchical Relationships](#hierarchical-relationships)
7. [Temporal Relationships](#temporal-relationships)
8. [Relationship Constraints](#relationship-constraints)

## Entity Relationship Diagram

Below is a high-level entity relationship diagram (ERD) representing the core entities and their relationships in the e-commerce application:

```
                                  ┌───────────┐
                                  │           │
                                  │   User    │
                                  │           │
                                  └─────┬─────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
            │               │   │               │   │               │
            │    Address    │   │  PaymentMethod│   │   Wishlist    │
            │               │   │               │   │               │
            └───────────────┘   └───────────────┘   └───────┬───────┘
                                                            │
                                                            ▼
                                                    ┌───────────────┐
                                                    │               │
                                                    │ WishlistItem  │
                                                    │               │
                                                    └───────┬───────┘
                                                            │
                                                            ▼
┌───────────────┐           ┌───────────────┐       ┌───────────────┐
│               │           │               │       │               │
│   Category    │◄─────────►│    Product    │◄──────│    Review     │
│               │           │               │       │               │
└───────┬───────┘           └───────┬───────┘       └───────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│               │           │               │
│  Subcategory  │           │ProductVariant │
│               │           │               │
└───────────────┘           └───────────────┘
                                    ▲
                                    │
                                    │
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│               │           │               │           │               │
│     Cart      │──────────►│   CartItem    │──────────►│     Order     │
│               │           │               │           │               │
└───────────────┘           └───────────────┘           └───────┬───────┘
                                                                │
                                                                │
                                                                ▼
                                                        ┌───────────────┐
                                                        │               │
                                                        │   OrderItem   │
                                                        │               │
                                                        └───────────────┘
```

## Core Entity Relationships

### User-Centric Relationships

The User entity is central to many relationships in the e-commerce application:

1. **User → Addresses**: One-to-many relationship
   - A user can have multiple addresses (shipping, billing)
   - Each address belongs to exactly one user
   - Relationship field: `Address.userId`

2. **User → PaymentMethods**: One-to-many relationship
   - A user can have multiple payment methods
   - Each payment method belongs to exactly one user
   - Relationship field: `PaymentMethod.userId`

3. **User → Orders**: One-to-many relationship
   - A user can place multiple orders
   - Each order is associated with at most one user (guest orders may not have a user)
   - Relationship field: `Order.userId`

4. **User → Cart**: One-to-one relationship
   - A user has at most one active cart
   - A cart belongs to at most one user (guest carts may not have a user)
   - Relationship field: `Cart.userId`

5. **User → Wishlists**: One-to-many relationship
   - A user can have multiple wishlists
   - Each wishlist belongs to exactly one user
   - Relationship field: `Wishlist.userId`

6. **User → Reviews**: One-to-many relationship
   - A user can write multiple reviews
   - Each review is written by at most one user (anonymous reviews may not have a user)
   - Relationship field: `Review.userId`

7. **User → Notifications**: One-to-many relationship
   - A user can receive multiple notifications
   - Each notification is sent to exactly one user
   - Relationship field: `Notification.userId`

### Product-Centric Relationships

The Product entity is another central entity with multiple relationships:

1. **Product → ProductVariants**: One-to-many relationship
   - A product can have multiple variants (e.g., different colors, sizes)
   - Each variant belongs to exactly one product
   - Relationship field: `ProductVariant.productId`

2. **Product → Categories**: Many-to-many relationship
   - A product can belong to multiple categories
   - A category can contain multiple products
   - Relationship fields: `Product.categories` and `Category.productCount`

3. **Product → Reviews**: One-to-many relationship
   - A product can have multiple reviews
   - Each review is for exactly one product
   - Relationship field: `Review.productId`

4. **Product → RelatedProducts**: Many-to-many relationship
   - A product can be related to multiple other products
   - Relationship is often symmetrical but not always
   - Relationship field: `Product.relatedProducts`

5. **Product → CartItems**: One-to-many relationship
   - A product can be in multiple cart items
   - Each cart item refers to exactly one product
   - Relationship field: `CartItem.productId`

6. **Product → OrderItems**: One-to-many relationship
   - A product can be in multiple order items
   - Each order item refers to exactly one product
   - Relationship field: `OrderItem.productId`

7. **Product → WishlistItems**: One-to-many relationship
   - A product can be in multiple wishlist items
   - Each wishlist item refers to exactly one product
   - Relationship field: `WishlistItem.productId`

### Order-Centric Relationships

The Order entity has several important relationships:

1. **Order → OrderItems**: One-to-many relationship
   - An order contains multiple order items
   - Each order item belongs to exactly one order
   - Relationship field: `OrderItem.orderId`

2. **Order → User**: Many-to-one relationship
   - An order is placed by at most one user
   - A user can place multiple orders
   - Relationship field: `Order.userId`

3. **Order → Addresses**: Many-to-one relationship
   - An order has exactly one shipping address and one billing address
   - An address can be used in multiple orders
   - Relationship fields: `Order.shippingAddress` and `Order.billingAddress`

4. **Order → Refunds**: One-to-many relationship
   - An order can have multiple refunds
   - Each refund is associated with exactly one order
   - Relationship field: `Refund.orderId`

5. **Order → Discounts**: Many-to-many relationship
   - An order can have multiple discounts applied
   - A discount can be applied to multiple orders
   - Relationship field: `Order.discounts`

## One-to-One Relationships

1. **User → Cart**: A user has at most one active cart, and a cart belongs to at most one user.
   - This is technically a one-to-one relationship, although guest carts may exist without users.
   - Relationship field: `Cart.userId`

2. **Product → Thumbnail**: Each product has exactly one thumbnail image.
   - This is a special case of the one-to-many relationship between Product and Image.
   - The thumbnail is typically the primary image of the product.
   - Relationship field: `Product.thumbnail`

3. **ProductVariant → Image**: Each product variant may have one specific image.
   - This is optional, as variants may share images with the parent product.
   - Relationship field: `ProductVariant.image`

## One-to-Many Relationships

1. **Cart → CartItems**: A cart contains multiple cart items, and each cart item belongs to exactly one cart.
   - Relationship field: `CartItem.cartId`

2. **Wishlist → WishlistItems**: A wishlist contains multiple wishlist items, and each wishlist item belongs to exactly one wishlist.
   - Relationship field: `WishlistItem.wishlistId`

3. **Category → Products**: A category contains multiple products, but this is implemented as a many-to-many relationship since products can belong to multiple categories.

4. **Product → Images**: A product has multiple images, and each image belongs to exactly one product.
   - Relationship field: Implicit in the `Product.images` array

5. **Product → Specifications**: A product has multiple specification groups, and each specification group belongs to exactly one product.
   - Relationship field: Implicit in the `Product.specifications` array

## Many-to-Many Relationships

1. **Product ↔ Category**: A product can belong to multiple categories, and a category can contain multiple products.
   - Relationship fields: `Product.categories` and `Category.productCount`

2. **Order ↔ Discount**: An order can have multiple discounts applied, and a discount can be applied to multiple orders.
   - Relationship field: `Order.discounts`

3. **Product ↔ RelatedProduct**: A product can be related to multiple other products, and a product can be related to by multiple other products.
   - Relationship field: `Product.relatedProducts`

4. **Discount ↔ Product**: A discount can be applicable to multiple products, and a product can have multiple applicable discounts.
   - Relationship fields: `Discount.applicableProducts`

5. **Discount ↔ Category**: A discount can be applicable to multiple categories, and a category can have multiple applicable discounts.
   - Relationship fields: `Discount.applicableCategories`

## Hierarchical Relationships

1. **Category → Subcategories**: A category can have multiple subcategories, and each subcategory has exactly one parent category.
   - This creates a hierarchical tree structure of categories.
   - Relationship fields: `Category.parentId`, `Category.level`, and `Category.subcategories`

2. **Product → ProductVariants**: A product can have multiple variants, and each variant belongs to exactly one product.
   - This creates a parent-child relationship between products and their variants.
   - Relationship field: `ProductVariant.productId`

## Temporal Relationships

1. **Cart → Order**: A cart is converted into an order when the checkout process is completed.
   - This is a temporal relationship rather than a direct database relationship.
   - The cart items are transformed into order items during this process.

2. **Order → OrderTimelineEvents**: An order has multiple timeline events that track its status changes over time.
   - This creates a historical record of the order's lifecycle.
   - Relationship field: Implicit in the `Order.timeline` array

3. **Product → PriceHistory**: Although not explicitly modeled in the current schema, products often have a price history that tracks price changes over time.
   - This would be implemented as a one-to-many relationship.

## Relationship Constraints

Several constraints ensure data integrity across relationships:

1. **Referential Integrity**: Foreign keys must reference existing entities.
   - For example, `CartItem.productId` must reference a valid `Product.id`.

2. **Cascade Deletion**: When a parent entity is deleted, related child entities may be deleted as well.
   - For example, deleting a `Cart` should delete all associated `CartItems`.

3. **Soft Deletion**: Instead of physically deleting records, many entities use a soft delete approach by marking them as inactive.
   - For example, `Product.isActive` indicates whether a product is active or soft-deleted.

4. **Unique Constraints**: Some relationships require uniqueness.
   - For example, a user cannot have multiple default shipping addresses.

5. **Required Relationships**: Some entities cannot exist without their parent.
   - For example, a `ProductVariant` cannot exist without a parent `Product`.

6. **Optional Relationships**: Some relationships are optional.
   - For example, a `Cart` may or may not be associated with a `User` (for guest carts).
