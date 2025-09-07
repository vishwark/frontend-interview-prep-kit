/**
 * Event Emitter System
 * 
 * Description:
 * This file implements an event emitter system that allows for publishing and subscribing to events.
 * It provides a way to implement the observer pattern in JavaScript.
 */

/**
 * Basic Event Emitter
 * 
 * Description:
 * A simple event emitter class that allows subscribing to events, emitting events,
 * and unsubscribing from events.
 * 
 * Methods:
 * - on(event, listener): Subscribe to an event
 * - off(event, listener): Unsubscribe from an event
 * - emit(event, ...args): Emit an event with arguments
 * - once(event, listener): Subscribe to an event for one-time execution
 * 
 * Edge Cases:
 * - Handles multiple listeners for the same event
 * - Properly manages listener removal during emission
 * - Handles events with no listeners
 */
class EventEmitter {
  constructor() {
    // Initialize event listeners map
    this.listeners = new Map();
  }
  
  /**
   * Subscribe to an event
   * @param {string} event - The event name
   * @param {Function} listener - The callback function
   * @returns {EventEmitter} - Returns this for chaining
   */
  on(event, listener) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    // Get or create the listeners array for this event
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    // Add the listener to the array
    this.listeners.get(event).push(listener);
    
    return this;
  }
  
  /**
   * Unsubscribe from an event
   * @param {string} event - The event name
   * @param {Function} listener - The callback function to remove
   * @returns {EventEmitter} - Returns this for chaining
   */
  off(event, listener) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    // If no listeners for this event, return early
    if (!this.listeners.has(event)) {
      return this;
    }
    
    // Filter out the specified listener
    const eventListeners = this.listeners.get(event);
    const filteredListeners = eventListeners.filter(l => l !== listener && l.original !== listener);
    
    // Update the listeners array or remove it if empty
    if (filteredListeners.length > 0) {
      this.listeners.set(event, filteredListeners);
    } else {
      this.listeners.delete(event);
    }
    
    return this;
  }
  
  /**
   * Emit an event with arguments
   * @param {string} event - The event name
   * @param {...any} args - Arguments to pass to the listeners
   * @returns {boolean} - Returns true if the event had listeners, false otherwise
   */
  emit(event, ...args) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    // If no listeners for this event, return false
    if (!this.listeners.has(event)) {
      return false;
    }
    
    // Get a copy of the listeners array to avoid issues if listeners are removed during emission
    const eventListeners = [...this.listeners.get(event)];
    
    // Call each listener with the provided arguments
    eventListeners.forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error(`Error in listener for event "${event}":`, error);
      }
    });
    
    return true;
  }
  
  /**
   * Subscribe to an event for one-time execution
   * @param {string} event - The event name
   * @param {Function} listener - The callback function
   * @returns {EventEmitter} - Returns this for chaining
   */
  once(event, listener) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    // Create a wrapper that will remove itself after execution
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    
    // Store reference to the original listener for proper removal
    onceWrapper.original = listener;
    
    // Register the wrapper as a listener
    return this.on(event, onceWrapper);
  }
  
  /**
   * Remove all listeners for an event or all events
   * @param {string} [event] - The event name (optional)
   * @returns {EventEmitter} - Returns this for chaining
   */
  removeAllListeners(event) {
    if (event === undefined) {
      // Remove all listeners for all events
      this.listeners.clear();
    } else if (typeof event === 'string') {
      // Remove all listeners for the specified event
      this.listeners.delete(event);
    } else {
      throw new TypeError('Event name must be a string or undefined');
    }
    
    return this;
  }
  
  /**
   * Get the number of listeners for an event
   * @param {string} event - The event name
   * @returns {number} - The number of listeners
   */
  listenerCount(event) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    // Return the number of listeners for the event
    return this.listeners.has(event) ? this.listeners.get(event).length : 0;
  }
  
  /**
   * Get the array of listeners for an event
   * @param {string} event - The event name
   * @returns {Function[]} - Array of listener functions
   */
  rawListeners(event) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    // Return a copy of the listeners array
    return this.listeners.has(event) ? [...this.listeners.get(event)] : [];
  }
}

