import { useSyncExternalStore } from 'react';

/**
 * i-VANTAGE Technologies - Haptics & Vibration Engine
 *
 * Implements mobile Web Vibration API haptics strictly for mobile viewports.
 * ZERO sound synthesis or audio playback is produced anywhere in the application.
 * All tactile vibrations are restricted strictly to mobile viewports (<= 820px).
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

const STORAGE_KEY = 'ivantage_haptics_muted';

class SoundEngine {
  private isMuted: boolean = false;
  private lastTapHapticAt = 0;
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
   * Helper to verify if user is strictly in mobile view (<= 820px viewport)
   */
  public isMobileView(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth <= 820 ||
      (typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 820px)').matches)
    );
  }

  /**
   * Mobile Web Vibration Haptic Trigger (Strictly Mobile Viewport Only, No Sounds)
   */
  public triggerHaptic(pattern: HapticPattern | number[]) {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    // Strict mobile view gate: Never vibrate on laptop / desktop screen sizes
    if (!this.isMobileView()) return;
    if (this.isMuted) return;

    if (pattern === 'tap') {
      const now = Date.now();
      if (now - this.lastTapHapticAt < 100) return;
      this.lastTapHapticAt = now;
    }

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
   * Signature Warp Transition (Haptic vibration only on mobile)
   */
  public playZoom() {
    this.triggerHaptic('warp');
  }

  /**
   * Tactile Micro-Click (Haptic vibration only on mobile)
   */
  public playClick() {
    this.triggerHaptic('tap');
  }

  /**
   * Option Selection Pop (Haptic vibration only on mobile)
   */
  public playToggle() {
    this.triggerHaptic('select');
  }

  /**
   * Question Advance (Haptic vibration only on mobile)
   */
  public playAdvance() {
    this.triggerHaptic('advance');
  }

  /**
   * Navigation Back (Haptic vibration only on mobile)
   */
  public playBack() {
    this.triggerHaptic('back');
  }

  /**
   * Celebration on Score Reveal (Haptic vibration only on mobile)
   */
  public playCelebration() {
    this.triggerHaptic('celebrate');
  }

  /**
   * Desktop Hover (100% Silent, 0 vibration)
   */
  public playHover() {
    // Pure silence, no haptic on desktop hover
  }

  /**
   * Success / Confirmation (Haptic vibration only on mobile)
   */
  public playSuccess() {
    this.triggerHaptic('warp');
  }

  /**
   * Error Notification (Haptic vibration only on mobile)
   */
  public playError() {
    this.triggerHaptic('error');
  }
}

// Global Singleton Instance
export const soundEngine = new SoundEngine();
export const hapticEngine = soundEngine;

/**
 * React Hook for state management
 */
export function useSoundState() {
  const isMuted = useSyncExternalStore(
    (listener) => soundEngine.subscribe(listener),
    () => soundEngine.getMuted(),
    () => false
  );

  return {
    isMuted,
    toggleMute: () => soundEngine.toggleMute(),
    setMuted: (muted: boolean) => soundEngine.setMuted(muted),
  };
}
