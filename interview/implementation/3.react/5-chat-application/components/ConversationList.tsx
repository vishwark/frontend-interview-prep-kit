import React from 'react';
import { Search } from 'lucide-react';
import UserAvatar from './UserAvatar';

// Define the conversation type
export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage?: {
    text: string;
    timestamp: Date;
    unread: boolean;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

/**
 * ConversationList Component
 * 
 * Displays a list of conversations/contacts with:
 * - User avatars and online status
 * - Last message preview
 * - Timestamp
 * - Unread message indicator
 * - Search functionality (mock)
 */
const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation
}) => {
  // Format timestamp for last message
  const formatTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // If the message is from today, show the time
    if (messageDate.getTime() === today.getTime()) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    }
    
    // If the message is from this week, show the day name
    const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    }
    
    // Otherwise, show the date
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Conversations</h2>
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          <ul>
            {conversations.map(conversation => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 focus:outline-none ${
                    activeConversationId === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Avatar */}
                  <UserAvatar
                    name={conversation.name}
                    image={conversation.avatar}
                    isOnline={conversation.isOnline}
                    size="md"
                  />
                  
                  {/* Conversation details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    {conversation.lastMessage && (
                      <div className="flex items-center">
                        <p className={`text-sm truncate ${
                          conversation.lastMessage.unread
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-500'
                        }`}>
                          {conversation.lastMessage.text}
                        </p>
                        
                        {/* Unread indicator */}
                        {conversation.lastMessage.unread && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
