# Fetch with Retries

## Problem Understanding

### Definition

**Fetch with retries** is a resilience pattern that automatically retries failed HTTP requests to handle transient failures. This pattern is essential for building robust web applications that can gracefully handle network issues, server overloads, and other temporary problems.

### Parameters

#### Basic Fetch with Retries Function
- `url`: The URL to fetch
- `options` (optional): Fetch options object
- `maxRetries` (optional): Maximum number of retry attempts (default: 3)
- `retryDelay` (optional): Delay between retries in milliseconds (default: 1000)

#### Advanced Fetch with Retries Function
- `url`: The URL to fetch
- `options`: An object with the following properties:
  - `fetchOptions` (optional): Standard fetch options object
  - `maxRetries` (optional): Maximum number of retry attempts (default: 3)
  - `retryDelay` (optional): Initial delay between retries in milliseconds (default: 1000)
  - `retryCondition` (optional): Function that determines if a retry should be attempted
  - `backoffStrategy` (optional): Function that calculates the delay for each retry
  - `onRetry` (optional): Callback function executed before each retry
  - `timeout` (optional): Request timeout in milliseconds

### Return Value

Both functions return a Promise that:
- Resolves with the fetch response if the request succeeds
- Rejects with an error if all retry attempts fail

### Edge Cases to Handle

1. **Network Issues**:
   - Connection failures
   - DNS resolution problems
   - Timeouts

2. **Server Responses**:
   - HTTP error status codes (4xx, 5xx)
   - Malformed responses
   - Rate limiting responses

3. **Retry Logic**:
   - Maximum number of retries
   - Retry delay calculation
   - Conditions for retrying vs. failing immediately

4. **Timeout Handling**:
   - Request timeouts
   - Cancellation of pending requests
   - Cleanup of resources

5. **Error Handling**:
   - Proper error propagation
   - Informative error messages
   - Logging and monitoring

### Use Cases

1. **API Communication**:
   - Making requests to external APIs that may experience downtime
   - Handling rate limiting with automatic retries
   - Ensuring critical API calls eventually succeed

2. **Resource Fetching**:
   - Loading assets in web applications
   - Downloading files with retry capability
   - Fetching configuration data

3. **Background Operations**:
   - Syncing data with servers
   - Uploading user-generated content
   - Processing queue items

4. **Resilient Microservices**:
   - Service-to-service communication
   - Handling service degradation gracefully
   - Implementing circuit breaker patterns

### Implementation Approaches

#### Basic Retry Logic

1. **Simple Retry Loop**:
   - Attempt the fetch
   - If it fails, wait and try again
   - Repeat until success or max retries reached

2. **Exponential Backoff**:
   - Increase the delay between retries exponentially
   - Helps prevent overwhelming the server during issues
   - Formula: `delay * (2 ^ retryAttempt)`

#### Advanced Retry Strategies

1. **Jitter**:
   - Add randomness to retry delays
   - Prevents "thundering herd" problem when many clients retry simultaneously
   - Formula: `baseDelay * (2 ^ retryAttempt) * (0.8 + Math.random() * 0.4)`

2. **Conditional Retries**:
   - Only retry specific error types or status codes
   - Fail immediately for client errors (4xx)
   - Retry for server errors (5xx) or network issues

3. **Timeout Management**:
   - Set timeouts for each request attempt
   - Cancel long-running requests
   - Use AbortController for clean cancellation

### Time and Space Complexity

- **Time Complexity**: O(n) where n is the number of retry attempts
- **Space Complexity**: O(1) as we only store a constant amount of state

### Common Interview Questions

1. How would you implement exponential backoff with jitter in a retry mechanism?
2. What types of errors or status codes would you retry versus fail immediately?
3. How would you handle request timeouts in a fetch with retries implementation?
4. How would you test a fetch with retries implementation?
5. How would you implement a circuit breaker pattern alongside retries?

### Code Example: Using Fetch with Retries

```javascript
// Basic usage
fetchWithRetries('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Failed to fetch:', error));

// Advanced usage with custom options
advancedFetchWithRetries('https://api.example.com/data', {
  fetchOptions: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
  },
  maxRetries: 5,
  retryDelay: 500,
  retryCondition: (error, response) => {
    // Only retry on network errors or 503 Service Unavailable
    return !response || response.status === 503;
  },
  backoffStrategy: (attempt, delay) => {
    // Linear backoff: 500ms, 1000ms, 1500ms, etc.
    return delay * attempt;
  },
  onRetry: (attempt, error, nextDelay) => {
    console.warn(`Retry ${attempt} after ${nextDelay}ms due to: ${error.message}`);
  },
  timeout: 3000 // 3 second timeout per request
})
  .then(response => response.json())
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Failed to fetch:', error));
