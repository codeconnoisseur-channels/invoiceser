"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-25 px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-danger-500">Error</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6">
          <Button onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
