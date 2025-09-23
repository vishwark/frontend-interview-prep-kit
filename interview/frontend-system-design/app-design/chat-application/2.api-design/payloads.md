# Chat Application API Payload Examples

This document provides detailed examples of request and response payloads for the chat application API. These examples complement the API contracts defined in [contracts.md](./contracts.md) and illustrate the expected data formats for various API operations.

## GraphQL API Payloads

### User Queries

#### Get User Profile

Request:
```graphql
query GetUserProfile {
  user(id: "user123") {
    id
    username
    displayName
    profilePicture
    status
    lastSeen
  }
}
```

Response:
```json
{
  "data": {
    "user": {
      "id": "user123",
      "username": "johndoe",
      "displayName": "John Doe",
      "profilePicture": "https://example.com/profiles/johndoe.jpg",
      "status": "Hey there! I'm using Chat App",
      "lastSeen": "2023-09-15T14:30:00Z"
    }
  }
}
```

#### Get Multiple Users

Request:
```graphql
query GetMultipleUsers {
  users(ids: ["user123", "user456"]) {
    id
    displayName
    profilePicture
    presence {
      status
      lastSeen
    }
  }
}
```

Response:
```json
{
  "data": {
    "users": [
      {
        "id": "user123",
        "displayName": "John Doe",
        "profilePicture": "https://example.com/profiles/johndoe.jpg",
        "presence": {
          "status": "online",
          "lastSeen": "2023-09-15T14:30:00Z"
        }
      },
      {
        "id": "user456",
        "displayName": "Jane Smith",
        "profilePicture": "https://example.com/profiles/janesmith.jpg",
        "presence": {
          "status": "away",
          "lastSeen": "2023-09-15T14:25:00Z"
        }
      }
    ]
  }
}
```

### Conversation Queries

#### Get Conversations List

Request:
```graphql
query GetConversations {
  conversations(limit: 10, offset: 0) {
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
      }
    }
    unreadCount
  }
}
```

Response:
```json
{
  "data": {
    "conversations": [
      {
        "id": "conv123",
        "title": null,
        "type": "INDIVIDUAL",
        "lastMessage": {
          "id": "msg789",
          "content": "See you tomorrow!",
          "sender": {
            "id": "user456",
            "displayName": "Jane Smith"
          },
          "timestamp": "2023-09-15T14:28:00Z"
        },
        "participants": [
          {
            "id": "user123",
            "displayName": "John Doe",
            "profilePicture": "https://example.com/profiles/johndoe.jpg",
            "presence": {
              "status": "online"
            }
          },
          {
            "id": "user456",
            "displayName": "Jane Smith",
            "profilePicture": "https://example.com/profiles/janesmith.jpg",
            "presence": {
              "status": "away"
            }
          }
        ],
        "unreadCount": 1
      },
      {
        "id": "conv456",
        "title": "Project Team",
        "type": "GROUP",
        "lastMessage": {
          "id": "msg567",
          "content": "Let's discuss this tomorrow",
          "sender": {
            "id": "user789",
            "displayName": "Bob Johnson"
          },
          "timestamp": "2023-09-15T14:15:00Z"
        },
        "participants": [
          {
            "id": "user123",
            "displayName": "John Doe",
            "profilePicture": "https://example.com/profiles/johndoe.jpg",
            "presence": {
              "status": "online"
            }
          },
          {
            "id": "user456",
            "displayName": "Jane Smith",
            "profilePicture": "https://example.com/profiles/janesmith.jpg",
            "presence": {
              "status": "away"
            }
          },
          {
            "id": "user789",
            "displayName": "Bob Johnson",
            "profilePicture": "https://example.com/profiles/bobjohnson.jpg",
            "presence": {
              "status": "offline"
            }
          }
        ],
        "unreadCount": 5
      }
    ]
  }
}
```

#### Get Conversation Messages

