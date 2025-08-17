export interface TheoryCategory {
  id: string;
  title: string;
  description: string;
  path: string;
  items: TheoryItem[];
}

export interface TheoryItem {
  id: string;
  title: string;
  description?: string;
  path: string;
}

export const theoryCategories: TheoryCategory[] = [
  {
    id: "js",
    title: "JavaScript",
    description: "JavaScript concepts and fundamentals",
    path: "/theory/js",
    items: [
      {
        id: "closures",
        title: "Closures",
        path: "/theory/js/closures",
        description: "Understanding JavaScript closures and their applications",
      },
      {
        id: "prototypes",
        title: "Prototypes & Inheritance",
        path: "/theory/js/prototypes",
        description: "JavaScript's prototype-based inheritance model",
      },
      {
        id: "event-loop",
        title: "Event Loop",
        path: "/theory/js/event-loop",
        description: "How JavaScript's event loop and concurrency model works",
      },
      {
        id: "scope",
        title: "Scope & Hoisting",
        path: "/theory/js/scope",
        description: "Variable scope, hoisting, and the execution context",
      },
      {
        id: "this-keyword",
        title: "The 'this' Keyword",
        path: "/theory/js/this-keyword",
        description: "Understanding the 'this' keyword in different contexts",
      },
    ],
  },
  {
    id: "react",
    title: "React",
    description: "React concepts and best practices",
    path: "/theory/react",
    items: [
      {
        id: "hooks",
        title: "React Hooks",
        path: "/theory/react/hooks",
        description: "Understanding React hooks and their use cases",
      },
      {
        id: "lifecycle",
        title: "Component Lifecycle",
        path: "/theory/react/lifecycle",
        description: "React component lifecycle methods and hooks equivalents",
      },
      {
        id: "state-management",
        title: "State Management",
        path: "/theory/react/state-management",
        description: "Different state management approaches in React",
      },
      {
        id: "rendering",
        title: "Rendering & Re-rendering",
        path: "/theory/react/rendering",
        description: "How React rendering works and optimization techniques",
      },
      {
        id: "context",
        title: "Context API",
        path: "/theory/react/context",
        description: "Using React Context for state management",
      },
    ],
  },
  {
    id: "css",
    title: "CSS",
    description: "CSS concepts and techniques",
    path: "/theory/css",
    items: [
      {
        id: "box-model",
        title: "Box Model",
        path: "/theory/css/box-model",
        description: "Understanding the CSS box model",
      },
      {
        id: "flexbox",
        title: "Flexbox",
        path: "/theory/css/flexbox",
        description: "CSS Flexbox layout system",
      },
      {
        id: "grid",
        title: "CSS Grid",
        path: "/theory/css/grid",
        description: "CSS Grid layout system",
      },
      {
        id: "responsive",
        title: "Responsive Design",
        path: "/theory/css/responsive",
        description: "Techniques for responsive web design",
      },
      {
        id: "animations",
        title: "Animations & Transitions",
        path: "/theory/css/animations",
        description: "CSS animations and transitions",
      },
    ],
  },
  {
    id: "project-level",
    title: "Project Level",
    description: "Project-level concepts and architecture",
    path: "/theory/project-level",
    items: [
      {
        id: "architecture",
        title: "Frontend Architecture",
        path: "/theory/project-level/architecture",
        description: "Frontend architecture patterns and best practices",
      },
      {
        id: "build-tools",
        title: "Build Tools",
        path: "/theory/project-level/build-tools",
        description: "Understanding frontend build tools and bundlers",
      },
      {
        id: "testing",
        title: "Testing Strategies",
        path: "/theory/project-level/testing",
        description: "Frontend testing approaches and tools",
      },
    ],
  },
  {
    id: "performance-optimisation",
    title: "Performance Optimization",
    description: "Techniques for optimizing frontend performance",
    path: "/theory/performance-optimisation",
    items: [
      {
        id: "loading",
        title: "Loading Performance",
        path: "/theory/performance-optimisation/loading",
        description: "Optimizing initial page load performance",
      },
      {
        id: "rendering",
        title: "Rendering Performance",
        path: "/theory/performance-optimisation/rendering",
        description: "Optimizing rendering performance",
      },
      {
        id: "memory",
        title: "Memory Management",
        path: "/theory/performance-optimisation/memory",
        description: "Managing memory usage in JavaScript applications",
      },
    ],
  },
  {
    id: "web-security",
    title: "Web Security",
    description: "Web security concepts and best practices",
    path: "/theory/web-security",
    items: [
      {
        id: "xss",
        title: "Cross-Site Scripting (XSS)",
        path: "/theory/web-security/xss",
        description: "Understanding and preventing XSS attacks",
      },
      {
        id: "csrf",
        title: "Cross-Site Request Forgery (CSRF)",
        path: "/theory/web-security/csrf",
        description: "Understanding and preventing CSRF attacks",
      },
      {
        id: "authentication",
        title: "Authentication & Authorization",
        path: "/theory/web-security/authentication",
        description: "Frontend authentication and authorization patterns",
      },
    ],
  },
  {
    id: "behavioural",
    title: "Behavioral Questions",
    description: "Common behavioral interview questions",
    path: "/theory/behavioural",
    items: [
      {
        id: "teamwork",
        title: "Teamwork & Collaboration",
        path: "/theory/behavioural/teamwork",
        description: "Questions about teamwork and collaboration",
      },
      {
        id: "challenges",
        title: "Challenges & Problem Solving",
        path: "/theory/behavioural/challenges",
        description: "Questions about overcoming challenges",
      },
      {
        id: "leadership",
        title: "Leadership & Initiative",
        path: "/theory/behavioural/leadership",
        description: "Questions about leadership and taking initiative",
      },
    ],
  },
];
