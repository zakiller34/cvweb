"use client";

import { ErrorContent } from "@/components/ui/error-content";

export default function MainError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorContent reset={reset} />;
}
