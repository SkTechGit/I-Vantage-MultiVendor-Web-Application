import { EventEmitter } from "events";

class RealtimeHub extends EventEmitter {
  constructor() {
    super();
    // Maximum listeners to avoid Node warnings on high client counts
    this.setMaxListeners(1000);

    // Map of active SSE client connections: clientId -> clientInfo
    this.clients = new Map();

    // Start 20-second heartbeat to keep Cloudflare tunnel, HTTP proxies, and mobile network connections alive
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 20000);

    // Ensure interval doesn't prevent process exit if running standalone
    if (this.heartbeatInterval.unref) {
      this.heartbeatInterval.unref();
    }
  }

  /**
   * Register a new client SSE response stream
   * @param {Object} clientInfo
   * @param {string} clientInfo.id Unique connection ID
   * @param {string} [clientInfo.userId]
   * @param {string} [clientInfo.userEmail]
   * @param {string} [clientInfo.role] super_admin, admin, vendor, user, guest
   * @param {Set<string>} clientInfo.channels Subscribed channels
   * @param {import("express").Response} clientInfo.res
   */
  addClient(clientInfo) {
    this.clients.set(clientInfo.id, clientInfo);

    // Send initial connection handshake frame
    try {
      clientInfo.res.write(
        `event: connected\ndata: ${JSON.stringify({
          connected: true,
          clientId: clientInfo.id,
          timestamp: Date.now(),
          channels: Array.from(clientInfo.channels),
        })}\n\n`
      );
    } catch (err) {
      this.removeClient(clientInfo.id);
    }
  }

  /**
   * Remove client when connection closes
   * @param {string} clientId
   */
  removeClient(clientId) {
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
    }
  }

  /**
   * Broadcast an event to all clients subscribed to a channel (or all clients if channel is "*")
   * @param {string} channel Domain channel: "team", "listings", "leads", "analytics", "blogs", "dashboard", "*"
   * @param {string} eventType e.g. "TEAM_MEMBER_STATUS_CHANGED"
   * @param {any} payload
   */
  broadcast(channel, eventType, payload = {}) {
    const messageData = JSON.stringify({
      channel,
      type: eventType,
      payload,
      timestamp: Date.now(),
    });

    const sseChunk = `event: message\ndata: ${messageData}\n\n`;

    for (const [clientId, client] of this.clients.entries()) {
      try {
        if (
          channel === "*" ||
          client.channels.has("*") ||
          client.channels.has(channel)
        ) {
          client.res.write(sseChunk);
        }
      } catch (err) {
        this.removeClient(clientId);
      }
    }

    // Forward to Next.js App Router native SSE clients
    try {
      const nextUrl = process.env.CLIENT_URL || "http://localhost:3000";
      fetch(`${nextUrl}/api/realtime/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, type: eventType, payload }),
        signal: AbortSignal.timeout(2000),
      }).catch(() => {});
    } catch {}

    // Also emit internally in process
    this.emit("event", { channel, type: eventType, payload });
  }

  /**
   * Broadcast to clients with a specific user role (e.g. only super_admin and admin)
   */
  broadcastToRoles(roles, channel, eventType, payload = {}) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const messageData = JSON.stringify({
      channel,
      type: eventType,
      payload,
      timestamp: Date.now(),
    });

    const sseChunk = `event: message\ndata: ${messageData}\n\n`;

    for (const [clientId, client] of this.clients.entries()) {
      try {
        if (client.role && allowedRoles.includes(client.role)) {
          if (
            channel === "*" ||
            client.channels.has("*") ||
            client.channels.has(channel)
          ) {
            client.res.write(sseChunk);
          }
        }
      } catch (err) {
        this.removeClient(clientId);
      }
    }
  }

  /**
   * Broadcast directly to a specific user by userId
   */
  broadcastToUser(userId, channel, eventType, payload = {}) {
    const targetUserIdStr = userId.toString();
    const messageData = JSON.stringify({
      channel,
      type: eventType,
      payload,
      timestamp: Date.now(),
    });

    const sseChunk = `event: message\ndata: ${messageData}\n\n`;

    for (const [clientId, client] of this.clients.entries()) {
      try {
        if (client.userId && client.userId.toString() === targetUserIdStr) {
          client.res.write(sseChunk);
        }
      } catch (err) {
        this.removeClient(clientId);
      }
    }
  }

  /**
   * Send periodic heartbeat comments to keep connections alive
   */
  sendHeartbeat() {
    const comment = `: keep-alive ${Date.now()}\n\n`;
    for (const [clientId, client] of this.clients.entries()) {
      try {
        client.res.write(comment);
      } catch (err) {
        this.removeClient(clientId);
      }
    }
  }

  /**
   * Return number of currently connected real-time streams
   */
  getClientCount() {
    return this.clients.size;
  }
}

// Export singleton instance
export const realtimeHub = new RealtimeHub();
export default realtimeHub;
