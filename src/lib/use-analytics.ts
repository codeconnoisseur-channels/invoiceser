"use client";

import { useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { captureEvent } from "./analytics";

export function useAnalytics() {
  const { user } = useUser();

  const track = useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      captureEvent(event, {
        ...properties,
        clerk_id: user?.id,
      });
    },
    [user],
  );

  return { track };
}
