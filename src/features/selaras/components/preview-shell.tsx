"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ChartNoAxesColumnIncreasing,
  CalendarDays,
  GraduationCap,
  Layers3,
  Menu,
} from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import SidebarNav from "@/components/ui/sidebar-nav";
import { classPath } from "../constants/presentation";
import { EXAMPLE_CLASS_ID } from "../constants/reference-content";
import { usePreview } from "./preview-provider";
import { AccountFooter } from "./account-footer";

export function PreviewShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { classroom } = usePreview();
  const base = classPath(classroom?.id ?? EXAMPLE_CLASS_ID);
  const navigation = [
    { href: "/kelas", label: "Kelas", icon: GraduationCap },
    { href: `${base}/sesi`, label: "Sesi", icon: CalendarDays },
    {
      href: `${base}/progres`,
      label: "Progres siswa",
      icon: ChartNoAxesColumnIncreasing,
    },
  ];
  const activeNav = pathname.includes("/sesi")
    ? `${base}/sesi`
    : pathname.endsWith("/progres")
      ? `${base}/progres`
      : "/kelas";
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  function navigate(href: string) {
    setMenuOpen(false);
    router.push(href);
  }
  const sidebar = (
    <SidebarNav
      fill
      header={
        <Link
          href="/kelas"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 font-bold"
        >
          <Layers3 size={18} className="text-accent" aria-hidden="true" />
          Selaras
        </Link>
      }
      navItems={navigation.map(({ href, label, icon: Icon }) => ({
        key: href,
        label,
        icon: <Icon size={18} aria-hidden="true" />,
      }))}
      activeNav={activeNav}
      onNavigate={navigate}
      newChatLabel={null}
      listLabel={null}
      recents={[]}
      footer={<AccountFooter />}
      className="bg-surface py-4"
    >
      {/* <p className="text-xs leading-relaxed text-muted">Data siswa fiktif. Perubahan hilang saat halaman dimuat ulang.</p> */}
    </SidebarNav>
  );

  return (
    <div
      lang="id"
      className="selaras-shell min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[auto_minmax(0,1fr)]"
    >
      <div className="selaras-sidebar sticky top-0 hidden h-dvh border-r border-line lg:block">
        {sidebar}
      </div>
      <div className="min-w-0">
        <div className="selaras-mobile-nav flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
          <Link
            href="/kelas"
            className="flex items-center gap-2 text-xl font-extrabold"
          >
            <Layers3 size={22} className="text-accent" aria-hidden="true" />
            Selaras
          </Link>
          <Drawer
            title="Navigasi Selaras"
            description="Siapkan sesi dan lihat progres siswa."
            open={menuOpen}
            onOpenChange={setMenuOpen}
            trigger={
              <IconButton label="Buka navigasi" variant="secondary">
                <Menu size={20} />
              </IconButton>
            }
          >
            <div className="h-[min(65dvh,640px)]">{sidebar}</div>
          </Drawer>
        </div>
        <main
          id="main-content"
          className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
