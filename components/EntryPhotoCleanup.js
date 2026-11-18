"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PHOTO_CLEANUP_FAILURE, retryPhotoCleanup } from "../lib/entry-photo-cleanup.js";

export default function EntryPhotoCleanup({ supabase, snapshot }) {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function handleRetry() {
    if (busy.current || removed) return;
    busy.current = true;
    setPending(true);
    try {
      const result = await retryPhotoCleanup(supabase, snapshot);
      setRemoved(result.status === "removed");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <div>
      <p role={removed ? "status" : "alert"} style={{ color: "#C9C6CF", fontSize: 14, lineHeight: 1.5 }}>
        {removed ? "Photo removed." : PHOTO_CLEANUP_FAILURE}
      </p>
      {!removed && <button type="button" onClick={handleRetry} disabled={pending}
        style={{ padding: "6px 12px", color: "#F0F2F0", background: "#2A292D", border: "1px solid rgba(240, 242, 240, 0.25)", borderRadius: 8, cursor: pending ? "default" : "pointer" }}>
        {pending ? "Retrying..." : "Retry photo cleanup"}
      </button>}
      <Link href="/" style={{ display: "inline-block", marginLeft: 16, color: "#F0F2F0", fontSize: 14 }}>Return to archive</Link>
    </div>
  );
}
