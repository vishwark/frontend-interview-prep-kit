import React, { useState } from 'react';
import useLocalStorage from '../1.useLocalStorage';
import { 
  Sun, 
  Moon, 
  Monitor, 
  ShoppingCart, 
  Plus, 
  X, 
  Trash2 
} from 'lucide-react';

const LocalStorageExample: React.FC = () => {
  // Example 1: User preferences
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  // Example 2: Form data persistence
  const [formData, setFormData] = useLocalStorage('form-data', {
    name: '',
    email: '',
    message: ''
  });
  
  // Example 3: Shopping cart
  const [cartItems, setCartItems] = useLocalStorage<string[]>('cart-items', []);
  const [newItem, setNewItem] = useState('');
  
  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle adding item to cart
  const handleAddToCart = () => {
    if (newItem.trim()) {
      setCartItems([...cartItems, newItem]);
      setNewItem('');
    }
  };
  
  // Handle removing item from cart
  const handleRemoveFromCart = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };
  
  // Clear all stored data
  const handleClearAll = () => {
    setTheme('light');
    setFormData({ name: '', email: '', message: '' });
    setCartItems([]);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useLocalStorage Hook Examples</h2>
      
      {/* Example 1: User Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Example 1: User Preferences
        </h3>
        <div className="space-y-4">
          <p className="text-gray-600">
            Current theme: <span className="font-medium">{theme}</span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sun size={18} /> Light Theme
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Moon size={18} /> Dark Theme
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                theme === 'system'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Monitor size={18} /> System Theme
            </button>
          </div>
        </div>
      </div>
      
      {/* Example 2: Form Data Persistence */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Example 2: Form Data Persistence
        </h3>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter your name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              placeholder="Enter your message"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Form data is automatically saved to localStorage. Refresh the page to see persistence.
          </p>
        </form>
      </div>
      
      {/* Example 3: Shopping Cart */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Example 3: Shopping Cart
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add item to cart"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-gray-700" />
              <span className="font-medium text-gray-700">Cart Items ({cartItems.length})</span>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-500 italic">Your cart is empty</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {/* Clear All Data */}
      <div className="flex justify-end">
        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <Trash2 size={16} /> Clear All Stored Data
        </button>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useLocalStorage hook implementation
function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}`}
        </pre>
      </div>
    </div>
  );
};

export default LocalStorageExample;
