"use client";

import { useEffect } from "react";

// Remembers the last successful lookup on this device only (browser storage),
// so the homepage can offer a one-tap "check again". Nothing leaves the
// browser; the privacy page says so, and "Forget" on the homepage clears it.
export const LAST_KEY = "ebp:last-lookup";

export default function RememberLookup({ disco, reference, discoName }) {
  useEffect(() => {
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify({ disco, reference, discoName, at: Date.now() }));
    } catch {
      /* private mode or storage blocked: nothing to remember */
    }
  }, [disco, reference, discoName]);
  return null;
}
