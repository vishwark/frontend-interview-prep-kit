import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  HelpCircle, 
  X, 
  ChevronDown,
  MousePointer,
  MessageSquare,
  Info
} from 'lucide-react';

// Define useClickOutside hook types
interface UseClickOutsideOptions {
  enabled?: boolean;
  excludeRefs?: React.RefObject<HTMLElement>[];
  onClickOutside: (event: MouseEvent | TouchEvent) => void;
}

// Implement useClickOutside hook
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  options: UseClickOutsideOptions
): void {
  const { enabled = true, excludeRefs = [], onClickOutside } = options;
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if the click was outside the ref element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Check if the click was inside any of the excluded elements
        const isInsideExcluded = excludeRefs.some(
          excludeRef => excludeRef.current && excludeRef.current.contains(event.target as Node)
        );
        
        if (!isInsideExcluded) {
          onClickOutside(event);
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, excludeRefs, onClickOutside, enabled]);
}

const ClickOutsideExample: React.FC = () => {
  // Example 1: Dropdown Menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  
  // Example 2: Modal Dialog
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Example 3: Multiple Popups
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Example 4: Tooltip
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipTriggerRef = useRef<HTMLButtonElement>(null);
  
  // Use the useClickOutside hook for dropdown
  useClickOutside(dropdownRef, {
    excludeRefs: [dropdownButtonRef],
    onClickOutside: () => setDropdownOpen(false)
  });
  
  // Use the useClickOutside hook for modal
  useClickOutside(modalRef, {
    onClickOutside: () => setModalOpen(false)
  });
  
  // Use the useClickOutside hook for notifications
  useClickOutside(notificationsRef, {
    excludeRefs: [notificationsButtonRef],
    onClickOutside: () => setNotificationsOpen(false)
  });
  
  // Use the useClickOutside hook for settings
  useClickOutside(settingsRef, {
    excludeRefs: [settingsButtonRef],
    onClickOutside: () => setSettingsOpen(false)
  });
  
  // Use the useClickOutside hook for user menu
  useClickOutside(userMenuRef, {
    excludeRefs: [userMenuButtonRef],
    onClickOutside: () => setUserMenuOpen(false)
  });
  
  // Use the useClickOutside hook for tooltip
  useClickOutside(tooltipRef, {
    excludeRefs: [tooltipTriggerRef],
    onClickOutside: () => setTooltipVisible(false)
  });
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  // Toggle modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  
  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setSettingsOpen(false);
    setUserMenuOpen(false);
  };
  
  // Toggle settings
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
  };
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
    setSettingsOpen(false);
  };
  
  // Toggle tooltip
  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };
  
  // Sample notifications
  const notifications = [
    { id: 1, text: 'New message from John', time: '5 min ago' },
    { id: 2, text: 'Meeting reminder: Team standup', time: '1 hour ago' },
    { id: 3, text: 'Your report is ready', time: 'Yesterday' }
  ];
  
  // Sample settings
  const settings = [
    { id: 1, name: 'Notifications', enabled: true },
    { id: 2, name: 'Dark Mode', enabled: false },
    { id: 3, name: 'Auto-save', enabled: true }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useClickOutside Hook Examples</h2>
      
      {/* Example 1: Dropdown Menu */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Menu size={20} className="text-blue-500" />
          Example 1: Dropdown Menu
        </h3>
        
        <div className="relative inline-block">
          <button
            ref={dropdownButtonRef}
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Menu size={16} />
            <span>Menu</span>
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
            >
              <div className="py-1">
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  <User size={16} className="mr-3 text-gray-400 group-hover:text-blue-500" />
                  Profile
                </a>
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  <Settings size={16} className="mr-3 text-gray-400 group-hover:text-blue-500" />
                  Settings
                </a>
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  <HelpCircle size={16} className="mr-3 text-gray-400 group-hover:text-blue-500" />
                  Help
                </a>
              </div>
              <div className="py-1">
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={16} className="mr-3 text-red-400 group-hover:text-red-500" />
                  Sign out
                </a>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates a dropdown menu that closes when clicking outside. The <code className="bg-blue-100 px-1 rounded">useClickOutside</code> hook 
            detects clicks outside the dropdown and closes it automatically. The button that toggles the dropdown is excluded from triggering the outside click.
          </p>
        </div>
      </div>
      
      {/* Example 2: Modal Dialog */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-500" />
          Example 2: Modal Dialog
        </h3>
        
        <div>
          <button
            onClick={toggleModal}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            Open Modal
          </button>
          
          {modalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                
                <div
                  ref={modalRef}
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Info size={24} className="text-blue-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Modal Title
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            This is a modal dialog that uses the useClickOutside hook. Click outside the modal to close it.
                            Notice how clicking inside the modal doesn't close it, but clicking anywhere outside will trigger
                            the onClickOutside callback.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates a modal dialog that closes when clicking outside. The <code className="bg-blue-100 px-1 rounded">useClickOutside</code> hook 
            detects clicks outside the modal content and closes it automatically. This pattern is common in modern web applications to provide a more intuitive user experience.
          </p>
        </div>
      </div>
      
      {/* Example 3: Multiple Popups */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <MousePointer size={20} className="text-blue-500" />
          Example 3: Multiple Popups
        </h3>
        
        <div className="flex justify-end space-x-2">
          {/* Notifications */}
          <div className="relative">
            <button
              ref={notificationsButtonRef}
              onClick={toggleNotifications}
              className={`p-2 rounded-full ${
                notificationsOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bell size={20} />
            </button>
            
            {notificationsOpen && (
              <div
                ref={notificationsRef}
                className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                      <span className="text-xs text-blue-500">Mark all as read</span>
                    </button>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Bell size={14} className="text-blue-500" />
                          </div>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm text-gray-800">{notification.text}</p>
                          <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <a href="#" className="block text-center text-sm text-blue-500 hover:text-blue-600">
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Settings */}
          <div className="relative">
            <button
              ref={settingsButtonRef}
              onClick={toggleSettings}
              className={`p-2 rounded-full ${
                settingsOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings size={20} />
            </button>
            
            {settingsOpen && (
              <div
                ref={settingsRef}
                className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="p-3 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">Settings</h3>
                </div>
                <div className="p-2">
                  {settings.map(setting => (
                    <div key={setting.id} className="px-3 py-2 flex items-center justify-between">
                      <span className="text-sm text-gray-700">{setting.name}</span>
                      <button
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          setting.enabled ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            setting.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button
              ref={userMenuButtonRef}
              onClick={toggleUserMenu}
              className={`p-2 rounded-full ${
                userMenuOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User size={20} />
            </button>
            
            {userMenuOpen && (
              <div
                ref={userMenuRef}
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Support
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates multiple popups that close when clicking outside. Each popup uses its own instance of the <code className="bg-blue-100 px-1 rounded">useClickOutside</code> hook. 
            When one popup is opened, the others are automatically closed. This pattern is common in navigation bars and dashboards.
          </p>
        </div>
      </div>
      
      {/* Example 4: Tooltip */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Info size={20} className="text-blue-500" />
          Example 4: Tooltip
        </h3>
        
        <div className="flex items-center justify-center py-8">
          <div className="relative inline-block">
            <button
              ref={tooltipTriggerRef}
              onClick={toggleTooltip}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Hover or Click Me
            </button>
            
            {tooltipVisible && (
              <div
                ref={tooltipRef}
                className="absolute z-10 w-64 px-4 py-2 mt-2 -translate-x-1/2 left-1/2 bg-gray-800 text-white text-sm rounded-lg shadow-lg"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800"></div>
                This is a tooltip that uses the useClickOutside hook. Click anywhere outside to close it.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This example demonstrates a tooltip that closes when clicking outside. The <code className="bg-blue-100 px-1 rounded">useClickOutside</code> hook 
            detects clicks outside the tooltip and closes it automatically. This pattern is useful for informational tooltips that can be dismissed by clicking elsewhere.
          </p>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useClickOutside hook implementation
function useClickOutside(ref, options) {
  const { enabled = true, excludeRefs = [], onClickOutside } = options;
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleClickOutside = (event) => {
      // Check if the click was outside the ref element
      if (ref.current && !ref.current.contains(event.target)) {
        // Check if the click was inside any of the excluded elements
        const isInsideExcluded = excludeRefs.some(
          excludeRef => excludeRef.current && excludeRef.current.contains(event.target)
        );
        
        if (!isInsideExcluded) {
          onClickOutside(event);
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, excludeRefs, onClickOutside, enabled]);
}`}
        </pre>
      </div>
    </div>
  );
};

export default ClickOutsideExample;
