"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRef, type ComponentProps } from "react";
import { Input } from "./input";
import { IconButton } from "./icon-button";

export function SearchInput({
  label,
  onClear,
  onFilterClick,
  clearLabel = "Clear search",
  className = "",
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  onClear?: () => void;
  onFilterClick?: () => void;
  clearLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className={`ui-search-input relative flex h-10 min-w-0 items-center gap-2 rounded-control border border-line bg-inset pl-3 pr-0.5 text-muted ${props.disabled ? "opacity-50" : ""} ${className}`}
      data-invalid={props["aria-invalid"] === true || props["aria-invalid"] === "true" || undefined}
    >
      <Search
        size={16}
        strokeWidth={2.2}
        aria-hidden="true"
        className="shrink-0"
      />

      <Input
        {...props}
        type="search"
        aria-label={label}
        placeholder={props.placeholder ?? label}
        className={`ui-search-field min-w-0 flex-1 text-sm placeholder:text-muted ${onClear ? "[&::-webkit-search-cancel-button]:hidden" : ""}`}
      />

      <div className="flex shrink-0 items-center gap-1">
        {onClear && Boolean(props.value) && (
          <IconButton
            label={clearLabel}
            variant="quiet"
            size="xs"
            disabled={props.disabled}
            onClick={() => { onClear(); containerRef.current?.querySelector("input")?.focus(); }}
            className="text-muted"
          >
            <X size={16} />
          </IconButton>
        )}

        {onFilterClick && (
          <IconButton
            label="Filter kelas"
            variant="quiet"
            size="xs"
            disabled={props.disabled}
            onClick={onFilterClick}
            className="text-muted"
          >
            <SlidersHorizontal size={19} strokeWidth={2.2} />
          </IconButton>
        )}
      </div>
    </div>
  );
}
