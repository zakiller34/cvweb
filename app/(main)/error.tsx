"use client";

export default function MainError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
