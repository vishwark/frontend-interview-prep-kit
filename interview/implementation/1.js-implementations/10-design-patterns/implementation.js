/**
 * Design Patterns
 * 
 * Description:
 * This file implements common design patterns in JavaScript.
 * Design patterns are reusable solutions to common problems in software design.
 */

/**
 * Singleton Pattern
 * 
 * Description:
 * Ensures a class has only one instance and provides a global point of access to it.
 * 
 * Use Cases:
 * - Database connections
 * - Configuration managers
 * - Logger instances
 */
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    // Initialize the singleton instance
    this.data = {};
    Singleton.instance = this;
  }
  
  // Example method
  setData(key, value) {
    this.data[key] = value;
  }
  
  getData(key) {
    return this.data[key];
  }
}

/**
 * Factory Pattern
 * 
 * Description:
 * Creates objects without exposing the instantiation logic to the client.
 * 
 * Use Cases:
 * - Creating different UI elements
 * - Supporting multiple product types
 * - Abstracting object creation
 */
class ProductFactory {
  createProduct(type) {
    if (type === 'simple') {
      return new SimpleProduct();
    } else if (type === 'complex') {
      return new ComplexProduct();
    } else if (type === 'virtual') {
      return new VirtualProduct();
    } else {
      throw new Error(`Product type ${type} not recognized.`);
    }
  }
}

class SimpleProduct {
  constructor() {
    this.type = 'simple';
  }
  
  getDescription() {
    return 'This is a simple product';
  }
}

class ComplexProduct {
  constructor() {
    this.type = 'complex';
  }
  
  getDescription() {
    return 'This is a complex product';
  }
}

class VirtualProduct {
  constructor() {
    this.type = 'virtual';
  }
  
  getDescription() {
    return 'This is a virtual product';
  }
}

/**
 * Observer Pattern
 * 
 * Description:
 * Defines a one-to-many dependency between objects so that when one object changes state,
 * all its dependents are notified and updated automatically.
 * 
 * Use Cases:
 * - Event handling systems
 * - Reactive programming
 * - MVC architecture (model updates view)
 */
class Subject {
  constructor() {
    this.observers = [];
  }
  
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }
  
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(data) {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  
  update(data) {
    console.log(`${this.name} received update:`, data);
  }
}

/**
 * Decorator Pattern
 * 
 * Description:
 * Attaches additional responsibilities to an object dynamically.
 * Decorators provide a flexible alternative to subclassing for extending functionality.
 * 
 * Use Cases:
 * - Adding features to objects without modifying their structure
 * - Combining multiple behaviors
 * - Implementing cross-cutting concerns
 */
class Component {
  operation() {
    return 'Basic Component';
  }
}

class DecoratorA {
  constructor(component) {
    this.component = component;
  }
  
  operation() {
    return `DecoratorA(${this.component.operation()})`;
  }
}

class DecoratorB {
  constructor(component) {
    this.component = component;
  }
  
  operation() {
    return `DecoratorB(${this.component.operation()})`;
  }
}

/**
 * Strategy Pattern
 * 
 * Description:
 * Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
 * Strategy lets the algorithm vary independently from clients that use it.
 * 
 * Use Cases:
 * - Different sorting algorithms
 * - Various payment methods
 * - Multiple validation strategies
 */
class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  executeStrategy(data) {
    return this.strategy.execute(data);
  }
}

class SortStrategy {
  execute(data) {
    return [...data].sort();
  }
}

class ReverseStrategy {
  execute(data) {
    return [...data].sort().reverse();
  }
}

class RandomStrategy {
  execute(data) {
    return [...data].sort(() => Math.random() - 0.5);
  }
}

/**
 * Module Pattern
 * 
 * Description:
 * Provides a way of encapsulating related methods and variables into a single unit.
 * 
 * Use Cases:
 * - Organizing related functionality
 * - Encapsulating private data
 * - Creating namespaces
 */
const Calculator = (function() {
  // Private variables
  let result = 0;
  
  // Public interface
  return {
    add(x) {
      result += x;
      return this;
    },
    
    subtract(x) {
      result -= x;
      return this;
    },
    
    multiply(x) {
      result *= x;
      return this;
    },
    
    divide(x) {
      if (x === 0) {
        throw new Error('Cannot divide by zero');
      }
      result /= x;
      return this;
    },
    
    getResult() {
      return result;
    },
    
    reset() {
      result = 0;
      return this;
    }
  };
})();

/**
 * Proxy Pattern
 * 
 * Description:
 * Provides a surrogate or placeholder for another object to control access to it.
 * 
 * Use Cases:
 * - Lazy initialization
 * - Access control
 * - Logging and monitoring
 * - Caching
 */
class RealSubject {
  performOperation() {
    console.log('RealSubject: Performing operation...');
    // Expensive operation
    return 'Operation result';
  }
}

class Proxy {
  constructor() {
    this.realSubject = null;
    this.cache = null;
  }
  
  performOperation() {
    // Lazy initialization
    if (!this.realSubject) {
      console.log('Proxy: Creating real subject...');
      this.realSubject = new RealSubject();
    }
    
    // Caching
    if (!this.cache) {
      console.log('Proxy: Caching result...');
      this.cache = this.realSubject.performOperation();
    } else {
      console.log('Proxy: Returning cached result...');
    }
    
    return this.cache;
  }
}

/**
 * Command Pattern
 * 
 * Description:
 * Encapsulates a request as an object, allowing for parameterization of clients with
 * different requests, queuing of requests, and logging of the operations.
 * 
 * Use Cases:
 * - Undo/redo functionality
 * - Transaction processing
 * - Remote procedure calls
 */
class Receiver {
  action() {
    return 'Receiver: Action performed';
  }
}

class Command {
  constructor(receiver) {
    this.receiver = receiver;
  }
  
  execute() {
    throw new Error('Execute method must be implemented');
  }
}

class ConcreteCommand extends Command {
  execute() {
    return this.receiver.action();
  }
}

class Invoker {
  constructor() {
    this.commands = [];
  }
  
  addCommand(command) {
    this.commands.push(command);
  }
  
  executeCommands() {
    return this.commands.map(command => command.execute());
  }
}

// Export the patterns if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Singleton,
    ProductFactory,
    SimpleProduct,
    ComplexProduct,
    VirtualProduct,
    Subject,
    Observer,
    Component,
    DecoratorA,
    DecoratorB,
    Context,
    SortStrategy,
    ReverseStrategy,
    RandomStrategy,
    Calculator,
    RealSubject,
    Proxy,
    Receiver,
    Command,
    ConcreteCommand,
    Invoker
  };
}
