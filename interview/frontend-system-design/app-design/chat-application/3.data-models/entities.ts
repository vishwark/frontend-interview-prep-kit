/**
 * Chat Application Data Models
 * 
 * This file contains TypeScript interfaces for all entities in the chat application.
 * These interfaces define the structure of the data used throughout the application.
 */

/**
 * User entity representing a user of the application
 */
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  lastSeen?: string;
  isActive: boolean;
  preferences: UserPreferences;
  role: UserRole;
  devices: Device[];
}

/**
 * User preferences for application settings
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  language: string;
  timezone: string;
  messageTextSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  autoDownloadMedia: boolean;
}

/**
 * Notification preferences for a user
 */
export interface NotificationPreferences {
  newMessage: boolean;
  groupMentions: boolean;
  directMentions: boolean;
  newConversation: boolean;
  messageReactions: boolean;
  soundEnabled: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
}

/**
 * Privacy preferences for a user
 */
export interface PrivacyPreferences {
  showReadReceipts: boolean;
  showLastSeen: boolean;
  showTypingIndicator: boolean;
  allowSearchByEmail: boolean;
  allowSearchByPhone: boolean;
}

/**
 * User role for permission management
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

/**
 * Device information for a user's connected device
 */
export interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'web';
  platform: string;
  lastActive: string;
  pushToken?: string;
}

/**
 * User presence status
 */
export interface Presence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  lastActivity?: string;
  customStatus?: string;
}

/**
 * Contact relationship between users
 */
export interface Contact {
  id: string;
  userId: string;
  contactId: string;
  nickname?: string;
  relationship: ContactRelationship;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isBlocked: boolean;
  notes?: string;
  tags: string[];
}

/**
 * Type of relationship between contacts
 */
export enum ContactRelationship {
  FRIEND = 'friend',
  COLLEAGUE = 'colleague',
  FAMILY = 'family',
  ACQUAINTANCE = 'acquaintance',
  OTHER = 'other'
}

/**
 * Conversation entity representing a chat conversation
 */
export interface Conversation {
  id: string;
  type: ConversationType;
  title?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  createdBy: string;
  participants: ConversationParticipant[];
  metadata: ConversationMetadata;
  isEncrypted: boolean;
  isArchived: boolean;
  isPinned: boolean;
  avatar?: string;
}

/**
 * Type of conversation
 */
export enum ConversationType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
  CHANNEL = 'channel'
}

/**
 * Participant in a conversation
 */
export interface ConversationParticipant {
  userId: string;
  role: ParticipantRole;
  joinedAt: string;
  lastReadMessageId?: string;
  lastReadAt?: string;
  isAdmin: boolean;
  isMuted: boolean;
  mutedUntil?: string;
}

/**
 * Role of a participant in a conversation
 */
export enum ParticipantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest'
}

/**
 * Additional metadata for a conversation
 */
export interface ConversationMetadata {
  description?: string;
  customProperties: Record<string, any>;
  theme?: string;
  groupSettings?: GroupConversationSettings;
}

/**
 * Settings specific to group conversations
 */
export interface GroupConversationSettings {
  allowMembersToInvite: boolean;
  allowMembersToChangeInfo: boolean;
  allowMembersToSendMedia: boolean;
  onlyAdminsCanSendMessages: boolean;
  joinApprovalRequired: boolean;
  slowMode?: {
    enabled: boolean;
    delay: number; // in seconds
  };
}

/**
 * Message entity representing a single message in a conversation
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  contentType: MessageContentType;
  createdAt: string;
  updatedAt: string;
  status: MessageStatus;
  attachments: Attachment[];
  reactions: MessageReaction[];
  replyToMessageId?: string;
  forwardedFrom?: {
    messageId: string;
    conversationId: string;
    senderName: string;
  };
  readBy: MessageReadReceipt[];
  deliveredTo: MessageDeliveryReceipt[];
  mentions: MessageMention[];
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  clientId?: string; // Temporary ID for optimistic updates
  metadata: Record<string, any>;
}

/**
 * Type of message content
 */
export enum MessageContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  LOCATION = 'location',
  CONTACT = 'contact',
  SYSTEM = 'system',
  CUSTOM = 'custom'
}

/**
 * Status of a message
 */
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

/**
 * Reaction to a message
 */
export interface MessageReaction {
  userId: string;
  type: string; // emoji code
  createdAt: string;
}

/**
 * Read receipt for a message
 */
export interface MessageReadReceipt {
  userId: string;
  timestamp: string;
}

/**
 * Delivery receipt for a message
 */
export interface MessageDeliveryReceipt {
  userId: string;
  timestamp: string;
}

/**
 * Mention of a user in a message
 */
export interface MessageMention {
  userId: string;
  index: number;
  length: number;
}

/**
 * Attachment entity representing a file attached to a message
 */
export interface Attachment {
  id: string;
  messageId: string;
  type: AttachmentType;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  metadata: AttachmentMetadata;
  uploadStatus: UploadStatus;
  createdAt: string;
}

/**
 * Type of attachment
 */
export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  LOCATION = 'location',
  CONTACT = 'contact',
  OTHER = 'other'
}

/**
 * Metadata for an attachment
 */
export interface AttachmentMetadata {
  width?: number;
  height?: number;
  duration?: number;
  encoding?: string;
  preview?: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  contact?: {
    name: string;
    phone?: string;
    email?: string;
  };
  customProperties: Record<string, any>;
}

/**
 * Status of an attachment upload
 */
export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Draft message being composed by a user
 */
export interface DraftMessage {
  conversationId: string;
  content: string;
  attachments: DraftAttachment[];
  replyToMessageId?: string;
  mentions: MessageMention[];
  lastUpdated: string;
}

/**
 * Draft attachment being prepared for upload
 */
export interface DraftAttachment {
  id: string;
  file: File;
  previewUrl?: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

/**
 * Typing indicator for a conversation
 */
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  timestamp: string;
}

/**
 * Notification for a user
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

/**
 * Type of notification
 */
export enum NotificationType {
  NEW_MESSAGE = 'new_message',
  MENTION = 'mention',
  REACTION = 'reaction',
  NEW_CONVERSATION = 'new_conversation',
  INVITATION = 'invitation',
  SYSTEM = 'system'
}

/**
 * Client state for offline support and sync
 */
export interface ClientState {
  lastSyncTimestamp: string;
  pendingMessages: Message[];
  pendingReactions: MessageReaction[];
  pendingReadReceipts: MessageReadReceipt[];
  offlineActions: OfflineAction[];
}

/**
 * Action performed while offline
 */
export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retryCount: number;
}

/**
 * Search query and results
 */
export interface SearchQuery {
  query: string;
  filters: {
    conversationId?: string;
    senderId?: string;
    hasAttachment?: boolean;
    startDate?: string;
    endDate?: string;
    contentTypes?: MessageContentType[];
  };
  sort: 'relevance' | 'newest' | 'oldest';
}

/**
 * Search result item
 */
export interface SearchResult {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  contentType: MessageContentType;
  timestamp: string;
  matchedText: string;
  contextBefore: string;
  contextAfter: string;
}

/**
 * User authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

/**
 * Error response from the API
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  requestId?: string;
}
