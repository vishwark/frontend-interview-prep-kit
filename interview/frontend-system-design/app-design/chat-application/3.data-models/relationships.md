# Chat Application Entity Relationships

This document describes the relationships between the various entities in the chat application, providing a comprehensive view of how data is structured and interconnected.

## Entity Relationship Diagram

```
┌─────────┐       ┌───────────────┐       ┌─────────┐
│  User   │◄──────┤ Conversation  │◄──────┤ Message │
└─────────┘       └───────────────┘       └─────────┘
     ▲                    ▲                    ▲
     │                    │                    │
     │                    │                    │
     │                    │                    │
┌─────────┐       ┌───────────────┐       ┌─────────┐
│ Contact │       │ Participant   │       │Attachment│
└─────────┘       └───────────────┘       └─────────┘
```

## Core Relationships

### User to Conversation

**Type**: Many-to-Many (through ConversationParticipant)

**Description**: Users participate in multiple conversations, and each conversation can have multiple participants.

**Implementation**:
- The `Conversation` entity has a `participants` array containing `ConversationParticipant` objects
- Each `ConversationParticipant` references a `userId` linking to a `User`

**Constraints**:
- A user can only be a participant in a conversation once
- Individual conversations must have exactly 2 participants
- Group conversations and channels can have 2 or more participants

**Example**:
```typescript
// User participating in multiple conversations
const user = {
  id: "user123",
  // ... other user properties
};

// Conversations with this user as participant
const conversation1 = {
  id: "conv1",
  type: "individual",
  participants: [
    {
      userId: "user123",
      role: "member",
      // ... other participant properties
    },
    {
      userId: "user456",
      role: "member",
      // ... other participant properties
    }
  ],
  // ... other conversation properties
};

const conversation2 = {
  id: "conv2",
  type: "group",
  participants: [
    {
      userId: "user123",
      role: "admin",
      // ... other participant properties
    },
    {
      userId: "user456",
      role: "member",
      // ... other participant properties
    },
    {
      userId: "user789",
      role: "member",
      // ... other participant properties
    }
  ],
  // ... other conversation properties
};
```

### Conversation to Message

**Type**: One-to-Many

**Description**: A conversation contains multiple messages, and each message belongs to exactly one conversation.

**Implementation**:
- Each `Message` has a `conversationId` property referencing a `Conversation`
- Messages are ordered by their `createdAt` timestamp

**Constraints**:
- Messages cannot exist without a conversation
- When a conversation is deleted, all its messages should be deleted (cascade delete)

**Example**:
```typescript
// Conversation containing messages
const conversation = {
  id: "conv123",
  // ... other conversation properties
};

// Messages in this conversation
const message1 = {
  id: "msg1",
  conversationId: "conv123",
  content: "Hello!",
  // ... other message properties
};

const message2 = {
  id: "msg2",
  conversationId: "conv123",
  content: "How are you?",
  // ... other message properties
};
```

### User to Message

**Type**: One-to-Many

**Description**: A user can send multiple messages, and each message is sent by exactly one user.

**Implementation**:
- Each `Message` has a `senderId` property referencing a `User`

**Constraints**:
- Messages cannot exist without a sender
- The sender must be a participant in the conversation
- When a user is deleted, their messages remain but are marked as from a deleted user

**Example**:
```typescript
// User sending messages
const user = {
  id: "user123",
  // ... other user properties
};

// Messages sent by this user
const message1 = {
  id: "msg1",
  senderId: "user123",
  content: "Hello!",
  // ... other message properties
};

const message2 = {
  id: "msg2",
  senderId: "user123",
  content: "How are you?",
  // ... other message properties
};
```

### Message to Attachment

**Type**: One-to-Many

**Description**: A message can have multiple attachments, and each attachment belongs to exactly one message.

**Implementation**:
- Each `Message` has an `attachments` array containing `Attachment` objects
- Each `Attachment` has a `messageId` property referencing a `Message`

**Constraints**:
- Attachments cannot exist without a message
- When a message is deleted, all its attachments should be deleted (cascade delete)
- There may be limits on the number and size of attachments per message

**Example**:
```typescript
// Message with attachments
const message = {
  id: "msg123",
  content: "Check out these photos!",
  attachments: [
    {
      id: "att1",
      messageId: "msg123",
      type: "image",
      // ... other attachment properties
    },
    {
      id: "att2",
      messageId: "msg123",
      type: "image",
      // ... other attachment properties
    }
  ],
  // ... other message properties
};
```

### User to Contact

**Type**: Many-to-Many

