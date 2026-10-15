"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

export type SelectOption = { value: string; label: string; disabled?: boolean };

export function Select({
  options,
  placeholder = "Select an option",
  triggerProps,
  ...props
}: BaseSelect.Root.Props<string> & {
  options: SelectOption[];
  placeholder?: string;
  triggerProps?: Omit<ComponentProps<typeof BaseSelect.Trigger>, "className">;
}) {
  return (
    <BaseSelect.Root items={options} {...props}>
      <BaseSelect.Trigger className="input ui-select-trigger" {...triggerProps}>
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon>
          <ChevronDown size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          sideOffset={6}
          alignItemWithTrigger={false}
          className="ui-positioner"
        >
          <BaseSelect.Popup className="ui-popup ui-select-popup">
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="ui-option"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>
                    <Check size={14} />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
