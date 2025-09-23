# Chat Application Component Hierarchy

This document outlines the component structure of the chat application, detailing the hierarchy, responsibilities, and relationships between components.

## Table of Contents

1. [Component Overview](#component-overview)
2. [Core Components](#core-components)
3. [Authentication Components](#authentication-components)
4. [Layout Components](#layout-components)
5. [Conversation Components](#conversation-components)
6. [Message Components](#message-components)
7. [Contact Components](#contact-components)
8. [Profile Components](#profile-components)
9. [Settings Components](#settings-components)
10. [Shared Components](#shared-components)
11. [Component Communication Patterns](#component-communication-patterns)
12. [Component Design Decisions](#component-design-decisions)

## Component Overview

The chat application follows a component-based architecture, with a focus on reusability, maintainability, and performance. The component hierarchy is organized as follows:

```
App
├── AuthenticatedApp
│   ├── AppLayout
│   │   ├── Sidebar
│   │   │   ├── UserProfile
│   │   │   ├── ConversationList
│   │   │   │   └── ConversationItem
│   │   │   └── Navigation
│   │   ├── MainContent
│   │   │   ├── ConversationView
│   │   │   │   ├── ConversationHeader
│   │   │   │   ├── MessageList
│   │   │   │   │   └── MessageItem
│   │   │   │   │       ├── MessageContent
│   │   │   │   │       ├── MessageAttachments
│   │   │   │   │       └── MessageActions
│   │   │   │   ├── MessageComposer
│   │   │   │   │   ├── ComposerInput
│   │   │   │   │   ├── AttachmentUploader
│   │   │   │   │   └── ComposerActions
│   │   │   │   └── ConversationInfo
│   │   │   └── EmptyState
│   │   └── RightSidebar (optional)
│   │       ├── UserDetails
│   │       ├── SharedMedia
│   │       └── SearchResults
│   └── Modals
│       ├── CreateConversation
│       ├── UserSettings
│       └── MediaViewer
└── UnauthenticatedApp
    ├── Login
    ├── Register
    └── ForgotPassword
```

## Core Components

### App

The root component that handles authentication state and renders either the `AuthenticatedApp` or `UnauthenticatedApp` based on the user's authentication status.

**Responsibilities:**
- Initializing the application
- Managing authentication state
- Handling global error boundaries
- Setting up global providers (theme, i18n, etc.)

**Props:** None

**State:**
- `isAuthenticated`: Boolean indicating if the user is authenticated
- `isLoading`: Boolean indicating if the authentication state is being loaded

**Example:**

```tsx
const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};
```

### AuthenticatedApp

The main application component rendered when the user is authenticated.

**Responsibilities:**
- Setting up the authenticated application layout
- Managing global state for authenticated users
- Handling routing for authenticated routes

**Props:** None

**State:**
- `currentUser`: Object containing information about the current user

**Example:**

```tsx
const AuthenticatedApp: React.FC = () => {
  return (
    <>
      <AppLayout />
      <Modals />
      <Notifications />
    </>
  );
};
```

### UnauthenticatedApp

The application component rendered when the user is not authenticated.

**Responsibilities:**
- Managing authentication flows (login, register, password reset)
- Handling routing for unauthenticated routes

**Props:** None

**State:**
- `authMode`: String indicating the current authentication mode ('login', 'register', 'forgot-password')

**Example:**

```tsx
const UnauthenticatedApp: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  return (
    <div className="unauthenticated-app">
      <AuthHeader />
      {authMode === 'login' && <Login onSwitchMode={setAuthMode} />}
      {authMode === 'register' && <Register onSwitchMode={setAuthMode} />}
      {authMode === 'forgot-password' && <ForgotPassword onSwitchMode={setAuthMode} />}
      <AuthFooter />
    </div>
  );
};
```

## Authentication Components

### Login

Component for user login.

**Responsibilities:**
- Handling login form submission
- Validating login credentials
- Displaying login errors
- Providing options to switch to register or forgot password

**Props:**
- `onSwitchMode`: Function to switch between authentication modes

**State:**
- `email`: String containing the user's email
- `password`: String containing the user's password
- `isSubmitting`: Boolean indicating if the form is being submitted
- `errors`: Object containing form validation errors

**Example:**

```tsx
const Login: React.FC<LoginProps> = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>Login</Button>
      <Button type="button" onClick={() => onSwitchMode('register')}>Register</Button>
      <Button type="button" onClick={() => onSwitchMode('forgot-password')}>Forgot Password</Button>
    </form>
  );
};
```

### Register

Component for user registration.

**Responsibilities:**
- Handling registration form submission
- Validating registration data
- Displaying registration errors
- Providing options to switch to login

**Props:**
- `onSwitchMode`: Function to switch between authentication modes

**State:**
- `formData`: Object containing registration form data
- `isSubmitting`: Boolean indicating if the form is being submitted
- `errors`: Object containing form validation errors

### ForgotPassword

Component for password reset.

**Responsibilities:**
- Handling password reset request submission
- Validating email
- Displaying password reset request errors
- Providing options to switch to login

**Props:**
- `onSwitchMode`: Function to switch between authentication modes

**State:**
- `email`: String containing the user's email
- `isSubmitting`: Boolean indicating if the form is being submitted
- `isSubmitted`: Boolean indicating if the form has been submitted successfully
- `errors`: Object containing form validation errors

## Layout Components

### AppLayout

The main layout component for the authenticated application.

**Responsibilities:**
- Structuring the overall application layout
- Managing responsive layout behavior
- Handling sidebar visibility

**Props:** None

**State:**
- `isSidebarOpen`: Boolean indicating if the sidebar is open (for mobile)
- `isRightSidebarOpen`: Boolean indicating if the right sidebar is open

**Example:**

```tsx
const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  
  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MainContent 
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />
      {isRightSidebarOpen && <RightSidebar onClose={() => setIsRightSidebarOpen(false)} />}
    </div>
  );
};
```

### Sidebar

The left sidebar component containing user profile, conversation list, and navigation.

**Responsibilities:**
- Displaying user profile information
- Showing conversation list
- Providing navigation options

**Props:**
- `isOpen`: Boolean indicating if the sidebar is open (for mobile)
- `onClose`: Function to close the sidebar

**State:** None (receives data from parent components)

### MainContent

The main content area of the application.

**Responsibilities:**
- Displaying the current route's content
- Handling route transitions

**Props:**
- `onOpenSidebar`: Function to open the sidebar (for mobile)
- `onToggleRightSidebar`: Function to toggle the right sidebar

**State:** None (receives data from parent components)

### RightSidebar

The optional right sidebar for displaying additional information.

**Responsibilities:**
- Displaying user details, shared media, or search results
- Adapting content based on the current context

**Props:**
- `onClose`: Function to close the right sidebar

**State:**
- `activeTab`: String indicating the active tab ('details', 'media', 'search')

## Conversation Components

### ConversationList

Component displaying a list of conversations.

**Responsibilities:**
- Displaying a scrollable list of conversations
- Handling conversation selection
- Supporting search and filtering

**Props:** None

**State:**
- `searchQuery`: String containing the current search query
- `filter`: String indicating the current filter ('all', 'unread', 'archived')

**Example:**

```tsx
const ConversationList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const { conversations, isLoading } = useConversations({ searchQuery, filter });
  
  return (
    <div className="conversation-list">
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <FilterTabs value={filter} onChange={setFilter} />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="conversations">
          {conversations.map(conversation => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### ConversationItem

Component representing a single conversation in the conversation list.

**Responsibilities:**
- Displaying conversation information (title, last message, time, etc.)
- Showing unread message count
- Handling selection

**Props:**
- `conversation`: Object containing conversation data
- `isActive`: Boolean indicating if the conversation is currently selected

**State:** None (receives data from parent components)

### ConversationView

Component displaying a conversation and its messages.

**Responsibilities:**
- Displaying conversation header
- Showing message list
- Providing message composer
- Handling message loading and pagination

**Props:**
- `conversationId`: String containing the ID of the conversation to display

**State:**
- `isInfoVisible`: Boolean indicating if the conversation info panel is visible

**Example:**

```tsx
const ConversationView: React.FC<ConversationViewProps> = ({ conversationId }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const { conversation, isLoading } = useConversation(conversationId);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!conversation) {
    return <NotFound />;
  }
  
  return (
    <div className="conversation-view">
      <ConversationHeader 
        conversation={conversation} 
        onToggleInfo={() => setIsInfoVisible(!isInfoVisible)} 
      />
      <MessageList conversationId={conversationId} />
      <MessageComposer conversationId={conversationId} />
      {isInfoVisible && <ConversationInfo conversation={conversation} />}
    </div>
  );
};
```

### ConversationHeader

Component displaying the header of a conversation.

**Responsibilities:**
- Showing conversation title and avatar
- Displaying participant status
- Providing conversation actions

**Props:**
- `conversation`: Object containing conversation data
- `onToggleInfo`: Function to toggle the conversation info panel

**State:** None (receives data from parent components)

### ConversationInfo

Component displaying detailed information about a conversation.

**Responsibilities:**
- Showing conversation details
- Displaying participant list
- Providing conversation settings

**Props:**
- `conversation`: Object containing conversation data

**State:**
- `activeTab`: String indicating the active tab ('details', 'participants', 'media', 'files')

## Message Components

### MessageList

Component displaying a list of messages in a conversation.

**Responsibilities:**
- Displaying a scrollable list of messages
- Handling message loading and pagination
- Managing scroll position and new message indicators

**Props:**
- `conversationId`: String containing the ID of the conversation

**State:**
- `hasMoreMessages`: Boolean indicating if there are more messages to load
- `isLoadingMore`: Boolean indicating if more messages are being loaded
- `unreadMessageCount`: Number indicating the count of unread messages

**Example:**

```tsx
const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { messages, isLoading, loadMore } = useMessages(conversationId);
  
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    const loadedMore = await loadMore();
    setHasMoreMessages(loadedMore);
    setIsLoadingMore(false);
  };
  
  return (
    <div className="message-list">
      {hasMoreMessages && (
        <Button onClick={handleLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : 'Load More'}
        </Button>
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <VirtualizedList
          items={messages}
          renderItem={(message) => <MessageItem key={message.id} message={message} />}
          onEndReached={handleLoadMore}
        />
      )}
    </div>
  );
};
```

### MessageItem

Component representing a single message in the message list.

**Responsibilities:**
- Displaying message content and metadata
- Showing message status (sent, delivered, read)
- Providing message actions (reply, react, etc.)

**Props:**
- `message`: Object containing message data
- `isConsecutive`: Boolean indicating if the message is part of a consecutive group from the same sender

**State:**
- `isActionsVisible`: Boolean indicating if message actions are visible

### MessageContent

Component displaying the content of a message.

**Responsibilities:**
- Rendering different types of message content (text, system, etc.)
- Handling message formatting (markdown, links, etc.)
- Displaying mentions and emojis

**Props:**
- `content`: String containing the message content
- `contentType`: String indicating the type of content ('text', 'system', etc.)

**State:** None (receives data from parent components)

### MessageAttachments

Component displaying attachments in a message.

**Responsibilities:**
- Rendering different types of attachments (images, files, etc.)
- Handling attachment previews
- Providing download options

**Props:**
- `attachments`: Array of attachment objects

**State:** None (receives data from parent components)

### MessageActions

Component providing actions for a message.

**Responsibilities:**
- Displaying action buttons (reply, react, forward, etc.)
- Handling action clicks

**Props:**
- `message`: Object containing message data
- `onReply`: Function to reply to the message
- `onReact`: Function to react to the message
- `onForward`: Function to forward the message
- `onEdit`: Function to edit the message (if owned by current user)
- `onDelete`: Function to delete the message (if owned by current user)

**State:** None (receives data from parent components)

### MessageComposer

Component for composing and sending messages.

**Responsibilities:**
- Providing input for message text
- Handling message submission
- Supporting attachments and formatting

**Props:**
- `conversationId`: String containing the ID of the conversation

**State:**
- `text`: String containing the message text
- `attachments`: Array of attachment objects
- `replyToMessage`: Object containing the message being replied to (if any)
- `isSubmitting`: Boolean indicating if the message is being sent

**Example:**

```tsx
const MessageComposer: React.FC<MessageComposerProps> = ({ conversationId }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!text.trim() && attachments.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      await sendMessage({
        conversationId,
        text,
        attachments,
        replyToMessageId: replyToMessage?.id
      });
      
      setText('');
      setAttachments([]);
      setReplyToMessage(null);
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="message-composer">
      {replyToMessage && (
        <ReplyPreview 
          message={replyToMessage} 
          onCancel={() => setReplyToMessage(null)} 
        />
      )}
      
      {attachments.length > 0 && (
        <AttachmentPreview 
          attachments={attachments} 
          onRemove={(id) => setAttachments(attachments.filter(a => a.id !== id))} 
        />
      )}
      
      <ComposerInput 
        value={text} 
        onChange={setText} 
        onSubmit={handleSubmit} 
        disabled={isSubmitting} 
      />
      
      <ComposerActions 
        onAttach={(newAttachments) => setAttachments([...attachments, ...newAttachments])} 
        onSubmit={handleSubmit} 
        disabled={isSubmitting} 
      />
    </div>
  );
};
```

### ComposerInput

Component providing input for message text.

**Responsibilities:**
- Handling text input
- Supporting mentions and emojis
- Providing formatting options

**Props:**
- `value`: String containing the current input value
- `onChange`: Function to update the input value
- `onSubmit`: Function to submit the message
- `disabled`: Boolean indicating if the input is disabled

**State:**
- `isMentionMenuOpen`: Boolean indicating if the mention menu is open
- `isEmojiPickerOpen`: Boolean indicating if the emoji picker is open

### AttachmentUploader

Component for uploading attachments.

**Responsibilities:**
- Handling file selection
- Uploading files
- Showing upload progress

**Props:**
- `onAttach`: Function to add attachments
- `disabled`: Boolean indicating if the uploader is disabled

**State:**
- `isUploading`: Boolean indicating if files are being uploaded
- `uploadProgress`: Number indicating the upload progress (0-100)

### ComposerActions

Component providing actions for the message composer.

**Responsibilities:**
- Displaying action buttons (attach, emoji, etc.)
- Handling action clicks

**Props:**
- `onAttach`: Function to add attachments
- `onSubmit`: Function to submit the message
- `disabled`: Boolean indicating if the actions are disabled

**State:** None (receives data from parent components)

## Contact Components

### ContactList

Component displaying a list of contacts.

**Responsibilities:**
- Displaying a scrollable list of contacts
- Handling contact selection
- Supporting search and filtering

**Props:** None

**State:**
- `searchQuery`: String containing the current search query
- `filter`: String indicating the current filter ('all', 'favorites', 'blocked')

### ContactItem

Component representing a single contact in the contact list.

**Responsibilities:**
- Displaying contact information (name, avatar, status)
- Handling selection

**Props:**
- `contact`: Object containing contact data
- `isActive`: Boolean indicating if the contact is currently selected

**State:** None (receives data from parent components)

### ContactProfile

Component displaying detailed information about a contact.

**Responsibilities:**
- Showing contact details
- Providing contact actions (message, block, etc.)
- Displaying shared media and files

**Props:**
- `contactId`: String containing the ID of the contact

**State:**
- `activeTab`: String indicating the active tab ('info', 'media', 'files')

## Profile Components

### UserProfile

Component displaying the current user's profile in the sidebar.

**Responsibilities:**
- Showing user avatar and name
- Displaying user status
- Providing access to settings

**Props:** None

**State:**
- `isStatusMenuOpen`: Boolean indicating if the status menu is open

**Example:**

```tsx
const UserProfile: React.FC = () => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const { currentUser, updateStatus } = useCurrentUser();
  
  return (
    <div className="user-profile">
      <Avatar src={currentUser.profilePicture} status={currentUser.status} />
      <div className="user-info">
        <h3>{currentUser.displayName}</h3>
        <StatusIndicator 
          status={currentUser.status} 
          onClick={() => setIsStatusMenuOpen(true)} 
        />
      </div>
      <IconButton icon="settings" onClick={() => openModal('userSettings')} />
      
      {isStatusMenuOpen && (
        <StatusMenu 
          currentStatus={currentUser.status} 
          onSelect={(status) => {
            updateStatus(status);
            setIsStatusMenuOpen(false);
          }} 
          onClose={() => setIsStatusMenuOpen(false)} 
        />
      )}
    </div>
  );
};
```

### ProfileEditor

Component for editing user profile information.

**Responsibilities:**
- Providing form for editing profile details
- Handling profile updates
- Supporting avatar upload

**Props:** None

**State:**
- `formData`: Object containing profile form data
- `isSubmitting`: Boolean indicating if the form is being submitted
- `errors`: Object containing form validation errors

## Settings Components

### UserSettings

Modal component for user settings.

**Responsibilities:**
- Providing access to different settings sections
- Managing settings navigation

**Props:**
- `onClose`: Function to close the settings modal

**State:**
- `activeSection`: String indicating the active settings section

**Example:**

```tsx
const UserSettings: React.FC<UserSettingsProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  
  return (
    <Modal onClose={onClose} title="Settings">
      <div className="user-settings">
        <SettingsSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <div className="settings-content">
          {activeSection === 'profile' && <ProfileSettings />}
          {activeSection === 'account' && <AccountSettings />}
          {activeSection === 'appearance' && <AppearanceSettings />}
          {activeSection === 'notifications' && <NotificationSettings />}
          {activeSection === 'privacy' && <PrivacySettings />}
        </div>
      </div>
    </Modal>
  );
};
```

### SettingsSidebar

Component providing navigation for settings sections.

**Responsibilities:**
- Displaying settings section links
- Handling section selection

**Props:**
- `activeSection`: String indicating the active settings section
- `onSectionChange`: Function to change the active section

**State:** None (receives data from parent components)

### ProfileSettings

Component for profile settings.

**Responsibilities:**
- Providing form for editing profile details
- Handling profile updates
- Supporting avatar upload

**Props:** None

**State:**
- `formData`: Object containing profile form data
- `isSubmitting`: Boolean indicating if the form is being submitted
- `errors`: Object containing form validation errors

### AccountSettings

Component for account settings.

**Responsibilities:**
- Providing options for account management
- Handling password changes
- Managing linked accounts

**Props:** None

**State:**
- Various form states for different account settings

### AppearanceSettings

Component for appearance settings.

**Responsibilities:**
- Providing theme selection
- Handling text size preferences
- Managing other appearance options

**Props:** None

**State:**
- `theme`: String indicating the selected theme
- `textSize`: String indicating the selected text size
- Other appearance preferences

### NotificationSettings

Component for notification settings.

**Responsibilities:**
- Providing notification preferences
- Handling notification settings updates

**Props:** None

**State:**
- Various notification preference states

### PrivacySettings

Component for privacy settings.

**Responsibilities:**
- Providing privacy preferences
- Handling privacy settings updates
- Managing blocked contacts

**Props:** None

**State:**
- Various privacy preference states

## Shared Components

### Avatar

Reusable component for displaying user or conversation avatars.

**Responsibilities:**
- Displaying avatar image or fallback
- Showing status indicator (optional)
- Handling different sizes

**Props:**
- `src`: String containing the avatar image URL
- `name`: String containing the name (for fallback)
- `size`: String or number indicating the avatar size
- `status`: String indicating the status (optional)

**State:** None (purely presentational)

**Example:**

```tsx
const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'medium', status }) => {
  const initials = name
    ? name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';
  
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <div className="avatar-fallback">{initials}</div>
      )}
      
      {status && <StatusIndicator status={status} />}
    </div>
  );
};
```

### StatusIndicator

Component for displaying user status.

**Responsibilities:**
- Showing status indicator with appropriate color
- Displaying status text (optional)

**Props:**
- `status`: String indicating the status ('online', 'away', 'busy', 'offline')
- `showText`: Boolean indicating if the status text should be shown

**State:** None (purely presentational)

### Button

Reusable button component.

**Responsibilities:**
- Providing consistent button styling
- Supporting different button variants and sizes
- Handling click events

**Props:**
- `variant`: String indicating the button variant ('primary', 'secondary', 'text')
- `size`: String indicating the button size ('small', 'medium', 'large')
- `disabled`: Boolean indicating if the button is disabled
- `onClick`: Function to handle click events
- `children`: React nodes to render inside the button

**State:** None (purely presentational)

### Modal

Reusable modal component.

**Responsibilities:**
- Providing consistent modal styling
- Handling modal open/close behavior
- Managing focus and accessibility

**Props:**
- `title`: String containing the modal title
- `onClose`: Function to close the modal
- `children`: React nodes to render inside the modal

**State:** None (receives data from parent components)

### Tooltip

Reusable tooltip component.

**Responsibilities:**
- Displaying tooltip content
- Handling tooltip positioning
- Managing tooltip visibility

**Props:**
- `content`: String or React node containing the tooltip content
- `position`: String indicating the tooltip position ('top', 'right', 'bottom', 'left')
- `children`: React node to attach the tooltip to

**State:**
- `isVisible`: Boolean indicating if the tooltip is visible

### Badge

Reusable badge component.

**Responsibilities:**
- Displaying badge content
- Supporting different badge variants

**Props:**
- `content`: String or number containing the badge content
- `variant`: String indicating the badge variant ('primary', 'secondary', 'error')

**State:** None (purely presentational)

## Component Communication Patterns

The chat application uses several patterns for component communication:

### Props Drilling

For shallow component hierarchies, props are passed down from parent to child components.

**Example:**

```tsx
// Parent component
const ConversationView: React.FC = () => {
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
  return (
    <div>
      <MessageList onReply={setReplyToMessage} />
      <MessageComposer replyToMessage={replyToMessage} onCancelReply={() => setReplyToMessage(null)} />
    </div>
  );
};

// Child component
const MessageList: React.FC<MessageListProps> = ({ onReply }) => {
  return (
    <div>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} onReply={onReply} />
      ))}
    </div>
  );
};
```

### Context API

For deeper component hierarchies, React Context is used to avoid excessive props drilling.

**Example:**

```tsx
// Context definition
const ConversationContext = React.createContext<ConversationContextValue | undefined>(undefined);

// Provider component
const ConversationProvider: React.FC<ConversationProviderProps> = ({ conversationId, children }) => {
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
  const value = {
    conversationId,
    replyToMessage,
    setReplyToMessage
  };
  
  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

// Consumer component
const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { setReplyToMessage } = useConversationContext();
  
  return (
    <div>
      {/* Message content */}
      <button onClick={() => setReplyToMessage(message)}>Reply</button>
    </div>
  );
};
```

### Redux State

For global application state, Redux is used to manage and share state across components.

**Example:**

```tsx
// Redux slice
const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    }
  }
});

// Component using Redux state
const ConversationList: React.FC = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const activeConversationId = useSelector(selectActiveConversationId);
  
  return (
    <div>
      {conversations.map(conversation => (
        <ConversationItem 
          key={conversation.id} 
          conversation={conversation} 
          isActive={conversation.id === activeConversationId}
          onClick={() => dispatch(setActiveConversation(conversation.id))}
        />
      ))}
    </div>
  );
};
```

### Custom Hooks

For reusable logic and state management, custom hooks are used to encapsulate and share functionality.

**Example:**

```tsx
// Custom hook
const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
