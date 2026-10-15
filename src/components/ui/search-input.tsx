"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Input } from "./input";
import { IconButton } from "./icon-button";

export function SearchInput({
  label,
  onClear,
  onFilterClick,
  className = "",
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  onClear?: () => void;
  onFilterClick?: () => void;
}) {
  return (
    <div
      className={`relative flex h-[40px] w-full items-center rounded-[10px] bg-[#F2F0F6] px-4 ${className}`}
    >
      <Search
        size={16}
        strokeWidth={2.2}
        aria-hidden="true"
        className="shrink-0 text-[#858096]"
      />

      <Input
        {...props}
        type="search"
        aria-label={label}
        placeholder={props.placeholder ?? label}
        className={`h-full min-w-0 flex-1 border-none bg-transparent px-3 text-xs text-[#25232D] shadow-none outline-none ring-0 placeholder:text-[#858096] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-search-cancel-button]:hidden`}
      />

      <div className="flex shrink-0 items-center gap-1">
        {onClear && Boolean(props.value) && (
          <IconButton
            label="Clear search"
            variant="quiet"
            size="sm"
            disabled={props.disabled}
            onClick={onClear}
            className="rounded-full text-[#858096] hover:bg-black/5"
          >
            <X size={16} />
          </IconButton>
        )}

        {onFilterClick && (
          <IconButton
            label="Filter kelas"
            variant="quiet"
            size="sm"
            disabled={props.disabled}
            onClick={onFilterClick}
            className="rounded-full text-[#858096] hover:bg-black/5"
          >
            <SlidersHorizontal size={19} strokeWidth={2.2} />
          </IconButton>
        )}
      </div>
    </div>
  );
}
