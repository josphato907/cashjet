import { useCallback, useRef } from 'react';

const AUDIO_URLS = {
  bet: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  cashout: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
  crash: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3",
  win: "https://assets.mixkit.co/active_storage/sfx/1938/1938-preview.mp3",
  countdown: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  coin: "https://assets.mixkit.co/active_storage/sfx/888/888-preview.mp3"
};

export function useAudio() {
  const audioCache = useRef({});

  const playSound = useCallback((type, volume = 0.5) => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioCache.current[type]) {
        audioCache.current[type] = new Audio(AUDIO_URLS[type]);
      }
      const audio = audioCache.current[type];
      if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Ignore autoplay blocks
        });
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  }, []);

  const playBetSound = useCallback(() => playSound("bet", 0.3), [playSound]);
  const playCashoutSound = useCallback(() => playSound("cashout", 0.4), [playSound]);
  const playCrashSound = useCallback(() => playSound("crash", 0.5), [playSound]);
  const playWinSound = useCallback(() => playSound("win", 0.4), [playSound]);
  const playCountdownSound = useCallback(() => playSound("countdown", 0.2), [playSound]);
  const playCoinSound = useCallback(() => playSound("coin", 0.4), [playSound]);

  return {
    playBetSound,
    playCashoutSound,
    playCrashSound,
    playWinSound,
    playCountdownSound,
    playCoinSound
  };
}
