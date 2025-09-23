# Chat Application Data Validation Schemas

This document defines the JSON schemas and validation rules for the chat application's data models. These schemas are used for validating data throughout the application, ensuring consistency and integrity.

## Table of Contents

1. [User Schema](#user-schema)
2. [Conversation Schema](#conversation-schema)
3. [Message Schema](#message-schema)
4. [Attachment Schema](#attachment-schema)
5. [Contact Schema](#contact-schema)
6. [Validation Strategies](#validation-strategies)
7. [Custom Validators](#custom-validators)

## User Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "required": ["id", "username", "email", "displayName", "createdAt", "updatedAt", "isActive", "preferences", "role"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9-_]{1,36}$",
      "description": "Unique identifier for the user"
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "maxLength": 30,
      "pattern": "^[a-zA-Z0-9_-]+$",
      "description": "Unique username for the user"
    },
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 255,
      "description": "Email address of the user"
    },
    "displayName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "description": "Display name shown to other users"
    },
    "profilePicture": {
      "type": ["string", "null"],
      "format": "uri",
      "description": "URL to the user's profile picture"
    },
    "status": {
      "type": ["string", "null"],
      "maxLength": 100,
      "description": "User's status message"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the user was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the user was last updated"
    },
    "lastSeen": {
      "type": ["string", "null"],
      "format": "date-time",
      "description": "Timestamp when the user was last seen"
    },
    "isActive": {
      "type": "boolean",
      "description": "Whether the user account is active"
    },
    "preferences": {
      "type": "object",
      "required": ["theme", "notifications", "privacy", "language", "timezone", "messageTextSize", "soundEnabled", "autoDownloadMedia"],
      "properties": {
        "theme": {
          "type": "string",
          "enum": ["light", "dark", "system"],
          "description": "User's preferred theme"
        },
        "notifications": {
          "type": "object",
          "required": ["newMessage", "groupMentions", "directMentions", "newConversation", "messageReactions", "soundEnabled", "doNotDisturb"],
          "properties": {
            "newMessage": {
              "type": "boolean",
              "description": "Whether to notify for new messages"
            },
            "groupMentions": {
              "type": "boolean",
              "description": "Whether to notify for group mentions"
            },
            "directMentions": {
              "type": "boolean",
              "description": "Whether to notify for direct mentions"
            },
            "newConversation": {
              "type": "boolean",
              "description": "Whether to notify for new conversations"
            },
            "messageReactions": {
              "type": "boolean",
              "description": "Whether to notify for message reactions"
            },
            "soundEnabled": {
              "type": "boolean",
              "description": "Whether notification sounds are enabled"
            },
            "doNotDisturb": {
              "type": "object",
              "required": ["enabled"],
              "properties": {
                "enabled": {
                  "type": "boolean",
                  "description": "Whether do not disturb mode is enabled"
                },
                "startTime": {
                  "type": ["string", "null"],
                  "pattern": "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
                  "description": "Start time for do not disturb mode (HH:MM)"
                },
                "endTime": {
                  "type": ["string", "null"],
                  "pattern": "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
                  "description": "End time for do not disturb mode (HH:MM)"
                }
              }
            }
          }
        },
        "privacy": {
          "type": "object",
          "required": ["showReadReceipts", "showLastSeen", "showTypingIndicator", "allowSearchByEmail", "allowSearchByPhone"],
          "properties": {
            "showReadReceipts": {
              "type": "boolean",
              "description": "Whether to show read receipts to others"
            },
            "showLastSeen": {
              "type": "boolean",
              "description": "Whether to show last seen status to others"
            },
            "showTypingIndicator": {
              "type": "boolean",
              "description": "Whether to show typing indicator to others"
            },
            "allowSearchByEmail": {
              "type": "boolean",
              "description": "Whether others can find user by email"
            },
            "allowSearchByPhone": {
              "type": "boolean",
              "description": "Whether others can find user by phone"
            }
          }
        },
        "language": {
          "type": "string",
          "pattern": "^[a-z]{2}(-[A-Z]{2})?$",
          "description": "User's preferred language (ISO 639-1 code)"
        },
        "timezone": {
          "type": "string",
          "description": "User's timezone (IANA timezone identifier)"
        },
        "messageTextSize": {
          "type": "string",
          "enum": ["small", "medium", "large"],
          "description": "User's preferred message text size"
        },
        "soundEnabled": {
          "type": "boolean",
          "description": "Whether sounds are enabled"
        },
        "autoDownloadMedia": {
          "type": "boolean",
          "description": "Whether to automatically download media"
        }
      }
    },
    "role": {
      "type": "string",
      "enum": ["user", "admin", "moderator"],
      "description": "User's role in the system"
    },
    "devices": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "type", "platform", "lastActive"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the device"
          },
          "name": {
            "type": "string",
            "description": "Name of the device"
          },
          "type": {
            "type": "string",
            "enum": ["mobile", "tablet", "desktop", "web"],
            "description": "Type of device"
          },
          "platform": {
            "type": "string",
            "description": "Operating system or platform"
          },
          "lastActive": {
            "type": "string",
            "format": "date-time",
            "description": "When the device was last active"
          },
          "pushToken": {
            "type": ["string", "null"],
            "description": "Push notification token for the device"
          }
        }
      }
    }
  }
}
```

## Conversation Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Conversation",
  "type": "object",
  "required": ["id", "type", "createdAt", "updatedAt", "lastMessageAt", "createdBy", "participants", "metadata", "isEncrypted", "isArchived", "isPinned"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9-_]{1,36}$",
      "description": "Unique identifier for the conversation"
    },
    "type": {
      "type": "string",
      "enum": ["individual", "group", "channel"],
      "description": "Type of conversation"
    },
    "title": {
      "type": ["string", "null"],
      "maxLength": 100,
      "description": "Title of the conversation (required for group and channel)"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the conversation was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the conversation was last updated"
    },
    "lastMessageAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of the last message in the conversation"
    },
    "createdBy": {
      "type": "string",
      "description": "ID of the user who created the conversation"
    },
    "participants": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["userId", "role", "joinedAt", "isAdmin", "isMuted"],
        "properties": {
          "userId": {
            "type": "string",
            "description": "ID of the participant user"
          },
          "role": {
            "type": "string",
            "enum": ["owner", "admin", "member", "guest"],
            "description": "Role of the participant in the conversation"
          },
          "joinedAt": {
            "type": "string",
            "format": "date-time",
            "description": "When the participant joined the conversation"
          },
          "lastReadMessageId": {
            "type": ["string", "null"],
            "description": "ID of the last message read by the participant"
          },
          "lastReadAt": {
            "type": ["string", "null"],
            "format": "date-time",
            "description": "When the participant last read the conversation"
          },
          "isAdmin": {
            "type": "boolean",
            "description": "Whether the participant is an admin"
          },
          "isMuted": {
            "type": "boolean",
            "description": "Whether the conversation is muted for the participant"
          },
          "mutedUntil": {
            "type": ["string", "null"],
            "format": "date-time",
            "description": "Until when the conversation is muted"
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["customProperties"],
      "properties": {
        "description": {
          "type": ["string", "null"],
          "maxLength": 500,
          "description": "Description of the conversation"
        },
        "customProperties": {
          "type": "object",
          "description": "Custom properties for the conversation"
        },
        "theme": {
          "type": ["string", "null"],
          "description": "Theme for the conversation"
        },
        "groupSettings": {
          "type": ["object", "null"],
          "properties": {
            "allowMembersToInvite": {
              "type": "boolean",
              "description": "Whether members can invite others"
            },
            "allowMembersToChangeInfo": {
              "type": "boolean",
              "description": "Whether members can change conversation info"
            },
            "allowMembersToSendMedia": {
              "type": "boolean",
              "description": "Whether members can send media"
            },
            "onlyAdminsCanSendMessages": {
              "type": "boolean",
              "description": "Whether only admins can send messages"
            },
            "joinApprovalRequired": {
              "type": "boolean",
              "description": "Whether approval is required to join"
            },
            "slowMode": {
              "type": ["object", "null"],
              "properties": {
                "enabled": {
                  "type": "boolean",
                  "description": "Whether slow mode is enabled"
                },
                "delay": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "Delay between messages in seconds"
                }
              }
            }
          }
        }
      }
    },
    "isEncrypted": {
      "type": "boolean",
      "description": "Whether the conversation is end-to-end encrypted"
    },
    "isArchived": {
      "type": "boolean",
      "description": "Whether the conversation is archived"
    },
    "isPinned": {
      "type": "boolean",
      "description": "Whether the conversation is pinned"
    },
    "avatar": {
      "type": ["string", "null"],
      "format": "uri",
      "description": "URL to the conversation avatar"
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "type": { "enum": ["group", "channel"] }
        }
      },
      "then": {
        "required": ["title"]
      }
    }
  ]
}
```

