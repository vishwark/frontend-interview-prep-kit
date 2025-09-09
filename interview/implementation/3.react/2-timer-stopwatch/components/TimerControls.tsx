import React from 'react';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
}

/**
 * TimerControls Component
 * 
 * Provides UI controls for:
 * - Starting the timer
 * - Pausing the timer
 * - Recording lap times
 * - Resetting the timer
 */
const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onLap
}) => {
  return (
    <div className="flex justify-center space-x-4 my-6">
      {/* Start/Pause button */}
      {isRunning ? (
        <button
          onClick={onPause}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onStart}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Start
        </button>
      )}

      {/* Lap button - only enabled when timer is running */}
      <button
        onClick={onLap}
        disabled={!isRunning}
        className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isRunning
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Lap
      </button>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Reset
      </button>
    </div>
  );
};

export default TimerControls;
