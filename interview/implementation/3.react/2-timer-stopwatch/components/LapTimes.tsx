import React, { useMemo } from 'react';

interface Lap {
  id: number;
  time: number; // Total time in milliseconds
  lapTime: number; // Time since last lap in milliseconds
}

interface LapTimesProps {
  laps: Lap[];
}

/**
 * LapTimes Component
 * 
 * Displays:
 * - List of recorded lap times
 * - Statistics (fastest lap, slowest lap, average lap time)
 */
const LapTimes: React.FC<LapTimesProps> = ({ laps }) => {
  // Calculate lap statistics
  const lapStats = useMemo(() => {
    if (laps.length <= 1) {
      return { fastest: null, slowest: null, average: null };
    }

    // Get lap times (excluding the first lap which is just the start)
    const lapTimes = laps.slice(1).map(lap => lap.lapTime);
    
    // Calculate fastest, slowest, and average lap times
    const fastest = Math.min(...lapTimes);
    const slowest = Math.max(...lapTimes);
    const average = lapTimes.reduce((sum, time) => sum + time, 0) / lapTimes.length;

    return { fastest, slowest, average };
  }, [laps]);

  // Format time in milliseconds to a readable format
  const formatTime = (timeInMs: number) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
  };

  // If there are no laps, display a message
  if (laps.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No laps recorded yet. Press the Lap button while the timer is running to record a lap.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Lap Times</h2>
      
      {/* Lap statistics */}
      {lapStats.fastest !== null && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-green-100 p-3 rounded">
            <div className="text-sm text-green-700 font-semibold">Fastest Lap</div>
            <div className="font-mono">{formatTime(lapStats.fastest)}</div>
          </div>
          <div className="bg-red-100 p-3 rounded">
            <div className="text-sm text-red-700 font-semibold">Slowest Lap</div>
            <div className="font-mono">{formatTime(lapStats.slowest)}</div>
          </div>
          <div className="bg-blue-100 p-3 rounded">
            <div className="text-sm text-blue-700 font-semibold">Average Lap</div>
            <div className="font-mono">{formatTime(lapStats.average)}</div>
          </div>
        </div>
      )}
      
      {/* Lap list */}
      <div className="border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Lap</th>
              <th className="py-2 px-4 text-left">Lap Time</th>
              <th className="py-2 px-4 text-left">Total Time</th>
            </tr>
          </thead>
          <tbody>
            {laps.map((lap, index) => {
              // Determine if this lap is the fastest or slowest
              const isFirstLap = index === 0;
              const isFastest = !isFirstLap && lapStats.fastest === lap.lapTime;
              const isSlowest = !isFirstLap && lapStats.slowest === lap.lapTime;
              
              // Set row color based on lap performance
              let rowClass = '';
              if (isFastest) rowClass = 'bg-green-50';
              if (isSlowest) rowClass = 'bg-red-50';

              return (
                <tr key={lap.id} className={rowClass}>
                  <td className="py-2 px-4 border-t">
                    {isFirstLap ? 'Start' : `Lap ${index}`}
                  </td>
                  <td className="py-2 px-4 border-t font-mono">
                    {isFirstLap ? '-' : formatTime(lap.lapTime)}
                    {isFastest && <span className="ml-2 text-green-600 text-xs">Fastest</span>}
                    {isSlowest && <span className="ml-2 text-red-600 text-xs">Slowest</span>}
                  </td>
                  <td className="py-2 px-4 border-t font-mono">
                    {formatTime(lap.time)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LapTimes;
