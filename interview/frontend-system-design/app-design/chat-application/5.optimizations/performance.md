# Chat Application Performance Optimizations

This document outlines the performance optimization strategies implemented in the chat application to ensure a smooth and responsive user experience across different devices and network conditions.

## Table of Contents

1. [Performance Overview](#performance-overview)
2. [Rendering Optimizations](#rendering-optimizations)
3. [Network Optimizations](#network-optimizations)
4. [Asset Optimizations](#asset-optimizations)
5. [State Management Optimizations](#state-management-optimizations)
6. [Memory Management](#memory-management)
7. [Virtualization](#virtualization)
8. [Caching Strategies](#caching-strategies)
9. [Measuring Performance](#measuring-performance)
10. [Implementation Details](#implementation-details)

## Performance Overview

Performance is a critical aspect of the chat application, as users expect real-time messaging with minimal latency and smooth interactions. Our performance optimization strategy focuses on several key areas:

1. **Fast Initial Load**: Minimize time to interactive for new users
2. **Smooth Message Rendering**: Ensure messages render quickly, even in long conversations
3. **Responsive UI**: Maintain 60fps for all animations and interactions
4. **Efficient Network Usage**: Minimize data transfer and optimize request patterns
5. **Low Memory Footprint**: Prevent memory leaks and excessive memory usage
6. **Battery Efficiency**: Minimize CPU and network usage to preserve battery life

### Performance Metrics

We track the following key performance metrics:

1. **Time to Interactive (TTI)**: Time until the app is fully interactive
2. **First Contentful Paint (FCP)**: Time until the first content is rendered
3. **Input Latency**: Time between user input and visible response
4. **Memory Usage**: RAM consumption over time
5. **CPU Usage**: Processing time required for key operations
6. **Network Requests**: Number and size of network requests
7. **Frame Rate**: Frames per second during animations and scrolling

### Performance Targets

The application aims to meet the following performance targets:

1. **TTI**: < 2 seconds on mid-range devices with good connectivity
2. **FCP**: < 1 second on mid-range devices with good connectivity
3. **Input Latency**: < 100ms for all interactions
4. **Memory Usage**: < 100MB after initial load
5. **Frame Rate**: Consistent 60fps for all animations and scrolling
6. **Message Send-to-Receive Latency**: < 500ms with good connectivity

## Rendering Optimizations

The application implements several rendering optimizations to ensure smooth UI performance.

### Component Memoization

Components are memoized to prevent unnecessary re-renders:

```tsx
// Example of component memoization
import React, { memo } from 'react';

interface MessageItemProps {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  isOwn: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  onRetry?: (messageId: string) => void;
}

// Use React.memo to prevent unnecessary re-renders
const MessageItem = memo(
  ({
    id,
    content,
    timestamp,
    sender,
    isOwn,
    status,
    onRetry,
  }: MessageItemProps) => {
    // Only re-render this component if one of its props changes
    return (
      <div className={`message ${isOwn ? 'message--own' : ''}`}>
        {!isOwn && (
          <div className="message__avatar">
            <img src={sender.avatar} alt={sender.name} />
          </div>
        )}
        <div className="message__content">
          {!isOwn && <div className="message__sender">{sender.name}</div>}
          <div className="message__bubble">{content}</div>
          <div className="message__meta">
            <span className="message__time">{formatTime(timestamp)}</span>
            {isOwn && <MessageStatus status={status} onRetry={() => onRetry?.(id)} />}
          </div>
        </div>
      </div>
    );
  },
  // Custom comparison function to determine if re-render is needed
  (prevProps, nextProps) => {
    // Only re-render if these props change
    return (
      prevProps.content === nextProps.content &&
      prevProps.status === nextProps.status &&
      prevProps.isOwn === nextProps.isOwn
    );
  }
);

// Memoized message status component
const MessageStatus = memo(({ status, onRetry }) => {
  switch (status) {
    case 'sending':
      return <span className="message__status message__status--sending">Sending...</span>;
    case 'sent':
      return <span className="message__status message__status--sent">Sent</span>;
    case 'delivered':
      return <span className="message__status message__status--delivered">Delivered</span>;
    case 'read':
      return <span className="message__status message__status--read">Read</span>;
    case 'failed':
      return (
        <span className="message__status message__status--failed">
          Failed <button onClick={onRetry}>Retry</button>
        </span>
      );
    default:
      return null;
  }
});

export default MessageItem;
```

### Windowing for Long Lists

Virtualization is used for long message lists to improve performance:

```tsx
// Example of virtualized message list
import React, { useRef, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import MessageItem from './MessageItem';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface MessageListProps {
  messages: Message[];
  users: Record<string, User>;
  currentUserId: string;
  onRetryMessage: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  users,
  currentUserId,
  onRetryMessage,
}) => {
  const listRef = useRef<List>(null);
  const sizeMap = useRef<Record<string, number>>({});
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages.length]);
  
  // Estimate the size of each message item
  const getItemSize = (index: number) => {
    const message = messages[index];
    
    // Return cached size if available
    if (sizeMap.current[message.id]) {
      return sizeMap.current[message.id];
    }
    
    // Estimate size based on content length
    const baseHeight = 60; // Base height for a message
    const contentLength = message.content.length;
    const estimatedHeight = baseHeight + Math.ceil(contentLength / 50) * 20;
    
    // Cache the estimated size
    sizeMap.current[message.id] = estimatedHeight;
    
    return estimatedHeight;
  };
  
  // Render a message item
  const renderMessage = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const message = messages[index];
    const sender = users[message.senderId];
    const isOwn = message.senderId === currentUserId;
    
    return (
      <div style={style}>
        <MessageItem
          id={message.id}
          content={message.content}
          timestamp={message.timestamp}
          sender={sender}
          isOwn={isOwn}
          status={message.status}
          onRetry={onRetryMessage}
        />
      </div>
    );
  };
  
  return (
    <div className="message-list">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={getItemSize}
            overscanCount={5}
          >
            {renderMessage}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default MessageList;
```

### Deferred Rendering

Non-critical UI elements are rendered after the main content:

```tsx
// Example of deferred rendering
import React, { useState, useEffect } from 'react';

const ChatView: React.FC = () => {
  // State for critical and non-critical UI elements
  const [showNonCriticalUI, setShowNonCriticalUI] = useState(false);
  
  useEffect(() => {
    // Render critical UI first
    
    // Defer rendering of non-critical UI
    const timer = setTimeout(() => {
      setShowNonCriticalUI(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="chat-view">
      {/* Critical UI elements (message list, input box) */}
      <MessageList />
      <MessageInput />
      
      {/* Non-critical UI elements */}
      {showNonCriticalUI && (
        <>
          <UserPresenceIndicator />
          <TypingIndicator />
          <ConversationDetails />
        </>
      )}
    </div>
  );
};

export default ChatView;
```

### Optimized Re-rendering

The application uses custom hooks to optimize re-rendering:

```tsx
// Example of optimized re-rendering with custom hooks
import { useState, useCallback, useRef, useEffect } from 'react';

// Custom hook for managing typing indicator state
function useTypingIndicator(conversationId: string, userId: string) {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Throttled function to send typing indicator
  const sendTypingIndicator = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      api.sendTypingIndicator(conversationId, userId, true);
    }
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set timeout to clear typing indicator
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      api.sendTypingIndicator(conversationId, userId, false);
    }, 3000);
  }, [conversationId, userId, isTyping]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return { isTyping, sendTypingIndicator };
}

// Usage in component
function MessageInput({ conversationId, userId }) {
  const [message, setMessage] = useState('');
  const { sendTypingIndicator } = useTypingIndicator(conversationId, userId);
  
  const handleChange = (e) => {
    setMessage(e.target.value);
    sendTypingIndicator();
  };
  
  return (
    <div className="message-input">
      <textarea value={message} onChange={handleChange} />
      <button>Send</button>
    </div>
  );
}
```

## Network Optimizations

The application implements several network optimizations to reduce latency and bandwidth usage.

### Request Batching

Multiple API requests are batched to reduce network overhead:

```typescript
// Example of request batching
class RequestBatcher {
  private queue: Array<QueuedRequest> = [];
  private timer: NodeJS.Timeout | null = null;
  private batchInterval: number;
  private maxBatchSize: number;
  
  constructor(batchInterval = 100, maxBatchSize = 20) {
    this.batchInterval = batchInterval;
    this.maxBatchSize = maxBatchSize;
  }
  
  public add<T>(
    endpoint: string,
    method: string,
    data: any,
    resolve: (value: T) => void,
    reject: (error: Error) => void
  ): void {
    // Add request to queue
    this.queue.push({
      endpoint,
      method,
      data,
      resolve,
      reject,
    });
    
    // Start timer if not already running
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchInterval);
    }
    
    // Flush immediately if queue reaches max size
    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
    }
  }
  
  private async flush(): void {
    // Clear timer
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    // If queue is empty, do nothing
    if (this.queue.length === 0) {
      return;
    }
    
    // Get current queue and reset
    const requests = [...this.queue];
    this.queue = [];
    
    // Group requests by endpoint and method
    const groupedRequests = this.groupRequests(requests);
    
    // Process each group
    for (const [key, group] of Object.entries(groupedRequests)) {
      const [endpoint, method] = key.split('|');
      
      try {
        // Send batch request
        const response = await fetch(`${endpoint}/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            method,
            requests: group.map(request => request.data),
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Batch request failed: ${response.statusText}`);
        }
        
        // Process response
        const results = await response.json();
        
        // Resolve individual requests
        for (let i = 0; i < group.length; i++) {
          const request = group[i];
          const result = results[i];
          
          if (result.error) {
            request.reject(new Error(result.error));
          } else {
            request.resolve(result.data);
          }
        }
      } catch (error) {
        // Reject all requests in group
        for (const request of group) {
          request.reject(error);
        }
      }
    }
  }
  
  private groupRequests(requests: Array<QueuedRequest>): Record<string, Array<QueuedRequest>> {
    const groups: Record<string, Array<QueuedRequest>> = {};
    
    for (const request of requests) {
      const key = `${request.endpoint}|${request.method}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      
      groups[key].push(request);
    }
    
    return groups;
  }
}

// Usage
const batcher = new RequestBatcher();

function sendReadReceipt(messageId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    batcher.add(
      '/api/messages/read',
      'POST',
      { messageId },
      resolve,
      reject
    );
  });
}

// Mark multiple messages as read
for (const message of unreadMessages) {
  sendReadReceipt(message.id);
}
```

### Connection Pooling

HTTP connections are pooled to reduce connection overhead:

```typescript
// Example of connection pooling
class ConnectionPool {
  private maxConnections: number;
  private connections: Map<string, Array<Connection>> = new Map();
  private waitingRequests: Map<string, Array<WaitingRequest>> = new Map();
  
  constructor(maxConnections = 6) {
    this.maxConnections = maxConnections;
  }
  
  public async getConnection(host: string): Promise<Connection> {
    // Check if we have an available connection
    const hostConnections = this.connections.get(host) || [];
    
    // Find an idle connection
    const idleConnection = hostConnections.find(conn => conn.idle);
    
    if (idleConnection) {
      // Mark as busy
      idleConnection.idle = false;
      return idleConnection;
    }
    
    // Check if we can create a new connection
    if (hostConnections.length < this.maxConnections) {
      // Create a new connection
      const connection = await this.createConnection(host);
      
      // Add to pool
      hostConnections.push(connection);
      this.connections.set(host, hostConnections);
      
      return connection;
    }
    
    // Wait for a connection to become available
    return new Promise((resolve, reject) => {
      const waitingRequests = this.waitingRequests.get(host) || [];
      waitingRequests.push({ resolve, reject });
      this.waitingRequests.set(host, waitingRequests);
    });
  }
  
  public releaseConnection(connection: Connection): void {
    const hostConnections = this.connections.get(connection.host) || [];
    
    // Find the connection
    const index = hostConnections.findIndex(conn => conn.id === connection.id);
    
    if (index !== -1) {
      // Mark as idle
      hostConnections[index].idle = true;
      
      // Check if there are waiting requests
      const waitingRequests = this.waitingRequests.get(connection.host) || [];
      
      if (waitingRequests.length > 0) {
        // Get the next waiting request
        const nextRequest = waitingRequests.shift();
        this.waitingRequests.set(connection.host, waitingRequests);
        
        // Mark as busy again
        hostConnections[index].idle = false;
        
        // Resolve the waiting request
        nextRequest.resolve(hostConnections[index]);
      }
    }
  }
  
  private async createConnection(host: string): Promise<Connection> {
    // Create a new connection
    const connection = {
      id: Math.random().toString(36).substr(2, 9),
      host,
      idle: false,
      socket: await this.createSocket(host),
    };
    
    return connection;
  }
  
  private async createSocket(host: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(`wss://${host}`);
      
      socket.addEventListener('open', () => {
        resolve(socket);
      });
      
      socket.addEventListener('error', (error) => {
        reject(error);
      });
    });
  }
}

// Usage
const connectionPool = new ConnectionPool();

async function sendRequest(host: string, data: any): Promise<any> {
  // Get a connection from the pool
  const connection = await connectionPool.getConnection(host);
  
  try {
    // Send the request
    connection.socket.send(JSON.stringify(data));
    
    // Wait for response
    const response = await new Promise((resolve, reject) => {
      const handleMessage = (event) => {
        connection.socket.removeEventListener('message', handleMessage);
        resolve(JSON.parse(event.data));
      };
      
      connection.socket.addEventListener('message', handleMessage);
      
      // Set timeout
      const timeout = setTimeout(() => {
        connection.socket.removeEventListener('message', handleMessage);
        reject(new Error('Request timed out'));
      }, 5000);
    });
    
    return response;
  } finally {
    // Release the connection back to the pool
    connectionPool.releaseConnection(connection);
  }
}
```

### Compression

Responses are compressed to reduce bandwidth usage:

```typescript
// Example of response compression handling
async function fetchWithCompression(url: string, options: RequestInit = {}): Promise<any> {
  // Add compression headers
  const headers = {
    ...options.headers,
    'Accept-Encoding': 'gzip, deflate, br',
  };
  
  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Check if response is compressed
  const contentEncoding = response.headers.get('Content-Encoding');
  
  if (contentEncoding) {
    // Get response as array buffer
    const buffer = await response.arrayBuffer();
    
    // Decompress based on encoding
    if (contentEncoding.includes('gzip')) {
      return decompressGzip(buffer);
    } else if (contentEncoding.includes('deflate')) {
      return decompressDeflate(buffer);
    } else if (contentEncoding.includes('br')) {
      return decompressBrotli(buffer);
    }
  }
  
  // If not compressed, return as JSON
  return response.json();
}

// Usage
const messages = await fetchWithCompression('/api/messages');
```

### Prefetching

Critical resources are prefetched to improve perceived performance:

```typescript
// Example of resource prefetching
class ResourcePrefetcher {
  private prefetchedResources: Set<string> = new Set();
  
  public prefetch(url: string, options: { type: 'image' | 'json' | 'script' } = { type: 'json' }): void {
    // Skip if already prefetched
    if (this.prefetchedResources.has(url)) {
      return;
    }
    
    // Mark as prefetched
    this.prefetchedResources.add(url);
    
    // Prefetch based on type
    switch (options.type) {
      case 'image':
        this.prefetchImage(url);
        break;
      case 'json':
        this.prefetchJson(url);
        break;
      case 'script':
        this.prefetchScript(url);
        break;
    }
  }
  
  private prefetchImage(url: string): void {
    const img = new Image();
    img.src = url;
  }
  
  private prefetchJson(url: string): void {
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Prefetch': 'true',
      },
      credentials: 'same-origin',
    }).catch(() => {
      // Ignore errors for prefetch
    });
  }
  
  private prefetchScript(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = url;
    document.head.appendChild(link);
  }
}

