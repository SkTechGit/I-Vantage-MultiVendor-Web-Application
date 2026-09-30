import { Router } from "express";
import {
  streamEvents,
  pollEvents,
  getRealtimeStatus,
  broadcastEvent,
} from "./realtime.controller.js";

const router = Router();

// SSE real-time stream endpoint
router.get("/stream", streamEvents);

// Fast-poll real-time endpoint for proxy / mobile / Cloudflare tunnel environments
router.get("/poll", pollEvents);

// Health / status endpoint
router.get("/status", getRealtimeStatus);

// Internal/service broadcast endpoint
router.post("/broadcast", broadcastEvent);

export default router;
