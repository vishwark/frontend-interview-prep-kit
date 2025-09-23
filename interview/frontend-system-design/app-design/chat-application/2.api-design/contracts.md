# Chat Application API Contracts

This document details the API contracts for the chat application, including endpoints, request/response formats, and expected behaviors.

## API Overview

The chat application uses a hybrid API architecture with:
- GraphQL for most data operations
- REST for authentication and file operations
- WebSockets for real-time communication

## GraphQL API

### Endpoint

```
POST /graphql
```

### Authentication

All GraphQL requests (except for public queries) require authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

### Schema Overview

The GraphQL schema is organized around these main types:

- `User`: User profile and account information
- `Conversation`: Individual or group conversation
- `Message`: Text or media message within a conversation
- `Contact`: Relationship between users
- `Presence`: User online status information

### Key Queries

#### Get User Profile

```graphql
query GetUserProfile($userId: ID!) {
  user(id: $userId) {
    id
    username
    displayName
    profilePicture
    status
    lastSeen
  }
}
```

#### Get Conversations

```graphql
query GetConversations($limit: Int!, $offset: Int!) {
  conversations(limit: $limit, offset: $offset) {
    id
    title
    type
    lastMessage {
      id
      content
      sender {
        id
        displayName
      }
      timestamp
    }
    participants {
      id
      displayName
      profilePicture
      presence {
        status
        lastSeen
      }
    }
    unreadCount
  }
}
```

#### Get Messages

```graphql
query GetMessages($conversationId: ID!, $limit: Int!, $before: String) {
  conversation(id: $conversationId) {
    id
    messages(limit: $limit, before: $before) {
      id
      content
      contentType
      sender {
        id
        displayName
        profilePicture
      }
      timestamp
      readBy {
        id
        timestamp
      }
      reactions {
        type
        user {
          id
          displayName
        }
      }
      attachments {
        id
        type
        url
        thumbnailUrl
        filename
        filesize
      }
    }
  }
}
```

#### Search Messages

```graphql
query SearchMessages($query: String!, $limit: Int!) {
  searchMessages(query: $query, limit: $limit) {
    id
    content
    conversation {
      id
      title
    }
    sender {
      id
      displayName
    }
    timestamp
  }
}
```

### Key Mutations

#### Send Message

```graphql
mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    id
    content
    contentType
    sender {
      id
      displayName
    }
    timestamp
    status
  }
}

# Input type
input SendMessageInput {
  conversationId: ID!
  content: String!
  contentType: MessageContentType!
  attachments: [AttachmentInput]
  replyToMessageId: ID
}
```

#### Create Conversation

```graphql
mutation CreateConversation($input: CreateConversationInput!) {
  createConversation(input: $input) {
    id
    title
    type
    participants {
      id
      displayName
      profilePicture
    }
  }
}

# Input type
input CreateConversationInput {
  title: String
  participantIds: [ID!]!
  type: ConversationType!
}
```

#### Update Message Status

```graphql
mutation UpdateMessageStatus($input: UpdateMessageStatusInput!) {
  updateMessageStatus(input: $input) {
    id
    status
    readAt
  }
}

# Input type
input UpdateMessageStatusInput {
  messageId: ID!
  status: MessageStatus!
}
```

#### Add Reaction

```graphql
mutation AddReaction($input: AddReactionInput!) {
  addReaction(input: $input) {
    id
    reactions {
      type
      user {
        id
        displayName
      }
    }
  }
}

# Input type
input AddReactionInput {
  messageId: ID!
  reactionType: String!
}
```

### GraphQL Subscriptions

```graphql
subscription OnNewMessage($conversationId: ID!) {
  messageReceived(conversationId: $conversationId) {
    id
    content
    contentType
    sender {
      id
      displayName
      profilePicture
    }
    timestamp
    attachments {
      id
      type
      url
      thumbnailUrl
    }
  }
}

subscription OnTypingIndicator($conversationId: ID!) {
  typingIndicator(conversationId: $conversationId) {
    user {
      id
      displayName
    }
    isTyping
    timestamp
  }
}

subscription OnPresenceChange($userIds: [ID!]!) {
  presenceChanged(userIds: $userIds) {
    userId
    status
    lastSeen
  }
}
```

## REST API

### Authentication Endpoints

#### Register User

```
POST /api/v1/auth/register
```

Request:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "displayName": "John Doe"
}
```

Response:
```json
{
  "id": "user123",
  "username": "johndoe",
  "email": "john@example.com",
  "displayName": "John Doe",
  "createdAt": "2023-09-15T14:30:00Z"
}
```

#### Login

```
POST /api/v1/auth/login
```

Request:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "user123",
    "username": "johndoe",
    "displayName": "John Doe",
    "profilePicture": "https://example.com/profiles/johndoe.jpg"
  }
}
```

#### Refresh Token

```
POST /api/v1/auth/refresh
```

Request:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

#### Logout

```
POST /api/v1/auth/logout
```

