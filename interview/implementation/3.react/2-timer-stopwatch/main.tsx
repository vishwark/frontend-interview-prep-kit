import React, { useState, useRef, useEffect, useCallback } from 'react';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import LapTimes from './components/LapTimes';

// Define the Lap interface
interface Lap {
  id: number;
  time: number; // Total time in milliseconds
  lapTime: number; // Time since last lap in milliseconds
}

/**
 * TimerStopwatch Component
 * 
 * Main component that:
 * - Manages timer state and logic
 * - Handles accurate time tracking using requestAnimationFrame
 * - Manages lap times and statistics
 * - Renders the TimerDisplay, TimerControls, and LapTimes components
 */
const TimerStopwatch: React.FC = () => {
  // State for the current time in milliseconds
  const [time, setTime] = useState<number>(0);
  
  // State for tracking if the timer is running
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // State for storing lap times
  const [laps, setLaps] = useState<Lap[]>([]);
  
  // Refs for tracking the timer
  const startTimeRef = useRef<number>(0); // When the timer started
  const timeAccumulatedRef = useRef<number>(0); // Time accumulated before the current start
  const animationFrameRef = useRef<number | null>(null); // Reference to the animation frame
  const lastLapTimeRef = useRef<number>(0); // Time of the last lap

  // Function to update the timer
  const updateTimer = useCallback(() => {
    if (!isRunning) return;
    
    // Calculate the current time
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const totalTime = timeAccumulatedRef.current + elapsed;
    
    // Update the time state
    setTime(totalTime);
    
    // Request the next animation frame
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning]);

  // Start the timer
  const handleStart = useCallback(() => {
    if (isRunning) return;
    
    // Record the start time
    startTimeRef.current = performance.now();
    
    // Start the timer
    setIsRunning(true);
    
    // If this is the first start or after a reset, add the initial lap
    if (time === 0 && laps.length === 0) {
      const initialLap: Lap = {
        id: Date.now(),
        time: 0,
        lapTime: 0
      };
      setLaps([initialLap]);
      lastLapTimeRef.current = 0;
    }
  }, [isRunning, time, laps.length]);

  // Pause the timer
  const handlePause = useCallback(() => {
    if (!isRunning) return;
    
    // Cancel the animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Update the accumulated time
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    timeAccumulatedRef.current += elapsed;
    
    // Pause the timer
    setIsRunning(false);
  }, [isRunning]);

  // Reset the timer
  const handleReset = useCallback(() => {
    // Cancel the animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Reset all state and refs
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    startTimeRef.current = 0;
    timeAccumulatedRef.current = 0;
    lastLapTimeRef.current = 0;
  }, []);

  // Record a lap
  const handleLap = useCallback(() => {
    if (!isRunning) return;
    
    // Create a new lap
    const newLap: Lap = {
      id: Date.now(),
      time: time,
      lapTime: time - lastLapTimeRef.current
    };
    
    // Update the last lap time
    lastLapTimeRef.current = time;
    
    // Add the lap to the list
    setLaps(prevLaps => [...prevLaps, newLap]);
  }, [isRunning, time]);

  // Start the timer when isRunning changes to true
  useEffect(() => {
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
    
    // Cleanup function to cancel the animation frame when the component unmounts
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, updateTimer]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Timer/Stopwatch</h1>
      
      {/* Timer display */}
      <TimerDisplay time={time} />
      
      {/* Timer controls */}
      <TimerControls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onLap={handleLap}
      />
      
      {/* Lap times */}
      <LapTimes laps={laps} />
    </div>
  );
};

export default TimerStopwatch;
