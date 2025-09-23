# Chat Application Scalability Strategies

This document outlines the scalability strategies implemented in the chat application to ensure it can handle a growing user base and increasing message volume while maintaining performance and reliability.

## Table of Contents

1. [Scalability Overview](#scalability-overview)
2. [Frontend Scalability](#frontend-scalability)
3. [WebSocket Scaling](#websocket-scaling)
4. [API Scaling](#api-scaling)
5. [Database Scaling](#database-scaling)
6. [Caching Strategies](#caching-strategies)
7. [Load Balancing](#load-balancing)
8. [Content Delivery](#content-delivery)
9. [Monitoring and Scaling Triggers](#monitoring-and-scaling-triggers)
10. [Implementation Details](#implementation-details)

## Scalability Overview

Scalability is a critical aspect of the chat application, as it needs to handle varying loads and grow with the user base. Our scalability strategy focuses on several key areas:

1. **Horizontal Scaling**: Adding more instances of services to handle increased load
2. **Vertical Scaling**: Increasing resources for existing instances when needed
3. **Efficient Resource Usage**: Optimizing code and infrastructure to minimize resource consumption
4. **Load Distribution**: Evenly distributing load across available resources
5. **Graceful Degradation**: Maintaining core functionality during peak loads or partial outages

### Scalability Metrics

We track the following key scalability metrics:

1. **Response Time**: Time to process and respond to requests
2. **Throughput**: Number of requests processed per second
3. **Error Rate**: Percentage of requests that result in errors
4. **Resource Utilization**: CPU, memory, network, and disk usage
5. **Connection Count**: Number of active WebSocket connections
6. **Message Rate**: Number of messages sent and received per second
7. **Queue Depth**: Length of message queues waiting to be processed

### Scalability Targets

The application aims to meet the following scalability targets:

1. **User Base**: Support up to 10 million active users
2. **Message Volume**: Handle up to 100,000 messages per second
3. **Connection Count**: Support up to 1 million concurrent WebSocket connections
4. **Response Time**: Maintain < 200ms API response time under load
5. **Availability**: 99.99% uptime (less than 1 hour of downtime per year)

## Frontend Scalability

The frontend is designed to scale efficiently with increasing user load.

### Code Splitting and Lazy Loading

Components and features are loaded on-demand to reduce initial load time and memory usage:

```tsx
// Example of code splitting and lazy loading
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoadingIndicator from './components/LoadingIndicator';

// Lazy load routes
const Home = lazy(() => import('./pages/Home'));
const Conversations = lazy(() => import('./pages/Conversations'));
const Conversation = lazy(() => import('./pages/Conversation'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

// Lazy load features
const VideoChat = lazy(() => import('./features/VideoChat'));
const FileSharing = lazy(() => import('./features/FileSharing'));
const GroupManagement = lazy(() => import('./features/GroupManagement'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/conversations" component={Conversations} />
        <Route path="/conversations/:id" component={Conversation} />
        <Route path="/settings" component={Settings} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </Suspense>
  );
};

// Feature loader component
interface FeatureLoaderProps {
  feature: 'video-chat' | 'file-sharing' | 'group-management';
  children: (Component: React.ComponentType<any>) => React.ReactNode;
}

const FeatureLoader: React.FC<FeatureLoaderProps> = ({ feature, children }) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const loadFeature = useCallback(async () => {
    if (Component || loading) return;
    
    setLoading(true);
    
    try {
      let module;
      
      switch (feature) {
        case 'video-chat':
          module = await import('./features/VideoChat');
          break;
        case 'file-sharing':
          module = await import('./features/FileSharing');
          break;
        case 'group-management':
          module = await import('./features/GroupManagement');
          break;
      }
      
      setComponent(() => module.default);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [feature, Component, loading]);
  
  if (error) {
    return <div>Failed to load feature: {error.message}</div>;
  }
  
  if (Component) {
    return <>{children(Component)}</>;
  }
  
  return (
    <button onClick={loadFeature} disabled={loading}>
      {loading ? 'Loading...' : `Load ${feature.replace('-', ' ')}`}
    </button>
  );
};

// Usage
function ConversationView() {
  return (
    <div>
      <MessageList />
      <MessageInput />
      
      <FeatureLoader feature="video-chat">
        {(VideoChat) => <VideoChat conversationId="123" />}
      </FeatureLoader>
    </div>
  );
}
```

### Worker Threads

Computationally intensive tasks are offloaded to worker threads:

```typescript
// Example of worker thread usage
// worker.ts
self.onmessage = (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'process_messages':
      const processedMessages = processMessages(payload.messages);
      self.postMessage({
        type: 'process_messages_result',
        payload: {
          processedMessages,
          requestId: payload.requestId,
        },
      });
      break;
    case 'search_messages':
      const searchResults = searchMessages(payload.query, payload.messages);
      self.postMessage({
        type: 'search_messages_result',
        payload: {
          results: searchResults,
          requestId: payload.requestId,
        },
      });
      break;
    case 'encrypt_message':
      const encryptedMessage = encryptMessage(payload.message, payload.publicKey);
      self.postMessage({
        type: 'encrypt_message_result',
        payload: {
          encryptedMessage,
          requestId: payload.requestId,
        },
      });
      break;
    case 'decrypt_message':
      const decryptedMessage = decryptMessage(payload.encryptedMessage, payload.privateKey);
      self.postMessage({
        type: 'decrypt_message_result',
        payload: {
          decryptedMessage,
          requestId: payload.requestId,
        },
      });
      break;
  }
};

function processMessages(messages) {
  // Process messages (e.g., sort, filter, group)
  return messages.map(message => ({
    ...message,
    processed: true,
    timestamp: new Date(message.timestamp),
    formattedContent: formatMessageContent(message.content),
  }));
}

function searchMessages(query, messages) {
  // Search messages for query
  const normalizedQuery = query.toLowerCase();
  
  return messages.filter(message => 
    message.content.toLowerCase().includes(normalizedQuery)
  );
}

function encryptMessage(message, publicKey) {
  // Encrypt message with public key
  // This is a simplified example
  return btoa(message);
}

function decryptMessage(encryptedMessage, privateKey) {
  // Decrypt message with private key
  // This is a simplified example
  return atob(encryptedMessage);
}

function formatMessageContent(content) {
  // Format message content (e.g., markdown, emojis, mentions)
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// Usage in main thread
// workerManager.ts
class WorkerManager {
  private worker: Worker;
  private requestMap: Map<string, { resolve: Function; reject: Function }> = new Map();
  
  constructor() {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url));
    
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.worker.onerror = this.handleWorkerError.bind(this);
  }
  
  private handleWorkerMessage(event: MessageEvent) {
    const { type, payload } = event.data;
    const { requestId } = payload;
    
    if (requestId && this.requestMap.has(requestId)) {
      const { resolve } = this.requestMap.get(requestId);
      
      // Remove the request from the map
      this.requestMap.delete(requestId);
      
      // Resolve the promise with the result
      resolve(payload);
    }
  }
  
  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    
    // Reject all pending requests
    for (const [requestId, { reject }] of this.requestMap.entries()) {
      reject(new Error('Worker error: ' + error.message));
      this.requestMap.delete(requestId);
    }
  }
  
  public async processMessages(messages: any[]): Promise<any[]> {
    return this.sendRequest('process_messages', { messages });
  }
  
  public async searchMessages(query: string, messages: any[]): Promise<any[]> {
    return this.sendRequest('search_messages', { query, messages });
  }
  
  public async encryptMessage(message: string, publicKey: string): Promise<string> {
    const result = await this.sendRequest('encrypt_message', { message, publicKey });
    return result.encryptedMessage;
  }
  
  public async decryptMessage(encryptedMessage: string, privateKey: string): Promise<string> {
    const result = await this.sendRequest('decrypt_message', { encryptedMessage, privateKey });
    return result.decryptedMessage;
  }
  
  private sendRequest(type: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Generate a unique request ID
      const requestId = Math.random().toString(36).substr(2, 9);
      
      // Store the promise callbacks
      this.requestMap.set(requestId, { resolve, reject });
      
      // Send the request to the worker
      this.worker.postMessage({
        type,
        payload: {
          ...payload,
          requestId,
        },
      });
      
      // Set a timeout to reject the promise if the worker doesn't respond
      setTimeout(() => {
        if (this.requestMap.has(requestId)) {
          const { reject } = this.requestMap.get(requestId);
          reject(new Error(`Request ${type} timed out`));
          this.requestMap.delete(requestId);
        }
      }, 10000); // 10 seconds timeout
    });
  }
  
  public terminate() {
    this.worker.terminate();
  }
}

// Usage
const workerManager = new WorkerManager();

async function handleMessageSearch(query: string) {
  try {
    const messages = await api.fetchMessages();
    const searchResults = await workerManager.searchMessages(query, messages);
    
    // Update UI with search results
    updateSearchResults(searchResults);
  } catch (error) {
    console.error('Search failed:', error);
    showErrorMessage('Failed to search messages');
  }
}
```

### Connection Management

WebSocket connections are managed efficiently to reduce resource usage:

```typescript
// Example of connection management
class ConnectionManager {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000;
  private heartbeatInterval: number | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private messageQueue: any[] = [];
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private url: string;
  
  constructor(url: string) {
    this.url = url;
  }
  
  public async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      return;
    }
    
    this.isConnecting = true;
    
    try {
      await this.createConnection();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.flushMessageQueue();
    } catch (error) {
      this.handleConnectionError(error);
    } finally {
      this.isConnecting = false;
    }
  }
  
  private createConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          resolve();
        };
        
        this.socket.onclose = (event) => {
          this.handleConnectionClose(event);
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  private handleConnectionClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    
    this.isConnected = false;
    this.stopHeartbeat();
    
    // Attempt to reconnect if not a clean close
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
    
    // Notify listeners
    this.emit('close', event);
  }
  
  private handleConnectionError(error: any): void {
    console.error('WebSocket connection error:', error);
    
    this.isConnected = false;
    this.stopHeartbeat();
    
    // Attempt to reconnect
    this.attemptReconnect();
    
    // Notify listeners
    this.emit('error', error);
  }
  
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnect attempts reached');
      this.emit('reconnect_failed');
      return;
    }
    
    this.reconnectAttempts++;
    
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
    
    // Notify listeners
    this.emit('reconnecting', this.reconnectAttempts);
  }
  
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      
      // Handle heartbeat response
      if (message.type === 'pong') {
        this.emit('heartbeat');
        return;
      }
      
      // Notify listeners
      this.emit('message', message);
      
      // Emit event for specific message type
      if (message.type) {
        this.emit(message.type, message.payload);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }
  
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = window.setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping' });
      }
    }, 30000); // 30 seconds
  }
  
  private stopHeartbeat(): void {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  public send(data: any): void {
    if (!this.isConnected) {
      // Queue message to be sent when connection is established
      this.messageQueue.push(data);
      this.connect();
      return;
    }
    
    try {
      this.socket?.send(JSON.stringify(data));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Queue message to be sent later
      this.messageQueue.push(data);
      
      // Reconnect if socket is closed
      if (!this.isConnected) {
        this.connect();
      }
    }
  }
  
  private flushMessageQueue(): void {
    if (this.messageQueue.length === 0) {
      return;
    }
    
    console.log(`Flushing ${this.messageQueue.length} queued messages`);
    
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    
    for (const message of messages) {
      this.send(message);
    }
  }
  
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)?.add(callback);
  }
  
  public off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    this.listeners.get(event)?.delete(callback);
  }
  
  private emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    for (const callback of this.listeners.get(event) || []) {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    }
  }
  
  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
      this.socket = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
    this.stopHeartbeat();
  }
}

// Usage
const connectionManager = new ConnectionManager('wss://chat-api.example.com/ws');

// Connect to WebSocket
connectionManager.connect();

// Listen for messages
connectionManager.on('message', (message) => {
  console.log('Received message:', message);
});

// Listen for specific message types
connectionManager.on('new_message', (payload) => {
  addMessageToConversation(payload.conversationId, payload.message);
});

connectionManager.on('typing_indicator', (payload) => {
  updateTypingIndicator(payload.conversationId, payload.userId, payload.isTyping);
});

// Send a message
connectionManager.send({
  type: 'send_message',
  payload: {
    conversationId: '123',
    content: 'Hello, world!',
  },
});

// Disconnect when component unmounts
useEffect(() => {
  return () => {
    connectionManager.disconnect();
  };
}, []);
```

## WebSocket Scaling

WebSocket connections are scaled to handle a large number of concurrent users.

### Connection Distribution

WebSocket connections are distributed across multiple servers:

```typescript
// Example of WebSocket connection distribution
class WebSocketCluster {
  private servers: string[];
  private connectionManager: ConnectionManager | null = null;
  private userId: string;
  
  constructor(servers: string[], userId: string) {
    this.servers = servers;
    this.userId = userId;
  }
  
  public connect(): void {
    // Select a server based on user ID
    const server = this.selectServer(this.userId);
    
    // Create a connection manager for the selected server
    this.connectionManager = new ConnectionManager(`wss://${server}/ws`);
    
    // Connect to the server
    this.connectionManager.connect();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  private selectServer(userId: string): string {
    // Consistent hashing to select a server
    const hash = this.hashString(userId);
    const index = hash % this.servers.length;
    
    return this.servers[index];
  }
  
  private hashString(str: string): number {
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash);
  }
  
  private setupEventListeners(): void {
    if (!this.connectionManager) {
      return;
    }
    
    // Handle reconnection
    this.connectionManager.on('reconnecting', (attempt: number) => {
      console.log(`Reconnecting to WebSocket server (attempt ${attempt})`);
      
      // If we've tried too many times with the current server,
      // try a different server
      if (attempt > 3) {
        this.rotateServer();
      }
    });
    
    // Handle reconnection failure
    this.connectionManager.on('reconnect_failed', () => {
      console.error('Failed to reconnect to WebSocket server');
      
      // Try a different server
      this.rotateServer();
    });
  }
  
  private rotateServer(): void {
    console.log('Rotating to a different WebSocket server');
    
    // Disconnect from current server
    this.connectionManager?.disconnect();
    
    // Remove the current server from the list
    const currentServer = this.servers.shift();
    if (currentServer) {
      // Add it to the end of the list
      this.servers.push(currentServer);
    }
    
    // Connect to the next server
    this.connect();
  }
  
  public send(data: any): void {
    this.connectionManager?.send(data);
  }
  
  public on(event: string, callback: Function): void {
    this.connectionManager?.on(event, callback);
  }
  
  public off(event: string, callback: Function): void {
    this.connectionManager?.off(event, callback);
  }
  
  public disconnect(): void {
    this.connectionManager?.disconnect();
    this.connectionManager = null;
  }
}

// Usage
const webSocketCluster = new WebSocketCluster([
  'ws1.chat-api.example.com',
  'ws2.chat-api.example.com',
  'ws3.chat-api.example.com',
], currentUser.id);

// Connect to the WebSocket cluster
webSocketCluster.connect();

// Send a message
webSocketCluster.send({
  type: 'send_message',
  payload: {
    conversationId: '123',
    content: 'Hello, world!',
  },
});

// Listen for messages
webSocketCluster.on('new_message', (payload) => {
  addMessageToConversation(payload.conversationId, payload.message);
});
```

### Message Batching

Messages are batched to reduce network overhead:

```typescript
// Example of message batching
class MessageBatcher {
  private batchInterval: number;
  private maxBatchSize: number;
  private batch: any[] = [];
  private timer: number | null = null;
  private onSendBatch: (batch: any[]) => void;
  
  constructor(
    onSendBatch: (batch: any[]) => void,
    options: {
      batchInterval?: number;
      maxBatchSize?: number;
    } = {}
  ) {
    this.batchInterval = options.batchInterval || 100; // 100ms
    this.maxBatchSize = options.maxBatchSize || 20; // 20 messages
    this.onSendBatch = onSendBatch;
  }
  
  public add(message: any): void {
    // Add message to batch
    this.batch.push(message);
    
    // Start timer if not already running
    if (this.timer === null) {
      this.timer = window.setTimeout(() => this.flush(), this.batchInterval);
    }
    
    // Flush immediately if batch is full
    if (this.batch.length >= this.maxBatchSize) {
      this.flush();
    }
  }
  
  public flush(): void {
    // Clear timer
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    // If batch is empty, do nothing
    if (this.batch.length === 0) {
      return;
    }
    
    // Send batch
    const batchToSend = [...this.batch];
    this.batch = [];
    
    this.onSendBatch(batchToSend);
  }
}

// Usage
const messageBatcher = new MessageBatcher(
  (batch) => {
    // Send batch to server
    connectionManager.send({
      type: 'batch',
      payload: {
        messages: batch,
      },
    });
  },
  {
    batchInterval: 50, // 50ms
    maxBatchSize: 10, // 10 messages
  }
);

// Add messages to batch
function sendReadReceipt(messageId: string): void {
  messageBatcher.add({
    type: 'read_receipt',
    messageId,
  });
}

// Mark multiple messages as read
for (const message of unreadMessages) {
  sendReadReceipt(message.id);
}
```

### Connection Pooling

WebSocket connections are pooled to reduce resource usage:

```typescript
// Example of WebSocket connection pooling
class WebSocketPool {
  private maxConnections: number;
  private connections: Map<string, WebSocket> = new Map();
  private connectionUsage: Map<string, number> = new Map();
  
  constructor(maxConnections: number = 6) {
    this.maxConnections = maxConnections;
  }
  
  public getConnection(url: string): WebSocket {
    // Check if connection already exists
    if (this.connections.has(url)) {
      // Increment usage count
      this.connectionUsage.set(url, (this.connectionUsage.get(url) || 0) + 1);
      
      return this.connections.get(url)!;
    }
    
    // Check if pool is full
    if (this.connections.size >= this.maxConnections) {
      // Find least used connection
      let leastUsedUrl: string | null = null;
      let leastUsageCount = Infinity;
      
      for (const [connUrl, usageCount] of this.connectionUsage.entries()) {
        if (usageCount < leastUsageCount) {
          leastUsageCount = usageCount;
          leastUsedUrl = connUrl;
        }
      }
      
      // Close least used connection
      if (leastUsedUrl) {
        this.closeConnection(leastUsedUrl);
      }
    }
    
    // Create new connection
    const connection = new WebSocket(url);
    
    // Store connection
    this.connections.set(url, connection);
    this.connectionUsage.set(url, 1);
    
    // Set up event listeners
    connection.addEventListener('close', () => {
      this.connections.delete(url);
      this.connectionUsage.delete(url);
    });
    
    return connection;
  }
  
  public releaseConnection(url: string): void {
    // Decrement usage count
    const usageCount = this.connectionUsage.get(url) || 0;
    
    if (usageCount <= 1) {
      // Close connection if no longer used
      this.closeConnection(url);
    } else {
      // Update usage count
      this.connectionUsage.set(url, usageCount - 1);
    }
  }
  
  private closeConnection(url: string): void {
    const connection = this.connections.get(url);
    
    if (connection) {
      // Close connection
      connection.close();
      
      // Remove from pool
      this.connections.delete(url);
      this.connectionUsage.delete(url);
    }
  }
  
  public closeAll(): void {
    // Close all connections
    for (const url of this.connections.keys()) {
      this.closeConnection(url);
    }
  }
}

// Usage
const webSocketPool = new WebSocketPool(4);

function getWebSocket(url: string): WebSocket {
  return webSocketPool.getConnection(url);
}

function releaseWebSocket(url: string): void {
  webSocketPool.releaseConnection(url);
}

// Clean up when component unmounts
useEffect(() => {
  return () => {
    webSocketPool.closeAll();
  };
}, []);
```

## API Scaling

API endpoints are designed to scale with increasing request volume.

### Request Rate Limiting

Requests are rate-limited to prevent abuse:

```typescript
// Example of client-side rate limiting
class RateLimiter {
  private limits: Map<string, { count: number; resetTime: number }> = new Map();
  private defaultLimit: number;
  private defaultWindow: number;
  
  constructor(defaultLimit: number = 60, defaultWindow: number = 60000) {
    this.defaultLimit = defaultLimit;
    this.defaultWindow = defaultWindow;
  }
  
  public async checkLimit(
    endpoint: string,
    options: {
      limit?: number;
      window?: number;
      waitForReset?: boolean;
    } = {}
  ): Promise<boolean> {
    const limit = options.limit || this.defaultLimit;
    const window = options.window || this.defaultWindow;
    const waitForReset = options.waitForReset || false;
    
    // Get current limit state
    let limitState = this.limits.get(endpoint);
    
    // If no limit state or reset time has passed, create new state
    const now = Date.now();
    
    if (!limitState || limitState.resetTime <= now) {
      limitState = {
        count: 0,
        resetTime: now + window,
      };
      
      this.limits.set(endpoint, limitState);
    }
    
    // Check if limit is reached
    if (limitState.count >= limit) {
      if (waitForReset) {
        // Wait for reset
        const waitTime = limitState.resetTime - now;
        
        if (waitTime > 0) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          
          // Reset limit state
          limitState = {
            count: 0,
            resetTime:
