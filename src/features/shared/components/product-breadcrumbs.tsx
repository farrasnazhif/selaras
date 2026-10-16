"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { usePreview } from "./preview-provider";
import { classPath, classroomTitle, displayDate } from "../constants/presentation";

export function ProductBreadcrumbs() {
  const pathname = usePathname();
  const { classroom, sessions } = usePreview();
  const items: { label: string; href?: string }[] = pathname === "/jadwal"
    ? [{ label: "Jadwal" }]
    : [{ label: "Kelas", href: "/kelas" }];
  if (pathname.startsWith("/kelas/")) {
    if (classroom) {
      const path = classPath(classroom.id);
      items.push({ label: classroomTitle(classroom), href: path });
      const [, , , tab, sessionId] = pathname.split("/");
      const tabs: Record<string, string> = { siswa: "Siswa", level: "Level", progres: "Progres", sesi: "Sesi" };
      if (tab && tabs[tab]) items.push({ label: tabs[tab], href: `${path}/${tab}` });
      if (sessionId === "baru") items.push({ label: "Susun jadwal" });
      else if (sessionId) {
        const session = sessions.find((item) => item.id === sessionId && item.classroomId === classroom.id);
        items.push({ label: session ? `${session.subject === "literasi" ? "Literasi" : "Numerasi"}, ${displayDate(session.date)}` : "Data tidak tersedia" });
      }
    } else items.push({ label: "Data tidak tersedia" });
  }
  return <div className="product-breadcrumbs print-hidden border-b border-line bg-surface">
    <div className="mx-auto flex min-h-10 max-w-[1200px] items-center px-ui-sm py-2 md:px-ui-md [&_ol]:font-extrabold [&_ol]:text-ink"><Breadcrumbs items={items} /></div>
  </div>;
}
