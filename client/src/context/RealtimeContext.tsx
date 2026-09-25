"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface RealtimeEvent<T = any> {
  channel: string;
  type: string;
  payload: T;
  timestamp: number;
}

interface RealtimeContextValue {
  isConnected: boolean;
  subscribe: (
    channel: string,
    eventType: string,
    callback: (payload: any) => void
  ) => () => void;
  broadcastLocal: (channel: string, type: string, payload: any) => void;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  isConnected: false,
  subscribe: () => () => {},
  broadcastLocal: () => {},
});

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  // Map of listeners: "channel:eventType" -> Set of callbacks
  const listenersRef = useRef<Map<string, Set<(payload: any) => void>>>(
    new Map()
  );

  // BroadcastChannel for cross-tab communication on the same device
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Dispatch an event to all local registered listeners
  const dispatchLocal = useCallback(
    (channel: string, type: string, payload: any, fromTab = false) => {
      // 1. Channel + specific type e.g. "team:TEAM_MEMBER_STATUS_CHANGED"
      const key = `${channel}:${type}`;
      const callbacks = listenersRef.current.get(key);
      if (callbacks) {
        callbacks.forEach((cb) => {
          try {
            cb(payload);
          } catch (err) {
            console.error(`Error in realtime listener for ${key}:`, err);
          }
        });
      }

      // 2. Channel wildcard e.g. "team:*"
      const channelWildcard = `${channel}:*`;
      const channelCallbacks = listenersRef.current.get(channelWildcard);
      if (channelCallbacks) {
        channelCallbacks.forEach((cb) => {
          try {
            cb(payload);
          } catch (err) {
            console.error(`Error in realtime wildcard listener for ${channelWildcard}:`, err);
          }
        });
      }

      // 3. Global wildcard "*:*"
      const globalCallbacks = listenersRef.current.get("*:*");
      if (globalCallbacks) {
        globalCallbacks.forEach((cb) => {
          try {
            cb(payload);
          } catch (err) {
            console.error("Error in realtime global listener:", err);
          }
        });
      }

      // Propagate to other tabs via BroadcastChannel if this event originated from SSE
      if (!fromTab && broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({
            channel,
            type,
            payload,
            timestamp: Date.now(),
          });
        } catch {
          // ignore tab message error
        }
      }
    },
    []
  );

  // Setup BroadcastChannel for 0ms cross-tab synchronization
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }

    const bc = new BroadcastChannel("ivantage_realtime_events");
    broadcastChannelRef.current = bc;

    bc.onmessage = (event) => {
      const { channel, type, payload } = event.data || {};
      if (channel && type) {
        dispatchLocal(channel, type, payload, true);
      }
    };

    return () => {
      bc.close();
      broadcastChannelRef.current = null;
    };
  }, [dispatchLocal]);

  // Connect to SSE stream
  useEffect(() => {
    if (typeof window === "undefined") return;

    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let reconnectDelay = 1000;
    let isDisposed = false;

    const connectSSE = () => {
      if (isDisposed) return;

      // Connect to native Next.js App Router SSE endpoint (no proxy buffering)
      const sseUrl = "/api/realtime/stream?channels=*";

      try {
        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.onopen = () => {
          setIsConnected(true);
          reconnectDelay = 1000; // Reset backoff on successful connection
        };

        eventSource.addEventListener("connected", () => {
          setIsConnected(true);
          reconnectDelay = 1000;
        });

        eventSource.addEventListener("message", (e) => {
          try {
            const data: RealtimeEvent = JSON.parse(e.data);
            if (data && data.channel && data.type) {
              dispatchLocal(data.channel, data.type, data.payload, false);
            }
          } catch (parseErr) {
            console.error("Failed to parse SSE message:", parseErr);
          }
        });

        eventSource.onerror = () => {
          setIsConnected(false);
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }

          // Auto-reconnect with exponential backoff (1s -> 2s -> 4s -> max 8s)
          if (!isDisposed && !reconnectTimer) {
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              connectSSE();
            }, reconnectDelay);
            reconnectDelay = Math.min(reconnectDelay * 2, 8000);
          }
        };
      } catch (connErr) {
        console.error("SSE connection error:", connErr);
        if (!isDisposed && !reconnectTimer) {
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connectSSE();
          }, reconnectDelay);
          reconnectDelay = Math.min(reconnectDelay * 2, 8000);
        }
      }
    };

    // Reconnect immediately when phone or tab wakes up
    const handleVisibilityOrOnline = () => {
      if (!isDisposed && document.visibilityState === "visible" && !eventSource) {
        connectSSE();
      }
    };

    window.addEventListener("online", handleVisibilityOrOnline);
    document.addEventListener("visibilitychange", handleVisibilityOrOnline);

    connectSSE();

    return () => {
      isDisposed = true;
      window.removeEventListener("online", handleVisibilityOrOnline);
      document.removeEventListener("visibilitychange", handleVisibilityOrOnline);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      setIsConnected(false);
    };
  }, [user, dispatchLocal]);

  // Subscribe method for components
  const subscribe = useCallback(
    (
      channel: string,
      eventType: string,
      callback: (payload: any) => void
    ) => {
      const key = `${channel}:${eventType}`;
      if (!listenersRef.current.has(key)) {
        listenersRef.current.set(key, new Set());
      }
      listenersRef.current.get(key)!.add(callback);

      // Return unsubscribe function
      return () => {
        const callbacks = listenersRef.current.get(key);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            listenersRef.current.delete(key);
          }
        }
      };
    },
    []
  );

  const broadcastLocal = useCallback(
    (channel: string, type: string, payload: any) => {
      dispatchLocal(channel, type, payload, false);
    },
    [dispatchLocal]
  );

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        subscribe,
        broadcastLocal,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);

/**
 * Convenient React hook to listen to real-time events in any component.
 * Supports both:
 *   useRealtimeEvent("leads", (payload) => { ... }) // Listens to all events on "leads" channel
 *   useRealtimeEvent("leads", "LEAD_CREATED", (payload) => { ... }) // Listens to specific event
 */
export function useRealtimeEvent<T = any>(
  channel: string,
  callback: (payload: T) => void
): void;
export function useRealtimeEvent<T = any>(
  channel: string,
  eventType: string,
  callback: (payload: T) => void
): void;
export function useRealtimeEvent<T = any>(
  channel: string,
  arg2: string | ((payload: T) => void),
  arg3?: (payload: T) => void
) {
  const { subscribe } = useRealtime();

  const eventType = typeof arg2 === "string" ? arg2 : "*";
  const callback = typeof arg2 === "function" ? arg2 : arg3!;

  useEffect(() => {
    if (!callback) return;
    const unsubscribe = subscribe(channel, eventType, callback);
    return () => {
      unsubscribe();
    };
  }, [channel, eventType, callback, subscribe]);
}
