"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tabs } from "@/components/ui/tabs";
import { classPath, classroomTitle } from "@/features/shared/constants/presentation";
import { usePreview } from "@/features/shared/components/preview-provider";
import { ClassUnavailable } from "@/features/shared/components/class-unavailable";
import { LevelsView } from "@/features/kelas/components/levels-view";
import { ClassStudentsView } from "@/features/kelas/components/class-students-view";
import { ClassSessionsView } from "@/features/sesi/components/class-sessions-view";
import { ProgressView } from "@/features/progres/components/progress-view";

export type ClassTab = "siswa" | "level" | "progres" | "sesi";

export function ClassDetailView({ tab = "level" }: { tab?: ClassTab }) {
  const { classroom } = usePreview();
  const router = useRouter();
  if (!classroom) return <ClassUnavailable />;
  return (
    <div className="space-y-ui-md">
      <Breadcrumbs
        items={[
          { label: "Kelas", href: "/kelas" },
          { label: classroomTitle(classroom) },
        ]}
      />
      <header>
        <h1 className="text-[28px] font-extrabold">{classroomTitle(classroom)}</h1>
        <p className="mt-1 text-sm text-muted">Kelola siswa, tingkat kemampuan, dan rencana belajar.</p>
      </header>
      <Tabs
        key={classroom.id}
        label="Detail kelas"
        value={tab}
        onValueChange={(value) =>
          router.push(`${classPath(classroom.id)}/${value}`)
        }
        items={[
          { value: "siswa", label: "Siswa", content: <ClassStudentsView /> },
          { value: "level", label: "Level", content: <LevelsView /> },
          {
            value: "progres",
            label: "Progres",
            content: <ProgressView embedded />,
          },
          { value: "sesi", label: "Sesi", content: <ClassSessionsView /> },
        ]}
      />
    </div>
  );
}
