# E-commerce Application Scalability

This document outlines the scalability strategies implemented in our e-commerce application to ensure it can handle increasing loads, traffic spikes, and growing user bases while maintaining performance and reliability.

## Table of Contents

1. [Introduction](#introduction)
2. [Frontend Scalability](#frontend-scalability)
   - [Static Asset Delivery](#static-asset-delivery)
   - [Client-Side Caching](#client-side-caching)
   - [Progressive Loading](#progressive-loading)
   - [Connection Optimization](#connection-optimization)
3. [API Scalability](#api-scalability)
   - [API Design for Scale](#api-design-for-scale)
   - [Request Batching](#request-batching)
   - [GraphQL Considerations](#graphql-considerations)
   - [WebSockets Scaling](#websockets-scaling)
4. [Backend Scalability](#backend-scalability)
   - [Horizontal Scaling](#horizontal-scaling)
   - [Load Balancing](#load-balancing)
   - [Database Scaling](#database-scaling)
   - [Caching Strategies](#caching-strategies)
5. [Infrastructure Scalability](#infrastructure-scalability)
   - [Cloud Infrastructure](#cloud-infrastructure)
   - [Containerization](#containerization)
   - [Serverless Architecture](#serverless-architecture)
   - [Edge Computing](#edge-computing)
6. [Monitoring and Scaling Triggers](#monitoring-and-scaling-triggers)
7. [Cost Optimization](#cost-optimization)
8. [Conclusion](#conclusion)

## Introduction

Scalability is a critical aspect of our e-commerce application, ensuring that it can handle growth in users, products, and transactions without degradation in performance or user experience. Our scalability strategy addresses both vertical scaling (adding more resources to existing infrastructure) and horizontal scaling (adding more instances of resources), with a focus on the latter for better resilience and cost-effectiveness.

## Frontend Scalability

### Static Asset Delivery

To ensure our frontend can scale to handle increasing traffic, we implement the following strategies for static asset delivery:

#### Content Delivery Network (CDN)

We use a global CDN to distribute static assets (JavaScript, CSS, images, fonts) closer to users, reducing latency and offloading traffic from our origin servers.

```js
// next.config.js (Next.js example)
module.exports = {
  // ... other configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.example.com' : '',
};
```

#### Asset Versioning and Cache Invalidation

We implement asset versioning to ensure that users always get the latest version of our assets while maximizing cache utilization.

```js
// webpack.config.js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  // ... other configuration
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  plugins: [
    // ... other plugins
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: '/',
    }),
  ],
};
```

#### Multiple CDN Domains

We use multiple CDN domains to increase browser connection parallelism and overcome browser connection limits.

```html
<link rel="stylesheet" href="https://cdn1.example.com/styles/main.css">
<script src="https://cdn2.example.com/scripts/main.js"></script>
<img src="https://cdn3.example.com/images/product.jpg" alt="Product">
```

### Client-Side Caching

We implement client-side caching strategies to reduce server load and improve performance for returning users.

#### Service Worker Caching

We use service workers to cache assets and API responses, enabling offline functionality and reducing server load.

```js
// src/service-worker.js
const CACHE_NAME = 'e-commerce-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles/main.css',
  '/scripts/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy for API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } 
  // Cache-first strategy for static assets
  else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        });
      })
    );
  }
});
```

#### Local Storage and IndexedDB

We use browser storage mechanisms to cache user-specific data and reduce API calls.

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
```

### Progressive Loading

We implement progressive loading techniques to prioritize critical content and improve perceived performance.

#### Code Splitting

We split our application code into smaller chunks that can be loaded on demand, reducing the initial load time.

```tsx
// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from './components/atoms/LoadingSpinner';

// Eager-loaded components
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { HomePage } from './pages/HomePage';

// Lazy-loaded components
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

export const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account/*" element={<AccountPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
};
```

#### Incremental Loading

We implement incremental loading for large datasets, loading only what's needed initially and fetching more data as the user scrolls or navigates.

```tsx
// src/components/organisms/ProductGrid/ProductGrid.tsx
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ProductCard } from '../../molecules/ProductCard';
import { LoadingSpinner } from '../../atoms/LoadingSpinner';
import './ProductGrid.scss';

interface ProductGridProps {
  categoryId: string;
  initialProducts: any[];
  fetchMoreProducts: (categoryId: string, page: number) => Promise<any[]>;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  categoryId,
  initialProducts,
  fetchMoreProducts,
}) => {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProducts();
    }
  }, [inView, hasMore, loading]);

  const loadMoreProducts = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newProducts = await fetchMoreProducts(categoryId, nextPage);
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts([...products, ...newProducts]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-grid">
      <div className="product-grid__items">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {hasMore && (
        <div ref={ref} className="product-grid__loader">
          {loading && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
};
```

### Connection Optimization

We optimize network connections to improve performance and reduce server load.

#### HTTP/2 and HTTP/3

We use HTTP/2 and HTTP/3 to enable multiplexing, header compression, and server push, reducing the number of connections needed and improving performance.

#### Connection Pooling

We implement connection pooling for API requests to reduce the overhead of establishing new connections.

```tsx
// src/services/api.ts
import axios from 'axios';

// Create a single axios instance for the entire application
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);
```

## API Scalability

### API Design for Scale

We design our APIs with scalability in mind, focusing on efficiency, cacheability, and reduced server load.

#### RESTful API Design

We follow RESTful principles to ensure our APIs are predictable, cacheable, and scalable.

```tsx
// src/services/productService.ts
import { api } from './api';

export const productService = {
  getProducts: async (categoryId: string, page: number = 1, limit: number = 20) => {
    const response = await api.get(`/products`, {
      params: {
        categoryId,
        page,
        limit,
      },
    });
    return response.data;
  },
  
  getProductById: async (productId: string) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  searchProducts: async (query: string, page: number = 1, limit: number = 20) => {
    const response = await api.get(`/products/search`, {
      params: {
        query,
        page,
        limit,
      },
    });
    return response.data;
  },
};
```

#### Field Selection and Pagination

We implement field selection and pagination to reduce the amount of data transferred and processed.

```tsx
// src/services/productService.ts
export const getProducts = async (options: {
  categoryId?: string;
  page?: number;
  limit?: number;
  fields?: string[];
  sort?: string;
}) => {
  const { categoryId, page = 1, limit = 20, fields, sort } = options;
  
  const response = await api.get('/products', {
    params: {
      categoryId,
      page,
      limit,
      fields: fields?.join(','),
      sort,
    },
  });
  
  return response.data;
};
```

### Request Batching

We implement request batching to reduce the number of HTTP requests and improve performance.

#### Batch API Endpoints

We create batch endpoints that can handle multiple operations in a single request.

```tsx
// src/services/batchService.ts
import { api } from './api';

export const batchService = {
  batchGet: async (requests: { endpoint: string; params?: any }[]) => {
    const response = await api.post('/batch', { requests });
    return response.data;
  },
};

// Usage example
const [productsData, categoriesData, userPreferences] = await batchService.batchGet([
  { endpoint: '/products', params: { categoryId: '123', page: 1, limit: 20 } },
  { endpoint: '/categories' },
  { endpoint: '/user/preferences' },
]);
```

#### Client-Side Request Batching

We implement client-side request batching for operations like adding multiple items to a cart or updating multiple preferences.

```tsx
// src/hooks/useCartBatch.ts
import { useState } from 'react';
import { api } from '../services/api';

export const useCartBatch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addItemsBatch = async (items: { productId: string; quantity: number }[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/cart/batch', { items });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };
  
  return { addItemsBatch, loading, error };
};
```

### GraphQL Considerations

If using GraphQL, we implement specific optimizations to ensure scalability.

#### Query Complexity Analysis

We analyze and limit the complexity of GraphQL queries to prevent resource-intensive operations.

```js
// server.js (Apollo Server example)
const { ApolloServer } = require('apollo-server-express');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createComplexityLimitRule(1000, {
      scalarCost: 1,
      objectCost: 10,
      listFactor: 10,
    }),
  ],
});
```

#### Persisted Queries

We implement persisted queries to reduce the size of GraphQL requests and improve caching.

```tsx
// src/services/graphql.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const persistedQueriesLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: persistedQueriesLink.concat(httpLink),
});
```

### WebSockets Scaling

For real-time features like notifications, chat, or live inventory updates, we implement scalable WebSocket solutions.

#### Connection Pooling

We use connection pooling to manage WebSocket connections efficiently.

```tsx
// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  
  connect() {
    if (this.socket) return;
    
    this.socket = io(process.env.REACT_APP_WEBSOCKET_URL as string, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log(`WebSocket disconnected: ${reason}`);
    });
    
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // Set up listeners for events
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback);
      });
    });
  }
  
  disconnect() {
    if (!this.socket) return;
    
    this.socket.disconnect();
    this.socket = null;
  }
  
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)?.add(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
    
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
      
      if (this.socket) {
        this.socket.off(event, callback);
      }
    };
  }
  
  emit(event: string, data: any) {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket?.emit(event, data);
  }
}

export const websocketService = new WebSocketService();
```

#### Message Queuing

We use message queuing systems to handle high volumes of WebSocket messages and ensure delivery.

```js
// server.js (Node.js WebSocket server with Redis)
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');

const server = http.createServer();
const io = new Server(server);

const pubClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });
  
  socket.on('leave', (room) => {
    socket.leave(room);
    console.log(`Client left room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('WebSocket server listening on port 3000');
});
```

## Backend Scalability

While our focus is on frontend scalability, we also consider backend scalability to ensure a holistic approach.

### Horizontal Scaling

We design our backend services to scale horizontally, adding more instances as load increases.

#### Stateless Services

We ensure our services are stateless, storing session data in external stores like Redis.

```js
// server.js (Express.js example)
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');

const app = express();
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// API routes
app.use('/api', require('./routes'));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

#### Service Discovery

We implement service discovery to enable dynamic scaling of backend services.

```js
// server.js (Node.js with Consul)
const express = require('express');
const Consul = require('consul');

const app = express();
const consul = new Consul({
  host: process.env.CONSUL_HOST,
  port: process.env.CONSUL_PORT,
});

// Register service with Consul
consul.agent.service.register({
  name: 'api-service',
  id: `api-service-${process.env.INSTANCE_ID}`,
  address: process.env.SERVICE_HOST,
  port: parseInt(process.env.SERVICE_PORT, 10),
  check: {
    http: `http://${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/health`,
    interval: '10s',
    timeout: '5s',
  },
}, (err) => {
  if (err) {
    console.error('Error registering service:', err);
    process.exit(1);
  }
  
  console.log('Service registered with Consul');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API routes
app.use('/api', require('./routes'));

app.listen(process.env.SERVICE_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVICE_PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received, shutting down');
  
  consul.agent.service.deregister(`api-service-${process.env.INSTANCE_ID}`, (err) => {
    if (err) {
      console.error('Error deregistering service:', err);
    } else {
      console.log('Service deregistered from Consul');
    }
    
    process.exit(0);
  });
});
```

### Load Balancing

We implement load balancing to distribute traffic across multiple instances of our services.

#### Client-Side Load Balancing

We implement client-side load balancing for microservices communication.

```tsx
// src/services/loadBalancer.ts
import axios from 'axios';

class LoadBalancer {
  private instances: string[] = [];
  private currentIndex = 0;
  
  constructor(private serviceName: string) {
    this.fetchInstances();
    
    // Refresh instances periodically
    setInterval(() => {
      this.fetchInstances();
    }, 30000); // Every 30 seconds
  }
  
  private async fetchInstances() {
    try {
      const response = await axios.get(`/service-registry/${this.serviceName}`);
      this.instances = response.data.instances;
    } catch (error) {
      console.error(`Error fetching instances for ${this.serviceName}:`, error);
    }
  }
  
  public getNextInstance(): string {
    if (this.instances.length === 0) {
      throw new Error(`No instances available for ${this.serviceName}`);
    }
    
    const instance = this.instances[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.instances.length;
    
    return instance;
  }
  
  public async request(path: string, options: any = {}) {
    const instance = this.getNextInstance();
    const url = `${instance}${path}`;
    
    return axios({
      url,
      ...options,
    });
  }
}

export const createLoadBalancer = (serviceName: string) => {
  return new LoadBalancer(serviceName);
};
```

#### Server-Side Load Balancing

We use server-side load balancing with tools like NGINX or cloud load balancers.

```nginx
# nginx.conf
upstream api_servers {
  least_conn;
  server api1.example.com:3000;
  server api2.example.com:3000;
  server api3.example.com:3000;
}

server {
  listen 80;
  server_name api.example.com;
  
  location / {
    proxy_pass http://api_servers;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Database Scaling

We implement database scaling strategies to handle increasing data and query loads.

#### Read Replicas

We use read replicas to distribute read queries and reduce load on the primary database.

```js
// server.js (Node.js with MySQL)
const mysql = require('mysql2/promise');

const createPrimaryPool = async () => {
  return mysql.createPool({
    host: process.env.DB_PRIMARY_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

const createReadPool = async () => {
  return mysql.createPool({
    host: process.env.DB_READ_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
  });
};

const db = {
  primary: null,
  read: null,
  
  async initialize() {
    this.primary = await createPrimaryPool();
    this.read = await createReadPool();
  },
  
  async query(sql, params, isWrite = false) {
    const pool = isWrite ? this.primary : this.read;
    const [results] = await pool.execute(sql, params);
    return results;
  },
};

module.exports = db;
```

#### Sharding

We implement database sharding for large datasets, partitioning data across multiple database instances.

```js
// server.js (Node.js with sharded MongoDB)
const { MongoClient } = require('mongodb');

class ShardedDatabase {
  constructor(shardCount) {
    this.shardCount = shardCount;
    this.shards = [];
  }
  
  async initialize() {
    for (let i = 0; i < this.shardCount; i++) {
      const client = new MongoClient(`mongodb://${process.env.MONGO_HOST_PREFIX}${i}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`);
      await client.connect();
      this.shards.push(client.db());
    }
  }
  
  getShardForUser(userId) {
    // Simple hash-based sharding
    const shardIndex = this.hashUserId(userId) % this.shardCount;
    return this.shards[shardIndex];
  }
  
  hashUserId(userId) {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  async getUserData(userId) {
    const shard = this.getShardForUser(userId);
    return shard.collection('users').findOne({ userId });
  }
  
  async updateUserData(userId, data) {
    const shard = this.getShardForUser(userId);
    return shard.collection('users').updateOne(
      { userId },
      { $set: data },
      { upsert: true }
    );
  }
}

const db = new ShardedDatabase(3); // 3 shards
module.exports = db;
```

### Caching Strategies

We implement caching at various levels to reduce database load and improve response times.

#### Multi-Level Caching

We implement multi-level caching with in-memory, distributed, and CDN caches.

```js
// server.js (Node.js with multi-level caching)
const express = require('express');
const NodeCache = require('node-cache');
const Redis = require('ioredis');
const db = require('./db');

const app = express();

// In-memory cache (L1)
const localCache = new NodeCache({
  stdTTL: 60, // 1 minute
  checkperiod: 120, // Check for expired keys every 2 minutes
});

// Distributed cache (L2)
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Multi-level cache middleware
const cacheMiddleware = (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  
  // Check L1 cache
  const localData = localCache.get(key);
  if (localData) {
    console.log('L1 cache hit');
    return res.json(localData);
  }
  
  // Check L2 cache
  redisClient.get(key, (err, data) => {
    if (err) {
      console.error('Redis error:', err);
      return next();
    }
    
    if (data) {
      console.
