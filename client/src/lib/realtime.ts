/**
 * Next.js Native Real-Time Hub & SSE Client Registry
 * Provides zero-buffer, sub-50ms event streaming across Cloudflare Tunnel & Mobile Devices.
 */

export interface SSEClient {
  id: string;
  userId?: string;
  userEmail?: string;
  role: string;
  channels: Set<string>;
  send: (chunk: string) => void;
  close: () => void;
}

declare global {
  var __nextSSEClients: Map<string, SSEClient> | undefined;
}

if (!global.__nextSSEClients) {
  global.__nextSSEClients = new Map<string, SSEClient>();
}

export const sseClients = global.__nextSSEClients;

export function registerSSEClient(client: SSEClient) {
  sseClients.set(client.id, client);
}

export function unregisterSSEClient(clientId: string) {
  sseClients.delete(clientId);
}

/**
 * Dispatches an event directly to all connected native Next.js SSE clients in memory.
 */
export function dispatchLocalSSE(
  channel: string,
  type: string,
  payload: Record<string, any> = {}
) {
  const messageData = JSON.stringify({
    channel,
    type,
    payload,
    timestamp: Date.now(),
  });

  const sseChunk = `event: message\ndata: ${messageData}\n\n`;

  for (const [clientId, client] of sseClients.entries()) {
    try {
      // Check channel matching with wildcard and tenancy support
      const isMatch =
        channel === "*" ||
        client.channels.has("*") ||
        client.channels.has(channel) ||
        // Check wildcard prefix e.g. client has "admin:*" and channel is "admin:team"
        Array.from(client.channels).some((c) => {
          if (c.endsWith(":*")) {
            const prefix = c.slice(0, -2);
            return channel.startsWith(prefix);
          }
          return false;
        });

      if (isMatch) {
        client.send(sseChunk);
      }
    } catch {
      unregisterSSEClient(clientId);
    }
  }
}

/**
 * Helper to dispatch real-time events across both native Next.js clients
 * and the Express server event bus.
 */
export async function broadcastRealtime(
  channel: string,
  type: string,
  payload: Record<string, any> = {}
) {
  // 1. Immediately push to all connected Next.js native SSE clients (< 1ms)
  dispatchLocalSSE(channel, type, payload);

  // 2. Also forward to Express backend so Express SSE clients (if any) receive it
  try {
    const backendUrl =
      process.env.REALTIME_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    fetch(`${backendUrl}/api/v1/realtime/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel,
        type,
        payload,
      }),
      signal: AbortSignal.timeout(2000),
    }).catch(() => {});
  } catch {
    // Fail silently so mutation responses are never blocked
  }
}
