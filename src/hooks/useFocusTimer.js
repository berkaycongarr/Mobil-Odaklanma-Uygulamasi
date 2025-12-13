import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';


const DEFAULT_TIME = 25*60;

export const useFocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  
  const appState = useRef(AppState.currentState);

 
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
     
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/) &&
        isActive
      ) {
        setIsActive(false); 
        setDistractionCount(prev => prev + 1); 
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]); 

  
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(seconds => seconds - 1);
      }, 1000);
    } else if (timeLeft === 0) {
     
      setIsActive(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  
  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
    setDistractionCount(0);
  };

 
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    timeLeft,
    isActive,
    distractionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime
  };
};