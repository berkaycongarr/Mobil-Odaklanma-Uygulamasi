import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

// Varsayılan süre: 25 dakika (Saniye cinsinden)
const DEFAULT_TIME = 25*60;

export const useFocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  
  // AppState takibi için referans (closure sorununu aşmak için)
  const appState = useRef(AppState.currentState);

  // 1. DİKKAT DAĞINIKLIĞI TAKİBİ (APP STATE)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Eğer uygulama arka plana atıldıysa ve sayaç çalışıyorsa
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/) &&
        isActive
      ) {
        setIsActive(false); // Sayacı otomatik duraklat
        setDistractionCount(prev => prev + 1); // Dikkat dağınıklığını artır
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]); // isActive değiştiğinde listener güncellenmeli

  // 2. ZAMANLAYICI MANTIĞI (TIMER)
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(seconds => seconds - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Süre bittiğinde yapılacaklar
      setIsActive(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Yardımcı Fonksiyonlar
  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
    setDistractionCount(0);
  };

  // Süreyi MM:SS formatına çeviren yardımcı fonksiyon
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