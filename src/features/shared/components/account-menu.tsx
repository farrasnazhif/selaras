"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { logout } from "@/features/auth/api/auth";
import { useAuth } from "@/providers/auth-provider";

export function AccountMenu() {
  const user = useAuth();
  const cache = useQueryClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!user) return null;
  const email = user.email ?? "";
  const metadataName: unknown = user.user_metadata?.full_name;
  const name = typeof metadataName === "string" && metadataName.trim() ? metadataName : email.split("@")[0] || "Guru";

  async function signOut() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await logout();
      cache.clear();
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Belum dapat keluar. Periksa koneksi dan coba lagi.");
      setBusy(false);
    }
  }
  return (
    <div className="relative">
      <DropdownMenu
        trigger={
          <Button variant="quiet" disabled={busy} className="h-11 gap-2 px-1.5 sm:px-ui-sm" aria-label={`Opsi akun ${email}`}>
            <span aria-hidden="true"><Avatar name={name} /></span>
            <span className="hidden min-w-0 text-left lg:block">
              <span className="block max-w-48 truncate text-sm font-semibold leading-[18px]">{name}</span>
              <span className="block max-w-48 truncate text-xs font-normal leading-[14px] text-muted">{email}</span>
            </span>
          </Button>
        }
        header={<div><p className="text-sm font-bold">{name}</p><p className="mt-1 break-all text-xs text-muted">{email}</p></div>}
        items={[
          { id: "settings", label: "Pengaturan", icon: <Settings size={16} aria-hidden="true" />, disabled: true, onSelect: () => {} },
          { id: "sign-out", label: busy ? "Keluar…" : "Keluar", icon: <LogOut size={16} aria-hidden="true" />, disabled: busy, danger: true, onSelect: signOut },
        ]}
      />
      {error && <div className="absolute right-0 top-full z-50 mt-2 w-64"><Callout title="Gagal keluar" tone="danger">{error}</Callout></div>}
    </div>
  );
}
