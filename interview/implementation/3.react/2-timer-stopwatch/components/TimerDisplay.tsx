import React from 'react';

interface TimerDisplayProps {
  time: number; // Time in milliseconds
}

/**
 * TimerDisplay Component
 * 
 * Displays the current time in hours:minutes:seconds:milliseconds format
 * Formats the time value for proper display
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({ time }) => {
  // Format the time into hours, minutes, seconds, and milliseconds
  const formatTime = (timeInMs: number) => {
    // Calculate hours, minutes, seconds, and milliseconds
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10); // Only show 2 digits for ms

    // Format each part to ensure it has 2 digits (or more for hours if needed)
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
  };

  return (
    <div className="text-center">
      <div className="text-6xl font-mono font-bold mb-4">
        {formatTime(time)}
      </div>
      <div className="flex justify-center text-xs text-gray-500">
        <span className="w-16 text-center">HOURS</span>
        <span className="w-16 text-center">MINUTES</span>
        <span className="w-16 text-center">SECONDS</span>
        <span className="w-16 text-center">MS</span>
      </div>
    </div>
  );
};

export default TimerDisplay;
