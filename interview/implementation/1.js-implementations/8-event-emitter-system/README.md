# Event Emitter System

## Problem Understanding

### Definition

An **Event Emitter** is a design pattern that implements the observer pattern, allowing objects to communicate with each other through custom events. It provides a way to subscribe to events, emit events, and unsubscribe from events, enabling loose coupling between components in an application.

### Methods

#### Basic Event Emitter
- `on(event, listener)`: Subscribe to an event
- `off(event, listener)`: Unsubscribe from an event
- `emit(event, ...args)`: Emit an event with arguments
- `once(event, listener)`: Subscribe to an event for one-time execution
- `removeAllListeners([event])`: Remove all listeners for an event or all events
- `listenerCount(event)`: Get the number of listeners for an event
- `rawListeners(event)`: Get the array of listeners for an event

#### Advanced Event Emitter (extends Basic Event Emitter)
- All methods from Basic Event Emitter
- `onWithPriority(event, listener, priority)`: Subscribe with priority
- `emitAsync(event, ...args)`: Emit an event asynchronously
- `onAny(listener)`: Listen to any event
- `offAny(listener)`: Remove a listener from any event

### Return Value

- Most methods return the emitter instance for method chaining
- `emit()` returns a boolean indicating if the event had listeners
- `emitAsync()` returns a Promise that resolves to a boolean
- `listenerCount()` returns a number
- `rawListeners()` returns an array of functions

### Edge Cases to Handle

1. **Listener Management**:
   - Multiple listeners for the same event
   - Removing listeners during event emission
   - Events with no listeners
   - Proper handling of `this` context in listeners

2. **Error Handling**:
   - Errors thrown by listeners
   - Invalid event names or listeners
   - Memory leaks from forgotten listeners

3. **Special Features**:
   - One-time listeners
   - Priority-based execution
   - Asynchronous event emission
   - Wildcard/pattern-based event listening

4. **Performance Considerations**:
   - Efficient storage and lookup of listeners
   - Minimizing overhead for frequently emitted events
   - Handling large numbers of listeners

### Use Cases

1. **UI Components**:
   - Button click handlers
   - Form submission events
   - Custom component events

2. **Application Architecture**:
   - Communication between modules
   - Implementing pub/sub patterns
   - Decoupling components

3. **Asynchronous Operations**:
   - Progress notifications
   - Completion events
   - Error handling

4. **Node.js Core**:
   - Stream events (data, end, error)
   - HTTP server events (request, connection)
   - Process events (exit, uncaughtException)

### Implementation Approaches

#### Storage Strategies

1. **Map-based Storage**:
   - Use a Map to store event names and their listeners
   - Efficient lookup and good performance
   - Easy to implement and understand

2. **Object-based Storage**:
   - Use a plain object with event names as keys
   - Simple but has limitations with special event names

3. **Hierarchical Storage**:
   - Support for namespaced events (e.g., "parent.child")
   - More complex but offers greater flexibility

#### Execution Strategies

1. **Synchronous Execution**:
   - Call listeners immediately when an event is emitted
   - Simple and predictable

2. **Asynchronous Execution**:
   - Use Promises or setTimeout to defer listener execution
   - Prevents blocking the main thread
   - Allows for better error handling

3. **Priority-based Execution**:
   - Execute listeners in order of priority
   - More complex but offers greater control

### Time and Space Complexity

- **Time Complexity**:
  - Adding/removing listeners: O(1) for basic operations, O(log n) for priority-based
  - Emitting events: O(n) where n is the number of listeners for the event
  - Finding listeners: O(1) with Map-based storage

- **Space Complexity**:
  - O(n) where n is the total number of registered listeners across all events

### Common Interview Questions

1. How would you implement an event emitter that supports namespaced events?
2. How would you handle errors thrown by event listeners?
3. How would you implement a once() method that removes the listener after execution?
4. How would you prevent memory leaks in an event emitter system?
5. How would you implement priority-based event listeners?

### Code Example: Using the Event Emitter

```javascript
// Create a new event emitter
const emitter = new EventEmitter();

// Subscribe to an event
emitter.on('userLoggedIn', (user) => {
  console.log(`User logged in: ${user.name}`);
});

// Subscribe to an event once
emitter.once('appStart', () => {
  console.log('Application started');
});

// Emit events
emitter.emit('appStart'); // Logs: Application started
emitter.emit('appStart'); // Nothing happens (once listener was removed)

emitter.emit('userLoggedIn', { name: 'John', id: 123 }); // Logs: User logged in: John

// Advanced usage with the AdvancedEventEmitter
const advancedEmitter = new AdvancedEventEmitter();

// Listen to any event
advancedEmitter.onAny((eventName, ...args) => {
  console.log(`Event "${eventName}" was emitted with args:`, args);
});

// Subscribe with priority
advancedEmitter.onWithPriority('important', () => {
  console.log('High priority listener');
}, 10);

advancedEmitter.onWithPriority('important', () => {
  console.log('Low priority listener');
}, 1);

// Emit event (high priority listener executes first)
advancedEmitter.emit('important'); 
// Logs:
// High priority listener
// Low priority listener
// Event "important" was emitted with args: []
```

### Comparison with Built-in EventEmitter

Node.js provides a built-in EventEmitter class with similar functionality. The main differences between a custom implementation and the built-in one include:

1. **API Compatibility**: The built-in version has a standardized API that many developers are familiar with
2. **Performance Optimization**: The built-in version is highly optimized for performance
3. **Error Handling**: The built-in version has specific behavior for error events
4. **Maximum Listeners**: The built-in version has a configurable maximum listener count to help detect memory leaks

When implementing a custom EventEmitter, it's important to consider these aspects and decide which features are necessary for your specific use case.