Request:
```graphql
query GetMessages {
  conversation(id: "conv123") {
    id
    messages(limit: 20, before: null) {
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

Response:
```json
{
  "data": {
    "conversation": {
      "id": "conv123",
      "messages": [
        {
          "id": "msg123",
          "content": "Hi there!",
          "contentType": "TEXT",
          "sender": {
            "id": "user123",
            "displayName": "John Doe",
            "profilePicture": "https://example.com/profiles/johndoe.jpg"
          },
          "timestamp": "2023-09-15T14:20:00Z",
          "readBy": [
            {
              "id": "user456",
              "timestamp": "2023-09-15T14:21:00Z"
            }
          ],
          "reactions": [],
          "attachments": []
        },
        {
          "id": "msg456",
          "content": "Hello! How are you?",
          "contentType": "TEXT",
          "sender": {
            "id": "user456",
            "displayName": "Jane Smith",
            "profilePicture": "https://example.com/profiles/janesmith.jpg"
          },
          "timestamp": "2023-09-15T14:22:00Z",
          "readBy": [
            {
              "id": "user123",
              "timestamp": "2023-09-15T14:22:30Z"
            }
          ],
          "reactions": [
            {
              "type": "👍",
              "user": {
                "id": "user123",
                "displayName": "John Doe"
              }
            }
          ],
          "attachments": []
        },
        {
          "id": "msg789",
          "content": "See you tomorrow!",
          "contentType": "TEXT",
          "sender": {
            "id": "user456",
            "displayName": "Jane Smith",
            "profilePicture": "https://example.com/profiles/janesmith.jpg"
          },
          "timestamp": "2023-09-15T14:28:00Z",
          "readBy": [],
          "reactions": [],
          "attachments": []
        }
      ]
    }
  }
}
```

### Message Mutations

#### Send Text Message

Request:
```graphql
mutation SendTextMessage {
  sendMessage(input: {
    conversationId: "conv123",
    content: "I'm doing great, thanks for asking!",
    contentType: TEXT,
    attachments: []
  }) {
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
```

Response:
```json
{
  "data": {
    "sendMessage": {
      "id": "msg101112",
      "content": "I'm doing great, thanks for asking!",
      "contentType": "TEXT",
      "sender": {
        "id": "user123",
        "displayName": "John Doe"
      },
      "timestamp": "2023-09-15T14:35:00Z",
      "status": "SENT"
    }
  }
}
```

#### Send Message with Attachment

Request:
```graphql
mutation SendMessageWithAttachment {
  sendMessage(input: {
    conversationId: "conv123",
    content: "Check out this photo!",
    contentType: TEXT,
    attachments: [
      {
        id: "file123",
        type: "IMAGE"
      }
    ]
  }) {
    id
    content
    contentType
    sender {
      id
      displayName
    }
    timestamp
    status
    attachments {
      id
      type
      url
      thumbnailUrl
    }
  }
}
```

Response:
```json
{
  "data": {
    "sendMessage": {
      "id": "msg131415",
      "content": "Check out this photo!",
      "contentType": "TEXT",
      "sender": {
        "id": "user123",
        "displayName": "John Doe"
      },
      "timestamp": "2023-09-15T14:40:00Z",
      "status": "SENT",
      "attachments": [
        {
          "id": "file123",
          "type": "IMAGE",
          "url": "https://storage.example.com/files/file123",
          "thumbnailUrl": "https://storage.example.com/thumbnails/file123"
        }
      ]
    }
  }
}
```

#### Create Group Conversation

Request:
```graphql
mutation CreateGroupConversation {
  createConversation(input: {
    title: "Weekend Plans",
    participantIds: ["user123", "user456", "user789"],
    type: GROUP
  }) {
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
```

Response:
```json
{
  "data": {
    "createConversation": {
      "id": "conv789",
      "title": "Weekend Plans",
      "type": "GROUP",
      "participants": [
        {
          "id": "user123",
          "displayName": "John Doe",
          "profilePicture": "https://example.com/profiles/johndoe.jpg"
        },
        {
          "id": "user456",
          "displayName": "Jane Smith",
          "profilePicture": "https://example.com/profiles/janesmith.jpg"
        },
        {
          "id": "user789",
          "displayName": "Bob Johnson",
          "profilePicture": "https://example.com/profiles/bobjohnson.jpg"
        }
      ]
    }
  }
}
```

#### Add Message Reaction

Request:
```graphql
mutation AddReaction {
  addReaction(input: {
    messageId: "msg456",
    reactionType: "❤️"
  }) {
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
```

Response:
```json
{
  "data": {
    "addReaction": {
      "id": "msg456",
      "reactions": [
        {
          "type": "👍",
          "user": {
            "id": "user123",
            "displayName": "John Doe"
          }
        },
        {
          "type": "❤️",
          "user": {
            "id": "user123",
            "displayName": "John Doe"
          }
        }
      ]
    }
  }
}
```

### GraphQL Error Response Example

```json
{
  "errors": [
    {
      "message": "You do not have permission to access this conversation",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["conversation"],
      "extensions": {
        "code": "AUTHORIZATION_ERROR",
        "details": {
          "conversationId": "conv123"
        }
      }
    }
  ],
  "data": {
    "conversation": null
  }
}
```

## REST API Payloads

### Authentication

#### Register User

Request:
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "displayName": "John Doe"
}
```

Response:
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "user123",
  "username": "johndoe",
  "email": "john@example.com",
  "displayName": "John Doe",
  "createdAt": "2023-09-15T14:30:00Z"
}
```

#### Login

Request:
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

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

Request:
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### File Operations

#### Upload File

Request:
```http
POST /api/v1/files/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="vacation.jpg"
Content-Type: image/jpeg

[Binary file data]
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="conversationId"

conv123
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="type"

image
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

Response:
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "file123",
  "originalName": "vacation.jpg",
  "mimeType": "image/jpeg",
  "size": 1024000,
  "url": "https://storage.example.com/files/file123",
  "thumbnailUrl": "https://storage.example.com/thumbnails/file123",
  "conversationId": "conv123",
  "uploadedBy": "user123",
  "uploadedAt": "2023-09-15T14:35:00Z"
}
```

### User Operations

#### Get User Profile

Request:
```http
GET /api/v1/users/user123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

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

Request:
```http
PUT /api/v1/users/user123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "displayName": "Johnny Doe",
  "status": "Available for chat",
  "profilePicture": "https://example.com/profiles/johnnydoe.jpg"
}
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "user123",
  "username": "johndoe",
  "displayName": "Johnny Doe",
  "profilePicture": "https://example.com/profiles/johnnydoe.jpg",
  "status": "Available for chat",
  "updatedAt": "2023-09-15T14:45:00Z"
}
```

### Error Response Examples

#### Invalid Request

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "invalid_request",
    "message": "Invalid request parameters",
    "details": {
      "email": "Must be a valid email address"
    }
  }
}
```

#### Authentication Error

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": {
    "code": "authentication_required",
    "message": "Authentication is required to access this resource"
  }
}
```

#### Resource Not Found

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": {
    "code": "resource_not_found",
    "message": "The requested resource was not found",
    "details": {
      "resourceType": "user",
      "resourceId": "user999"
    }
  }
}
```

## WebSocket Payloads

### Connection

```
WebSocket: /ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Client to Server Messages