// Usage
const prefetcher = new ResourcePrefetcher();

// When user opens a conversation
function openConversation(conversationId: string): void {
  // Prefetch conversation data
  prefetcher.prefetch(`/api/conversations/${conversationId}`);
  
  // Prefetch recent messages
  prefetcher.prefetch(`/api/conversations/${conversationId}/messages`);
  
  // Prefetch user avatars
  for (const participant of conversation.participants) {
    prefetcher.prefetch(participant.avatar, { type: 'image' });
  }
}
```

## Asset Optimizations

The application optimizes assets to reduce load times and bandwidth usage.

### Image Optimization

Images are optimized and served in modern formats:

```typescript
// Example of image optimization
class ImageOptimizer {
  private supportedFormats: string[] = [];
  
  constructor() {
    // Detect supported formats
    this.detectSupportedFormats();
  }
  
  private detectSupportedFormats(): void {
    const canvas = document.createElement('canvas');
    
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      this.supportedFormats.push('webp');
    }
    
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      this.supportedFormats.push('avif');
    }
  }
  
  public getOptimizedImageUrl(
    originalUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
    } = {}
  ): string {
    // Parse the original URL
    const url = new URL(originalUrl);
    
    // Add optimization parameters
    if (options.width) {
      url.searchParams.set('w', options.width.toString());
    }
    
    if (options.height) {
      url.searchParams.set('h', options.height.toString());
    }
    
    if (options.quality) {
      url.searchParams.set('q', options.quality.toString());
    }
    
    // Set format based on browser support
    if (this.supportedFormats.includes('avif')) {
      url.searchParams.set('fm', 'avif');
    } else if (this.supportedFormats.includes('webp')) {
      url.searchParams.set('fm', 'webp');
    }
    
    return url.toString();
  }
}

