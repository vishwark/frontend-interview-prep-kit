export interface ImplementationCategory {
  id: string;
  title: string;
  description: string;
  path: string;
  items: ImplementationItem[];
}

export interface ImplementationItem {
  id: string;
  title: string;
  description?: string;
  path: string;
  requirementPath?: string;
}

export const implementationCategories: ImplementationCategory[] = [
  {
    id: "js-implementations",
    title: "JavaScript Implementations",
    description: "Common JavaScript implementation challenges",
    path: "/implementation/js-implementations",
    items: [
      {
        id: "debounce-throttle",
        title: "Debounce & Throttle",
        path: "/implementation/js-implementations/debounce-throttle",
      },
      {
        id: "flatten-nested-object-array",
        title: "Flatten Nested Object/Array",
        path: "/implementation/js-implementations/flatten-nested-object-array",
      },
      {
        id: "memoize-function",
        title: "Memoize Function",
        path: "/implementation/js-implementations/memoize-function",
      },
      {
        id: "parse-integer-without-builtin",
        title: "Parse Integer Without Built-in",
        path: "/implementation/js-implementations/parse-integer-without-builtin",
      },
      {
        id: "deep-clone-object",
        title: "Deep Clone Object",
        path: "/implementation/js-implementations/deep-clone-object",
      },
      {
        id: "fetch-keys-nested-object",
        title: "Fetch Keys from Nested Object",
        path: "/implementation/js-implementations/fetch-keys-nested-object",
      },
      {
        id: "fetch-with-retries",
        title: "Fetch with Retries",
        path: "/implementation/js-implementations/fetch-with-retries",
      },
      {
        id: "event-emitter-system",
        title: "Event Emitter System",
        path: "/implementation/js-implementations/event-emitter-system",
      },
      {
        id: "curry-function",
        title: "Curry Function",
        path: "/implementation/js-implementations/curry-function",
      },
      {
        id: "design-patterns",
        title: "Design Patterns",
        path: "/implementation/js-implementations/design-patterns",
      },
      {
        id: "virtual-dom-render",
        title: "Virtual DOM Render",
        path: "/implementation/js-implementations/virtual-dom-render",
      },
      {
        id: "memoize-async-function",
        title: "Memoize Async Function",
        path: "/implementation/js-implementations/memoize-async-function",
      },
    ],
  },
  {
    id: "js-polyfill",
    title: "JavaScript Polyfills",
    description: "Implement JavaScript polyfills for built-in methods",
    path: "/implementation/js-polyfill",
    items: [
      {
        id: "promise",
        title: "Promise Polyfills",
        path: "/implementation/js-polyfill/promise",
        description: "Implement Promise methods like all, allSettled, any, race",
      },
      {
        id: "array",
        title: "Array Polyfills",
        path: "/implementation/js-polyfill/array",
        description: "Implement Array methods like map, reduce, filter, flatten, sort",
      },
      {
        id: "function",
        title: "Function Polyfills",
        path: "/implementation/js-polyfill/function",
        description: "Implement Function methods like call, bind, apply",
      },
      {
        id: "utility-func",
        title: "Utility Functions",
        path: "/implementation/js-polyfill/utility-func",
        description: "Implement utility functions like debounce, throttle",
      },
      {
        id: "object",
        title: "Object Polyfills",
        path: "/implementation/js-polyfill/object",
        description: "Implement Object methods like create",
      },
      {
        id: "timeouts",
        title: "Timeout Polyfills",
        path: "/implementation/js-polyfill/timeouts",
        description: "Implement timeout methods like setTimeout, clearTimeout, clearAllTimeouts",
      },
    ],
  },
  {
    id: "react",
    title: "React Implementations",
    description: "Common React implementation challenges",
    path: "/implementation/react",
    items: [
      {
        id: "todo-app",
        title: "Todo App",
        path: "/implementation/react/todo-app",
        requirementPath: "/interview/implementation/3.react/1-todo-app/requirements.js",
      },
      {
        id: "timer-stopwatch",
        title: "Timer/Stopwatch",
        path: "/implementation/react/timer-stopwatch",
        requirementPath: "/interview/implementation/3.react/2-timer-stopwatch/requirements.js",
      },
      {
        id: "product-listing-pagination",
        title: "Product Listing with Pagination",
        path: "/implementation/react/product-listing-pagination",
        requirementPath: "/interview/implementation/3.react/3-product-listing-pagination/requirements.js",
      },
      {
        id: "typeahead-autocomplete",
        title: "Typeahead/Autocomplete",
        path: "/implementation/react/typeahead-autocomplete",
        requirementPath: "/interview/implementation/3.react/4-typeahead-autocomplete/requirements.js",
      },
      {
        id: "chat-application",
        title: "Chat Application",
        path: "/implementation/react/chat-application",
        requirementPath: "/interview/implementation/3.react/5-chat-application/requirements.js",
      },
      {
        id: "file-explorer",
        title: "File Explorer",
        path: "/implementation/react/file-explorer",
        requirementPath: "/interview/implementation/3.react/6-file-explorer/requirements.js",
      },
      {
        id: "reusable-component",
        title: "Reusable Component",
        path: "/implementation/react/reusable-component",
        requirementPath: "/interview/implementation/3.react/7-reusable-component/requirements.js",
      },
      {
        id: "dynamic-form",
        title: "Dynamic Form",
        path: "/implementation/react/dynamic-form",
        requirementPath: "/interview/implementation/3.react/8-dynamic-form/requirements.js",
      },
      {
        id: "ecommerce-filter",
        title: "E-commerce Filter",
        path: "/implementation/react/ecommerce-filter",
        requirementPath: "/interview/implementation/3.react/9-ecommerce-filter/requirements.js",
      },
      {
        id: "infinite-scroll",
        title: "Infinite Scroll",
        path: "/implementation/react/infinite-scroll",
        requirementPath: "/interview/implementation/3.react/10-infinite-scroll/requirements.js",
      },
      {
        id: "custom-hook",
        title: "Custom Hooks",
        path: "/implementation/react/custom-hook",
        requirementPath: "/interview/implementation/3.react/21-custom-hook/requirements.js",
      },
    ],
  },
];
