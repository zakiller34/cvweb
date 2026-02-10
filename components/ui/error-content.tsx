"use client";

import { useEffect } from "react";

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk") ||
    error.message.includes("ChunkLoadError")
  );
}

export function ErrorContent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    if (isChunkLoadError(error)) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <button
          onClick={reset}
          className="mt-4 rounded bg-gray-900 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