#### Join Conversation

```json
{
  "type": "join_conversation",
  "payload": {
    "conversationId": "conv123"
  }
}
```

#### Send Message

```json
{
  "type": "send_message",
  "payload": {
    "conversationId": "conv123",
    "content": "Hello, how are you?",
    "contentType": "text",
    "temporaryId": "temp123",
    "attachments": []
  }
}
```

#### Typing Indicator

```json
{
  "type": "typing_indicator",
  "payload": {
    "conversationId": "conv123",
    "isTyping": true
  }
}
```

#### Read Receipt

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

### Server to Client Messages

#### Message Received

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

#### Message Acknowledgment

```json
{
  "type": "message_ack",
  "payload": {
    "temporaryId": "temp123",
    "messageId": "msg789",
    "conversationId": "conv123",
    "status": "delivered",
    "timestamp": "2023-09-15T14:57:00Z"
  }
}
```

#### Typing Indicator

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

#### Presence Update

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

#### Error

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

## Pagination Examples

### Cursor-based Pagination (GraphQL)

Request:
```graphql
query GetMessages {
  conversation(id: "conv123") {
    id
    messages(limit: 20, before: "msg456") {
      id
      content
      sender {
        id
        displayName
      }
      timestamp
    }
    pageInfo {
      hasMore
      endCursor
    }
  }
}
```

Response:
```json
{
  "data": {
    "conversation": {
      "id": "conv123",
      "messages": [
        {
          "id": "msg123",
          "content": "Hi there!",
          "sender": {
            "id": "user123",
            "displayName": "John Doe"
          },
          "timestamp": "2023-09-15T14:20:00Z"
        },
        {
          "id": "msg124",
          "content": "How are you?",
          "sender": {
            "id": "user123",
            "displayName": "John Doe"
          },
          "timestamp": "2023-09-15T14:21:00Z"
        }
      ],
      "pageInfo": {
        "hasMore": true,
        "endCursor": "msg123"
      }
    }
  }
}
```

### Offset-based Pagination (REST)

Request:
```http
GET /api/v1/conversations?limit=10&offset=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "conversations": [
    {
      "id": "conv789",
      "title": "Weekend Plans",
      "type": "GROUP",
      "lastMessage": {
        "content": "Let's meet at 7pm",
        "sender": {
          "id": "user456",
          "displayName": "Jane Smith"
        },
        "timestamp": "2023-09-15T14:50:00Z"
      },
      "unreadCount": 3
    },
    {
      "id": "conv101112",
      "title": null,
      "type": "INDIVIDUAL",
      "lastMessage": {
        "content": "Thanks for your help!",
        "sender": {
          "id": "user789",
          "displayName": "Bob Johnson"
        },
        "timestamp": "2023-09-15T14:45:00Z"
      },
      "unreadCount": 0
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 10,
    "hasMore": true
  }
}
