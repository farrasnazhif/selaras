"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./button";

export type ComboboxProps<Multiple extends boolean | undefined = false> = BaseCombobox.Root.Props<string, Multiple> & {
  options: string[];
  placeholder?: string;
  inputProps?: Omit<ComponentProps<typeof BaseCombobox.Input>, "className">;
};

export function Combobox<Multiple extends boolean | undefined = false>({ options, placeholder = "Search options…", inputProps, ...props }: ComboboxProps<Multiple>) {
  const input = <BaseCombobox.Input className={props.multiple ? "ui-chip-input" : "input pr-9"} placeholder={placeholder} {...inputProps} />;
  return <BaseCombobox.Root items={options} {...props}>
    {props.multiple ? <BaseCombobox.Chips className="input ui-chips">
      <BaseCombobox.Value>{(values: string[]) => values.map((value) => <BaseCombobox.Chip key={value} className="ui-chip">
        {value}<BaseCombobox.ChipRemove aria-label={`Remove ${value}`} render={<Button variant="quiet" />}><X size={12} /></BaseCombobox.ChipRemove>
      </BaseCombobox.Chip>)}</BaseCombobox.Value>
      {input}
    </BaseCombobox.Chips> : <div className="relative">
      {input}<BaseCombobox.Trigger aria-label="Show options" render={<Button variant="quiet" className="absolute right-1 top-1 !px-2" />}><ChevronDown size={14} /></BaseCombobox.Trigger>
    </div>}
    <BaseCombobox.Portal><BaseCombobox.Positioner sideOffset={6} className="ui-positioner">
      <BaseCombobox.Popup className="ui-popup ui-select-popup">
        <BaseCombobox.Empty className="p-3 text-xs text-muted">No matches found.</BaseCombobox.Empty>
        <BaseCombobox.List>{(option: string) => <BaseCombobox.Item key={option} value={option} className="ui-option">
          {option}<BaseCombobox.ItemIndicator><Check size={14} /></BaseCombobox.ItemIndicator>
        </BaseCombobox.Item>}</BaseCombobox.List>
      </BaseCombobox.Popup>
    </BaseCombobox.Positioner></BaseCombobox.Portal>
  </BaseCombobox.Root>;
}
