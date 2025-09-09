import React, { useState, useEffect, useRef } from 'react';
import ConversationList, { Conversation } from './components/ConversationList';
import ChatMessage, { Message, MessageStatus, MessageType } from './components/ChatMessage';
import MessageInput from './components/MessageInput';
import UserAvatar from './components/UserAvatar';
import { MessageCircle } from 'lucide-react';

// Mock user data
const currentUser = {
  id: 'user-1',
  name: 'You',
  avatar: 'https://i.pravatar.cc/150?img=12'
};

// Mock conversations data
const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
    lastMessage: {
      text: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unread: false
    }
  },
  {
    id: 'conv-2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: false,
    lastMessage: {
      text: 'Can you send me the report?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      unread: true
    }
  },
  {
    id: 'conv-3',
    name: 'Team Chat',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isOnline: true,
    lastMessage: {
      text: 'Meeting at 3pm tomorrow',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      unread: false
    }
  },
  {
    id: 'conv-4',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isOnline: true,
    lastMessage: {
      text: 'Thanks for your help!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unread: false
    }
  },
  {
    id: 'conv-5',
    name: 'Bob Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: false,
    lastMessage: {
      text: 'Let me know when you are free',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      unread: false
    }
  }
];

// Mock messages data
const initialMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      text: 'Hey there!',
      sender: { id: 'conv-1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-2',
      text: 'Hi! How are you?',
      sender: { id: 'user-1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=12' },
      timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-3',
      text: 'I\'m doing well, thanks for asking!',
      sender: { id: 'conv-1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      timestamp: new Date(Date.now() - 1000 * 60 * 6), // 6 minutes ago
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-4',
      text: 'Hey, how are you doing?',
      sender: { id: 'conv-1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      status: 'read',
      type: 'text'
    }
  ],
  'conv-2': [
    {
      id: 'msg-5',
      text: 'Hello, do you have a minute?',
      sender: { id: 'conv-2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      timestamp: new Date(Date.now() - 1000 * 60 * 65), // 1 hour and 5 minutes ago
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-6',
      text: 'Sure, what\'s up?',
      sender: { id: 'user-1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=12' },
      timestamp: new Date(Date.now() - 1000 * 60 * 63), // 1 hour and 3 minutes ago
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-7',
      text: 'Can you send me the report?',
      sender: { id: 'conv-2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      status: 'delivered',
      type: 'text'
    }
  ]
};

/**
 * ChatApplication Component
 * 
 * Main component that:
 * - Displays the conversation list and chat interface
 * - Manages conversations and messages state
 * - Simulates real-time messaging
 * - Handles typing indicators
 */
const ChatApplication: React.FC = () => {
  // State for conversations
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  
  // State for active conversation
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');
  
  // State for messages
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  
  // State for typing indicators
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  
  // Ref for message container to auto-scroll
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, activeConversationId]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    // Mark unread messages as read
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId && conv.lastMessage?.unread
          ? {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                unread: false
              }
            }
          : conv
      )
    );
  };

  // Get the active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  
  // Get messages for the active conversation
  const activeMessages = activeConversationId && messages[activeConversationId] ? 
    messages[activeConversationId] : [];

  // Handle sending a message
  const handleSendMessage = (text: string, type: MessageType) => {
    if (!activeConversationId) return;
    
    // Create a new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      timestamp: new Date(),
      status: 'sent',
      type
    };
    
    // Add the message to the conversation
    setMessages(prevMessages => ({
      ...prevMessages,
      [activeConversationId]: [...(prevMessages[activeConversationId] || []), newMessage]
    }));
    
    // Update the conversation's last message
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              lastMessage: {
                text,
                timestamp: new Date(),
                unread: false
              }
            }
          : conv
      )
    );
    
    // Simulate message status updates
    simulateMessageStatusUpdates(newMessage.id, activeConversationId);
    
    // Simulate reply after a delay
    simulateReply(activeConversationId);
  };

  // Simulate message status updates (sent -> delivered -> read)
  const simulateMessageStatusUpdates = (messageId: string, conversationId: string) => {
    // Update to 'delivered' after 1 second
    setTimeout(() => {
      setMessages(prevMessages => ({
        ...prevMessages,
        [conversationId]: prevMessages[conversationId].map(msg =>
          msg.id === messageId ? { ...msg, status: 'delivered' as MessageStatus } : msg
        )
      }));
      
      // Update to 'read' after 2 more seconds
      setTimeout(() => {
        setMessages(prevMessages => ({
          ...prevMessages,
          [conversationId]: prevMessages[conversationId].map(msg =>
            msg.id === messageId ? { ...msg, status: 'read' as MessageStatus } : msg
          )
        }));
      }, 2000);
    }, 1000);
  };

  // Simulate a reply from the other user
  const simulateReply = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;
    
    // Show typing indicator after 1 second
    setTimeout(() => {
      setTypingUsers(prev => ({ ...prev, [conversationId]: true }));
      
      // Hide typing indicator and send reply after 3 more seconds
      setTimeout(() => {
        setTypingUsers(prev => ({ ...prev, [conversationId]: false }));
        
        // Create a reply message
        const replyMessage: Message = {
          id: `msg-${Date.now()}`,
          text: getRandomReply(),
          sender: {
            id: conversation.id,
            name: conversation.name,
            avatar: conversation.avatar
          },
          timestamp: new Date(),
          status: 'read',
          type: 'text'
        };
        
        // Add the reply to the conversation
        setMessages(prevMessages => ({
          ...prevMessages,
          [conversationId]: [...(prevMessages[conversationId] || []), replyMessage]
        }));
        
        // Update the conversation's last message
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: {
                    text: replyMessage.text,
                    timestamp: new Date(),
                    unread: activeConversationId !== conversationId // Mark as unread if not the active conversation
                  }
                }
              : conv
          )
        );
      }, 3000);
    }, 1000);
  };

  // Get a random reply message
  const getRandomReply = () => {
    const replies = [
      "That sounds great!",
      "I'll get back to you on that.",
      "Thanks for letting me know.",
      "Can we discuss this later?",
      "I appreciate your help!",
      "Let me check and get back to you.",
      "Interesting, tell me more.",
      "I agree with you.",
      "That's a good point.",
      "I'll be there soon."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // Handle typing start
  const handleTypingStart = () => {
    // In a real app, this would send a typing indicator to the server
    console.log('Typing started');
  };

  // Handle typing stop
  const handleTypingStop = () => {
    // In a real app, this would send a typing stop indicator to the server
    console.log('Typing stopped');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with conversations */}
      <div className="w-full md:w-80 bg-white">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      
      {/* Chat area */}
      <div className="hidden md:flex flex-col flex-1">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white">
              <UserAvatar
                name={activeConversation.name}
                image={activeConversation.avatar}
                isOnline={activeConversation.isOnline}
              />
              <div className="ml-3">
                <h2 className="font-semibold">{activeConversation.name}</h2>
                <p className="text-sm text-gray-500">
                  {activeConversation.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            {/* Messages */}
            <div
              ref={messageContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50"
            >
              {activeMessages.map(message => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender.id === currentUser.id}
                  showAvatar={true}
                />
              ))}
              
              {/* Typing indicator */}
              {activeConversationId && typingUsers[activeConversationId] && (
                <div className="flex items-center mb-4">
                  <UserAvatar
                    name={activeConversation.name}
                    image={activeConversation.avatar}
                    size="sm"
                  />
                  <div className="ml-2 bg-gray-200 rounded-lg px-4 py-2 inline-flex items-center">
                    <span className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
      
      {/* Mobile view - show only conversation list or chat */}
      <div className="flex flex-col flex-1 md:hidden">
        {!activeConversationId ? (
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
          />
        ) : activeConversation ? (
          <>
            {/* Chat header with back button */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white">
              <button
                onClick={() => setActiveConversationId(null)}
                className="mr-2 text-gray-500"
                aria-label="Back to conversations"
              >
                &larr;
              </button>
              <UserAvatar
                name={activeConversation.name}
                image={activeConversation.avatar}
                isOnline={activeConversation.isOnline}
              />
              <div className="ml-3">
                <h2 className="font-semibold">{activeConversation.name}</h2>
                <p className="text-sm text-gray-500">
                  {activeConversation.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            {/* Messages */}
            <div
              ref={messageContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50"
            >
              {activeMessages.map(message => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender.id === currentUser.id}
                  showAvatar={true}
                />
              ))}
              
              {/* Typing indicator */}
              {activeConversationId && typingUsers[activeConversationId] && (
                <div className="flex items-center mb-4">
                  <UserAvatar
                    name={activeConversation.name}
                    image={activeConversation.avatar}
                    size="sm"
                  />
                  <div className="ml-2 bg-gray-200 rounded-lg px-4 py-2 inline-flex items-center">
                    <span className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Conversation not found</p>
          </div>
        )}
      </div>
      
      {/* CSS for typing indicator animation */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #606060;
          margin: 0 2px;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ChatApplication;
