"use client";

import { Info, SearchX } from "lucide-react";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
      <SearchX className="h-8 w-8 text-muted-foreground" />
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-xl border border-danger/40 bg-card px-6 py-16 text-center"
    >
      <Info className="h-8 w-8 text-danger" />
      <h3 className="mt-4 text-base font-semibold">Could not load models</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-10 items-center rounded-md border bg-card px-4 text-sm font-medium hover:bg-muted"
      >
        Try again
      </button>
    </div>
  );
}