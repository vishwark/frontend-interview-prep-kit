# E-commerce Application Offline-First Strategies

This document outlines the offline-first strategies implemented in our e-commerce application to ensure a seamless user experience regardless of network conditions.

## Table of Contents

1. [Introduction](#introduction)
2. [Progressive Web App (PWA)](#progressive-web-app-pwa)
   - [Web App Manifest](#web-app-manifest)
   - [Service Worker Registration](#service-worker-registration)
   - [Installation Experience](#installation-experience)
3. [Service Worker Implementation](#service-worker-implementation)
   - [Caching Strategies](#caching-strategies)
   - [Background Sync](#background-sync)
   - [Push Notifications](#push-notifications)
4. [Offline Data Management](#offline-data-management)
   - [IndexedDB Implementation](#indexeddb-implementation)
   - [Offline State Management](#offline-state-management)
   - [Data Synchronization](#data-synchronization)
5. [Offline User Experience](#offline-user-experience)
   - [Offline Pages](#offline-pages)
   - [Offline Feedback](#offline-feedback)
   - [Graceful Degradation](#graceful-degradation)
6. [Testing Offline Functionality](#testing-offline-functionality)
7. [Conclusion](#conclusion)

## Introduction

An offline-first approach is essential for modern e-commerce applications, especially in regions with unreliable network connectivity or for users on the go. Our offline-first strategy ensures that users can continue browsing products, add items to their cart, and even initiate checkout processes while offline, with seamless synchronization once connectivity is restored.

## Progressive Web App (PWA)

We implement our e-commerce application as a Progressive Web App (PWA) to provide an app-like experience with offline capabilities.

### Web App Manifest

The Web App Manifest provides information about our application, enabling it to be installed on users' home screens.

```json
// public/manifest.json
{
  "name": "E-commerce Store",
  "short_name": "E-Store",
  "description": "Shop the latest products with our e-commerce store",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Service Worker Registration

We register a service worker to enable offline functionality and background processing.

```tsx
// src/serviceWorkerRegistration.ts
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  // but the previous service worker will still serve the older
                  // content until all client tabs are closed.
                  console.log('New content is available and will be used when all tabs for this page are closed.');
                  
                  // Execute callback for update
                  if (window.confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                } else {
                  // At this point, everything has been precached.
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
```

### Installation Experience

We provide a custom installation experience to encourage users to install our PWA.

```tsx
// src/components/molecules/InstallPrompt/InstallPrompt.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button';
import './InstallPrompt.scss';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = () => {
    // Hide the prompt
    setShowPrompt(false);
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
    });
  };
  
  if (!showPrompt) {
    return null;
  }
  
  return (
    <div className="install-prompt">
      <div className="install-prompt__content">
        <h3 className="install-prompt__title">Install our app</h3>
        <p className="install-prompt__description">
          Install our app on your home screen for quick and easy access when you're on the go.
        </p>
        <div className="install-prompt__actions">
          <Button onClick={handleInstallClick} variant="primary">
            Install
          </Button>
          <Button onClick={() => setShowPrompt(false)} variant="secondary">
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## Service Worker Implementation

### Caching Strategies

We implement various caching strategies for different types of resources to optimize the offline experience.

```js
// src/service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute } = workbox.precaching;

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache page navigations (HTML) with a Network First strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
      }),
    ],
  })
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'assets-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      }),
    ],
  })
);

// Cache API requests with a Network First strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1 Day
      }),
    ],
  })
);

// Fallback page for offline access
const FALLBACK_HTML = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-fallback').then((cache) => {
      return cache.add(FALLBACK_HTML);
    })
  );
});

// Serve the fallback page when a navigation request fails
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(FALLBACK_HTML);
      })
    );
  }
});
```

### Background Sync

We implement background sync to handle operations that require network connectivity, such as placing orders or updating the cart.

```js
// src/service-worker.js
const { BackgroundSyncPlugin } = workbox.backgroundSync;

// Create a queue for failed cart operations
const cartQueue = new workbox.backgroundSync.Queue('cart-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours (specified in minutes)
});

// Register route for cart operations
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/cart'),
  async ({ event }) => {
    try {
      return await fetch(event.request.clone());
    } catch (error) {
      await cartQueue.pushRequest({ request: event.request });
      return new Response('Operation queued for retry', {
        status: 202,
      });
    }
  },
  'POST'
);

// Create a queue for failed order operations
const orderQueue = new workbox.backgroundSync.Queue('order-queue', {
  maxRetentionTime: 48 * 60, // Retry for up to 48 hours (specified in minutes)
});

// Register route for order operations
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/orders'),
  async ({ event }) => {
    try {
      return await fetch(event.request.clone());
    } catch (error) {
      await orderQueue.pushRequest({ request: event.request });
      return new Response('Order queued for submission', {
        status: 202,
      });
    }
  },
  'POST'
);

// Listen for sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(cartQueue.replayRequests());
  }
  
  if (event.tag === 'order-sync') {
    event.waitUntil(orderQueue.replayRequests());
  }
});
```

### Push Notifications

We implement push notifications to keep users engaged and informed about order status, promotions, and other updates.

```js
// src/service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url,
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

## Offline Data Management

### IndexedDB Implementation

We use IndexedDB to store product data, user cart, and other essential information for offline access.

```tsx
// src/services/indexedDB.ts
export class IndexedDBService {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  
  constructor(dbName: string, version: number) {
    this.dbName = dbName;
    this.version = version;
  }
  
  async connect(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = (event) => {
        reject(`Error opening database: ${(event.target as IDBRequest).error}`);
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBRequest).result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('category', 'categoryId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'productId' });
        }
        
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
          orderStore.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }
  
  async getAll(storeName: string): Promise<any[]> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = (event) => {
        reject(`Error getting data from ${storeName}: ${(event.target as IDBRequest).error}`);
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
    });
  }
  
  async get(storeName: string, key: string | number): Promise<any> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onerror = (event) => {
        reject(`Error getting data from ${storeName}: ${(event.target as IDBRequest).error}`);
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
    });
  }
  
  async add(storeName: string, data: any): Promise<any> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onerror = (event) => {
        reject(`Error adding data to ${storeName}: ${(event.target as IDBRequest).error}`);
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
    });
  }
  
  async put(storeName: string, data: any): Promise<any> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onerror = (event) => {
        reject(`Error updating data in ${storeName}: ${(event.target as IDBRequest).error}`);
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
    });
  }
  
  async delete(storeName: string, key: string | number): Promise<void> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onerror = (event) => {
        reject(`Error deleting data from ${storeName}: ${(event.target as IDBRequest).error}`);
      };
      
      request.onsuccess = () => {
        resolve();
      };
    });
  }
  
  async clear(storeName: string): Promise<void> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onerror = (event) => {
        reject(`Error clearing data from ${storeName}: ${(event.target as IDBRequest).error}`);
      };
      
      request.onsuccess = () => {
        resolve();
      };
    });
  }
}

export const db = new IndexedDBService('e-commerce-db', 1);
```

### Offline State Management

We implement offline state management to track the application's online/offline status and synchronize data when connectivity is restored.

```tsx
// src/hooks/useOfflineStatus.ts
import { useState, useEffect } from 'react';

export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOffline;
};
```

```tsx
// src/contexts/OfflineContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineContextType {
  isOffline: boolean;
  hasPendingOperations: boolean;
  pendingOperationsCount: number;
}

const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  hasPendingOperations: false,
  pendingOperationsCount: 0,
});

export const useOfflineContext = () => useContext(OfflineContext);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingOperations, setPendingOperations] = useState<string[]>([]);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      
      // Trigger sync when coming back online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          if (pendingOperations.includes('cart')) {
            registration.sync.register('cart-sync');
          }
          
          if (pendingOperations.includes('order')) {
            registration.sync.register('order-sync');
          }
        });
      }
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check for pending operations in IndexedDB
    const checkPendingOperations = async () => {
      try {
        const pendingOps: string[] = [];
        
        // Check if there are pending cart operations
        const cartQueue = await indexedDB.open('workbox-background-sync', 1);
        cartQueue.onsuccess = (event) => {
          const db = (event.target as IDBRequest).result;
          if (db.objectStoreNames.contains('cart-queue')) {
            const transaction = db.transaction('cart-queue', 'readonly');
            const store = transaction.objectStore('cart-queue');
            const countRequest = store.count();
            
            countRequest.onsuccess = () => {
              if (countRequest.result > 0) {
                pendingOps.push('cart');
              }
            };
          }
          
          if (db.objectStoreNames.contains('order-queue')) {
            const transaction = db.transaction('order-queue', 'readonly');
            const store = transaction.objectStore('order-queue');
            const countRequest = store.count();
            
            countRequest.onsuccess = () => {
              if (countRequest.result > 0) {
                pendingOps.push('order');
              }
              
              setPendingOperations(pendingOps);
            };
          }
        };
      } catch (error) {
        console.error('Error checking pending operations:', error);
      }
    };
    
    checkPendingOperations();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingOperations]);
  
  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        hasPendingOperations: pendingOperations.length > 0,
        pendingOperationsCount: pendingOperations.length,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};
