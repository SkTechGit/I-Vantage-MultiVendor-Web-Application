"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

export interface RealtimeEvent<T = any> {
  id?: string;
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

  // Set of recently processed event IDs / fingerprints to prevent duplicate dispatches
  const seenEventKeysRef = useRef<Set<string>>(new Set());

  // High-water mark timestamp for fast polling sync (initialized in effect for React 19 purity)
  const lastPollTimestampRef = useRef<number>(0);

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

      // Propagate to other tabs via BroadcastChannel if this event originated from SSE/Poll
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

  // Process an incoming event with deduplication
  const processIncomingEvent = useCallback(
    (evt: RealtimeEvent) => {
      if (!evt || !evt.channel || !evt.type) return;

      const eventKey = evt.id || `${evt.channel}:${evt.type}:${evt.timestamp || Date.now()}`;
      if (seenEventKeysRef.current.has(eventKey)) {
        return; // Already dispatched
      }

      seenEventKeysRef.current.add(eventKey);

      // Keep seen set under 1000 items
      if (seenEventKeysRef.current.size > 1000) {
        const arr = Array.from(seenEventKeysRef.current);
        seenEventKeysRef.current = new Set(arr.slice(arr.length - 500));
      }

      dispatchLocal(evt.channel, evt.type, evt.payload, false);
    },
    [dispatchLocal]
  );

  // Setup BroadcastChannel for 0ms cross-tab synchronization on the same device
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

  // Dual Real-Time Engine: SSE Stream + Ultra-Fast Fallback Polling (1.5s interval)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;
    let sseReconnectTimer: NodeJS.Timeout | null = null;
    let isDisposed = false;
    let isPollingActive = false;

    // 1. FAST HTTP POLLING (Guaranteed across Cloudflare Tunnels, proxies & mobile NATs)
    const runPoll = async () => {
      if (isDisposed || isPollingActive) return;
      isPollingActive = true;

      try {
        const since = lastPollTimestampRef.current || (Date.now() - 5000);
        const res = await fetch(`/api/v1/realtime/poll?channels=*&since=${since}`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            setIsConnected(true);
            if (data.timestamp) {
              lastPollTimestampRef.current = data.timestamp;
            }
            if (Array.isArray(data.events) && data.events.length > 0) {
              data.events.forEach((evt: RealtimeEvent) => {
                processIncomingEvent(evt);
              });
            }
          }
        }
      } catch {
        // network momentary pause
      } finally {
        isPollingActive = false;
      }
    };

    // 2. SERVER-SENT EVENTS (SSE) STREAM
    const connectSSE = () => {
      if (isDisposed) return;

      const sseUrl = "/api/v1/realtime/stream?channels=*";

      try {
        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.addEventListener("connected", () => {
          setIsConnected(true);
        });

        eventSource.addEventListener("message", (e) => {
          try {
            const data: RealtimeEvent = JSON.parse(e.data);
            if (data && data.channel && data.type) {
              processIncomingEvent(data);
            }
          } catch (parseErr) {
            console.error("Failed to parse SSE message:", parseErr);
          }
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }

          if (!isDisposed && !sseReconnectTimer) {
            sseReconnectTimer = setTimeout(() => {
              sseReconnectTimer = null;
              connectSSE();
            }, 3000);
          }
        };
      } catch {
        if (!isDisposed && !sseReconnectTimer) {
          sseReconnectTimer = setTimeout(() => {
            sseReconnectTimer = null;
            connectSSE();
          }, 3000);
        }
      }
    };

    // Start SSE stream
    connectSSE();

    // Start polling immediately, then every 1500ms
    runPoll();
    pollInterval = setInterval(runPoll, 1500);

    // Re-sync immediately on visibility or network reconnection
    const handleWakeup = () => {
      if (!isDisposed && document.visibilityState === "visible") {
        runPoll();
        if (!eventSource) {
          connectSSE();
        }
      }
    };

    window.addEventListener("online", handleWakeup);
    document.addEventListener("visibilitychange", handleWakeup);

    return () => {
      isDisposed = true;
      window.removeEventListener("online", handleWakeup);
      document.removeEventListener("visibilitychange", handleWakeup);
      if (pollInterval) clearInterval(pollInterval);
      if (sseReconnectTimer) clearTimeout(sseReconnectTimer);
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  }, [user, processIncomingEvent]);

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
