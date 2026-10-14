"use client";

import type { ComponentProps } from "react";
import { Button } from "./button";

export function IconButton({ label, children, loading, className = "", ...props }: Omit<ComponentProps<typeof Button>, "aria-label"> & { label: string }) {
  return <Button className={`ui-icon-button ${className}`} {...props} loading={loading} aria-label={label}>{loading ? null : children}</Button>;
}
