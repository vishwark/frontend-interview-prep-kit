/**
 * Higher-Order Component (HOC) for Loader Requirements
 * 
 * Create a Higher-Order Component that shows a loader while data is being fetched:
 * 
 * 1. Implement a withLoader HOC that:
 *    - Wraps a component that requires data fetching
 *    - Shows a loading indicator while data is being loaded
 *    - Passes the fetched data to the wrapped component
 *    - Handles error states and displays error messages
 * 
 * 2. Support for customization:
 *    - Custom loading component/spinner
 *    - Custom error component/message
 *    - Configurable loading delay
 *    - Ability to retry failed requests
 * 
 * 3. Additional features:
 *    - Support for loading states of multiple requests
 *    - Skeleton screens instead of spinners (optional)
 *    - Timeout handling for long-running requests
 * 
 * Technical requirements:
 * - Follow React HOC best practices
 * - Create TypeScript types/interfaces for the HOC
 * - Handle component display name properly
 * - Forward refs and other props correctly
 * - Create example components that demonstrate HOC usage
 * - Document the API and usage patterns
 */
