import React, { useState } from 'react';
import { 
  Loader, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  Database,
  Users,
  FileText,
  BarChart
} from 'lucide-react';

// Define useAsync hook types
interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
  retry?: {
    count: number;
    delay: number;
  };
}

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  success: boolean;
  retryCount: number;
}

interface UseAsyncReturn<T, P extends any[]> {
  execute: (...params: P) => Promise<T>;
  status: UseAsyncState<T>;
  reset: () => void;
  cancel: () => void;
}

// Mock API functions
const mockApis = {
  fetchUser: async (id: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (Math.random() > 0.8) {
      throw new Error('Failed to fetch user');
    }
    return {
      id,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Developer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    };
  },
  
  fetchPosts: async (count: number = 5): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (Math.random() > 0.8) {
      throw new Error('Failed to fetch posts');
    }
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `This is the content of post ${i + 1}`,
      date: new Date(Date.now() - i * 86400000).toISOString()
    }));
  },
  
  fetchAnalytics: async (days: number = 7): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1800));
    if (Math.random() > 0.8) {
      throw new Error('Failed to fetch analytics');
    }
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      visits: Math.floor(Math.random() * 1000),
      conversions: Math.floor(Math.random() * 100),
      revenue: Math.floor(Math.random() * 10000) / 100
    }));
  }
};