## Message Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Message",
  "type": "object",
  "required": ["id", "conversationId", "senderId", "content", "contentType", "createdAt", "updatedAt", "status", "attachments", "reactions", "readBy", "deliveredTo", "mentions", "isEdited", "isDeleted", "metadata"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9-_]{1,36}$",
      "description": "Unique identifier for the message"
    },
    "conversationId": {
      "type": "string",
      "description": "ID of the conversation the message belongs to"
    },
    "senderId": {
      "type": "string",
      "description": "ID of the user who sent the message"
    },
    "content": {
      "type": "string",
      "maxLength": 10000,
      "description": "Content of the message"
    },
    "contentType": {
      "type": "string",
      "enum": ["text", "image", "video", "audio", "file", "location", "contact", "system", "custom"],
      "description": "Type of message content"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the message was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the message was last updated"
    },
    "status": {
      "type": "string",
      "enum": ["sending", "sent", "delivered", "read", "failed"],
      "description": "Status of the message"
    },
    "attachments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "messageId", "type", "name", "size", "mimeType", "url", "metadata", "uploadStatus", "createdAt"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the attachment"
          },
          "messageId": {
            "type": "string",
            "description": "ID of the message the attachment belongs to"
          },
          "type": {
            "type": "string",
            "enum": ["image", "video", "audio", "document", "location", "contact", "other"],
            "description": "Type of attachment"
          },
          "name": {
            "type": "string",
            "description": "Name of the attachment file"
          },
          "size": {
            "type": "integer",
            "minimum": 0,
            "description": "Size of the attachment in bytes"
          },
          "mimeType": {
            "type": "string",
            "description": "MIME type of the attachment"
          },
          "url": {
            "type": "string",
            "format": "uri",
            "description": "URL to the attachment"
          },
          "thumbnailUrl": {
            "type": ["string", "null"],
            "format": "uri",
            "description": "URL to the attachment thumbnail"
          },
          "metadata": {
            "type": "object",
            "properties": {
              "width": {
                "type": ["integer", "null"],
                "description": "Width of the image or video"
              },
              "height": {
                "type": ["integer", "null"],
                "description": "Height of the image or video"
              },
              "duration": {
                "type": ["number", "null"],
                "description": "Duration of audio or video in seconds"
              },
              "encoding": {
                "type": ["string", "null"],
                "description": "Encoding format"
              },
              "preview": {
                "type": ["string", "null"],
                "description": "Preview text for documents"
              },
              "location": {
                "type": ["object", "null"],
                "properties": {
                  "latitude": {
                    "type": "number",
                    "description": "Latitude coordinate"
                  },
                  "longitude": {
                    "type": "number",
                    "description": "Longitude coordinate"
                  },
                  "name": {
                    "type": ["string", "null"],
                    "description": "Name of the location"
                  },
                  "address": {
                    "type": ["string", "null"],
                    "description": "Address of the location"
                  }
                }
              },
              "contact": {
                "type": ["object", "null"],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Name of the contact"
                  },
                  "phone": {
                    "type": ["string", "null"],
                    "description": "Phone number of the contact"
                  },
                  "email": {
                    "type": ["string", "null"],
                    "description": "Email of the contact"
                  }
                }
              },
              "customProperties": {
                "type": "object",
                "description": "Custom properties for the attachment"
              }
            }
          },
          "uploadStatus": {
            "type": "string",
            "enum": ["pending", "uploading", "completed", "failed"],
            "description": "Status of the attachment upload"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the attachment was created"
          }
        }
      }
    },
    "reactions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["userId", "type", "createdAt"],
        "properties": {
          "userId": {
            "type": "string",
            "description": "ID of the user who reacted"
          },
          "type": {
            "type": "string",
            "description": "Type of reaction (emoji code)"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the reaction was created"
          }
        }
      }
    },
    "replyToMessageId": {
      "type": ["string", "null"],
      "description": "ID of the message being replied to"
    },
    "forwardedFrom": {
      "type": ["object", "null"],
      "properties": {
        "messageId": {
          "type": "string",
          "description": "ID of the original message"
        },
        "conversationId": {
          "type": "string",
          "description": "ID of the original conversation"
        },
        "senderName": {
          "type": "string",
          "description": "Name of the original sender"
        }
      }
    },
    "readBy": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["userId", "timestamp"],
        "properties": {
          "userId": {
            "type": "string",
            "description": "ID of the user who read the message"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the message was read"
          }
        }
      }
    },
    "deliveredTo": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["userId", "timestamp"],
        "properties": {
          "userId": {
            "type": "string",
            "description": "ID of the user the message was delivered to"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the message was delivered"
          }
        }
      }
    },
    "mentions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["userId", "index", "length"],
        "properties": {
          "userId": {
            "type": "string",
            "description": "ID of the mentioned user"
          },
          "index": {
            "type": "integer",
            "minimum": 0,
            "description": "Starting index of the mention in the content"
          },
          "length": {
            "type": "integer",
            "minimum": 1,
            "description": "Length of the mention in the content"
          }
        }
      }
    },
    "isEdited": {
      "type": "boolean",
      "description": "Whether the message has been edited"
    },
    "isDeleted": {
      "type": "boolean",
      "description": "Whether the message has been deleted"
    },
    "deletedAt": {
      "type": ["string", "null"],
      "format": "date-time",
      "description": "Timestamp when the message was deleted"
    },
    "clientId": {
      "type": ["string", "null"],
      "description": "Temporary client-side ID for optimistic updates"
    },
    "metadata": {
      "type": "object",
      "description": "Additional metadata for the message"
    }
  }
}
```

## Attachment Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Attachment",
  "type": "object",
  "required": ["id", "messageId", "type", "name", "size", "mimeType", "url", "metadata", "uploadStatus", "createdAt"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9-_]{1,36}$",
      "description": "Unique identifier for the attachment"
    },
    "messageId": {
      "type": "string",
      "description": "ID of the message the attachment belongs to"
    },
    "type": {
      "type": "string",
      "enum": ["image", "video", "audio", "document", "location", "contact", "other"],
      "description": "Type of attachment"
    },
    "name": {
      "type": "string",
      "maxLength": 255,
      "description": "Name of the attachment file"
    },
    "size": {
      "type": "integer",
      "minimum": 0,
      "maximum": 104857600, // 100MB
      "description": "Size of the attachment in bytes"
    },
    "mimeType": {
      "type": "string",
      "description": "MIME type of the attachment"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL to the attachment"
    },
    "thumbnailUrl": {
      "type": ["string", "null"],
      "format": "uri",
      "description": "URL to the attachment thumbnail"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "width": {
          "type": ["integer", "null"],
          "description": "Width of the image or video"
        },
        "height": {
          "type": ["integer", "null"],
          "description": "Height of the image or video"
        },
        "duration": {
          "type": ["number", "null"],
          "description": "Duration of audio or video in seconds"
        },
        "encoding": {
          "type": ["string", "null"],
          "description": "Encoding format"
        },
        "preview": {
          "type": ["string", "null"],
          "description": "Preview text for documents"
        },
        "location": {
          "type": ["object", "null"],
          "properties": {
            "latitude": {
              "type": "number",
              "description": "Latitude coordinate"
            },
            "longitude": {
              "type": "number",
              "description": "Longitude coordinate"
            },
            "name": {
              "type": ["string", "null"],
              "description": "Name of the location"
            },
            "address": {
              "type": ["string", "null"],
              "description": "Address of the location"
            }
          }
        },
        "contact": {
          "type": ["object", "null"],
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the contact"
            },
            "phone": {
              "type": ["string", "null"],
              "description": "Phone number of the contact"
            },
            "email": {
              "type": ["string", "null"],
              "description": "Email of the contact"
            }
          }
        },
        "customProperties": {
          "type": "object",
          "description": "Custom properties for the attachment"
        }
      }
    },
    "uploadStatus": {
      "type": "string",
      "enum": ["pending", "uploading", "completed", "failed"],
      "description": "Status of the attachment upload"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the attachment was created"
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "type": { "enum": ["image", "video"] }
        }
      },
      "then": {
        "properties": {
          "metadata": {
            "required": ["width", "height"]
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "type": { "enum": ["audio", "video"] }
        }
      },
      "then": {
        "properties": {
          "metadata": {
            "required": ["duration"]
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "type": { "enum": ["location"] }
        }
      },
      "then": {
        "properties": {
          "metadata": {
            "required": ["location"]
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "type": { "enum": ["contact"] }
        }
      },
      "then": {
        "properties": {
          "metadata": {
            "required": ["contact"]
          }
        }
      }
    }
  ]
}
```

