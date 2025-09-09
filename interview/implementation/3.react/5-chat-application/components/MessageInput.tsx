import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string, type: 'text' | 'image') => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * MessageInput Component
 * 
 * Provides an input field for sending messages with:
 * - Text input with auto-resize
 * - Send button
 * - Image upload button (mock)
 * - Emoji button (mock)
 * - Typing indicator events
 */
const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = 'Type a message...'
}) => {
  // State for the message text
  const [message, setMessage] = useState('');
  
  // Ref for the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // State for tracking typing status
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize the textarea as content changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to the scrollHeight to fit the content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle typing indicator
  useEffect(() => {
    // If the user is typing and hasn't triggered the typing event yet
    if (message && !isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to stop typing indicator after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTypingStop();
      }
    }, 1500);

    // Cleanup function
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTypingStart, onTypingStop]);

  // Handle sending a message
  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage, 'text');
      setMessage('');
      
      // Stop typing indicator
      setIsTyping(false);
      onTypingStop();
      
      // Focus back on the textarea
      textareaRef.current?.focus();
    }
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mock function for image upload
  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    alert('Image upload functionality would be implemented here');
  };

  // Mock function for emoji picker
  const handleEmojiPicker = () => {
    // In a real app, this would open an emoji picker
    alert('Emoji picker would be implemented here');
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-end space-x-2">
        {/* Image upload button */}
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Upload image"
        >
          <Image className="w-5 h-5" />
        </button>
        
        {/* Emoji button */}
        <button
          type="button"
          onClick={handleEmojiPicker}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Insert emoji"
        >
          <Smile className="w-5 h-5" />
        </button>
        
        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-auto"
            aria-label="Message input"
          />
        </div>
        
        {/* Send button */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={disabled || !message.trim()}
          className={`p-2 rounded-full ${
            message.trim() && !disabled
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } focus:outline-none`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
