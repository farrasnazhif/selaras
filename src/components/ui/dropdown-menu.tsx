"use client";

import { Menu } from "@base-ui/react/menu";
import type { ReactElement, ReactNode } from "react";
import GlideMenu from "./glide-menu";

export type MenuAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onSelect: () => void;
};

export function DropdownMenu({
  trigger,
  items,
  header,
}: {
  trigger: ReactElement;
  items: MenuAction[];
  header?: ReactNode;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger render={trigger} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end" className="ui-positioner">
          <Menu.Popup className="ui-popup min-w-44">
            {header && (
              <div className="mb-1 border-b border-line px-3 py-3">
                {header}
              </div>
            )}
            <GlideMenu className="space-y-1">
              {items.map((item, index) => (
                <Menu.Item
                  key={item.id}
                  data-menu-row
                  disabled={item.disabled}
                  onClick={item.onSelect}
                  className={`ui-option ui-coded-option relative z-1 ui-tone-${item.danger ? "pink" : ["purple", "cyan", "green", "yellow"][index % 4]}`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </Menu.Item>
              ))}
            </GlideMenu>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
