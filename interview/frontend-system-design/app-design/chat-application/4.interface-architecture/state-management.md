# Chat Application State Management

This document outlines the state management architecture for the chat application, detailing the approach, tools, and patterns used to manage application state.

## Table of Contents

1. [State Management Overview](#state-management-overview)
2. [State Categories](#state-categories)
3. [Global State Management](#global-state-management)
4. [Local State Management](#local-state-management)
5. [Server State Management](#server-state-management)
6. [Form State Management](#form-state-management)
7. [URL State Management](#url-state-management)
8. [State Persistence](#state-persistence)
9. [Real-time State Updates](#real-time-state-updates)
10. [State Management Challenges](#state-management-challenges)
11. [Performance Optimizations](#performance-optimizations)

## State Management Overview

The chat application uses a hybrid state management approach, combining different tools and patterns to handle various types of state efficiently. This approach allows us to use the most appropriate solution for each type of state while maintaining a consistent and predictable state flow throughout the application.

### State Management Principles

1. **Single Source of Truth**: Each piece of state has a single, definitive source
2. **Minimal State**: Only essential data is stored in state
3. **Derived State**: Non-essential data is derived from essential state
4. **Immutable Updates**: State is updated immutably to maintain predictability
5. **Unidirectional Data Flow**: Data flows in one direction for easier debugging
6. **Separation of Concerns**: Different types of state are managed separately

### State Management Tools

The application uses the following tools for state management:

1. **Redux Toolkit**: For global application state
2. **React's Built-in State Hooks**: For component-local state
3. **React Query**: For server state and data fetching
4. **React Hook Form**: For form state management
5. **React Router**: For URL-based state

## State Categories

The application state is divided into several categories, each managed with the most appropriate tool:

### 1. UI State

UI state represents the visual state of the application, such as which modals are open, which tabs are active, or whether a dropdown is expanded.

**Examples:**
- Whether the sidebar is open on mobile
- Which tab is active in a tabbed interface
- Whether a tooltip is visible
- Animation states

**Management Approach:**
- Primarily managed with React's `useState` and `useReducer` hooks at the component level
- For UI state that affects multiple components, Redux is used

### 2. Authentication State

Authentication state represents the user's authentication status and related data.

**Examples:**
- Whether the user is authenticated
- Authentication tokens
- Token expiration information
- Multi-factor authentication status

**Management Approach:**
- Managed with Redux for global access
- Persisted in secure storage (HTTP-only cookies for tokens, localStorage for non-sensitive data)
- Refreshed automatically when needed

### 3. User State

User state represents information about the current user.

**Examples:**
- User profile information
- User preferences
- User settings
- User status (online, away, etc.)

**Management Approach:**
- Managed with Redux for global access
- Cached with React Query for efficient updates
- Persisted in localStorage for non-sensitive data

### 4. Conversation State

Conversation state represents the list of conversations and their metadata.

**Examples:**
- List of conversations
- Conversation metadata (title, participants, etc.)
- Unread message counts
- Active conversation

**Management Approach:**
- Managed with Redux for global access
- Cached with React Query for efficient updates
- Real-time updates via WebSockets

### 5. Message State

Message state represents the messages within conversations.

**Examples:**
- Messages for each conversation
- Message status (sent, delivered, read)
- Message reactions
- Typing indicators

**Management Approach:**
- Managed with React Query for efficient caching and pagination
- Real-time updates via WebSockets
- Optimistic updates for better user experience

### 6. Contact State

Contact state represents the user's contacts and their information.

**Examples:**
- List of contacts
- Contact metadata (name, status, etc.)
- Contact relationships
- Blocked contacts

**Management Approach:**
- Managed with Redux for global access
- Cached with React Query for efficient updates

### 7. Network State

Network state represents the application's connection status and pending operations.

**Examples:**
- Online/offline status
- Connection quality
- Pending operations
- Retry queues

**Management Approach:**
- Managed with Redux for global access
- Custom hooks for network status monitoring
- Offline support with service workers

## Global State Management

Global state is managed using Redux Toolkit, which provides a more ergonomic API for Redux while maintaining its predictable state management benefits.

### Redux Store Structure

```
{
  auth: {
    isAuthenticated: boolean,
    user: User | null,
    tokens: {
      access: string | null,
      refresh: string | null,
      expiresAt: number | null
    },
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
  },
  conversations: {
    items: Record<string, Conversation>,
    ids: string[],
    activeId: string | null,
    filter: 'all' | 'unread' | 'archived',
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
  },
  contacts: {
    items: Record<string, Contact>,
    ids: string[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
  },
  ui: {
    theme: 'light' | 'dark' | 'system',
    isSidebarOpen: boolean,
    isRightSidebarOpen: boolean,
    modals: {
      createConversation: boolean,
      userSettings: boolean,
      mediaViewer: {
        isOpen: boolean,
        mediaUrl: string | null
      }
    },
    notifications: Notification[]
  },
  network: {
    isOnline: boolean,
    connectionQuality: 'excellent' | 'good' | 'poor' | 'none',
    pendingOperations: PendingOperation[]
  }
}
```

### Redux Slices

The Redux store is divided into slices, each responsible for a specific domain of the application:

#### Auth Slice

```typescript
// auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, refreshToken } from '../api/auth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginCredentials) => {
    const response = await login(email, password);
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await logout();
  }
);

export const refreshTokens = createAsyncThunk(
  'auth/refreshToken',
  async () => {
    const response = await refreshToken();
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    tokens: {
      access: null,
      refresh: null,
      expiresAt: null
    },
    status: 'idle',
    error: null
  },
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      // Other async action handlers
  }
});

export default authSlice.reducer;
```

#### Conversations Slice

```typescript
// conversations/conversationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchConversations, createConversation } from '../api/conversations';

export const fetchUserConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async () => {
    const response = await fetchConversations();
    return response.data;
  }
);

export const createNewConversation = createAsyncThunk(
  'conversations/createConversation',
  async (conversationData: NewConversationData) => {
    const response = await createConversation(conversationData);
    return response.data;
  }
);

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
    items: {},
    ids: [],
    activeId: null,
    filter: 'all',
    status: 'idle',
    error: null
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeId = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateConversation: (state, action) => {
      const { id, changes } = action.payload;
      if (state.items[id]) {
        state.items[id] = { ...state.items[id], ...changes };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserConversations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Normalize conversations
        const conversations = action.payload;
        state.items = conversations.reduce((acc, conversation) => {
          acc[conversation.id] = conversation;
          return acc;
        }, {});
        
        state.ids = conversations.map(conversation => conversation.id);
      })
      .addCase(fetchUserConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      // Other async action handlers
  }
});

export const { setActiveConversation, setFilter, updateConversation } = conversationsSlice.actions;
export default conversationsSlice.reducer;
```

#### UI Slice

```typescript
// ui/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'system',
    isSidebarOpen: false,
    isRightSidebarOpen: false,
    modals: {
      createConversation: false,
      userSettings: false,
      mediaViewer: {
        isOpen: false,
        mediaUrl: null
      }
    },
    notifications: []
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleRightSidebar: (state) => {
      state.isRightSidebarOpen = !state.isRightSidebarOpen;
    },
    openModal: (state, action) => {
      const { modalName, props } = action.payload;
      if (modalName === 'mediaViewer') {
        state.modals.mediaViewer = {
          isOpen: true,
          mediaUrl: props.mediaUrl
        };
      } else {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (modalName === 'mediaViewer') {
        state.modals.mediaViewer = {
          isOpen: false,
          mediaUrl: null
        };
      } else {
        state.modals[modalName] = false;
      }
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    }
  }
});

export const {
  setTheme,
  toggleSidebar,
  toggleRightSidebar,
  openModal,
  closeModal,
  addNotification,
  removeNotification
} = uiSlice.actions;
export default uiSlice.reducer;
```

### Redux Middleware

The application uses several Redux middleware for additional functionality:

1. **Redux Thunk**: For handling asynchronous actions
2. **Redux Logger**: For logging actions and state changes in development
3. **Redux Persist**: For persisting state to localStorage
4. **Custom WebSocket Middleware**: For handling real-time updates

```typescript
// store/middleware/websocketMiddleware.ts
import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';
import { updateConversation } from '../conversations/conversationsSlice';
import { addMessage, updateMessage } from '../messages/messagesSlice';

let socket: Socket;

const websocketMiddleware: Middleware = store => next => action => {
  if (action.type === 'auth/login/fulfilled') {
    // Connect to WebSocket when user logs in
    socket = io(process.env.REACT_APP_WEBSOCKET_URL, {
      auth: {
        token: action.payload.tokens.access
      }
    });
    
    // Set up event listeners
    socket.on('conversation:update', (conversation) => {
      store.dispatch(updateConversation({
        id: conversation.id,
        changes: conversation
      }));
    });
    
    socket.on('message:new', (message) => {
      store.dispatch(addMessage(message));
    });
    
    socket.on('message:update', (message) => {
      store.dispatch(updateMessage({
        id: message.id,
        changes: message
      }));
    });
  }
  
  if (action.type === 'auth/logout/fulfilled') {
    // Disconnect from WebSocket when user logs out
    if (socket) {
      socket.disconnect();
    }
  }
  
  return next(action);
};

export default websocketMiddleware;
```

### Redux Store Configuration

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import logger from 'redux-logger';

import authReducer from './auth/authSlice';
import conversationsReducer from './conversations/conversationsSlice';
import contactsReducer from './contacts/contactsSlice';
import uiReducer from './ui/uiSlice';
import networkReducer from './network/networkSlice';
import websocketMiddleware from './middleware/websocketMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'] // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  conversations: conversationsReducer,
  contacts: contactsReducer,
  ui: uiReducer,
  network: networkReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
    .concat(logger, websocketMiddleware)
});

export const persistor = persistStore(store);
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Redux Hooks

```typescript
// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Local State Management

Local state is managed using React's built-in state hooks: `useState` and `useReducer`.

### useState for Simple State

```typescript
// components/MessageComposer.tsx
import React, { useState } from 'react';

const MessageComposer: React.FC<MessageComposerProps> = ({ conversationId }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const handleSubmit = async () => {
    // Submit message logic
    setText('');
    setAttachments([]);
  };
  
  return (
    <div className="message-composer">
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Type a message..." 
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};
```

### useReducer for Complex State

```typescript
// components/ConversationSettings.tsx
import React, { useReducer } from 'react';

type State = {
  isEditing: boolean;
  name: string;
  description: string;
  isPublic: boolean;
  errors: Record<string, string>;
};

type Action =
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_PUBLIC'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; error: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'RESET'; payload: Conversation };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_PUBLIC':
      return { ...state, isPublic: action.payload };
    case 'SET_ERROR':
      return { 
        ...state, 
        errors: { 
          ...state.errors, 
          [action.payload.field]: action.payload.error 
        } 
      };
    case 'CLEAR_ERROR':
      const errors = { ...state.errors };
      delete errors[action.payload];
      return { ...state, errors };
    case 'RESET':
      return {
        isEditing: false,
        name: action.payload.name,
        description: action.payload.description || '',
        isPublic: action.payload.isPublic,
        errors: {}
      };
    default:
      return state;
  }
};

const ConversationSettings: React.FC<ConversationSettingsProps> = ({ conversation }) => {
  const [state, dispatch] = useReducer(reducer, {
    isEditing: false,
    name: conversation.name,
    description: conversation.description || '',
    isPublic: conversation.isPublic,
    errors: {}
  });
  
  // Component logic
  
  return (
    <div className="conversation-settings">
      {/* Component UI */}
    </div>
  );
};
```

### Custom Hooks for Reusable State Logic

```typescript
// hooks/useToggle.ts
import { useState, useCallback } from 'react';

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  
  const toggle = useCallback(() => {
    setState(state => !state);
  }, []);
  
  const setTrue = useCallback(() => {
    setState(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setState(false);
  }, []);
  
  return [state, toggle, setTrue, setFalse] as const;
};

// Usage
const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [isActionsVisible, toggleActions, showActions, hideActions] = useToggle(false);
  
  return (
    <div 
      className="message-item" 
      onMouseEnter={showActions} 
      onMouseLeave={hideActions}
    >
      {/* Message content */}
      {isActionsVisible && <MessageActions message={message} />}
    </div>
  );
};
```

## Server State Management

Server state is managed using React Query, which provides caching, background updates, and optimistic updates for data fetched from the server.

### Query Configuration

```typescript
// api/reactQuery.ts
import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});
```

### Queries for Fetching Data

```typescript
// hooks/useMessages.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchMessages, sendMessage } from '../api/messages';

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  
  const {
    data: messages,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery(
    ['messages', conversationId],
    () => fetchMessages(conversationId),
    {
      enabled: !!conversationId,
      keepPreviousData: true
    }
  );
  
  const sendMessageMutation = useMutation(
    (newMessage: NewMessage) => sendMessage(conversationId, newMessage),
    {
      onMutate: async (newMessage) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(['messages', conversationId]);
        
        // Snapshot the previous value
        const previousMessages = queryClient.getQueryData(['messages', conversationId]);
        
        // Optimistically update to the new value
        queryClient.setQueryData(['messages', conversationId], (old: Message[]) => [
          ...old,
          {
            id: `temp-${Date.now()}`,
            conversationId,
            senderId: newMessage.senderId,
            content: newMessage.content,
            contentType: newMessage.contentType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'sending',
            attachments: [],
            reactions: [],
            readBy: [],
            deliveredTo: [],
            mentions: [],
            isEdited: false,
            isDeleted: false,
            metadata: {}
          }
        ]);
        
        // Return a context object with the snapshotted value
        return { previousMessages };
      },
      onError: (err, newMessage, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(['messages', conversationId], context.previousMessages);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(['messages', conversationId]);
      }
    }
  );
  
  return {
    messages,
    isLoading,
    isError,
    error,
    refetch,
    sendMessage: sendMessageMutation.mutate
  };
};
```

### Infinite Queries for Pagination

```typescript
// hooks/useInfiniteMessages.ts
import { useInfiniteQuery } from 'react-query';
import { fetchMessagesPaginated } from '../api/messages';

export const useInfiniteMessages = (conversationId: string) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    ['messages', conversationId, 'infinite'],
    ({ pageParam = 1 }) => fetchMessagesPaginated(conversationId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage ?? undefined;
      },
      enabled: !!conversationId
    }
  );
  
  // Flatten the pages into a single array of messages
  const messages = data?.pages.flatMap(page => page.messages) ?? [];
  
  return {
    messages,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
```

## Form State Management

Form state is managed using React Hook Form, which provides efficient form validation and state management.

### Basic Form

```typescript
// components/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
}).required();

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Complex Form with Dynamic Fields

