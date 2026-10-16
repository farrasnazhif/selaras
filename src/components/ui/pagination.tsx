"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export function Pagination({
  page,
  pageCount,
  onPageChange,
  disabled,
  locale = "en",
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  locale?: "en" | "id";
}) {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.min(count, Math.max(1, Math.floor(page)));
  const start = Math.max(1, Math.min(current - 2, count - 4));
  return (
    <nav
      aria-label={locale === "id" ? "Halaman" : "Pagination"}
      className="flex flex-col items-center justify-center gap-3"
    >
      <span className="text-xs text-muted" role="status">
        {locale === "id"
          ? `Halaman ${current} dari ${count}`
          : `Page ${current} of ${count}`}
      </span>
      <div className="flex gap-1">
        <Button
          size="xs"
          aria-label={locale === "id" ? "Halaman sebelumnya" : "Previous page"}
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
            aria-label={`${locale === "id" ? "Halaman" : "Page"} ${number}`}
            aria-current={number === current ? "page" : undefined}
            disabled={disabled}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Button>
        ))}
        <Button
          size="xs"
          aria-label={locale === "id" ? "Halaman berikutnya" : "Next page"}
          disabled={disabled || current === count}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </nav>
  );
}
