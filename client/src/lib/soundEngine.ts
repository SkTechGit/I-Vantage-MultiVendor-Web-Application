/**
 * i-VANTAGE Technologies - Haptic Vibration Engine
 *
 * Implements mobile Web Vibration API haptics for an executive,
 * tactile, and responsive UX across all interactions.
 * All sound synthesis permanently removed as per user preference.
 */

export type HapticPattern = 'warp' | 'tap' | 'select' | 'advance' | 'back' | 'celebrate' | 'error' | 'menu' | 'toggle' | 'pop';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  warp: [18, 32, 40, 32, 65],
  tap: [12],
  select: [18],
  advance: [12, 22, 14],
  back: [22],
  celebrate: [35, 45, 35, 45, 75],
  error: [25, 45, 25],
  menu: [14, 25, 18],
  toggle: [15],
  pop: [8, 16],
};

const STORAGE_KEY = 'ivantage_sound_muted';

class SoundEngine {
  private isMuted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        this.isMuted = stored === 'true';
      } catch {
        this.isMuted = false;
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, String(muted));
      } catch {}
    }
    this.listeners.forEach((listener) => listener(muted));
  }

  public toggleMute(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    return next;
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Mobile Web Vibration Haptic Trigger
   */
  public triggerHaptic(pattern: HapticPattern | number[]) {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    try {
      if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        const vibrationData = typeof pattern === 'string' ? HAPTIC_PATTERNS[pattern] : pattern;
        navigator.vibrate(vibrationData);
      }
    } catch {
      // Gracefully ignore on unsupported devices
    }
  }

  /**
   * Signature Warp Transition (Haptic vibration only)
   */
  public playZoom() {
    this.triggerHaptic('warp');
  }

  /**
   * Tactile Micro-Click (Haptic vibration only)
   */
  public playClick() {
    this.triggerHaptic('tap');
  }

  /**
   * Option Selection Pop (Haptic vibration only)
   */
  public playToggle() {
    this.triggerHaptic('select');
  }

  /**
   * Question Advance (Haptic vibration only)
   */
  public playAdvance() {
    this.triggerHaptic('advance');
  }

  /**
   * Navigation Back (Haptic vibration only)
   */
  public playBack() {
    this.triggerHaptic('back');
  }

  /**
   * Celebration on Score Reveal (Haptic vibration only)
   */
  public playCelebration() {
    this.triggerHaptic('celebrate');
  }

  /**
   * Hover effect (No-op, silent)
   */
  public playHover() {
    // Pure silence, no vibration on desktop hover
  }

  /**
   * Success / Confirmation (Haptic vibration only)
   */
  public playSuccess() {
    this.triggerHaptic('warp');
  }

  /**
   * Error Notification (Haptic vibration only)
   */
  public playError() {
    this.triggerHaptic('error');
  }
}

// Global Singleton Instance
export const soundEngine = new SoundEngine();

/**
 * React Hook for state management
 */
import { useState, useEffect } from 'react';

export function useSoundState() {
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(soundEngine.getMuted());
    const unsubscribe = soundEngine.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  return {
    isMuted,
    toggleMute: () => soundEngine.toggleMute(),
    setMuted: (muted: boolean) => soundEngine.setMuted(muted),
  };
}