// Usage
const imageOptimizer = new ImageOptimizer();

function UserAvatar({ user, size = 'medium' }) {
  // Define size in pixels
  const pixelSize = size === 'small' ? 32 : size === 'medium' ? 48 : 96;
  
  // Get optimized URL
  const optimizedUrl = imageOptimizer.getOptimizedImageUrl(user.avatar, {
    width: pixelSize,
    height: pixelSize,
    quality: 80,
  });
  
  return (
    <img
      src={optimizedUrl}
      alt={user.name}
      width={pixelSize}
      height={pixelSize}
      loading="lazy"
    />
  );
}
```

### Font Loading

Fonts are loaded efficiently to prevent layout shifts:

```typescript
// Example of optimized font loading
function optimizeFontLoading(): void {
  // Add font-display: swap to all font faces
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
  
  // Preload critical fonts
  const criticalFonts = [
    '/fonts/inter-regular.woff2',
    '/fonts/inter-medium.woff2',
  ];
  
  for (const font of criticalFonts) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
  
  // Load non-critical fonts asynchronously
  if ('fonts' in document) {
    // Load fonts when the page becomes idle
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        loadNonCriticalFonts();
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(loadNonCriticalFonts, 1000);
    }
  }
}

function loadNonCriticalFonts(): void {
  const nonCriticalFonts = [
    '/fonts/inter-bold.woff2',
    '/fonts/inter-light.woff2',
    '/fonts/emoji.woff2',
  ];
  
  for (const font of nonCriticalFonts) {
    const fontFace = new FontFace('Inter', `url(${font})`, {
      weight: font.includes('bold') ? '700' : font.includes('light') ? '300' : '400',
      style: 'normal',
    });
    
    fontFace.load().then((loadedFace) => {
      (document.fonts as any).add(loadedFace);
    });
  }
}

