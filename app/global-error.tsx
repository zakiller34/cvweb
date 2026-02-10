"use client";

import { ErrorContent } from "@/components/ui/error-content";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-gray-50">
        <ErrorContent error={error} reset={reset} />
      </body>
    </html>
  );
}
