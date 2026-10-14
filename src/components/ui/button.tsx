"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "quiet";

type Props = Omit<ComponentProps<typeof BaseButton>, "className" | "color"> & {
  variant?: ButtonVariant;
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
};

export function Button({
  variant = "ghost",
  size = "sm",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: Props) {
  // Preserve legacy md/lg props with the default small presentation.
  size = size === "xs" ? "xs" : "sm";
  return (
    <BaseButton
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || props["aria-busy"]}
      data-loading={loading || undefined}
      className={`button button-${variant} button-${size} ${className}`}
    >
      {loading && (
        <LoaderCircle
          aria-hidden="true"
          className="size-[1em] shrink-0 animate-spin motion-reduce:animate-none"
        />
      )}
      {children}
    </BaseButton>
  );
}
