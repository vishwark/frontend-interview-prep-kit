export interface SystemDesignCategory {
  id: string;
  title: string;
  description: string;
  path: string;
  items: SystemDesignItem[];
}

export interface SystemDesignItem {
  id: string;
  title: string;
  description?: string;
  path: string;
}

export const systemDesignCategories: SystemDesignCategory[] = [
  {
    id: "scalability",
    title: "Scalability",
    description: "Scalability concepts for frontend applications",
    path: "/frontend-system-design/scalability",
    items: [
      {
        id: "best-practices",
        title: "Best Practices",
        path: "/frontend-system-design/scalability/best-practices",
        description: "Best practices for building scalable frontend applications",
      },
      {
        id: "code-splitting",
        title: "Code Splitting",
        path: "/frontend-system-design/scalability/code-splitting",
        description: "Techniques for code splitting in frontend applications",
      },
      {
        id: "lazy-loading",
        title: "Lazy Loading",
        path: "/frontend-system-design/scalability/lazy-loading",
        description: "Implementing lazy loading in frontend applications",
      },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    description: "Performance optimization for frontend applications",
    path: "/frontend-system-design/performance",
    items: [
      {
        id: "rendering-optimization",
        title: "Rendering Optimization",
        path: "/frontend-system-design/performance/rendering-optimization",
        description: "Techniques for optimizing rendering performance",
      },
      {
        id: "network-optimization",
        title: "Network Optimization",
        path: "/frontend-system-design/performance/network-optimization",
        description: "Techniques for optimizing network requests",
      },
      {
        id: "asset-optimization",
        title: "Asset Optimization",
        path: "/frontend-system-design/performance/asset-optimization",
        description: "Techniques for optimizing assets like images, fonts, etc.",
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Architecture patterns for frontend applications",
    path: "/frontend-system-design/architecture",
    items: [
      {
        id: "component-design",
        title: "Component Design",
        path: "/frontend-system-design/architecture/component-design",
        description: "Designing reusable and maintainable components",
      },
      {
        id: "state-management",
        title: "State Management",
        path: "/frontend-system-design/architecture/state-management",
        description: "Different approaches to state management",
      },
      {
        id: "data-fetching",
        title: "Data Fetching",
        path: "/frontend-system-design/architecture/data-fetching",
        description: "Strategies for data fetching in frontend applications",
      },
    ],
  },
  {
    id: "case-studies",
    title: "Case Studies",
    description: "Real-world frontend system design case studies",
    path: "/frontend-system-design/case-studies",
    items: [
      {
        id: "chat-application",
        title: "Chat Application",
        path: "/frontend-system-design/case-studies/chat-application",
        description: "Designing a scalable chat application",
      },
      {
        id: "e-commerce",
        title: "E-commerce Platform",
        path: "/frontend-system-design/case-studies/e-commerce",
        description: "Designing a scalable e-commerce platform",
      },
      {
        id: "social-media",
        title: "Social Media Feed",
        path: "/frontend-system-design/case-studies/social-media",
        description: "Designing a scalable social media feed",
      },
    ],
  },
];