```typescript
// components/ConversationSettingsForm.tsx
import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  isPublic: yup.boolean(),
  participants: yup.array().of(
    yup.object({
      userId: yup.string().required('User ID is required'),
      role: yup.string().oneOf(['owner', 'admin', 'member', 'guest']).required('Role is required')
    })
  )
}).required();

type ConversationFormData = {
  name: string;
  description: string;
  isPublic: boolean;
  participants: {
    userId: string;
    role: 'owner' | 'admin' | 'member' | 'guest';
  }[];
};

const ConversationSettingsForm: React.FC<ConversationSettingsFormProps> = ({ 
  conversation, 
  onSubmit 
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ConversationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: conversation.name,
      description: conversation.description || '',
      isPublic: conversation.isPublic,
      participants: conversation.participants
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants'
  });
  
  useEffect(() => {
    reset({
      name: conversation.name,
      description: conversation.description || '',
      isPublic: conversation.isPublic,
      participants: conversation.participants
    });
  }, [conversation, reset]);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register('description')} />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      
      <div>
        <label>
          <input type="checkbox" {...register('isPublic')} />
          Public conversation
        </label>
      </div>
      
      <div>
        <h3>Participants</h3>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              {...register(`participants.${index}.userId`)}
              defaultValue={field.userId}
              readOnly
            />
            
            <select {...register(`participants.${index}.role`)}>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>
            
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => append({ userId: '', role: 'member' })}
        >
          Add Participant
        </button>
      </div>
      
      <button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};
```

## URL State Management

URL state is managed using React Router, which provides routing and navigation capabilities.

### Route Configuration

```typescript
// App.tsx
import React from 'react';
import { Browser
