"use client";

import { Fragment, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComponentPreview({
  title,
  caption,
  variants,
  children,
}: {
  title: string;
  caption: string;
  variants?: string[];
  children: (variant: string) => ReactNode;
}) {
  const [variant, setVariant] = useState(variants?.[0] ?? "");
  const [replay, setReplay] = useState(0);
  return (
    <section aria-label={`${title} preview`}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1 basis-48">
          <h2 className="text-2xl leading-[1.25] font-[750]">{title}</h2>
          <p className="text-sm leading-5 text-muted mt-2">{caption}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setReplay((value) => value + 1)}
        >
          <RotateCcw size={12} />
          Replay
        </Button>
      </div>
      {variants && (
        <div
          className="catalog-variants mb-4"
          role="group"
          aria-label={`${title} variant`}
        >
          {variants.map((value) => (
            <Button
              type="button"
              variant="quiet"
              size="sm"
              key={value}
              aria-pressed={variant === value}
              onClick={() => setVariant(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      )}
      <div className="catalog-preview">
        <Fragment key={`${variant}:${replay}`}>{children(variant)}</Fragment>
      </div>
      <p className="text-xs text-muted leading-relaxed mt-4">
        Interactive sample data. Connect actions to your own feature when you’re
        ready.
      </p>
    </section>
  );
}
