"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps, ReactNode } from "react";

export function Tabs({ items, label, variant = "default", ...props }: ComponentProps<typeof BaseTabs.Root> & { label: string; variant?: "default" | "underline"; items: { value: string; label: string; content: ReactNode; disabled?: boolean }[] }) {
  return <BaseTabs.Root {...props} data-variant={variant}>
    <BaseTabs.List className="tabs-list" aria-label={label}>{items.map((item) => <BaseTabs.Tab key={item.value} value={item.value} disabled={item.disabled} className="tab">{item.label}</BaseTabs.Tab>)}{variant === "underline" && <BaseTabs.Indicator renderBeforeHydration className="ui-tab-indicator" />}</BaseTabs.List>
    {items.map((item) => <BaseTabs.Panel key={item.value} value={item.value} className="pt-5 text-sm text-muted">{item.content}</BaseTabs.Panel>)}
  </BaseTabs.Root>;
}
