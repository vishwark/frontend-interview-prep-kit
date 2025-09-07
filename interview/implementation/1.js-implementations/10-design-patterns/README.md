# Design Patterns

## Problem Understanding

### Definition

**Design patterns** are reusable solutions to common problems in software design. They represent best practices evolved over time by experienced software developers. Design patterns provide a standard terminology and are specific to particular scenarios, making software design more flexible, reusable, and maintainable.

### Categories of Design Patterns

#### Creational Patterns
Focus on object creation mechanisms, trying to create objects in a manner suitable to the situation.

#### Structural Patterns
Deal with object composition, creating relationships between objects to form larger structures.

#### Behavioral Patterns
Concerned with communication between objects, how objects interact and distribute responsibility.

### Implemented Patterns

#### Singleton Pattern (Creational)
- **Definition**: Ensures a class has only one instance and provides a global point of access to it.
- **Use Cases**: Database connections, configuration managers, logger instances.

#### Factory Pattern (Creational)
- **Definition**: Creates objects without exposing the instantiation logic to the client.
- **Use Cases**: Creating different UI elements, supporting multiple product types, abstracting object creation.

#### Observer Pattern (Behavioral)
- **Definition**: Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
- **Use Cases**: Event handling systems, reactive programming, MVC architecture.

#### Decorator Pattern (Structural)
- **Definition**: Attaches additional responsibilities to an object dynamically.
- **Use Cases**: Adding features without modifying structure, combining multiple behaviors, implementing cross-cutting concerns.

#### Strategy Pattern (Behavioral)
- **Definition**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
- **Use Cases**: Different sorting algorithms, various payment methods, multiple validation strategies.

#### Module Pattern (Structural)
- **Definition**: Provides a way of encapsulating related methods and variables into a single unit.
- **Use Cases**: Organizing related functionality, encapsulating private data, creating namespaces.

#### Proxy Pattern (Structural)
- **Definition**: Provides a surrogate or placeholder for another object to control access to it.
- **Use Cases**: Lazy initialization, access control, logging and monitoring, caching.

#### Command Pattern (Behavioral)
- **Definition**: Encapsulates a request as an object, allowing for parameterization of clients with different requests, queuing of requests, and logging of operations.
- **Use Cases**: Undo/redo functionality, transaction processing, remote procedure calls.

### Implementation Considerations

#### When to Use Design Patterns
- When you need a proven solution to a common problem
- When you want to increase code reusability and maintainability
- When you need to communicate design decisions effectively with other developers

#### When Not to Use Design Patterns
- When simpler solutions would suffice
- When they add unnecessary complexity
- When they're used without understanding the underlying problem

#### Common Pitfalls
- Overusing patterns where simpler solutions would work
- Forcing a pattern to fit a problem it doesn't solve
- Not understanding the trade-offs of each pattern

### JavaScript-Specific Considerations

#### Prototypal Inheritance
JavaScript's prototypal inheritance model affects how some patterns are implemented compared to classical OOP languages.

#### Functional Programming
JavaScript's support for first-class functions enables functional programming approaches to some patterns.

#### Module Systems
JavaScript's various module systems (CommonJS, ES Modules) provide native support for the Module pattern.

#### Dynamic Nature
JavaScript's dynamic typing and runtime flexibility allow for more concise implementations of some patterns.

### Code Examples

#### Singleton Pattern
```javascript
const singleton = new Singleton();
singleton.setData('key', 'value');
console.log(singleton.getData('key')); // 'value'

const anotherSingleton = new Singleton();
console.log(anotherSingleton === singleton); // true
```

#### Factory Pattern
```javascript
const factory = new ProductFactory();
const simpleProduct = factory.createProduct('simple');
console.log(simpleProduct.getDescription()); // 'This is a simple product'

const complexProduct = factory.createProduct('complex');
console.log(complexProduct.getDescription()); // 'This is a complex product'
```

#### Observer Pattern
```javascript
const subject = new Subject();
const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.addObserver(observer1);
subject.addObserver(observer2);
subject.notify('Hello observers!');
// Observer 1 received update: Hello observers!
// Observer 2 received update: Hello observers!
```

#### Strategy Pattern
```javascript
const context = new Context(new SortStrategy());
console.log(context.executeStrategy([3, 1, 2])); // [1, 2, 3]

context.setStrategy(new ReverseStrategy());
console.log(context.executeStrategy([3, 1, 2])); // [3, 2, 1]
```

### Comparison of Patterns

| Pattern | Intent | Complexity | Flexibility |
|---------|--------|------------|------------|
| Singleton | Ensure single instance | Low | Low |
| Factory | Abstract object creation | Medium | Medium |
| Observer | Define one-to-many dependencies | Medium | High |
| Decorator | Add responsibilities dynamically | Medium | High |
| Strategy | Encapsulate interchangeable algorithms | Medium | High |
| Module | Encapsulate related functionality | Low | Medium |
| Proxy | Control access to objects | Medium | Medium |
| Command | Encapsulate requests as objects | Medium | High |

### Common Interview Questions

1. What is the difference between the Factory pattern and the Builder pattern?
2. How does the Singleton pattern differ in a multi-threaded environment?
3. Can you explain the difference between the Strategy pattern and the State pattern?
4. How would you implement the Observer pattern in a way that prevents memory leaks?
5. When would you choose the Decorator pattern over inheritance?
6. How does the Module pattern help with encapsulation in JavaScript?
7. What are the trade-offs of using the Proxy pattern?
8. How would you implement an undo mechanism using the Command pattern?

### Anti-Patterns to Avoid

1. **God Object**: Creating objects that know or do too much
2. **Spaghetti Code**: Code with complex and tangled control structure
3. **Golden Hammer**: Using a familiar pattern for every problem
4. **Premature Optimization**: Optimizing before understanding where bottlenecks are
5. **Reinventing the Wheel**: Creating custom solutions for solved problems

### Resources for Further Learning

1. **"Design Patterns: Elements of Reusable Object-Oriented Software"** by the Gang of Four
2. **"Learning JavaScript Design Patterns"** by Addy Osmani
3. **"JavaScript Patterns"** by Stoyan Stefanov
4. **"Refactoring to Patterns"** by Joshua Kerievsky
