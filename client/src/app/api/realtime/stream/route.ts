import { NextRequest } from "next/server";
import crypto from "crypto";
import { getSessionUser } from "@/lib/auth";
import { registerSSEClient, unregisterSSEClient, SSEClient } from "@/lib/realtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  const clientId = `client_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

  const role = session?.role || "guest";
  const userId = session?.id;
  const userEmail = session?.email;

  // Determine allowed channels based on authenticated role
  // Public catalog channels are accessible to all visitors (guests, users, vendors, superadmins)
  const channels = new Set<string>();
  channels.add("public");
  channels.add("blogs");
  channels.add("listings");
  channels.add("categories");
  channels.add("amenities");

  // Read requested channels from query param if any
  const { searchParams } = new URL(req.url);
  const requestedChannels = searchParams.get("channels")?.split(",").map((c) => c.trim().toLowerCase()) || [];

  if (role === "superadmin") {
    // Superadmin has omnipresent access to all real-time event channels
    channels.add("*");
    channels.add("admin");
    channels.add("admin:*");
    channels.add("team");
    channels.add("leads");
    channels.add("analytics");
    requestedChannels.forEach((ch) => channels.add(ch));
  } else if (role === "vendor" && userId) {
    // Vendor is strictly scoped to their tenant
    channels.add("vendor");
    channels.add(`vendor:${userId}`);
    channels.add(`vendor:${userId}:*`);
    channels.add(`vendor:${userId}:listings`);
    channels.add(`vendor:${userId}:leads`);
    channels.add(`vendor:${userId}:analytics`);
  } else if (userId) {
    // Regular customer / user
    channels.add(`user:${userId}`);
  }

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Helper to send SSE chunks
  const sendChunk = async (chunk: string) => {
    try {
      await writer.write(encoder.encode(chunk));
    } catch {
      // Stream closed
      unregisterSSEClient(clientId);
    }
  };

  const clientInfo: SSEClient = {
    id: clientId,
    userId,
    userEmail,
    role,
    channels,
    send: (chunk: string) => {
      sendChunk(chunk);
    },
    close: () => {
      try {
        writer.close();
      } catch {}
      unregisterSSEClient(clientId);
    },
  };

  registerSSEClient(clientInfo);

  // 1. Send initial 2KB comment padding to immediately force Cloudflare Tunnel and mobile browsers to flush headers
  const initialPadding = `:${" ".repeat(2048)}\n\n`;
  sendChunk(initialPadding);

  // 2. Send connected handshake frame
  const handshake = `event: connected\ndata: ${JSON.stringify({
    connected: true,
    clientId,
    role,
    channels: Array.from(channels),
    timestamp: Date.now(),
  })}\n\n`;
  sendChunk(handshake);

  // 3. Heartbeat ping every 15 seconds to keep mobile 4G/5G and Cloudflare tunnels alive
  const heartbeatTimer = setInterval(() => {
    sendChunk(`: keep-alive ${Date.now()}\n\n`);
  }, 15000);

  // 4. Handle client disconnection
  req.signal.addEventListener("abort", () => {
    clearInterval(heartbeatTimer);
    unregisterSSEClient(clientId);
    try {
      writer.close();
    } catch {}
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform, must-revalidate",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
