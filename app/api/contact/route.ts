import { NextRequest, NextResponse } from "next/server";
import { getContactApiBaseUrl } from "@/lib/publicEnv";

/** Server-side proxy — avoids browser CORS to Render/other API hosts. */
function backendContactUrl() {
  return `${getContactApiBaseUrl()}/contact`;
}

export async function POST(request: NextRequest) {
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  try {
    const upstream = await fetch(backendContactUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "application/json";

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "We couldn't reach our servers right now. Please try again in a moment, or call us directly.",
      },
      { status: 502 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
