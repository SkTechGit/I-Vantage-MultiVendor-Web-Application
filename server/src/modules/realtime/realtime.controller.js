import crypto from "crypto";
import { realtimeHub } from "./realtime.hub.js";
import { AUTH_COOKIE } from "../auth/auth.constants.js";
import { verifyAccessToken } from "../../utils/jwt.js";

/**
 * Helper to optionally extract user info from access token or cookies
 */
const extractUserInfo = (req) => {
  let token =
    req.cookies?.[AUTH_COOKIE.ACCESS_NAME] ||
    req.cookies?.[AUTH_COOKIE.NAME];

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      return {
        userId: payload.id || payload._id,
        userEmail: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * GET /api/v1/realtime/stream
 * Connects a client to the SSE event stream
 */
export const streamEvents = (req, res) => {
  // Set SSE response headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // Prevent Nginx / proxy buffering
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    "Access-Control-Allow-Credentials": "true",
  });

  // Ensure headers are flushed immediately
  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  // Parse subscribed channels from query params (e.g. ?channels=team,listings,leads)
  const channelsParam = req.query.channels;
  const channelList = channelsParam
    ? channelsParam.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean)
    : ["*"];

  const channelsSet = new Set(channelList.length > 0 ? channelList : ["*"]);

  const userInfo = extractUserInfo(req);
  const clientId = `client_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

  const clientInfo = {
    id: clientId,
    userId: userInfo?.userId || null,
    userEmail: userInfo?.userEmail || null,
    role: userInfo?.role || "guest",
    channels: channelsSet,
    res,
  };

  realtimeHub.addClient(clientInfo);

  // Clean up on disconnect
  const cleanup = () => {
    realtimeHub.removeClient(clientId);
  };

  req.on("close", cleanup);
  res.on("close", cleanup);
  req.on("error", cleanup);
};

/**
 * GET /api/v1/realtime/health
 * Simple health check returning active connection count
 */
export const getRealtimeStatus = (req, res) => {
  res.json({
    success: true,
    activeConnections: realtimeHub.getClientCount(),
    timestamp: Date.now(),
  });
};

/**
 * POST /api/v1/realtime/broadcast
 * Allows services and Next.js handlers to dispatch real-time events to all connected clients
 */
export const broadcastEvent = (req, res) => {
  const { channel, type, payload } = req.body;
  if (!type) {
    return res.status(400).json({ success: false, message: "Event type is required." });
  }

  realtimeHub.broadcast(channel || "*", type, payload || {});

  res.status(200).json({
    success: true,
    message: "Event broadcasted successfully.",
    dispatchedTo: realtimeHub.getClientCount(),
  });
};

