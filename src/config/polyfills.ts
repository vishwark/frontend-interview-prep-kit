export interface PolyfillSubItem {
  id: string
  title: string
  path: string
  filePath: string
}

export interface PolyfillItem {
  id: string
  title: string
  description?: string
  path: string
  items: PolyfillSubItem[]
}

export interface PolyfillCategory {
  id: string
  title: string
  description?: string
  path: string
  items: PolyfillItem[]
}

export const polyfillCategories: PolyfillCategory[] = [
  {
    id: "js-polyfill",
    title: "JavaScript Polyfills",
    description: "Implement JavaScript polyfills for built-in methods",
    path: "/polyfills",
    items: [
      {
        id: "promise",
        title: "Promise Polyfills",
        description: "Implement Promise methods like all, allSettled, any, race",
        path: "/polyfills/promise/promise-all",
        items: [
          {
            id: "promise-all",
            title: "Promise.all",
            path: "/polyfills/promise/promise-all",
            filePath: "/interview/implementation/2.js-polyfill/1.promise/1.promise-all.js"
          },
          {
            id: "promise-all-settled",
            title: "Promise.allSettled",
            path: "/polyfills/promise/promise-all-settled",
            filePath: "/interview/implementation/2.js-polyfill/1.promise/2.promise-all-settled.js"
          },
          {
            id: "promise-any",
            title: "Promise.any",
            path: "/polyfills/promise/promise-any",
            filePath: "/interview/implementation/2.js-polyfill/1.promise/3.promise-any.js"
          },
          {
            id: "promise-race",
            title: "Promise.race",
            path: "/polyfills/promise/promise-race",
            filePath: "/interview/implementation/2.js-polyfill/1.promise/4.promise-race.js"
          }
        ]
      },
      {
        id: "array",
        title: "Array Polyfills",
        description: "Implement Array methods like map, reduce, filter, flatten, sort",
        path: "/polyfills/array/map",
        items: [
          {
            id: "map",
            title: "Array.prototype.map",
            path: "/polyfills/array/map",
            filePath: "/interview/implementation/2.js-polyfill/2.array/1.map.js"
          },
          {
            id: "reduce",
            title: "Array.prototype.reduce",
            path: "/polyfills/array/reduce",
            filePath: "/interview/implementation/2.js-polyfill/2.array/2.reduce.js"
          },
          {
            id: "filter",
            title: "Array.prototype.filter",
            path: "/polyfills/array/filter",
            filePath: "/interview/implementation/2.js-polyfill/2.array/3.filter.js"
          },
          {
            id: "flatten",
            title: "Array.prototype.flat",
            path: "/polyfills/array/flatten",
            filePath: "/interview/implementation/2.js-polyfill/2.array/4.flatten.js"
          },
          {
            id: "sort",
            title: "Array.prototype.sort",
            path: "/polyfills/array/sort",
            filePath: "/interview/implementation/2.js-polyfill/2.array/5.sort.js"
          }
        ]
      },
      {
        id: "function",
        title: "Function Polyfills",
        description: "Implement Function methods like call, bind, apply",
        path: "/polyfills/function/call",
        items: [
          {
            id: "call",
            title: "Function.prototype.call",
            path: "/polyfills/function/call",
            filePath: "/interview/implementation/2.js-polyfill/3.function/1.call.js"
          },
          {
            id: "bind",
            title: "Function.prototype.bind",
            path: "/polyfills/function/bind",
            filePath: "/interview/implementation/2.js-polyfill/3.function/2.bind.js"
          },
          {
            id: "apply",
            title: "Function.prototype.apply",
            path: "/polyfills/function/apply",
            filePath: "/interview/implementation/2.js-polyfill/3.function/3.apply.js"
          }
        ]
      },
      {
        id: "utility-func",
        title: "Utility Functions",
        description: "Implement utility functions like debounce, throttle",
        path: "/polyfills/utility-func/debounce",
        items: [
          {
            id: "debounce",
            title: "Debounce",
            path: "/polyfills/utility-func/debounce",
            filePath: "/interview/implementation/2.js-polyfill/4.utility-func/1.debounce.js"
          },
          {
            id: "throttle",
            title: "Throttle",
            path: "/polyfills/utility-func/throttle",
            filePath: "/interview/implementation/2.js-polyfill/4.utility-func/2.throttle.js"
          }
        ]
      },
      {
        id: "object",
        title: "Object Polyfills",
        description: "Implement Object methods like create",
        path: "/polyfills/object/create",
        items: [
          {
            id: "create",
            title: "Object.create",
            path: "/polyfills/object/create",
            filePath: "/interview/implementation/2.js-polyfill/5.object/1.object-create.js"
          }
        ]
      },
      {
        id: "timeouts",
        title: "Timeout Polyfills",
        description: "Implement timeout methods like setTimeout, clearTimeout, clearAllTimeouts",
        path: "/polyfills/timeouts/set-timeout",
        items: [
          {
            id: "set-timeout",
            title: "setTimeout",
            path: "/polyfills/timeouts/set-timeout",
            filePath: "/interview/implementation/2.js-polyfill/6.timeouts/1.set-timeout.js"
          },
          {
            id: "clear-timeout",
            title: "clearTimeout",
            path: "/polyfills/timeouts/clear-timeout",
            filePath: "/interview/implementation/2.js-polyfill/6.timeouts/2.clear-timeout.js"
          },
          {
            id: "clear-all-timeouts",
            title: "clearAllTimeouts",
            path: "/polyfills/timeouts/clear-all-timeouts",
            filePath: "/interview/implementation/2.js-polyfill/6.timeouts/3.clear-all-timeouts.js"
          }
        ]
      }
    ]
  }
];