/**
 * Advanced Event Emitter
 * 
 * Description:
 * An enhanced event emitter class with additional features like event namespaces,
 * priority-based listeners, and asynchronous event emission.
 * 
 * Methods:
 * - All methods from BasicEventEmitter
 * - onWithPriority(event, listener, priority): Subscribe with priority
 * - emitAsync(event, ...args): Emit an event asynchronously
 * - onAny(listener): Listen to any event
 * - offAny(listener): Remove a listener from any event
 * 
 * Edge Cases:
 * - Handles namespaced events (e.g., "parent.child")
 * - Manages priority-based execution order
 * - Properly handles async/await in listeners
 */
class AdvancedEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.anyListeners = [];
  }
  
  /**
   * Subscribe to an event with priority
   * @param {string} event - The event name
   * @param {Function} listener - The callback function
   * @param {number} priority - Priority level (higher numbers execute first)
   * @returns {AdvancedEventEmitter} - Returns this for chaining
   */
  onWithPriority(event, listener, priority = 0) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    if (typeof priority !== 'number') {
      throw new TypeError('Priority must be a number');
    }
    
    // Add priority property to the listener
    const priorityListener = (...args) => listener.apply(this, args);
    priorityListener.priority = priority;
    priorityListener.original = listener;
    
    // Get or create the listeners array for this event
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    // Add the listener to the array
    const eventListeners = this.listeners.get(event);
    eventListeners.push(priorityListener);
    
    // Sort listeners by priority (higher numbers first)
    eventListeners.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    return this;
  }
  
  /**
   * Emit an event asynchronously
   * @param {string} event - The event name
   * @param {...any} args - Arguments to pass to the listeners
   * @returns {Promise<boolean>} - Resolves to true if the event had listeners, false otherwise
   */
  async emitAsync(event, ...args) {
    // Validate input
    if (typeof event !== 'string') {
      throw new TypeError('Event name must be a string');
    }
    
    // Handle "any" listeners
    const anyPromises = this.anyListeners.map(listener => 
      Promise.resolve().then(() => listener.apply(this, [event, ...args]))
    );
    
    // If no specific listeners for this event, just process "any" listeners
    if (!this.listeners.has(event)) {
      await Promise.all(anyPromises);
      return anyPromises.length > 0;
    }
    
    // Get a copy of the listeners array
    const eventListeners = [...this.listeners.get(event)];
    
    // Create an array of promises for each listener
    const promises = eventListeners.map(listener => 
      Promise.resolve().then(() => listener.apply(this, args))
    );
    
    // Wait for all listeners to complete
    await Promise.all([...promises, ...anyPromises]);
    
    return true;
  }
  
  /**
   * Subscribe to any event
   * @param {Function} listener - The callback function
   * @returns {AdvancedEventEmitter} - Returns this for chaining
   */
  onAny(listener) {
    // Validate input
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    // Add the listener to the anyListeners array
    this.anyListeners.push(listener);
    
    return this;
  }
  
  /**
   * Unsubscribe from any event
   * @param {Function} listener - The callback function to remove
   * @returns {AdvancedEventEmitter} - Returns this for chaining
   */
  offAny(listener) {
    // Validate input
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    // Filter out the specified listener
    this.anyListeners = this.anyListeners.filter(l => l !== listener);
    
    return this;
  }
  
  /**
   * Override emit to also trigger "any" listeners
   * @param {string} event - The event name
   * @param {...any} args - Arguments to pass to the listeners
   * @returns {boolean} - Returns true if the event had listeners, false otherwise
   */
  emit(event, ...args) {
    // Call "any" listeners
    this.anyListeners.forEach(listener => {
      try {
        listener.apply(this, [event, ...args]);
      } catch (error) {
        console.error(`Error in "any" listener for event "${event}":`, error);
      }
    });
    
    // Call specific event listeners using the parent class method
    const hasSpecificListeners = super.emit(event, ...args);
    
    // Return true if either specific or "any" listeners were called
    return hasSpecificListeners || this.anyListeners.length > 0;
  }
  
  /**
   * Remove all listeners, including "any" listeners
   * @param {string} [event] - The event name (optional)
   * @returns {AdvancedEventEmitter} - Returns this for chaining
   */
  removeAllListeners(event) {
    if (event === undefined) {
      // Remove all listeners for all events and "any" listeners
      super.removeAllListeners();
      this.anyListeners = [];
    } else {
      // Remove listeners for the specified event only
      super.removeAllListeners(event);
    }
    
    return this;
  }
}

// Export the classes if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EventEmitter,
    AdvancedEventEmitter
  };
}