## Contact Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Contact",
  "type": "object",
  "required": ["id", "userId", "contactId", "relationship", "createdAt", "updatedAt", "isFavorite", "isBlocked", "tags"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9-_]{1,36}$",
      "description": "Unique identifier for the contact relationship"
    },
    "userId": {
      "type": "string",
      "description": "ID of the user who owns this contact"
    },
    "contactId": {
      "type": "string",
      "description": "ID of the user who is the contact"
    },
    "nickname": {
      "type": ["string", "null"],
      "maxLength": 50,
      "description": "Custom nickname for the contact"
    },
    "relationship": {
      "type": "string",
      "enum": ["friend", "colleague", "family", "acquaintance", "other"],
      "description": "Type of relationship with the contact"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the contact was added"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the contact was last updated"
    },
    "isFavorite": {
      "type": "boolean",
      "description": "Whether the contact is marked as favorite"
    },
    "isBlocked": {
      "type": "boolean",
      "description": "Whether the contact is blocked"
    },
    "notes": {
      "type": ["string", "null"],
      "maxLength": 500,
      "description": "Personal notes about the contact"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 30
      },
      "description": "Tags associated with the contact"
    }
  }
}
```

## Validation Strategies

The chat application implements several validation strategies to ensure data integrity:

### Client-Side Validation

1. **Form Validation**: Input forms use validation rules derived from these schemas
2. **Pre-submission Validation**: Data is validated before sending to the server
3. **Real-time Feedback**: Users receive immediate feedback on validation errors

### Server-Side Validation

1. **API Endpoint Validation**: All incoming data is validated against these schemas
2. **Database Constraints**: Database schema enforces additional constraints
3. **Business Logic Validation**: Additional validation based on business rules

### Shared Validation

1. **Shared Validation Library**: Both client and server use the same validation rules
2. **Schema-driven Validation**: Validation rules are generated from these schemas
3. **Custom Validators**: Domain-specific validators supplement schema validation

## Custom Validators

In addition to JSON Schema validation, the application implements custom validators for specific use cases:

### Content Sanitization

```typescript
function sanitizeMessageContent(content: string): string {
  // Remove potentially dangerous HTML/script content
  const sanitized = DOMPurify.sanitize(content);
  
  // Normalize whitespace
  return sanitized.replace(/\s+/g, ' ').trim();
}
```

### Profanity
