# Chat Application Error Handling

This document outlines the error handling strategies, error codes, and best practices for the chat application API. Proper error handling is crucial for providing a robust and user-friendly experience.

## Error Handling Philosophy

The chat application follows these principles for error handling:

1. **Consistency**: Errors follow a consistent format across all API endpoints
2. **Clarity**: Error messages are clear, actionable, and user-friendly
3. **Security**: Error responses don't leak sensitive information
4. **Granularity**: Errors provide enough detail for debugging without exposing internals
5. **Localization**: Error messages support translation for international users

## Error Response Formats

### REST API Error Format

All REST API errors follow this JSON structure:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      // Optional additional context about the error
    },
    "requestId": "unique-request-identifier"
  }
}
```

### GraphQL API Error Format

GraphQL errors follow the standard GraphQL error format with extensions:

```json
{
  "errors": [
    {
      "message": "Human-readable error message",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["conversation", "messages"],
      "extensions": {
        "code": "ERROR_CODE",
        "details": {
          // Optional additional context about the error
        },
        "requestId": "unique-request-identifier"
      }
    }
  ],
  "data": {
    // Partial data if available
  }
}
```

### WebSocket Error Format

WebSocket errors are sent as messages with the type "error":

```json
{
  "type": "error",
  "payload": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      // Optional additional context about the error
    },
    "requestId": "unique-request-identifier"
  }
}
```

## HTTP Status Codes

The REST API uses standard HTTP status codes to indicate the result of requests:

### Success Codes

- **200 OK**: The request succeeded
- **201 Created**: A resource was successfully created
- **204 No Content**: The request succeeded but returns no content

### Client Error Codes

- **400 Bad Request**: The request was malformed or invalid
- **401 Unauthorized**: Authentication is required or failed
- **403 Forbidden**: The authenticated user lacks permission
- **404 Not Found**: The requested resource doesn't exist
- **409 Conflict**: The request conflicts with the current state
- **422 Unprocessable Entity**: The request was well-formed but contains semantic errors
- **429 Too Many Requests**: Rate limit exceeded

### Server Error Codes

- **500 Internal Server Error**: An unexpected server error occurred
- **502 Bad Gateway**: An upstream service returned an invalid response
- **503 Service Unavailable**: The service is temporarily unavailable
- **504 Gateway Timeout**: An upstream service timed out

## Error Codes

### Authentication & Authorization Errors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `authentication_required` | Authentication is required to access this resource | 401 |
| `invalid_credentials` | The provided credentials are invalid | 401 |
| `invalid_token` | The authentication token is invalid or expired | 401 |
| `insufficient_permissions` | The user lacks permission to perform this action | 403 |
| `account_locked` | The user account has been locked | 403 |
| `account_disabled` | The user account has been disabled | 403 |

### Resource Errors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `resource_not_found` | The requested resource was not found | 404 |
| `resource_already_exists` | A resource with this identifier already exists | 409 |
| `resource_conflict` | The request conflicts with the current state of the resource | 409 |
| `resource_gone` | The resource previously existed but is no longer available | 410 |

### Validation Errors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `invalid_request` | The request is malformed or invalid | 400 |
| `invalid_parameters` | One or more request parameters are invalid | 400 |
| `missing_required_field` | A required field is missing | 400 |
| `validation_failed` | The request failed validation checks | 422 |
| `payload_too_large` | The request payload exceeds the size limit | 413 |

### Rate Limiting Errors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `rate_limit_exceeded` | The rate limit for this endpoint has been exceeded | 429 |
| `quota_exceeded` | The user's quota for this resource has been exceeded | 429 |

### Messaging Errors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `message_not_delivered` | The message could not be delivered | 422 |
| `conversation_not_found` | The specified conversation does not exist | 404 |
| `user_not_in_conversation` | The user is not a participant in this conversation | 403 |
| `message_too_large` | The message exceeds the maximum allowed size | 413 |
| `attachment_too_large` | The attachment exceeds the maximum allowed size | 413 |
| `invalid_message_format` | The message format is invalid | 400 |

### File Errors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `file_not_found` | The requested file does not exist | 404 |
| `file_too_large` | The file exceeds the maximum allowed size | 413 |
| `invalid_file_type` | The file type is not supported | 415 |
| `file_upload_failed` | The file upload failed | 422 |
| `storage_limit_exceeded` | The user's storage limit has been exceeded | 413 |

### Server Errors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `internal_error` | An unexpected internal error occurred | 500 |
| `service_unavailable` | The service is temporarily unavailable | 503 |
| `database_error` | A database error occurred | 500 |
| `external_service_error` | An error occurred in an external service | 502 |
| `timeout` | The request timed out | 504 |

### WebSocket Errors

| Code | Description | Close Code |
|------|-------------|------------|
| `connection_error` | Error establishing WebSocket connection | 1011 |
| `authentication_failed` | WebSocket authentication failed | 4000 |
| `connection_limit_exceeded` | Too many concurrent connections | 4001 |
| `invalid_message` | Invalid WebSocket message format | 4002 |
| `subscription_error` | Error in subscription handling | 4003 |

## Error Handling Strategies

### Client-Side Error Handling

#### Retry Strategies

The client should implement retry strategies for transient errors:

1. **Network Errors**: Retry with exponential backoff
2. **Rate Limiting (429)**: Retry after the time specified in the `Retry-After` header
3. **Service Unavailable (503)**: Retry with exponential backoff
4. **Gateway Timeout (504)**: Retry with exponential backoff

Example retry implementation:

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 429) {
        // Rate limited - get retry time from header or use default
        const retryAfter = response.headers.get('Retry-After') || 1;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        retries++;
        continue;
      }
      
      if (response.status >= 500) {
        // Server error - retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        retries++;
        continue;
      }
      
      // Client error - don't retry
      const error = await response.json();
      throw new Error(error.error.message || 'Request failed');
    } catch (error) {
      if (retries >= maxRetries - 1) {
        throw error;
      }
      
      // Network error - retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      retries++;
    }
  }
}
```

