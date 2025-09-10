import React, { useState } from 'react';
import useFetch from '../4.useFetch';
import { 
  Search, 
  RefreshCw, 
  XCircle, 
  Clock, 
  ShoppingCart, 
  AlertCircle 
} from 'lucide-react';

// Define types for the useFetch hook return value
interface UseFetchResult<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
  cancel: () => void;
  retryCount: number;
}

const FetchExample: React.FC = () => {
  // Example 1: Basic data fetching with loading/error states
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const { 
    data: postData, 
    loading: postLoading, 
    error: postError,
    refetch: refetchPost
  } = useFetch(url) as UseFetchResult;
  
  // Example 2: Fetch with automatic retries
  const [retryCount, setRetryCount] = useState(3);
  const { 
    data: retryData, 
    loading: retryLoading, 
    error: retryError,
    retryCount: currentRetries
  } = useFetch('https://jsonplaceholder.typicode.com/posts/2', {
    retries: retryCount,
    retryDelay: 1000
  }) as UseFetchResult;
  
  // Example 3: Cancellable requests
  const [shouldFetch, setShouldFetch] = useState(false);
  const { 
    data: cancellableData, 
    loading: cancellableLoading, 
    error: cancellableError,
    cancel: cancelRequest,
    refetch: startRequest
  } = useFetch('https://jsonplaceholder.typicode.com/posts/3', {
    immediate: shouldFetch
  }) as UseFetchResult;
  
  // Example 4: Polling for real-time updates
  const [isPollActive, setIsPollActive] = useState(false);
  const [pollInterval, setPollInterval] = useState(5000);
  const [pollCount, setPollCount] = useState(0);
  
  const { 
    data: pollData, 
    loading: pollLoading, 
    refetch: pollRefetch
  } = useFetch('https://jsonplaceholder.typicode.com/posts/4', {
    onSuccess: () => {
      if (isPollActive) {
        setPollCount(prev => prev + 1);
        setTimeout(pollRefetch, pollInterval);
      }
    }
  }) as UseFetchResult;
  
  // Start or stop polling
  const togglePolling = () => {
    if (!isPollActive) {
      setIsPollActive(true);
      pollRefetch();
    } else {
      setIsPollActive(false);
    }
  };
  
  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  // Format JSON for display
  const formatJSON = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useFetch Hook Examples</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Search size={20} className="text-blue-500" />
          Example 1: Basic Data Fetching
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                API URL:
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="Enter API URL"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => refetchPost()}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <RefreshCw size={16} /> Fetch Data
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 min-h-[200px]">
            {postLoading ? (
              <div className="flex items-center justify-center h-full text-blue-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : postError ? (
              <div className="flex items-center text-red-500">
                <AlertCircle size={18} className="mr-2" />
                <p>Error: {postError.message}</p>
              </div>
            ) : postData ? (
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">{formatJSON(postData)}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                No data fetched yet
              </div>
            )}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mt-4">
          <p className="text-sm text-blue-800">
            Basic data fetching with <code className="bg-blue-100 px-1 rounded">useFetch</code> provides loading and error states, 
            making it easy to handle different phases of the request lifecycle.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <RefreshCw size={20} className="text-blue-500" />
          Example 2: Automatic Retries
        </h3>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div>
              <label htmlFor="retries" className="block text-sm font-medium text-gray-700 mb-1">
                Number of retries:
              </label>
              <input
                type="number"
                id="retries"
                value={retryCount}
                onChange={(e) => setRetryCount(parseInt(e.target.value))}
                min="0"
                max="5"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="bg-blue-50 px-3 py-2 rounded-md">
              <p className="text-sm text-blue-800">Current retry attempt: <span className="font-medium">{currentRetries}</span></p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 min-h-[200px]">
            {retryLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-blue-500">
                <svg className="animate-spin mb-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Loading... (Will retry up to {retryCount} times if it fails)</p>
              </div>
            ) : retryError ? (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <div className="flex items-center text-red-600 mb-2">
                  <AlertCircle size={18} className="mr-2" />
                  <p className="font-medium">Error: {retryError.message}</p>
                </div>
                <p className="text-red-500">Failed after {currentRetries} retry attempts</p>
              </div>
            ) : retryData ? (
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">{formatJSON(retryData)}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                No data fetched yet
              </div>
            )}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mt-4">
          <p className="text-sm text-blue-800">
            The retry functionality in <code className="bg-blue-100 px-1 rounded">useFetch</code> automatically attempts to recover from 
            network failures, improving reliability for unstable connections.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <XCircle size={20} className="text-blue-500" />
          Example 3: Cancellable Requests
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setShouldFetch(true);
                startRequest();
              }}
              disabled={cancellableLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                cancellableLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <RefreshCw size={16} className={cancellableLoading ? 'animate-spin' : ''} />
              Start Request
            </button>
            <button 
              onClick={() => {
                cancelRequest();
                setShouldFetch(false);
              }}
              disabled={!cancellableLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                !cancellableLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <XCircle size={16} />
              Cancel Request
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 min-h-[200px]">
            {cancellableLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-blue-500">
                  <svg className="animate-spin mb-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Loading... (Click "Cancel Request" to abort)</p>
                </div>
              </div>
            ) : cancellableError ? (
              <div className="flex items-center text-red-500">
                <AlertCircle size={18} className="mr-2" />
                <p>Error: {cancellableError.message}</p>
              </div>
            ) : cancellableData ? (
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">{formatJSON(cancellableData)}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                {shouldFetch ? 'Request was cancelled' : 'No request started yet'}
              </div>
            )}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mt-4">
          <p className="text-sm text-blue-800">
            Cancellable requests with <code className="bg-blue-100 px-1 rounded">useFetch</code> allow you to abort in-flight network 
            requests when a component unmounts or when the user navigates away, preventing memory leaks.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Clock size={20} className="text-blue-500" />
          Example 4: Polling for Real-time Updates
        </h3>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div>
              <label htmlFor="pollInterval" className="block text-sm font-medium text-gray-700 mb-1">
                Poll interval (ms):
              </label>
              <input
                type="number"
                id="pollInterval"
                value={pollInterval}
                onChange={(e) => setPollInterval(parseInt(e.target.value))}
                min="1000"
                step="1000"
                disabled={isPollActive}
                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            <button 
              onClick={togglePolling}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isPollActive 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Clock size={16} className={isPollActive ? 'animate-pulse' : ''} />
              {isPollActive ? 'Stop Polling' : 'Start Polling'}
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Poll count: {pollCount}
              </div>
              {isPollActive && (
                <div className="flex items-center text-green-600 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active
                </div>
              )}
            </div>
            
            {pollLoading ? (
              <div className="flex items-center text-blue-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching update...
              </div>
            ) : pollData ? (
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">{formatJSON(pollData)}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                No data fetched yet
              </div>
            )}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mt-4">
          <p className="text-sm text-blue-800">
            Polling with <code className="bg-blue-100 px-1 rounded">useFetch</code> enables real-time data updates by periodically 
            refetching data, useful for dashboards, chat applications, or any feature requiring 
            fresh data.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// Example usage
const { 
  data, 
  loading, 
  error, 
  refetch, 
  cancel 
} = useFetch('https://api.example.com/data', {
  retries: 3,
  retryDelay: 1000,
  onSuccess: (data) => console.log('Success!', data),
  onError: (error) => console.error('Error!', error)
});

// Hook implementation (simplified)
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
    
    return () => {
      // Cleanup logic here
    };
  }, [url]);
  
  return { data, loading, error, refetch: fetchData };
}`}
        </pre>
      </div>
      
    </div>
  );
};

export default FetchExample;
