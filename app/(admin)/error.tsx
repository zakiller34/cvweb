"use client";

import Link from "next/link";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded bg-gray-900 px-4 py-2 text-white"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="rounded border border-gray-300 px-4 py-2"
          >
            Back to admin
          </Link>
        </div>
      </div>
    </div>
  );
}
