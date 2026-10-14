"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="inline-flex flex-wrap items-center gap-3">
      <Button size="xs" onClick={copy}>
        {status === "copied" ? <Check size={14} /> : <Copy size={14} />}
        {label}
      </Button>
      <span role="status" className="text-xs text-muted">
        {status === "copied"
          ? "Copied to clipboard"
          : status === "error"
            ? "Couldn’t copy. Select and copy the text manually."
            : ""}
      </span>
    </div>
  );
}
