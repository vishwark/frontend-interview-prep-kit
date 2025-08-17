export interface OutputCategory {
  id: string;
  title: string;
  description: string;
  path: string;
  items: OutputItem[];
}

export interface OutputItem {
  id: string;
  title: string;
  description?: string;
  path: string;
}

export const outputCategories: OutputCategory[] = [
  {
    id: "hosting",
    title: "Hoisting",
    description: "Questions about JavaScript hoisting behavior",
    path: "/output-based/hosting",
    items: [
      {
        id: "var-hoisting",
        title: "Variable Hoisting",
        path: "/output-based/hosting/var-hoisting",
        description: "Predict the output of code involving variable hoisting",
      },
      {
        id: "function-hoisting",
        title: "Function Hoisting",
        path: "/output-based/hosting/function-hoisting",
        description: "Predict the output of code involving function hoisting",
      },
      {
        id: "let-const-hoisting",
        title: "Let & Const Hoisting",
        path: "/output-based/hosting/let-const-hoisting",
        description: "Predict the output of code involving let and const hoisting",
      },
    ],
  },
  {
    id: "promise-set-timeout",
    title: "Promises & setTimeout",
    description: "Questions about JavaScript promises and setTimeout behavior",
    path: "/output-based/promise-set-timeout",
    items: [
      {
        id: "promise-chaining",
        title: "Promise Chaining",
        path: "/output-based/promise-set-timeout/promise-chaining",
        description: "Predict the output of code involving promise chaining",
      },
      {
        id: "promise-all",
        title: "Promise.all",
        path: "/output-based/promise-set-timeout/promise-all",
        description: "Predict the output of code involving Promise.all",
      },
      {
        id: "promise-race",
        title: "Promise.race",
        path: "/output-based/promise-set-timeout/promise-race",
        description: "Predict the output of code involving Promise.race",
      },
      {
        id: "set-timeout-order",
        title: "setTimeout Execution Order",
        path: "/output-based/promise-set-timeout/set-timeout-order",
        description: "Predict the output of code involving setTimeout execution order",
      },
    ],
  },
  {
    id: "set-timeout-or-interval",
    title: "setTimeout & setInterval",
    description: "Questions about JavaScript setTimeout and setInterval behavior",
    path: "/output-based/set-timeout-or-interval",
    items: [
      {
        id: "nested-timeouts",
        title: "Nested Timeouts",
        path: "/output-based/set-timeout-or-interval/nested-timeouts",
        description: "Predict the output of code involving nested timeouts",
      },
      {
        id: "clearing-timeouts",
        title: "Clearing Timeouts",
        path: "/output-based/set-timeout-or-interval/clearing-timeouts",
        description: "Predict the output of code involving clearing timeouts",
      },
      {
        id: "interval-behavior",
        title: "setInterval Behavior",
        path: "/output-based/set-timeout-or-interval/interval-behavior",
        description: "Predict the output of code involving setInterval behavior",
      },
    ],
  },
  {
    id: "this-binding",
    title: "This Binding",
    description: "Questions about JavaScript 'this' binding behavior",
    path: "/output-based/this-binding",
    items: [
      {
        id: "implicit-binding",
        title: "Implicit Binding",
        path: "/output-based/this-binding/implicit-binding",
        description: "Predict the output of code involving implicit 'this' binding",
      },
      {
        id: "explicit-binding",
        title: "Explicit Binding",
        path: "/output-based/this-binding/explicit-binding",
        description: "Predict the output of code involving explicit 'this' binding",
      },
      {
        id: "arrow-functions",
        title: "Arrow Functions",
        path: "/output-based/this-binding/arrow-functions",
        description: "Predict the output of code involving 'this' in arrow functions",
      },
      {
        id: "class-binding",
        title: "Class Methods",
        path: "/output-based/this-binding/class-binding",
        description: "Predict the output of code involving 'this' in class methods",
      },
    ],
  },
  {
    id: "object",
    title: "Objects",
    description: "Questions about JavaScript object behavior",
    path: "/output-based/object",
    items: [
      {
        id: "object-creation",
        title: "Object Creation",
        path: "/output-based/object/object-creation",
        description: "Predict the output of code involving object creation",
      },
      {
        id: "property-access",
        title: "Property Access",
        path: "/output-based/object/property-access",
        description: "Predict the output of code involving object property access",
      },
      {
        id: "prototype-chain",
        title: "Prototype Chain",
        path: "/output-based/object/prototype-chain",
        description: "Predict the output of code involving prototype chain",
      },
    ],
  },
  {
    id: "mixed-concepts",
    title: "Mixed Concepts",
    description: "Questions involving multiple JavaScript concepts",
    path: "/output-based/mixed-concepts",
    items: [
      {
        id: "closures-scope",
        title: "Closures & Scope",
        path: "/output-based/mixed-concepts/closures-scope",
        description: "Predict the output of code involving closures and scope",
      },
      {
        id: "async-await",
        title: "Async/Await",
        path: "/output-based/mixed-concepts/async-await",
        description: "Predict the output of code involving async/await",
      },
      {
        id: "event-loop",
        title: "Event Loop",
        path: "/output-based/mixed-concepts/event-loop",
        description: "Predict the output of code involving the event loop",
      },
      {
        id: "complex-scenarios",
        title: "Complex Scenarios",
        path: "/output-based/mixed-concepts/complex-scenarios",
        description: "Predict the output of complex JavaScript scenarios",
      },
    ],
  },
];