#### Offline Handling

For offline scenarios, the client should:

1. Queue outgoing messages for later delivery
2. Show appropriate offline indicators
3. Implement sync mechanisms for when connectivity is restored
4. Provide optimistic UI updates where appropriate

#### Error Presentation

Guidelines for presenting errors to users:

1. Use clear, non-technical language
2. Provide actionable steps when possible
3. Distinguish between transient and permanent errors
4. Localize error messages
5. Log detailed errors for debugging but show simplified messages to users

### Server-Side Error Handling

#### Logging

All errors should be logged with:

1. Error code and message
2. Request ID for correlation
3. Timestamp
4. User ID (if authenticated)
5. Request details (sanitized of sensitive data)
6. Stack trace (in development/staging environments)

#### Monitoring and Alerting

1. Set up alerts for unusual error rates
2. Monitor error patterns to identify systemic issues
3. Track error rates by endpoint and error type
4. Implement health checks to detect service degradation

## WebSocket Error Handling

### Connection Errors

1. Implement reconnection logic with exponential backoff
2. Maintain connection state and pending messages
3. Resume subscriptions after reconnection

Example WebSocket reconnection:

```javascript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.reconnectInterval = options.reconnectInterval || 1000;
    this.reconnectAttempts = 0;
    this.connect();
  }
  
  connect() {
    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = (event) => {
      this.reconnectAttempts = 0;
      if (this.onopen) this.onopen(event);
    };
    
    this.socket.onclose = (event) => {
      if (!event.wasClean) {
        this.reconnect();
      }
      if (this.onclose) this.onclose(event);
    };
    
    this.socket.onerror = (event) => {
      if (this.onerror) this.onerror(event);
    };
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'error') {
        this.handleError(data.payload);
      } else if (this.onmessage) {
        this.onmessage(event);
      }
    };
  }
  
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.onreconnectfailed) this.onreconnectfailed();
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      if (this.onreconnecting) this.onreconnecting(this.reconnectAttempts);
      this.connect();
    }, delay);
  }
  
  handleError(error) {
    if (this.onerror) this.onerror(new ErrorEvent('error', { message: error.message }));
    
    // Handle specific error types
    switch (error.code) {
      case 'authentication_failed':
        // Handle authentication errors
        break;
      case 'connection_limit_exceeded':
        // Handle connection limit errors
        break;
      default:
        // Handle other errors
        break;
    }
  }
  
  send(data) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    }
    return false;
  }
  
  close() {
    this.maxReconnectAttempts = 0;
    this.socket.close();
  }
}
```

### Message Delivery Errors

1. Implement message acknowledgment system
2. Track message delivery status
3. Provide retry mechanisms for failed messages

## GraphQL Error Handling

### Error Extensions

GraphQL errors should include extensions for additional context:

```json
{
  "errors": [
    {
      "message": "You do not have permission to access this conversation",
      "extensions": {
        "code": "AUTHORIZATION_ERROR",
        "details": {
          "conversationId": "conv123"
        },
        "requestId": "req-123-456-789"
      }
    }
  ]
}
```

### Partial Results

When possible, return partial results with errors:

```json
{
  "data": {
    "conversations": [
      {
        "id": "conv123",
        "title": "Team Chat"
      },
      null
    ]
  },
  "errors": [
    {
      "message": "Error fetching conversation",
      "path": ["conversations", 1],
      "extensions": {
        "code": "RESOURCE_NOT_FOUND"
      }
    }
  ]
}
```

## Security Considerations

### Error Information Disclosure

1. Never expose stack traces in production
2. Avoid exposing internal identifiers or implementation details
3. Use generic messages for sensitive operations
4. Log detailed errors server-side but return sanitized responses

### Authentication Errors

1. Use consistent response times for authentication to prevent timing attacks
2. Provide generic error messages for authentication failures
3. Implement rate limiting for authentication attempts

## Internationalization

Error messages should support internationalization:

1. Use error codes as translation keys
2. Accept language preferences in requests
3. Return localized error messages based on user preferences

Example:

```javascript
function getLocalizedErrorMessage(errorCode, language = 'en') {
  const errorMessages = {
    'en': {
      'resource_not_found': 'The requested resource was not found',
      'insufficient_permissions': 'You do not have permission to perform this action'
    },
    'es': {
      'resource_not_found': 'No se encontró el recurso solicitado',
      'insufficient_permissions': 'No tienes permiso para realizar esta acción'
    }
  };
  
  return errorMessages[language]?.[errorCode] || errorMessages['en'][errorCode] || 'An error occurred';
}
```

## Conclusion

Effective error handling is essential for providing a robust and user-friendly chat application. By following consistent patterns, providing clear error messages, and implementing appropriate retry strategies, the application can gracefully handle failures and provide a seamless user experience even when things go wrong.
