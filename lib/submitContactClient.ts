"use client";

import { getApiMeta, readApiErrorMessage, unwrapApiData } from "@/lib/apiEnvelope";

/**
 * Contact form POST — always same-origin via Next.js /api/contact (no browser CORS to Render).
 */
export async function submitContact(payload: Record<string, string>) {
  const url = `${window.location.origin}/api/contact`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "We couldn't reach our servers right now. Please try again in a moment, or call us directly.",
    );
  }

  let body: unknown = {};
  try {
    body = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error("Something went wrong while sending your message. Please try again.");
    }
  }

  if (!res.ok) throw new Error(readApiErrorMessage(body, "Submission failed"));

  const data = unwrapApiData<{ contact?: unknown }>(body);
  const message =
    getApiMeta(body)?.message || readApiErrorMessage(body, "Thank you! We will get back to you soon.");
  return { message, contact: data.contact, ...data };
}
