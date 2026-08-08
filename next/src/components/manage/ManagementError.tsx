"use client";

import ErrorFallback from "@/components/ErrorFallback";

export default function ManagementError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback {...props} fallbackMessage="データの読み込みに失敗しました。" />;
}
