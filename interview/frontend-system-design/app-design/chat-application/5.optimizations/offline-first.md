# Chat Application Offline-First Strategies

This document outlines the offline-first strategies implemented in the chat application to ensure a seamless user experience even when network connectivity is limited or unavailable.

## Table of Contents

1. [Offline-First Overview](#offline-first-overview)
2. [Service Worker Implementation](#service-worker-implementation)
3. [Data Persistence](#data-persistence)
4. [Offline Message Handling](#offline-message-handling)
5. [Synchronization Strategies](#synchronization-strategies)
6. [Conflict Resolution](#conflict-resolution)
7. [User Experience Considerations](#user-experience-considerations)
8. [Progressive Web App Features](#progressive-web-app-features)
9. [Testing Offline Capabilities](#testing-offline-capabilities)
10. [Implementation Details](#implementation-details)

## Offline-First Overview

The chat application is designed with an offline-first approach, which means it prioritizes providing a functional experience regardless of network connectivity. This approach focuses on several key areas:

1. **Local Data Storage**: Storing essential data locally for offline access
2. **Background Synchronization**: Syncing data when connectivity is restored
3. **Graceful Degradation**: Maintaining core functionality during connectivity issues
4. **Progressive Enhancement**: Adding features when connectivity improves
5. **Conflict Resolution**: Handling conflicts when offline changes conflict with server state

### Offline Capabilities

The application provides the following capabilities when offline:

1. **Viewing Conversations**: Access to previously loaded conversations and messages
2. **Sending Messages**: Ability to compose and "send" messages (queued for later delivery)
3. **Message Status**: Clear indication of message delivery status
4. **Media Access**: Access to previously downloaded media (images, audio)
5. **User Interface**: Full UI functionality without "loading" states

### Offline Limitations

The following features are limited or unavailable when offline:

1. **Real-time Updates**: No real-time message delivery or typing indicators
2. **Media Uploads**: New media uploads are queued but not processed
3. **User Presence**: No updates to online/offline status of other users
4. **Search**: Limited to locally cached data
5. **Group Management**: Changes to group membership are queued

## Service Worker Implementation

A service worker is used to enable offline functionality and manage network requests:

```typescript
// Example of service worker implementation
// service-worker.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Create a background sync queue for messages
const messageSyncQueue = new BackgroundSyncPlugin('message-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours (specified in minutes)
});

// Create a background sync queue for read receipts
const readReceiptSyncQueue = new BackgroundSyncPlugin('read-receipt-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours
});

// API routes that should use NetworkFirst strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/conversations'),
  new NetworkFirst({
    cacheName: 'api-conversations',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// API routes that should use StaleWhileRevalidate strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/users'),
  new StaleWhileRevalidate({
    cacheName: 'api-users',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Cache media assets with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'audio',
  new CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Handle message sending with background sync
registerRoute(
  ({ url }) => url.pathname === '/api/messages',
  async ({ event }) => {
    const request = event.request.clone();
    
    try {
      // Try to send the message normally
      return await fetch(request);
    } catch (error) {
      // If offline, add to background sync queue
      return messageSyncQueue.pushRequest({ request });
    }
  },
  'POST'
);

// Handle read receipts with background sync
registerRoute(
  ({ url }) => url.pathname === '/api/messages/read',
  async ({ event }) => {
    const request = event.request.clone();
    
    try {
      // Try to send the read receipt normally
      return await fetch(request);
    } catch (error) {
      // If offline, add to background sync queue
      return readReceiptSyncQueue.pushRequest({ request });
    }
  },
  'POST'
);

// Listen for background sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'message-queue') {
    event.waitUntil(messageSyncQueue.replayRequests());
  }
  
  if (event.tag === 'read-receipt-queue') {
    event.waitUntil(readReceiptSyncQueue.replayRequests());
  }
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/notification-icon.png',
    badge: '/icons/notification-badge.png',
    data: {
      url: data.url,
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

### Service Worker Registration

The service worker is registered when the application loads:

```typescript
// Example of service worker registration
// sw-register.ts
export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      
      console.log('Service worker registered:', registration);
      
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      }
      
      // Register for background sync
      if ('sync' in registration) {
        // Register background sync
        await registration.sync.register('message-queue');
        await registration.sync.register('read-receipt-queue');
      }
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
}

// Usage
registerServiceWorker();
```

## Data Persistence

Data is persisted locally using IndexedDB to enable offline access:

```typescript
// Example of IndexedDB data persistence
// db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ChatDBSchema extends DBSchema {
  conversations: {
    key: string;
    value: Conversation;
    indexes: {
      'by-updated': number;
    };
  };
  messages: {
    key: string;
    value: Message;
    indexes: {
      'by-conversation': string;
      'by-timestamp': number;
    };
  };
  users: {
    key: string;
    value: User;
  };
  outbox: {
    key: string;
    value: OutboxMessage;
    indexes: {
      'by-timestamp': number;
    };
  };
}

interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    timestamp: number;
  };
  updatedAt: number;
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  localOnly?: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: number;
}

interface OutboxMessage {
  id: string;
  conversationId: string;
  content: string;
  timestamp: number;
  retryCount: number;
  lastRetry?: number;
}

class Database {
  private db: IDBPDatabase<ChatDBSchema> | null = null;
  private dbPromise: Promise<IDBPDatabase<ChatDBSchema>> | null = null;
  
  public async getDB(): Promise<IDBPDatabase<ChatDBSchema>> {
    if (this.db) {
      return this.db;
    }
    
    if (this.dbPromise) {
      return this.dbPromise;
    }
    
    this.dbPromise = this.initDB();
    this.db = await this.dbPromise;
    this.dbPromise = null;
    
    return this.db;
  }
  
  private async initDB(): Promise<IDBPDatabase<ChatDBSchema>> {
    return openDB<ChatDBSchema>('chat-app-db', 1, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationsStore = db.createObjectStore('conversations', { keyPath: 'id' });
          conversationsStore.createIndex('by-updated', 'updatedAt');
        }
        
        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
          messagesStore.createIndex('by-conversation', 'conversationId');
          messagesStore.createIndex('by-timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('outbox')) {
          const outboxStore = db.createObjectStore('outbox', { keyPath: 'id' });
          outboxStore.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  
  // Conversation methods
  public async getConversation(id: string): Promise<Conversation | undefined> {
    const db = await this.getDB();
    return db.get('conversations', id);
  }
  
  public async getConversations(): Promise<Conversation[]> {
    const db = await this.getDB();
    return db.getAllFromIndex('conversations', 'by-updated');
  }
  
  public async saveConversation(conversation: Conversation): Promise<void> {
    const db = await this.getDB();
    await db.put('conversations', conversation);
  }
  
  public async deleteConversation(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('conversations', id);
  }
  
  // Message methods
  public async getMessage(id: string): Promise<Message | undefined> {
    const db = await this.getDB();
    return db.get('messages', id);
  }
  
  public async getMessages(conversationId: string): Promise<Message[]> {
    const db = await this.getDB();
    const messages = await db.getAllFromIndex('messages', 'by-conversation', conversationId);
    
    // Sort by timestamp
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }
  
  public async saveMessage(message: Message): Promise<void> {
    const db = await this.getDB();
    await db.put('messages', message);
    
    // Update conversation's last message
    const conversation = await this.getConversation(message.conversationId);
    
    if (conversation) {
      conversation.lastMessage = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        timestamp: message.timestamp,
      };
      conversation.updatedAt = Date.now();
      
      await this.saveConversation(conversation);
    }
  }
  
  public async deleteMessage(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('messages', id);
  }
  
  // User methods
  public async getUser(id: string): Promise<User | undefined> {
    const db = await this.getDB();
    return db.get('users', id);
  }
  
  public async getUsers(): Promise<User[]> {
    const db = await this.getDB();
    return db.getAll('users');
  }
  
  public async saveUser(user: User): Promise<void> {
    const db = await this.getDB();
    await db.put('users', user);
  }
  
  // Outbox methods
  public async addToOutbox(message: OutboxMessage): Promise<void> {
    const db = await this.getDB();
    await db.put('outbox', message);
  }
  
  public async removeFromOutbox(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('outbox', id);
  }
  
  public async getOutboxMessages(): Promise<OutboxMessage[]> {
    const db = await this.getDB();
    return db.getAllFromIndex('outbox', 'by-timestamp');
  }
}

// Create a singleton instance
const database = new Database();

export default database;
```

## Offline Message Handling

Messages sent while offline are stored locally and synchronized when connectivity is restored:

```typescript
// Example of offline message handling
// message-service.ts
import { v4 as uuidv4 } from 'uuid';
import database from './db';
import { isOnline } from './network-status';

class MessageService {
  public async sendMessage(conversationId: string, content: string, senderId: string): Promise<string> {
    // Generate a unique ID for the message
    const messageId = uuidv4();
    
    // Create the message object
    const message = {
      id: messageId,
      conversationId,
      senderId,
      content,
      timestamp: Date.now(),
      status: 'sending' as const,
    };
    
    // Save the message locally
    await database.saveMessage(message);
    
    // Check if we're online
    if (isOnline()) {
      // Try to send the message to the server
      try {
        await this.sendMessageToServer(message);
        
        // Update message status
        await this.updateMessageStatus(messageId, 'sent');
        
        return messageId;
      } catch (error) {
        console.error('Failed to send message:', error);
        
        // Update message status
        await this.updateMessageStatus(messageId, 'failed');
        
        // Add to outbox for later retry
        await this.addToOutbox(message);
        
        return messageId;
      }
    } else {
      // We're offline, add to outbox for later
      await this.addToOutbox(message);
      
      return messageId;
    }
  }
  
  private async sendMessageToServer(message: any): Promise<void> {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  }
  
  private async addToOutbox(message: any): Promise<void> {
    await database.addToOutbox({
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      timestamp: message.timestamp,
      retryCount: 0,
    });
  }
  
  public async updateMessageStatus(messageId: string, status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'): Promise<void> {
    // Get the message
    const message = await database.getMessage(messageId);
    
    if (message) {
      // Update the status
      message.status = status;
      
      // Save the updated message
      await database.saveMessage(message);
    }
  }
  
  public async syncOutbox(): Promise<void> {
    // Check if we're online
    if (!isOnline()) {
      return;
    }
    
    // Get all messages in the outbox
    const outboxMessages = await database.getOutboxMessages();
    
    // Process each message
    for (const outboxMessage of outboxMessages) {
      try {
        // Get the full message
        const message = await database.getMessage(outboxMessage.id);
        
        if (message) {
          // Try to send the message
          await this.sendMessageToServer(message);
          
          // Update message status
          await this.updateMessageStatus(message.id, 'sent');
          
          // Remove from outbox
          await database.removeFromOutbox(message.id);
        } else {
          // Message no longer exists, remove from outbox
          await database.removeFromOutbox(outboxMessage.id);
        }
      } catch (error) {
        console.error('Failed to sync message:', error);
        
        // Increment retry count
        outboxMessage.retryCount++;
        outboxMessage.lastRetry = Date.now();
        
        // If we've tried too many times, give up
        if (outboxMessage.retryCount > 5) {
          await database.removeFromOutbox(outboxMessage.id);
          await this.updateMessageStatus(outboxMessage.id, 'failed');
        } else {
          // Save updated outbox message
          await database.addToOutbox(outboxMessage);
        }
      }
    }
  }
}

// Create a singleton instance
const messageService = new MessageService();

export default messageService;
```

## Synchronization Strategies

Data is synchronized between the local database and the server using various strategies:

```typescript
// Example of synchronization strategies
// sync-service.ts
import database from './db';
import { isOnline } from './network-status';
import messageService from './message-service';

class SyncService {
  private syncInterval: number | null = null;
  private lastSyncTime: number = 0;
  
  public startSync(intervalMs: number = 30000): void {
    // Clear any existing interval
    this.stopSync();
    
    // Start a new interval
    this.syncInterval = window.setInterval(() => {
      this.sync();
    }, intervalMs);
    
    // Sync immediately
    this.sync();
  }
  
  public stopSync(): void {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  public async sync(): Promise<void> {
    // Check if we're online
    if (!isOnline()) {
      return;
    }
    
    try {
      // Sync outbox first (send pending messages)
      await messageService.syncOutbox();
      
      // Sync conversations
      await this.syncConversations();
      
      // Sync messages for each conversation
      const conversations = await database.getConversations();
      
      for (const conversation of conversations) {
        await this.syncMessages(conversation.id);
      }
      
      // Sync users
      await this.syncUsers();
      
      // Update last sync time
      this.lastSyncTime = Date.now();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
  
  private async syncConversations(): Promise<void> {
    try {
      // Fetch conversations from server
      const response = await fetch('/api/conversations', {
        headers: {
          'If-Modified-Since': new Date(this.lastSyncTime).toUTCString(),
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync conversations: ${response.statusText}`);
      }
      
      // If no new data, return
      if (response.status === 304) {
        return;
      }
      
      const serverConversations = await response.json();
      
      // Get local conversations
      const localConversations = await database.getConversations();
      const localConversationMap = new Map(
        localConversations.map(conv => [conv.id, conv])
      );
      
      // Update local database with server data
      for (const serverConversation of serverConversations) {
        const localConversation = localConversationMap.get(serverConversation.id);
        
        if (!localConversation || serverConversation.updatedAt > localConversation.updatedAt) {
          // Server has newer data, update local
          await database.saveConversation(serverConversation);
        }
      }
    } catch (error) {
      console.error('Failed to sync conversations:', error);
      throw error;
    }
  }
  
  private async syncMessages(conversationId: string): Promise<void> {
    try {
      // Get the latest local message timestamp
      const localMessages = await database.getMessages(conversationId);
      const latestTimestamp = localMessages.length > 0
        ? Math.max(...localMessages.map(msg => msg.timestamp))
        : 0;
      
      // Fetch messages from server
      const response = await fetch(`/api/conversations/${conversationId}/messages?since=${latestTimestamp}`);
      
      if (!response.ok) {
        throw new Error(`Failed to sync messages: ${response.statusText}`);
      }
      
      const serverMessages = await response.json();
      
      // Create a map of local messages
      const localMessageMap = new Map(
        localMessages.map(msg => [msg.id, msg])
      );
      
      // Update local database with server data
      for (const serverMessage of serverMessages) {
        const localMessage = localMessageMap.get(serverMessage.id);
        
        if (!localMessage) {
          // New message from server
          await database.saveMessage(serverMessage);
        } else if (!localMessage.localOnly) {
          // Update existing message
          // Don't update local-only messages
          await database.saveMessage({
            ...localMessage,
            ...serverMessage,
          });
        }
      }
    } catch (error) {
      console.error(`Failed to sync messages for conversation ${conversationId}:`, error);
      throw error;
    }
  }
  
  private async syncUsers(): Promise<void> {
    try {
      // Fetch users from server
      const response = await fetch('/api/users', {
        headers: {
          'If-Modified-Since': new Date(this.lastSyncTime).toUTCString(),
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync users: ${response.statusText}`);
      }
      
      // If no new data, return
      if (response.status === 304) {
        return;
      }
      
      const serverUsers = await response.json();
      
      // Update local database with server data
      for (const serverUser of serverUsers) {
        await database.saveUser(serverUser);
      }
    } catch (error) {
      console.error('Failed to sync users:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const syncService = new SyncService();

export default syncService;
```

## Conflict Resolution

Conflicts between local and server data are resolved using various strategies:

```typescript
// Example of conflict resolution
// conflict-resolver.ts
import database from './db';

class ConflictResolver {
  public async resolveMessageConflict(localMessage: any, serverMessage: any): Promise<any> {
    // If the message is local-only, keep local version
    if (localMessage.localOnly) {
      return localMessage;
    }
    
    // If server message is newer, use server version
    if (serverMessage.updatedAt > localMessage.updatedAt) {
      return serverMessage;
    }
    
    // If local message has a different status, merge them
    if (localMessage.status !== serverMessage.status) {
      // Use the "more advanced" status
      const statusPriority = {
        'sending': 1,
        'sent': 2,
        'delivered': 3,
        'read': 4,
        'failed': 0,
      };
      
      const resolvedStatus = statusPriority[localMessage.status] > statusPriority[serverMessage.status]
        ? localMessage.status
        : serverMessage.status;
      
      return {
        ...serverMessage,
        status: resolvedStatus,
      };
    }
    
    // Default to server version
    return serverMessage;
  }
  
  public async resolveConversationConflict(localConversation: any, serverConversation: any): Promise<any> {
    // If server conversation is newer, use server version
    if (serverConversation.updatedAt > localConversation.updatedAt) {
      // But preserve unread count if it's different
      if (localConversation.unreadCount !== serverConversation.unreadCount) {
        return {
          ...serverConversation,
          unreadCount: localConversation.unreadCount,
        };
      }
      
      return serverConversation;
    }
    
    // If local conversation has newer last message, merge them
    if (
      localConversation.lastMessage &&
      serverConversation.lastMessage &&
      localConversation.lastMessage.timestamp > serverConversation.lastMessage.timestamp
    ) {
      return {
        ...serverConversation,
        lastMessage: localConversation.lastMessage,
        updatedAt: localConversation.updatedAt,
      };
    }
    
    // Default to local version
    return localConversation;
  }
  
  public async resolveUserConflict(localUser: any, serverUser: any): Promise<any> {
    // Always use server version for user data
    return serverUser;
  }
}

// Create a singleton instance
const conflictResolver = new ConflictResolver();

export default conflictResolver;
```

## User Experience Considerations

The application provides a seamless user experience during connectivity changes:

```typescript
// Example of offline UX considerations
// network-status.ts
class NetworkStatus {
  private online: boolean = navigator.onLine;
  private listeners: Set<(online: boolean) => void> = new Set();
  
  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));
    
    // Initial status
    this.online = navigator.onLine;
  }
  
  private updateStatus(online: boolean): void {
    // Only update if status changed
    if (this.online === online) {
      return;
    }
    
    this.online = online;
    
    // Notify listeners
    for (const listener of this.listeners) {
      try {
        listener(online);
      } catch (error) {
        console.error('Error in network status listener:', error);
      }
    }
  }
  
  public isOnline(): boolean {
    return this.online;
  }
  
  public addListener(listener: (online: boolean) => void): void {
    this.listeners.add(listener);
  }
  
  public removeListener(listener: (online: boolean) => void): void {
    this.listeners.delete(listener);
  }
}

// Create a singleton instance
const networkStatus = new NetworkStatus();

// Export helper functions
export function isOnline(): boolean {
  return networkStatus.isOnline();
}

export function onNetworkStatusChange(listener: (online: boolean) => void): () => void {
  networkStatus.addListener(listener);
  
  // Return a function to remove the listener
  return () => {
    networkStatus.removeListener(listener);
  };
}

// Usage in components
// offline-indicator.tsx
import React, { useState, useEffect } from 'react';
import { isOnline, onNetworkStatusChange } from './network-status';

const OfflineIndicator: React.FC = () => {
  const [online, setOnline] = useState(isOnline());
  
  useEffect(() => {
    // Listen for network status changes
    const removeListener = onNetworkStatusChange((online) => {
      setOnline(online);
    });
    
    // Clean up listener
    return removeListener;
  }, []);
  
  if (online) {
    return null;
  }
  
  return (
    <div className="offline-indicator">
      <span className="offline-indicator__icon">⚠️</span>
      <span className="offline-indicator__text">You are offline. Messages will be sent when you reconnect.</span>
    </div>
  );
};

export default OfflineIndicator;
```

## Progressive Web App Features

The application is implemented as a Progressive Web App (PWA) for enhanced offline capabilities:

```typescript
// Example of PWA configuration
// manifest.json
{
  "name": "Chat Application",
  "short_name": "Chat",
  "description": "A real-time chat application with offline support",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/maskable-icon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "New Message",
      "short_name": "New",
      "description": "Start a new conversation",
      "url": "/new",
      "icons": [
        {
          "src": "/icons/new-message.png",
          "sizes": "192x192"
        }
      ]
    },
    {
      "name": "Recent Conversations",
      "short_name": "Recent",
      "description": "View recent conversations",
      "url": "/conversations",
      "icons": [
        {
          "src": "/icons/recent.png",
          "sizes": "192x192"
        }
      ]
    }
  ]
}

// index.html
