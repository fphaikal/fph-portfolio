"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per component mount
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackView = async () => {
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2026";

        if (!apiUrl.startsWith("http")) {
          apiUrl = `https://${apiUrl}`;
        }

        await fetch(`${apiUrl}/api/blog/${slug}/view`, {
          method: "POST",
        });
      } catch (error) {
        // Silently fail - view tracking is not critical
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [slug]);

  // This component doesn't render anything
  return null;
}
