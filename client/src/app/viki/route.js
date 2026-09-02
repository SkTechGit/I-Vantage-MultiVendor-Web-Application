import { NextResponse } from "next/server";

const VIKI_API_URL = process.env.VIKI_API_URL;

export async function POST(request) {
  try {
    if (!VIKI_API_URL) {
      console.error("VIKI_API_URL is not configured");

      return NextResponse.json(
        {
          error: "VIKI service is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const sessionId =
      typeof body.session_id === "string"
        ? body.session_id.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Session ID is required.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${VIKI_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("VIKI Python API error:", {
        status: response.status,
        body: errorText,
      });

      return NextResponse.json(
        {
          error: "VIKI is temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      response: data.response,
    });
  } catch (error) {
    console.error("VIKI proxy error:", error);

    return NextResponse.json(
      {
        error: "Unable to connect to VIKI.",
      },
      { status: 500 }
    );
  }
}