import React from 'react';

interface UserAvatarProps {
  name: string;
  image?: string;
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * UserAvatar Component
 * 
 * Displays a user's avatar with online status indicator
 * Falls back to initials if no image is provided
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  image,
  isOnline = false,
  size = 'md',
  className = ''
}) => {
  // Get user initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  // Determine status indicator position and size
  const statusClasses = {
    sm: 'w-2 h-2 right-0 bottom-0',
    md: 'w-2.5 h-2.5 right-0 bottom-0',
    lg: 'w-3 h-3 right-0 bottom-0'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar */}
      {image ? (
        <img
          src={image}
          alt={`${name}'s avatar`}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-blue-500 text-white flex items-center justify-center font-medium`}
          aria-label={`${name}'s avatar`}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Online status indicator */}
      <span
        className={`absolute ${statusClasses[size]} rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
        aria-hidden="true"
      ></span>
      
      {/* Screen reader text for online status */}
      <span className="sr-only">{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
};

export default UserAvatar;
