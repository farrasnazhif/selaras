"use client";

import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

// shortcut: demo identity only, use a verified profile when backend integration is requested.
const profile = { name: "Guru Demo", email: "guru@selaras.example" };

export function AccountFooter() {
  return (
    <DropdownMenu
      trigger={
        <Button
          variant="quiet"
          className="w-full justify-start px-0.5"
          aria-label={`Opsi akun demo ${profile.email}`}
        >
          <span aria-hidden="true">
            <Avatar name={profile.name} />
          </span>
          <span className="sidebar-account-copy min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-semibold leading-[18px]">
              {profile.name}
            </span>
            <span className="block truncate text-[11px] font-normal leading-[14px] text-muted">
              {profile.email}
            </span>
          </span>
          <ChevronsUpDown
            size={14}
            className="sidebar-account-copy shrink-0 text-muted"
            aria-hidden="true"
          />
        </Button>
      }
      header={
        <div>
          <p className=" text-sm font-bold">{profile.name}</p>
          <p className="mt-1 break-all text-xs text-muted">{profile.email}</p>
        </div>
      }
      items={[
        {
          id: "settings",
          label: "Settings",
          icon: <Settings size={16} aria-hidden="true" />,
          disabled: true,
          onSelect: () => {},
        },
        {
          id: "sign-out",
          label: "Sign out",
          icon: <LogOut size={16} aria-hidden="true" />,
          disabled: true,
          danger: true,
          onSelect: () => {},
        },
      ]}
    />
  );
}