// Initialize font optimization
optimizeFontLoading();
```

### Code Splitting

The application uses code splitting to reduce initial bundle size:

```typescript
// Example of code splitting configuration
// webpack.config.js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          priority: 40,
          chunks: 'all',
        },
        lib: {
          test(module) {
            return (
              module.size() > 80000 &&
              /node_modules[/\\]/.test(module.identifier())
            );
          },
          name(module) {
            const match = module.identifier().match(/node_modules[/\\](.+?)([/\\]|$)/);
            const packageName = match ? match[1] : null;
            return `lib.${packageName.replace('@', '')}`;
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 20,
        },
        shared: {
          name(module, chunks) {
            return `shared.${chunks.map(c => c.name).join('~')}`;
          },
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // ...
};

// Usage in application
// App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Conversations = lazy(() => import('./pages/Conversations'));
const Conversation = lazy(() => import('./pages/Conversation'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/conversations" component={Conversations} />
          <Route path="/conversations/:id" component={Conversation} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
```

## State Management Optimizations

The application optimizes state management to improve performance.

### Normalized State

State is normalized to avoid duplication and improve update performance:

```typescript
// Example of normalized state
interface NormalizedState {
  entities: {
    users: Record<string, User>;
    conversations: Record<string, Conversation>;
    messages:
