import { Router } from "express";
import {
  streamEvents,
  getRealtimeStatus,
  broadcastEvent,
} from "./realtime.controller.js";

const router = Router();

// SSE real-time stream endpoint
router.get("/stream", streamEvents);

// Health / status endpoint
router.get("/status", getRealtimeStatus);

// Internal/service broadcast endpoint
router.post("/broadcast", broadcastEvent);

export default router;
