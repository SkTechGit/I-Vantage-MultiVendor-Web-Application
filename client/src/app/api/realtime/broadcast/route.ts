import { NextRequest, NextResponse } from "next/server";
import { dispatchLocalSSE } from "@/lib/realtime";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channel, type, payload } = body || {};

    if (!channel || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: channel and type" },
        { status: 400 }
      );
    }

    dispatchLocalSSE(channel, type, payload || {});

    return NextResponse.json({
      success: true,
      message: "Broadcast dispatched to Next.js clients",
      channel,
      type,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Broadcast error" },
      { status: 500 }
    );
  }
}
