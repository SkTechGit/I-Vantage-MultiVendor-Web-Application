import crypto from "crypto";
import { realtimeHub } from "./realtime.hub.js";
import { AUTH_COOKIE } from "../auth/auth.constants.js";
import { SCOPED_COOKIES } from "../../utils/cookie.js";
import { verifyAccessToken } from "../../utils/jwt.js";

/**
 * Helper to optionally extract user info from access token or cookies
 */
const extractUserInfo = (req) => {
  const portal =
    req.headers?.["x-portal"] ||
    req.query?.portal ||
    (req.query?.channels?.includes("team") ? "admin" : null);

  let token = null;
  if (portal === "admin") {
    token = req.cookies?.[SCOPED_COOKIES.ADMIN_ACCESS];
  } else if (portal === "vendor") {
    token = req.cookies?.[SCOPED_COOKIES.VENDOR_ACCESS];
  } else {
    token =
      req.cookies?.[AUTH_COOKIE.ACCESS_NAME] ||
      req.cookies?.[SCOPED_COOKIES.ADMIN_ACCESS] ||
      req.cookies?.[SCOPED_COOKIES.VENDOR_ACCESS] ||
      req.cookies?.[AUTH_COOKIE.NAME];
  }

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
 * GET /api/v1/realtime/poll?channels=team,listings&since=1790500000000
 * Fast polling endpoint for environments where SSE is buffered or restricted (e.g. Cloudflare tunnels)
 */
export const pollEvents = (req, res) => {
  const since = Number(req.query.since) || 0;
  const channelsParam = req.query.channels;
  const channelList = channelsParam
    ? channelsParam.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean)
    : ["*"];

  const userInfo = extractUserInfo(req);
  const events = realtimeHub.getEventsSince(since, channelList, userInfo);

  res.status(200).json({
    success: true,
    events,
    timestamp: Date.now(),
    serverTime: new Date().toISOString(),
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


