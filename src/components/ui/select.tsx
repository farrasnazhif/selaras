"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { useState, type ComponentProps } from "react";

export type SelectOption = { value: string; label: string; prefix?: string; disabled?: boolean; tone?: "purple" | "pink" | "green" | "cyan" | "yellow" };

const tones = ["purple", "pink", "green", "cyan", "yellow"];

function optionLabel(option: SelectOption) {
  return option.prefix ? <span className="inline-flex items-center gap-2"><span className="font-extrabold tabular-nums">{option.prefix}</span><span>{option.label}</span></span> : option.label;
}

export function Select({
  options,
  placeholder = "Select an option",
  triggerProps,
  value,
  defaultValue,
  onValueChange,
  ...props
}: BaseSelect.Root.Props<string> & {
  options: SelectOption[];
  placeholder?: string;
  triggerProps?: Omit<ComponentProps<typeof BaseSelect.Trigger>, "className">;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const selected = value !== undefined ? value : internalValue;
  const index = options.findIndex((option) => option.value === selected);
  const tone = options[index]?.tone ?? tones[Math.max(0, index) % tones.length];
  return (
    <BaseSelect.Root items={options} {...props} value={selected} onValueChange={(next, details) => { setInternalValue(next); onValueChange?.(next, details); }}>
      <BaseSelect.Trigger className={`input ui-select-trigger ui-tone-${tone}`} {...triggerProps}>
        <BaseSelect.Value placeholder={placeholder}>{options[index]?.prefix ? optionLabel(options[index]) : undefined}</BaseSelect.Value>
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
              {options.map((option, index) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={`ui-option ui-coded-option ui-tone-${option.tone ?? tones[index % tones.length]}`}
                >
                  <BaseSelect.ItemText>{optionLabel(option)}</BaseSelect.ItemText>
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
