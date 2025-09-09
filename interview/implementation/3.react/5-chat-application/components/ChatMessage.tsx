import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import UserAvatar from './UserAvatar';

// Define message types
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'image';

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  status: MessageStatus;
  type: MessageType;
  imageUrl?: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

/**
 * ChatMessage Component
 * 
 * Displays a single chat message with:
 * - Text or image content
 * - Sender avatar (optional)
 * - Timestamp
 * - Message status (sent, delivered, read)
 */
const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
  showAvatar = true
}) => {
  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Get status icon based on message status
  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      data-testid="chat-message"
    >
      {/* Avatar for other user's messages */}
      {!isOwnMessage && showAvatar && (
        <div className="mr-2 flex-shrink-0">
          <UserAvatar
            name={message.sender.name}
            image={message.sender.avatar}
            size="sm"
          />
        </div>
      )}

      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* Message content */}
        <div
          className={`rounded-lg px-4 py-2 max-w-xs sm:max-w-md break-words ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {/* Text message */}
          {message.type === 'text' && <p>{message.text}</p>}

          {/* Image message */}
          {message.type === 'image' && (
            <div className="space-y-2">
              {message.text && <p>{message.text}</p>}
              <img
                src={message.imageUrl}
                alt="Shared image"
                className="rounded max-w-full"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Timestamp and status */}
        <div className="flex items-center mt-1 text-xs text-gray-500 space-x-1">
          <span>{formatTime(message.timestamp)}</span>
          {isOwnMessage && (
            <span className="ml-1" aria-label={`Message ${message.status}`}>
              {getStatusIcon(message.status)}
            </span>
          )}
        </div>
      </div>

      {/* Avatar for own messages */}
      {isOwnMessage && showAvatar && (
        <div className="ml-2 flex-shrink-0">
          <UserAvatar
            name={message.sender.name}
            image={message.sender.avatar}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
