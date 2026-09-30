import { EventEmitter } from "events";

class RealtimeHub extends EventEmitter {
  constructor() {
    super();
    // Maximum listeners to avoid Node warnings on high client counts
    this.setMaxListeners(1000);

    // Map of active SSE client connections: clientId -> clientInfo
    this.clients = new Map();

    // Circular in-memory event buffer for ultra-reliable cross-network sync
    this.eventHistory = [];
    this.eventIdCounter = 1;

    // Start 15-second heartbeat to keep Cloudflare tunnel, HTTP proxies, and mobile network connections alive
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 15000);

    // Clean up event history older than 10 minutes every 2 minutes
    this.historyCleanupInterval = setInterval(() => {
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      this.eventHistory = this.eventHistory.filter((e) => e.timestamp > tenMinutesAgo);
    }, 120000);

    // Ensure interval doesn't prevent process exit if running standalone
    if (this.heartbeatInterval.unref) {
      this.heartbeatInterval.unref();
    }
    if (this.historyCleanupInterval.unref) {
      this.historyCleanupInterval.unref();
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

    // Send initial connection handshake frame + Cloudflare buffer bypass padding
    try {
      // 2KB initial comment padding forces proxies / Cloudflare to immediately flush
      const padding = `: padding ${"x".repeat(2048)}\n\n`;
      clientInfo.res.write(padding);

      clientInfo.res.write(
        `event: connected\ndata: ${JSON.stringify({
          connected: true,
          clientId: clientInfo.id,
          timestamp: Date.now(),
          channels: Array.from(clientInfo.channels),
        })}\n\n`
      );
      if (typeof clientInfo.res.flush === "function") {
        clientInfo.res.flush();
      }
    } catch {
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
   * Internal helper to record an event in the history buffer
   */
  _recordEvent(channel, eventType, payload = {}, meta = {}) {
    const event = {
      id: `evt_${Date.now()}_${this.eventIdCounter++}`,
      channel,
      type: eventType,
      payload,
      timestamp: Date.now(),
      targetUserId: meta.targetUserId || null,
      targetRoles: meta.targetRoles || null,
    };

    this.eventHistory.push(event);
    if (this.eventHistory.length > 200) {
      this.eventHistory.shift();
    }

    return event;
  }

  /**
   * Broadcast an event to all clients subscribed to a channel (or all clients if channel is "*")
   * @param {string} channel Domain channel: "team", "listings", "leads", "analytics", "blogs", "dashboard", "*"
   * @param {string} eventType e.g. "TEAM_MEMBER_STATUS_CHANGED"
   * @param {any} payload
   */
  broadcast(channel, eventType, payload = {}) {
    const event = this._recordEvent(channel, eventType, payload);

    const messageData = JSON.stringify({
      id: event.id,
      channel,
      type: eventType,
      payload,
      timestamp: event.timestamp,
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
          if (typeof client.res.flush === "function") {
            client.res.flush();
          }
        }
      } catch {
        this.removeClient(clientId);
      }
    }

    // Also emit internally in process
    this.emit("event", event);
  }

  /**
   * Broadcast to clients with a specific user role (e.g. only super_admin and admin)
   */
  broadcastToRoles(roles, channel, eventType, payload = {}) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const event = this._recordEvent(channel, eventType, payload, { targetRoles: allowedRoles });

    const messageData = JSON.stringify({
      id: event.id,
      channel,
      type: eventType,
      payload,
      timestamp: event.timestamp,
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
            if (typeof client.res.flush === "function") {
              client.res.flush();
            }
          }
        }
      } catch {
        this.removeClient(clientId);
      }
    }

    this.emit("event", event);
  }

  /**
   * Broadcast directly to a specific user by userId
   */
  broadcastToUser(userId, channel, eventType, payload = {}) {
    const targetUserIdStr = userId.toString();
    const event = this._recordEvent(channel, eventType, payload, { targetUserId: targetUserIdStr });

    const messageData = JSON.stringify({
      id: event.id,
      channel,
      type: eventType,
      payload,
      timestamp: event.timestamp,
    });

    const sseChunk = `event: message\ndata: ${messageData}\n\n`;

    for (const [clientId, client] of this.clients.entries()) {
      try {
        if (client.userId && client.userId.toString() === targetUserIdStr) {
          client.res.write(sseChunk);
          if (typeof client.res.flush === "function") {
            client.res.flush();
          }
        }
      } catch {
        this.removeClient(clientId);
      }
    }

    this.emit("event", event);
  }

  /**
   * Retrieves events occurring after `sinceTimestamp` matching subscribed channels.
   * Enables 100% resilient polling sync across any network / proxy / mobile tunnel.
   */
  getEventsSince(sinceTimestamp = 0, channels = ["*"], userInfo = null) {
    const since = Number(sinceTimestamp) || 0;
    const channelsSet = new Set(channels.map((c) => c.toLowerCase()));
    const hasWildcard = channelsSet.has("*");
    const currentUserId = userInfo?.userId?.toString() || null;
    const currentUserRole = userInfo?.role || null;
    const isSuperAdmin =
      currentUserRole === "super_admin" || currentUserRole === "superadmin";

    return this.eventHistory.filter((evt) => {
      // Must be strictly newer than caller's high-water mark
      if (evt.timestamp <= since) return false;

      // Channel matching
      const channelMatches = hasWildcard || channelsSet.has(evt.channel.toLowerCase());
      if (!channelMatches) return false;

      // User target matching (if event was user-specific, only deliver to that user or super_admins)
      if (evt.targetUserId) {
        if (!isSuperAdmin && evt.targetUserId !== currentUserId) {
          return false;
        }
      }

      // Role target matching (if event was role-restricted)
      if (evt.targetRoles && evt.targetRoles.length > 0) {
        if (!currentUserRole || !evt.targetRoles.includes(currentUserRole)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Send periodic heartbeat comments to keep connections alive
   */
  sendHeartbeat() {
    const comment = `: keep-alive ${Date.now()}\n\n`;
    for (const [clientId, client] of this.clients.entries()) {
      try {
        client.res.write(comment);
        if (typeof client.res.flush === "function") {
          client.res.flush();
        }
      } catch {
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
