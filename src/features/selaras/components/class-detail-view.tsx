"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { phaseForGrade } from "../constants/preview";
import { classPath, classroomTitle } from "../constants/presentation";
import { usePreview } from "./preview-provider";
import { ClassUnavailable } from "./class-unavailable";
import { LevelsView } from "./levels-view";
import { ClassStudentsView } from "./class-students-view";
import { ClassSessionsView } from "./class-sessions-view";
import { ProgressView } from "./progress-view";

export type ClassTab = "siswa" | "level" | "progres" | "sesi";

export function ClassDetailView({ tab = "level" }: { tab?: ClassTab }) {
  const { classroom, classrooms, grades } = usePreview();
  const router = useRouter();
  if (!classroom) return <ClassUnavailable />;
  const firstPhase = phaseForGrade(grades.first);
  const secondPhase = phaseForGrade(grades.second);
  return (
    <div className="space-y-5">
      <Breadcrumbs
        items={[
          { label: "Kelas", href: "/kelas" },
          { label: classroomTitle(classroom) },
        ]}
      />
      <header>
        <div className="flex items-end justify-between">
          <div>
            <Badge tone="primary">
              {firstPhase === secondPhase
                ? `Satu fase (${firstPhase})`
                : `Lintas fase (${firstPhase} + ${secondPhase})`}
            </Badge>
            <h1 className="mt-1 text-[28px] font-bold">
              {classroomTitle(classroom)}
            </h1>
            <p className="text-sm text-muted">
              Penyesuaian capaian level dasar literasi dan numerasi TaRL
              (Teaching at the Right Level).
            </p>
          </div>
          <div className="w-64 max-w-full">
            <Select
              value={classroom.id}
              options={classrooms.map((item) => ({
                value: item.id,
                label: classroomTitle(item),
              }))}
              onValueChange={(value) => {
                if (value && value !== classroom.id)
                  router.push(`${classPath(value)}/${tab}`);
              }}
              triggerProps={{ "aria-label": "Pilih kelas rangkap" }}
            />
          </div>
        </div>
      </header>
      <Tabs
        key={classroom.id}
        label="Detail kelas rangkap"
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
