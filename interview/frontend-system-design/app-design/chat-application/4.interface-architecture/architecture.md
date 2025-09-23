# Chat Application Frontend Architecture

This document outlines the frontend architecture of the chat application, detailing the overall structure, design patterns, and architectural decisions.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Design Patterns](#design-patterns)
4. [Code Organization](#code-organization)
5. [Data Flow](#data-flow)
6. [Error Handling](#error-handling)
7. [Performance Considerations](#performance-considerations)
8. [Security Considerations](#security-considerations)
9. [Testing Strategy](#testing-strategy)
10. [Build and Deployment](#build-and-deployment)
11. [Architectural Decisions](#architectural-decisions)

## Architecture Overview

The chat application follows a modern frontend architecture that emphasizes modularity, maintainability, and performance. The architecture is designed to support real-time communication, efficient state management, and a responsive user interface.

### Key Architectural Principles

1. **Component-Based Architecture**: The UI is built using reusable, composable components
2. **Unidirectional Data Flow**: Data flows in one direction for predictable state management
3. **Separation of Concerns**: Clear separation between UI, business logic, and data access
4. **Single Source of Truth**: State is managed centrally to avoid inconsistencies
5. **Progressive Enhancement**: Core functionality works across devices with enhanced experiences where supported
6. **Responsive Design**: UI adapts to different screen sizes and devices
7. **Accessibility First**: Accessibility is considered from the beginning, not as an afterthought

### Technology Stack

The application is built using the following core technologies:

1. **React**: UI library for building component-based interfaces
2. **TypeScript**: Static typing for improved developer experience and code quality
3. **Redux Toolkit**: State management for global application state
4. **React Query**: Data fetching and cache management
5. **Socket.IO Client**: Real-time communication with WebSockets
6. **React Router**: Client-side routing
7. **Styled Components**: Component-level styling with CSS-in-JS
8. **Framer Motion**: Animation library for smooth transitions
9. **Jest & React Testing Library**: Testing framework and utilities
10. **Webpack**: Module bundler for production builds

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │    Pages    │  │   Layouts   │  │  Components │  │  Hooks  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      State Management Layer                     │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │    Redux    │  │ React Query │  │ Local State │  │ Context │  │
│  │    Store    │  │    Cache    │  │    Hooks    │  │   API   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service Layer                            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │  API Client │  │  WebSocket  │  │ Local Storage│ │ Workers │  │
│  │   Services  │  │   Client    │  │   Service   │  │         │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Cross-Cutting Concerns                     │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │ Authentication│ │   Logging   │  │   Error    │  │  i18n   │  │
│  │              │  │             │  │  Handling  │  │         │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

The project follows a feature-based structure, organizing code by feature rather than by type. This approach makes it easier to locate related code and promotes better encapsulation.

### Directory Structure

```
src/
├── assets/                # Static assets like images and icons
├── components/            # Shared UI components
│   ├── common/            # Basic UI elements (Button, Input, etc.)
│   ├── layout/            # Layout components (Header, Sidebar, etc.)
│   └── shared/            # Shared feature components
├── config/                # Application configuration
├── features/              # Feature-specific code
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Auth-specific components
│   │   ├── hooks/         # Auth-specific hooks
│   │   ├── services/      # Auth-specific services
│   │   ├── store/         # Auth-specific state management
│   │   └── types/         # Auth-specific type definitions
│   ├── conversations/     # Conversations feature
│   ├── messages/          # Messages feature
│   ├── contacts/          # Contacts feature
│   └── settings/          # Settings feature
├── hooks/                 # Shared custom hooks
├── layouts/               # Page layout components
├── pages/                 # Page components
├── routes/                # Routing configuration
├── services/              # Shared services
│   ├── api/               # API client and endpoints
│   ├── socket/            # WebSocket client
│   ├── storage/           # Local storage service
│   └── workers/           # Web workers
├── store/                 # Global state management
│   ├── slices/            # Redux slices
│   ├── middleware/        # Redux middleware
│   └── index.ts           # Store configuration
├── styles/                # Global styles and themes
├── types/                 # Shared type definitions
├── utils/                 # Utility functions
├── App.tsx                # Root component
└── index.tsx              # Entry point
```

### Feature Structure

Each feature follows a consistent internal structure:

```
features/conversations/
├── components/            # Feature-specific components
│   ├── ConversationList.tsx
│   ├── ConversationItem.tsx
│   ├── ConversationView.tsx
│   └── ...
├── hooks/                 # Feature-specific hooks
│   ├── useConversations.ts
│   ├── useConversation.ts
│   └── ...
├── services/              # Feature-specific services
│   ├── conversationsApi.ts
│   └── ...
├── store/                 # Feature-specific state management
│   ├── conversationsSlice.ts
│   └── ...
├── types/                 # Feature-specific type definitions
│   ├── conversation.ts
│   └── ...
└── index.ts               # Feature public API
```

## Design Patterns

The application implements several design patterns to solve common problems and improve code quality:

### Component Patterns

1. **Compound Components**: For related component groups

```tsx
// Example of compound components
const Tabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ id, children }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  
  return (
    <button 
      className={activeTab === id ? 'active' : ''} 
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = ({ id, children }) => {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== id) {
    return null;
  }
  
  return <div>{children}</div>;
};

// Usage
<Tabs defaultTab="messages">
  <div className="tabs-header">
    <Tabs.Tab id="messages">Messages</Tabs.Tab>
    <Tabs.Tab id="files">Files</Tabs.Tab>
    <Tabs.Tab id="links">Links</Tabs.Tab>
  </div>
  <div className="tabs-content">
    <Tabs.Panel id="messages">Messages content</Tabs.Panel>
    <Tabs.Panel id="files">Files content</Tabs.Panel>
    <Tabs.Panel id="links">Links content</Tabs.Panel>
  </div>
</Tabs>
```

2. **Render Props**: For sharing behavior between components

```tsx
// Example of render props
const MessageList = ({ conversationId, renderMessage }) => {
  const { messages } = useMessages(conversationId);
  
  return (
    <div className="message-list">
      {messages.map(message => renderMessage(message))}
    </div>
  );
};

// Usage
<MessageList 
  conversationId="123"
  renderMessage={(message) => (
    <MessageItem 
      key={message.id} 
      message={message}
      showAvatar={true}
    />
  )}
/>
```

3. **Higher-Order Components**: For cross-cutting concerns

```tsx
// Example of a higher-order component
const withErrorBoundary = (Component) => {
  return class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, info) {
      // Log the error
      console.error(error, info);
    }
    
    render() {
      if (this.state.hasError) {
        return <ErrorDisplay error={this.state.error} />;
      }
      
      return <Component {...this.props} />;
    }
  };
};

// Usage
const SafeConversationView = withErrorBoundary(ConversationView);
```

4. **Custom Hooks**: For reusable logic

```tsx
// Example of a custom hook
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// Usage
const NetworkStatus = () => {
  const isOnline = useOnlineStatus();
  
  return (
    <div className="network-status">
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
};
```

### Architectural Patterns

1. **Container/Presentational Pattern**: Separating logic from presentation

```tsx
// Container component
const ConversationListContainer = () => {
  const { conversations, isLoading, error } = useConversations();
  const { activeConversationId } = useSelector(selectActiveConversationId);
  const dispatch = useDispatch();
  
  const handleConversationClick = (conversationId) => {
    dispatch(setActiveConversation(conversationId));
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  
  return (
    <ConversationList 
      conversations={conversations}
      activeConversationId={activeConversationId}
      onConversationClick={handleConversationClick}
    />
  );
};

// Presentational component
const ConversationList = ({ 
  conversations, 
  activeConversationId, 
  onConversationClick 
}) => {
  return (
    <div className="conversation-list">
      {conversations.map(conversation => (
        <ConversationItem 
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onClick={() => onConversationClick(conversation.id)}
        />
      ))}
    </div>
  );
};
```

2. **Module Pattern**: Encapsulating related functionality

```tsx
// Example of module pattern
const authService = (() => {
  // Private variables
  let currentUser = null;
  let tokens = null;
  
  // Private functions
  const saveTokens = (newTokens) => {
    tokens = newTokens;
    localStorage.setItem('tokens', JSON.stringify(newTokens));
  };
  
  // Public API
  return {
    login: async (email, password) => {
      const response = await api.post('/auth/login', { email, password });
      saveTokens(response.data.tokens);
      currentUser = response.data.user;
      return currentUser;
    },
    
    logout: async () => {
      await api.post('/auth/logout');
      localStorage.removeItem('tokens');
      currentUser = null;
      tokens = null;
    },
    
    getCurrentUser: () => currentUser,
    
    isAuthenticated: () => !!currentUser
  };
})();

// Usage
const LoginForm = () => {
  const handleSubmit = async (values) => {
    try {
      await authService.login(values.email, values.password);
      // Redirect to app
    } catch (error) {
      // Handle error
    }
  };
  
  // Form JSX
};
```

3. **Observer Pattern**: For event-based communication

```tsx
// Example of observer pattern
class EventBus {
  constructor() {
    this.subscribers = {};
  }
  
  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    
    this.subscribers[event].push(callback);
    
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(
        cb => cb !== callback
      );
    };
  }
  
  publish(event, data) {
    if (!this.subscribers[event]) {
      return;
    }
    
    this.subscribers[event].forEach(callback => {
      callback(data);
    });
  }
}

const eventBus = new EventBus();

// Usage in components
const NotificationListener = () => {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('notification', (data) => {
      toast(data.message);
    });
    
    return unsubscribe;
  }, []);
  
  return null;
};

// Publishing events
const sendMessage = async (message) => {
  await api.post('/messages', message);
  eventBus.publish('notification', { message: 'Message sent!' });
};
```

4. **Command Pattern**: For encapsulating operations

```tsx
// Example of command pattern
class Command {
  execute() {}
  undo() {}
}

class SendMessageCommand extends Command {
  constructor(messageService, message) {
    super();
    this.messageService = messageService;
    this.message = message;
    this.sentMessage = null;
  }
  
  async execute() {
    this.sentMessage = await this.messageService.sendMessage(this.message);
    return this.sentMessage;
  }
  
  async undo() {
    if (this.sentMessage) {
      await this.messageService.deleteMessage(this.sentMessage.id);
      this.sentMessage = null;
    }
  }
}

// Usage
const messageService = new MessageService();
const command = new SendMessageCommand(messageService, {
  conversationId: '123',
  content: 'Hello, world!'
});

// Execute the command
await command.execute();

// Undo the command if needed
await command.undo();
```

## Code Organization

The application's code is organized according to several principles:

### Modular Architecture

The codebase is divided into modules, each with a specific responsibility:

1. **Core Module**: Essential functionality and utilities
2. **Feature Modules**: Feature-specific code
3. **Shared Module**: Shared components and utilities
4. **Layout Module**: Layout components and templates

### Code Splitting

The application uses code splitting to reduce the initial bundle size:

1. **Route-based Splitting**: Each route is loaded dynamically
2. **Component-based Splitting**: Large components are loaded on demand
3. **Feature-based Splitting**: Features are loaded when needed

```tsx
// Example of route-based code splitting
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const AppLayout = lazy(() => import('../layouts/AppLayout'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<AppLayout />}>
          {/* Nested routes */}
        </Route>
      </Routes>
    </Suspense>
  );
};
```

### Barrel Files

The application uses barrel files (index.ts) to simplify imports:

```tsx
// features/conversations/components/index.ts
export { default as ConversationList } from './ConversationList';
export { default as ConversationItem } from './ConversationItem';
export { default as ConversationView } from './ConversationView';

// Usage in other files
import { ConversationList, ConversationItem } from '../features/conversations/components';
```

### Absolute Imports

The application uses absolute imports for better readability and maintainability:

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@components/*": ["components/*"],
      "@features/*": ["features/*"],
      "@hooks/*": ["hooks/*"],
      "@services/*": ["services/*"],
      "@store/*": ["store/*"],
      "@utils/*": ["utils/*"]
    }
  }
}

// Usage
import { Button } from '@components/common';
import { useConversations } from '@features/conversations/hooks';
import { formatDate } from '@utils/date';
```

## Data Flow

The application follows a unidirectional data flow pattern, which makes the state changes predictable and easier to debug:

### Data Flow Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │   Action    │         │    Store    │
│ Interaction │────────▶│  Creators   │────────▶│  (Reducers) │
└─────────────┘         └─────────────┘         └─────────────┘
                                                      │
                                                      │
                                                      ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Component  │◀────────│   Selectors  │◀────────│    State    │
│   Re-render │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

### State Management

The application uses a combination of state management approaches:

1. **Global State**: Managed with Redux Toolkit
2. **Server State**: Managed with React Query
3. **Local State**: Managed with React's useState and useReducer
4. **URL State**: Managed with React Router

#### Redux Store

The Redux store is organized into slices, each responsible for a specific domain:

```tsx
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/store/authSlice';
import conversationsReducer from '@features/conversations/store/conversationsSlice';
import contactsReducer from '@features/contacts/store/contactsSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationsReducer,
    contacts: contactsReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(socketMiddleware)
});

export default store;
```

#### React Query

React Query is used for server state management:

```tsx
// services/api/queryClient.ts
import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 3
    }
  }
});

// hooks/useMessages.ts
import { useQuery } from 'react-query';
import { fetchMessages } from '@services/api/messages';

export const useMessages = (conversationId) => {
  return useQuery(
    ['messages', conversationId],
    () => fetchMessages(conversationId),
    {
      enabled: !!conversationId
    }
  );
};
```

### API Communication

The application communicates with the backend API using a centralized API client:

```tsx
// services/api/client.ts
import axios from 'axios';
import { getTokens } from '@services/auth';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const tokens = getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const tokens = getTokens();
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          { refreshToken: tokens.refresh }
        );
        
        // Save the new tokens
        saveTokens(response.data);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### WebSocket Communication

The application uses Socket.IO for real-time communication:

```tsx
// services/socket/index.ts
import { io, Socket } from 'socket.io-client';
import { getTokens } from '@services/auth';
import { store } from '@store';
import { addMessage, updateMessage } from '@features/messages/store/messagesSlice';
import { updateConversation } from '@features/conversations/store/conversationsSlice';

let socket: Socket;

export const initializeSocket = () => {
  const tokens = getTokens();
  
  if (!tokens?.access) {
    return null;
  }
  
  socket = io(process.env.REACT_APP_WEBSOCKET_URL, {
    auth: {
      token: tokens.access
    }
  });
  
  socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  
  socket.on('message:new', (message) => {
    store.dispatch(addMessage(message));
  });
  
  socket.on('message:update', (message) => {
    store.dispatch(updateMessage(message));
  });
  
  socket.on('conversation:update', (conversation) => {
    store.dispatch(updateConversation(conversation));
  });
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
```

## Error Handling

The application implements a comprehensive error handling strategy:

### Global Error Boundary

A global error boundary catches unhandled errors in the component tree:

```tsx
// components/ErrorBoundary.tsx
import React from 'react';
import ErrorDisplay from './ErrorDisplay';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    
    return this.props.children;
  }
}

// App.tsx
const App = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};
```

### API Error Handling

API errors are handled consistently across the application:

```tsx
// services/api/errorHandler.ts
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    const message = data.message || 'An error occurred';
    
    return new ApiError(message, status, data);
  } else if (error.request) {
    // The request was made but no response was received
    return new ApiError('No response from server', 0, null);
  } else {
    // Something happened in setting up the request that triggered an Error
    return new ApiError(error.message, 0, null);
  }
};

// Usage in API calls
const fetchConversations = async () => {
  try {
    const response = await apiClient.get('/conversations');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
```

### Form Validation

Form validation is handled using Formik and Yup:

```tsx
// components/LoginForm.tsx
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

const LoginForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            {errors.email && touched.email && (
              <div className="error">{errors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" />
            {errors.password && touched.password && (
              <div className="error">{errors.password}</div>
            )}
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </Form>
      )}
    </Formik>
  );
};
```

### Error Notifications

Errors are displayed to users using a toast notification system:

```tsx
// components/ErrorNotification.tsx
import { toast } from 'react-toastify';

export const showError = (error) => {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
    console.error(error);
  }
};

// Usage
try {
  await sendMessage(message);
} catch (error) {
  showError(error);
}
```

## Performance Considerations

The application implements several performance optimizations:

### Code Splitting

Code splitting reduces the initial bundle size:

```tsx
// Route-based code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Component-based code splitting
const MediaViewer = lazy(() => import('./MediaViewer'));
```

### Memoization

Memoization prevents unnecessary re-renders:

```tsx
// Memoizing components
const MessageItem = React.memo(({ message, isConsecutive }) => {
  // Component implementation
});

// Memoizing expensive calculations
const useSortedMessages = (messages) => {
  return useMemo(() => {
    return [...messages].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);
};

// Memoizing callbacks
const handleMessageClick = useCallback((messageId) => {
  setSelectedMessageId(messageId);
}, []);
```

### Virtualized Lists

Virtualized lists improve performance for long lists:

```tsx
// components/VirtualizedMessageList.tsx
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const VirtualizedMessageList = ({ messages }) => {
  const renderRow = ({ index, style }) => {
    const message = messages[index];
    
    return (
      <div style={style}>
        <MessageItem 
          message={message}
          isConsecut