// Implement useAsync hook
function useAsync<T, P extends any[]>(
  asyncFunction: (...params: P) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, P> {
  const [status, setStatus] = useState<UseAsyncState<T>>({
    data: null,
    loading: options.immediate === true,
    error: null,
    success: false,
    retryCount: 0
  });
  
  const [controller, setController] = useState<AbortController | null>(null);
  
  const execute = async (...params: P): Promise<T> => {
    // Create a new AbortController for this execution
    const abortController = new AbortController();
    setController(abortController);
    
    // Reset state
    setStatus({
      data: null,
      loading: true,
      error: null,
      success: false,
      retryCount: 0
    });
    
    try {
      // Execute the async function
      const data = await asyncFunction(...params);
      
      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return Promise.reject(new Error('Operation was aborted'));
      }
      
      // Update state with successful result
      setStatus({
        data,
        loading: false,
        error: null,
        success: true,
        retryCount: 0
      });
      
      // Call onSuccess callback if provided
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return Promise.reject(new Error('Operation was aborted'));
      }
      
      // Handle retry logic
      if (options.retry && options.retry.count && status.retryCount < options.retry.count) {
        setStatus(prev => ({
          ...prev,
          retryCount: prev.retryCount + 1
        }));
        
        // Wait for the specified delay
        await new Promise(resolve => setTimeout(resolve, options?.retry?.delay));
        
        // Try again
        return execute(...params);
      }
      
      // Update state with error
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setStatus({
        data: null,
        loading: false,
        error: errorObj,
        success: false,
        retryCount: status.retryCount
      });
      
      // Call onError callback if provided
      if (options.onError) {
        options.onError(errorObj);
      }
      
      return Promise.reject(errorObj);
    }
  };
  
  const reset = () => {
    setStatus({
      data: null,
      loading: false,
      error: null,
      success: false,
      retryCount: 0
    });
  };
  
  const cancel = () => {
    if (controller) {
      controller.abort();
      setStatus(prev => ({
        ...prev,
        loading: false
      }));
    }
  };
  
  // Execute immediately if immediate option is true
  React.useEffect(() => {
    if (options.immediate) {
      // Cast empty array to P to satisfy TypeScript
      execute(...([] as unknown as P));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    execute,
    status,
    reset,
    cancel
  };
}

const AsyncExample: React.FC = () => {
  // Example 1: Basic Async Operation
  const [userId, setUserId] = useState('1');
  const userAsync = useAsync(mockApis.fetchUser);
  
  // Example 2: Automatic Retry
  const [postCount, setPostCount] = useState(5);
  const postsAsync = useAsync(mockApis.fetchPosts, {
    retry: {
      count: 3,
      delay: 1000
    }
  });
  
  // Example 3: Analytics with Loading States
  const [days, setDays] = useState(7);
  const analyticsAsync = useAsync(mockApis.fetchAnalytics);
  
  // Handle user fetch
  const handleFetchUser = () => {
    userAsync.execute(userId);
  };
  
  // Handle posts fetch
  const handleFetchPosts = () => {
    postsAsync.execute(postCount);
  };
  
  // Handle analytics fetch
  const handleFetchAnalytics = () => {
    analyticsAsync.execute(days);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useAsync Hook Examples</h2>
      
      {/* Example 1: Basic Async Operation */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Users size={20} className="text-blue-500" />
          Example 1: Fetch User Data
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User ID:
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetchUser}
                disabled={userAsync.status.loading}
                className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                  userAsync.status.loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {userAsync.status.loading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {userAsync.status.loading ? 'Loading...' : 'Fetch User'}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 min-h-[200px]">
            {userAsync.status.loading ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <Loader size={32} className="text-blue-500 animate-spin mb-2" />
                <p className="text-gray-500">Loading user data...</p>
              </div>
            ) : userAsync.status.error ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-red-500">
                <XCircle size={32} className="mb-2" />
                <p>Error: {userAsync.status.error.message}</p>
                <button
                  onClick={handleFetchUser}
                  className="mt-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : userAsync.status.data ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                  <img
                    src={userAsync.status.data.avatar}
                    alt={userAsync.status.data.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-800">{userAsync.status.data.name}</h4>
                <p className="text-gray-600">{userAsync.status.data.email}</p>
                <p className="text-sm text-gray-500">{userAsync.status.data.role}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                <Users size={32} className="mb-2" />
                <p>No user data fetched yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates basic usage of <code className="bg-blue-100 px-1 rounded">useAsync</code> to 
            fetch user data. The hook manages loading, error, and success states automatically.
          </p>
        </div>
      </div>
      
      {/* Example 2: Automatic Retry */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <FileText size={20} className="text-blue-500" />
          Example 2: Fetch Posts with Automatic Retry
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="postCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Posts:
              </label>
              <input
                type="number"
                id="postCount"
                value={postCount}
                onChange={(e) => setPostCount(parseInt(e.target.value) || 1)}
                min="1"
                max="10"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetchPosts}
                disabled={postsAsync.status.loading}
                className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                  postsAsync.status.loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {postsAsync.status.loading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {postsAsync.status.loading ? 'Loading...' : 'Fetch Posts'}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 min-h-[300px]">
            {postsAsync.status.loading ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <Loader size={32} className="text-blue-500 animate-spin mb-2" />
                <p className="text-gray-500">Loading posts...</p>
                {postsAsync.status.retryCount > 0 && (
                  <div className="mt-2 text-amber-600 flex items-center gap-1">
                    <AlertTriangle size={16} />
                    <span>Retry attempt {postsAsync.status.retryCount}/3</span>
                  </div>
                )}
              </div>
            ) : postsAsync.status.error ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-red-500">
                <XCircle size={32} className="mb-2" />
                <p>Error: {postsAsync.status.error.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Failed after {postsAsync.status.retryCount} retry attempts
                </p>
                <button
                  onClick={handleFetchPosts}
                  className="mt-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : postsAsync.status.data ? (
              <div className="space-y-4">
                {postsAsync.status.data.map(post => (
                  <div key={post.id} className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium text-gray-800">{post.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{post.body}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Posted on {formatDate(post.date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                <FileText size={32} className="mb-2" />
                <p>No posts fetched yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates <code className="bg-blue-100 px-1 rounded">useAsync</code> with automatic retry functionality. 
            If the API call fails, it will automatically retry up to 3 times with a 1-second delay between attempts.
            The API has a 20% chance of failure to demonstrate the retry mechanism.
          </p>
        </div>
      </div>
      
      {/* Example 3: Analytics with Loading States */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <BarChart size={20} className="text-blue-500" />
          Example 3: Analytics Dashboard
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days:
              </label>
              <select
                id="days"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFetchAnalytics}
                disabled={analyticsAsync.status.loading}
                className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                  analyticsAsync.status.loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {analyticsAsync.status.loading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {analyticsAsync.status.loading ? 'Loading...' : 'Fetch Analytics'}
              </button>
              
              {analyticsAsync.status.loading && (
                <button
                  onClick={analyticsAsync.cancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 min-h-[300px]">
            {analyticsAsync.status.loading ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock size={24} className="text-blue-500" />
                  </div>
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading analytics data...</p>
              </div>
            ) : analyticsAsync.status.error ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-red-500">
                <XCircle size={32} className="mb-2" />
                <p>Error: {analyticsAsync.status.error.message}</p>
                <button
                  onClick={handleFetchAnalytics}
                  className="mt-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : analyticsAsync.status.data ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analyticsAsync.status.data.map((day, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.visits.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.conversions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${day.revenue.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-xs text-blue-500 font-medium">Total Visits</p>
                    <p className="text-xl font-bold text-blue-700">
                      {analyticsAsync.status.data.reduce((sum, day) => sum + day.visits, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-xs text-green-500 font-medium">Total Conversions</p>
                    <p className="text-xl font-bold text-green-700">
                      {analyticsAsync.status.data.reduce((sum, day) => sum + day.conversions, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-md">
                    <p className="text-xs text-purple-500 font-medium">Total Revenue</p>
                    <p className="text-xl font-bold text-purple-700">
                      ${analyticsAsync.status.data.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                <BarChart size={32} className="mb-2" />
                <p>No analytics data fetched yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates <code className="bg-blue-100 px-1 rounded">useAsync</code> with cancellation support. 
            You can cancel the request while it's in progress, which is useful for long-running operations or when the user 
            navigates away from the page.
          </p>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useAsync hook implementation
function useAsync(asyncFunction, options = {}) {
  const [status, setStatus] = useState({
    data: null,
    loading: options.immediate === true,
    error: null,
    success: false,
    retryCount: 0
  });
  
  const [controller, setController] = useState(null);
  
  const execute = async (...params) => {
    // Create a new AbortController for this execution
    const abortController = new AbortController();
    setController(abortController);
    
    // Reset state
    setStatus({
      data: null,
      loading: true,
      error: null,
      success: false,
      retryCount: 0
    });
    
    try {
      // Execute the async function
      const data = await asyncFunction(...params);
      
      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return Promise.reject(new Error('Operation was aborted'));
      }
      
      // Update state with successful result
      setStatus({
        data,
        loading: false,
        error: null,
        success: true,
        retryCount: 0
      });
      
      // Call onSuccess callback if provided
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return Promise.reject(new Error('Operation was aborted'));
      }
      
      // Handle retry logic
      if (options.retry && status.retryCount < options.retry.count) {
        setStatus(prev => ({
          ...prev,
          retryCount: prev.retryCount + 1
        }));
        
        // Wait for the specified delay
        await new Promise(resolve => setTimeout(resolve, options.retry.delay));
        
        // Try again
        return execute(...params);
      }
      
      // Update state with error
      setStatus({
        data: null,
        loading: false,
        error,
        success: false,
        retryCount: status.retryCount
      });
      
      // Call onError callback if provided
      if (options.onError) {
        options.onError(error);
      }
      
      return Promise.reject(error);
    }
  };
  
  const reset = () => {
    setStatus({
      data: null,
      loading: false,
      error: null,
      success: false,
      retryCount: 0
    });
  };
  
  const cancel = () => {
    if (controller) {
      controller.abort();
      setStatus(prev => ({
        ...prev,
        loading: false
      }));
    }
  };
  
  // Execute immediately if immediate option is true
  React.useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);
  
  return {
    execute,
    status,
    reset,
    cancel
  };
}`}
        </pre>
      </div>
    </div>
  );
};

export default AsyncExample;
