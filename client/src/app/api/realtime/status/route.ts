import { NextResponse } from "next/server";
import { sseClients } from "@/lib/realtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientsList = Array.from(sseClients.values()).map((c) => ({
    id: c.id,
    userId: c.userId,
    userEmail: c.userEmail,
    role: c.role,
    channels: Array.from(c.channels),
  }));

  return NextResponse.json({
    count: sseClients.size,
    clients: clientsList,
    timestamp: Date.now(),
  });
}
