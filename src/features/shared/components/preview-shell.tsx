"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Info, Layers3 } from "lucide-react";
import { AccountMenu } from "./account-menu";

export function PreviewShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname !== "/kelas" && !pathname.startsWith("/kelas/") && pathname !== "/jadwal") return children;
  const active = pathname.startsWith("/jadwal") ? 1 : 0;
  return (
    <div lang="id" className="selaras-shell min-h-dvh bg-canvas text-ink">
      <header className="product-header sticky top-0 z-40 border-b-2 border-line bg-surface">
        <div className="mx-auto grid min-h-[76px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-ui-sm md:px-ui-md">
          <Link href="/kelas" className="flex w-fit items-center gap-2 text-lg font-extrabold sm:text-xl" aria-label="Selaras · Kelas">
            <Layers3 size={26} className="shrink-0 text-accent" strokeWidth={2.5} aria-hidden="true" />
            <span className="hidden min-[400px]:inline">Selaras</span>
          </Link>
          <nav aria-label="Navigasi utama" className="product-nav relative grid h-full grid-cols-2 text-center">
            {[{ href: "/kelas", label: "Kelas" }, { href: "/jadwal", label: "Jadwal" }].map((item, index) => <Link key={item.href} href={item.href} aria-current={active === index ? "page" : undefined} className="flex min-h-[76px] items-center justify-center px-ui-sm text-sm font-extrabold text-black sm:px-ui-md sm:text-base">{item.label}</Link>)}
            <span aria-hidden="true" className="product-nav-line pointer-events-none absolute inset-x-0 bottom-0 h-1 w-1/2 rounded-t-full bg-primary" style={{ transform: `translateX(${active * 100}%)` }} />
          </nav>
          <div className="flex min-w-0 justify-end"><AccountMenu /></div>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-[1200px] px-ui-sm py-ui-md md:px-ui-md lg:py-ui-group">{children}</main>
      <footer className="print-hidden mx-auto flex max-w-[1200px] items-start gap-2 px-ui-sm pb-ui-md text-xs text-muted md:px-ui-md"><Info size={15} className="shrink-0" aria-hidden="true" /><p>Data latihan. Perubahan hilang jika halaman dimuat ulang.</p></footer>
    </div>
  );
}