```

### Data Synchronization

We implement data synchronization to ensure that offline actions are synchronized with the server when connectivity is restored.

```tsx
// src/services/cartService.ts
import { db } from './indexedDB';
import { api } from './api';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    try {
      // Try to get cart from API
      const response = await api.get('/cart');
      
      // Update local cart
      const items = response.data.items;
      await this.updateLocalCart(items);
      
      return items;
    } catch (error) {
      console.log('Error fetching cart from API, using local cart:', error);
      
      // Fallback to local cart
      return this.getLocalCart();
    }
  },
  
  async getLocalCart(): Promise<CartItem[]> {
    try {
      return await db.getAll('cart');
    } catch (error) {
      console.error('Error getting local cart:', error);
      return [];
    }
  },
  
  async updateLocalCart(items: CartItem[]): Promise<void> {
    try {
      // Clear existing cart
      await db.clear('cart');
      
      // Add new items
      for (const item of items) {
        await db.add('cart', item);
      }
    } catch (error) {
      console.error('Error updating local cart:', error);
    }
  },
  
  async addToCart(item: CartItem): Promise<void> {
    try {
      // Add to local cart first
      const existingItem = await db.get('cart', item.productId);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
        await db.put('cart', existingItem);
      } else {
        await db.add('cart', item);
      }
      
      // Try to sync with API
      try {
        await api.post('/cart', { item });
      } catch (error) {
        console.log('Error syncing cart with API, will retry when online:', error);
        
        // Register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('cart-sync');
          });
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
  
  async removeFromCart(productId: string): Promise<void> {
    try {
      // Remove from local cart first
      await db.delete('cart', productId);
      
      // Try to sync with API
      try {
        await api.delete(`/cart/${productId}`);
      } catch (error) {
        console.log('Error syncing cart removal with API, will retry when online:', error);
        
        // Register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('cart-sync');
          });
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },
  
  async updateCartItemQuantity(productId: string, quantity: number): Promise<void> {
    try {
      // Update local cart first
      const existingItem = await db.get('cart', productId);
      
      if (existingItem) {
        existingItem.quantity = quantity;
        await db.put('cart', existingItem);
      }
      
      // Try to sync with API
      try {
        await api.put(`/cart/${productId}`, { quantity });
      } catch (error) {
        console.log('Error syncing cart update with API, will retry when online:', error);
        
        // Register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('cart-sync');
          });
        }
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  },
  
  async clearCart(): Promise<void> {
    try {
      // Clear local cart first
      await db.clear('cart');
      
      // Try to sync with API
      try {
        await api.delete('/cart');
      } catch (error) {
        console.log('Error syncing cart clear with API, will retry when online:', error);
        
        // Register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('cart-sync');
          });
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};
```

## Offline User Experience

### Offline Pages

We create dedicated offline pages to provide a better user experience when the application is offline.

```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - E-commerce Store</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f8f9fa;
      color: #343a40;
      text-align: center;
      padding: 0 20px;
    }
    
    .container {
      max-width: 600px;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.2s;
    }
    
    .button:hover {
      background-color: #0069d9;
    }
    
    .offline-features {
      margin-top: 2rem;
      text-align: left;
    }
    
    .offline-features h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .offline-features ul {
      padding-left: 1.5rem;
    }
    
    .offline-features li {
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📶</div>
    <h1>You're offline</h1>
    <p>It looks like you've lost your internet connection. Don't worry, you can still access previously viewed products and your shopping cart.</p>
    
    <a href="/" class="button">Go to Homepage</a>
    
    <div class="offline-features">
      <h2>Available offline features:</h2>
      <ul>
        <li>Browse previously viewed products</li>
        <li>View your shopping cart</li>
