"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export function Pagination({
  page,
  pageCount,
  onPageChange,
  disabled,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.min(count, Math.max(1, Math.floor(page)));
  const start = Math.max(1, Math.min(current - 2, count - 4));
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <span className="text-xs text-muted" role="status">
        Page {current} of {count}
      </span>
      <div className="flex gap-1">
        <Button
          size="xs"
          aria-label="Previous page"
          disabled={disabled || current === 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeft size={14} />
        </Button>
        {Array.from(
          { length: Math.min(5, count) },
          (_, index) => start + index,
        ).map((number) => (
          <Button
            key={number}
            size="xs"
            variant={number === current ? "primary" : "quiet"}
            aria-label={`Page ${number}`}
            aria-current={number === current ? "page" : undefined}
            disabled={disabled}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Button>
        ))}
        <Button
          size="xs"
          aria-label="Next page"
          disabled={disabled || current === count}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </nav>
  );
}