**Description**: A user can have multiple contacts, and a user can be a contact of multiple other users.

**Implementation**:
- The `Contact` entity has both `userId` (the owner) and `contactId` (the contact) properties referencing `User` entities

**Constraints**:
- A user cannot be their own contact
- A contact relationship can only exist once between two users
- Contact relationships are not automatically bidirectional (User A having User B as a contact doesn't mean User B has User A as a contact)

**Example**:
```typescript
// User with contacts
const user = {
  id: "user123",
  // ... other user properties
};

// Contacts of this user
const contact1 = {
  id: "contact1",
  userId: "user123",    // Owner of the contact
  contactId: "user456", // The contact
  relationship: "friend",
  // ... other contact properties
};

const contact2 = {
  id: "contact2",
  userId: "user123",    // Owner of the contact
  contactId: "user789", // The contact
  relationship: "colleague",
  // ... other contact properties
};

// This user as a contact of another user
const reverseContact = {
  id: "contact3",
  userId: "user456",    // Owner of the contact
  contactId: "user123", // The contact (our original user)
  relationship: "family",
  // ... other contact properties
};
```

## Additional Relationships

### Message to Message (Reply)

**Type**: One-to-Many

**Description**: A message can be replied to by multiple other messages, and a message can reply to at most one other message.

**Implementation**:
- Each `Message` has an optional `replyToMessageId` property referencing another `Message`

**Constraints**:
- The replied-to message must exist in the same conversation
- Circular reply chains are not allowed

**Example**:
```typescript
// Original message
const originalMessage = {
  id: "msg1",
  conversationId: "conv123",
  content: "Hello!",
  // ... other message properties
};

// Reply to the original message
const replyMessage = {
  id: "msg2",
  conversationId: "conv123",
  content: "Hi there!",
  replyToMessageId: "msg1",
  // ... other message properties
};
```

### Message to User (Read Receipt)

**Type**: Many-to-Many

**Description**: A message can be read by multiple users, and a user can read multiple messages.

**Implementation**:
- Each `Message` has a `readBy` array containing `MessageReadReceipt` objects with `userId` and `timestamp`

**Constraints**:
- A user can only have one read receipt per message
- Only participants of the conversation can have read receipts for its messages

**Example**:
```typescript
// Message with read receipts
const message = {
  id: "msg123",
  content: "Hello everyone!",
  readBy: [
    {
      userId: "user456",
      timestamp: "2023-09-15T14:30:00Z"
    },
    {
      userId: "user789",
      timestamp: "2023-09-15T14:35:00Z"
    }
  ],
  // ... other message properties
};
```

### Message to User (Delivery Receipt)

**Type**: Many-to-Many

**Description**: A message can be delivered to multiple users, and a user can receive multiple messages.

**Implementation**:
- Each `Message` has a `deliveredTo` array containing `MessageDeliveryReceipt` objects with `userId` and `timestamp`

**Constraints**:
- A user can only have one delivery receipt per message
- Only participants of the conversation can have delivery receipts for its messages

**Example**:
```typescript
// Message with delivery receipts
const message = {
  id: "msg123",
  content: "Hello everyone!",
  deliveredTo: [
    {
      userId: "user456",
      timestamp: "2023-09-15T14:25:00Z"
    },
    {
      userId: "user789",
      timestamp: "2023-09-15T14:26:00Z"
    }
  ],
  // ... other message properties
};
```

### Message to User (Reaction)

**Type**: Many-to-Many

**Description**: A message can have reactions from multiple users, and a user can react to multiple messages.

**Implementation**:
- Each `Message` has a `reactions` array containing `MessageReaction` objects with `userId`, `type`, and `createdAt`

**Constraints**:
- A user can have multiple different reactions to a message (e.g., both a "👍" and a "❤️")
- Only participants of the conversation can react to its messages

**Example**:
```typescript
// Message with reactions
const message = {
  id: "msg123",
  content: "Great news everyone!",
  reactions: [
    {
      userId: "user456",
      type: "👍",
      createdAt: "2023-09-15T14:40:00Z"
    },
    {
      userId: "user789",
      type: "❤️",
      createdAt: "2023-09-15T14:45:00Z"
    },
    {
      userId: "user456",
      type: "🎉",
      createdAt: "2023-09-15T14:50:00Z"
    }
  ],
  // ... other message properties
};
```

### Message to User (Mention)

**Type**: Many-to-Many

**Description**: A message can mention multiple users, and a user can be mentioned in multiple messages.

**Implementation**:
- Each `Message` has a `mentions` array containing `MessageMention` objects with `userId`, `index`, and `length`

**Constraints**:
- A user can only be mentioned once per message
- Only participants of the conversation can be mentioned in its messages

**Example**:
```typescript
// Message with mentions
const message = {
  id: "msg123",
  content: "Hey @John, can you help @Sarah with this?",
  mentions: [
    {
      userId: "user456", // John
      index: 4,
      length: 5
    },
    {
      userId: "user789", // Sarah
      index: 21,
      length: 6
    }
  ],
  // ... other message properties
};
```

## Derived Relationships

### User to Presence

**Type**: One-to-One

**Description**: A user has exactly one presence status, and each presence status belongs to exactly one user.

**Implementation**:
- Each `Presence` has a `userId` property referencing a `User`

**Example**:
```typescript
// User
const user = {
  id: "user123",
  // ... other user properties
};

// Presence for this user
const presence = {
  userId: "user123",
  status: "online",
  lastSeen: "2023-09-15T15:00:00Z",
  // ... other presence properties
};
```

### User to Device

**Type**: One-to-Many

**Description**: A user can have multiple devices, and each device belongs to exactly one user.

**Implementation**:
- Each `User` has a `devices` array containing `Device` objects

**Example**:
```typescript
// User with multiple devices
const user = {
  id: "user123",
  devices: [
    {
      id: "device1",
      name: "iPhone 13",
      type: "mobile",
      platform: "iOS",
      lastActive: "2023-09-15T14:30:00Z",
      // ... other device properties
    },
    {
      id: "device2",
      name: "MacBook Pro",
      type: "desktop",
      platform: "macOS",
      lastActive: "2023-09-15T15:00:00Z",
      // ... other device properties
    }
  ],
  // ... other user properties
};
```

## Database Schema Considerations

### Indexing Strategy

To optimize query performance, the following indexes should be created:

1. **User Indexes**:
   - Primary key on `id`
   - Unique index on `email`
   - Unique index on `username`
   - Index on `lastSeen` for presence queries

2. **Conversation Indexes**:
   - Primary key on `id`
   - Index on `participants.userId` for finding a user's conversations
   - Index on `lastMessageAt` for sorting conversations by recency

3. **Message Indexes**:
   - Primary key on `id`
   - Index on `conversationId` for retrieving messages in a conversation
   - Compound index on `conversationId` and `createdAt` for paginated message loading
   - Index on `senderId` for finding messages sent by a user
   - Index on `mentions.userId` for finding messages that mention a user

4. **Contact Indexes**:
   - Primary key on `id`
   - Compound unique index on `userId` and `contactId`
   - Index on `userId` for finding a user's contacts

### Denormalization Strategies

For performance optimization, certain data is denormalized:

1. **Conversation Participants**:
   - Participant information is embedded in the `Conversation` entity for quick access
   - This avoids joins when loading conversation lists

2. **Message Read/Delivery Receipts**:
   - Receipt information is embedded in the `Message` entity
   - This allows for efficient checking of message status

3. **Last Message Preview**:
   - The last message content and metadata can be denormalized into the `Conversation` entity
   - This avoids additional queries when displaying conversation lists

4. **User Profile Information**:
   - Basic user profile information (display name, profile picture) can be denormalized into other entities where frequently accessed
   - This reduces the need for additional user lookups

## Data Consistency Challenges

### Concurrent Edits

When multiple users edit the same conversation or message simultaneously:

1. **Optimistic Concurrency Control**:
   - Use version numbers or timestamps to detect conflicts
   - Implement conflict resolution strategies based on business rules

2. **Last-Writer-Wins**:
   - For simple attributes, the last update may overwrite previous changes
   - This is acceptable for non-critical fields

### Real-time Updates

To maintain consistency across clients:

1. **Event Sourcing**:
   - All changes are represented as events
   - Clients apply events in the same order to maintain consistent state

2. **State Synchronization**:
   - Periodic state synchronization to correct any inconsistencies
   - Full state can be requested by clients when needed

### Offline Operations

When users perform actions while offline:

1. **Optimistic Updates**:
   - Changes are applied locally immediately
   - Queued for synchronization when connectivity is restored

2. **Conflict Resolution**:
   - Server-side conflict detection and resolution
   - Client notification of conflicts that require user intervention

## Conclusion

The relationships between entities in the chat application are designed to support real-time messaging, rich media sharing, and social features while maintaining data integrity and performance. The schema balances normalization for data integrity with strategic denormalization for performance optimization.