Request:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "success": true
}
```

### File Endpoints

#### Upload File

```
POST /api/v1/files/upload
```

Request:
- Content-Type: multipart/form-data
- Form fields:
  - file: The file to upload
  - conversationId: ID of the conversation (optional)
  - type: Type of file (image, video, document, audio)

Response:
```json
{
  "id": "file123",
  "originalName": "vacation.jpg",
  "mimeType": "image/jpeg",
  "size": 1024000,
  "url": "https://storage.example.com/files/file123",
  "thumbnailUrl": "https://storage.example.com/thumbnails/file123",
  "conversationId": "conv456",
  "uploadedBy": "user123",
  "uploadedAt": "2023-09-15T14:35:00Z"
}
```

#### Get File

```
GET /api/v1/files/{fileId}
```

Response:
- The file content with appropriate Content-Type header
- If the file is an image, video, or audio, it will be streamed
- For documents, it will be downloaded

#### Delete File

```
DELETE /api/v1/files/{fileId}
```

Response:
```json
{
  "success": true
}
```

### User Endpoints

#### Get User Profile

```
GET /api/v1/users/{userId}
```

Response:
```json
{
  "id": "user123",
  "username": "johndoe",
  "displayName": "John Doe",
  "profilePicture": "https://example.com/profiles/johndoe.jpg",
  "status": "Hey there! I'm using Chat App",
  "presence": {
    "status": "online",
    "lastSeen": "2023-09-15T14:40:00Z"
  }
}
```

#### Update User Profile

```
PUT /api/v1/users/{userId}
```

Request:
```json
{
  "displayName": "Johnny Doe",
  "status": "Available for chat",
  "profilePicture": "https://example.com/profiles/johnnydoe.jpg"
}
```

Response:
```json
{
  "id": "user123",
  "username": "johndoe",
  "displayName": "Johnny Doe",
  "profilePicture": "https://example.com/profiles/johnnydoe.jpg",
  "status": "Available for chat",
  "updatedAt": "2023-09-15T14:45:00Z"
}
```

### Health Check Endpoint

```
GET /api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2023-09-15T14:50:00Z"
}
```

## WebSocket API

### Connection

```
WebSocket: /ws
```

Connection requires authentication via a query parameter or header:

```
/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Events

#### Client to Server Events

##### Join Conversation

```json
{
  "type": "join_conversation",
  "payload": {
    "conversationId": "conv123"
  }
}
```

##### Leave Conversation

```json
{
  "type": "leave_conversation",
  "payload": {
    "conversationId": "conv123"
  }
}
```

##### Send Message

```json
{
  "type": "send_message",
  "payload": {
    "conversationId": "conv123",
    "content": "Hello, how are you?",
    "contentType": "text",
    "attachments": []
  }
}
```

##### Typing Indicator

```json
{
  "type": "typing_indicator",
  "payload": {
    "conversationId": "conv123",
    "isTyping": true
  }
}
```

##### Read Receipt

```json
{
  "type": "read_receipt",
  "payload": {
    "conversationId": "conv123",
    "messageId": "msg456",
    "timestamp": "2023-09-15T14:55:00Z"
  }
}
```

#### Server to Client Events

##### Message Received

```json
{
  "type": "message_received",
  "payload": {
    "id": "msg456",
    "conversationId": "conv123",
    "sender": {
      "id": "user789",
      "displayName": "Jane Smith",
      "profilePicture": "https://example.com/profiles/janesmith.jpg"
    },
    "content": "Hello, how are you?",
    "contentType": "text",
    "timestamp": "2023-09-15T14:56:00Z",
    "attachments": []
  }
}
```

##### Typing Indicator

```json
{
  "type": "typing_indicator",
  "payload": {
    "conversationId": "conv123",
    "user": {
      "id": "user789",
      "displayName": "Jane Smith"
    },
    "isTyping": true,
    "timestamp": "2023-09-15T14:57:00Z"
  }
}
```

##### Presence Update

```json
{
  "type": "presence_update",
  "payload": {
    "user": {
      "id": "user789",
      "displayName": "Jane Smith"
    },
    "status": "online",
    "lastSeen": "2023-09-15T14:58:00Z"
  }
}
```

##### Read Receipt

```json
{
  "type": "read_receipt",
  "payload": {
    "conversationId": "conv123",
    "messageId": "msg456",
    "user": {
      "id": "user789",
      "displayName": "Jane Smith"
    },
    "timestamp": "2023-09-15T14:59:00Z"
  }
}
```

##### Error

```json
{
  "type": "error",
  "payload": {
    "code": "message_not_delivered",
    "message": "Failed to deliver message",
    "details": {
      "conversationId": "conv123",
      "temporaryId": "temp123"
    }
  }
}
```

## API Status Codes

### HTTP Status Codes (REST)

- 200 OK: Successful request
- 201 Created: Resource created successfully
- 400 Bad Request: Invalid request parameters
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Resource conflict
- 422 Unprocessable Entity: Validation error
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server error

### GraphQL Error Codes

- AUTHENTICATION_ERROR: User is not authenticated
- AUTHORIZATION_ERROR: User lacks permission
- BAD_USER_INPUT: Invalid input data
- INTERNAL_SERVER_ERROR: Server error
- RESOURCE_NOT_FOUND: Requested resource not found
- RATE_LIMIT_EXCEEDED: Too many requests
- VALIDATION_ERROR: Input validation failed

### WebSocket Close Codes

- 1000: Normal closure
- 1001: Going away (server shutdown)
- 1008: Policy violation
- 1011: Internal server error
- 4000: Authentication failure
- 4001: Rate limit exceeded
- 4002: Invalid message format
- 4003: Permission denied
