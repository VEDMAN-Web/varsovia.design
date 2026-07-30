"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

type Props = {
  title: string;
};

export default function BlogShareButton({ title }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-[#f4ebec] text-[#6a414d] transition hover:bg-[#ecdde0] active:scale-[0.98] sm:h-11 sm:w-11"
      aria-label={copied ? "Link copied" : "Share article"}
    >
      <Share2 size={18} strokeWidth={1.75} aria-hidden />
    </button>
  );
}
