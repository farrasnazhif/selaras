"use client";

import { FolderPlus, LoaderCircle, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DataState({
  state,
  onRetry,
  action,
}: {
  state: "loading" | "empty" | "error" | "unavailable";
  onRetry?: () => void;
  action?: React.ReactNode;
}) {
  const loading = state === "loading";
  const empty = state === "empty";
  const Icon = loading ? LoaderCircle : empty ? FolderPlus : CircleAlert;
  return (
    <div className="data-state" role={loading ? "status" : undefined}>
      <span className="state-icon">
        <Icon size={24} aria-hidden="true" className={loading ? "animate-spin motion-reduce:animate-none" : ""} />
      </span>
      <h2 className="mt-4 text-2xl leading-[1.25] font-[750]">
        {loading
          ? "Getting your projects…"
          : empty
            ? "Your next idea starts here"
            : state === "unavailable"
              ? "Project unavailable"
              : "We couldn’t load your projects"}
      </h2>
      <p className="text-sm text-muted mt-2 max-w-sm">
        {loading
          ? "Just a moment while we get everything ready."
          : empty
            ? "Create your first project. Keep the scope small, then make it happen."
            : state === "unavailable"
              ? "It may have been removed, or you may not have access."
              : "Check your connection and try again. Your work is still there."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}
