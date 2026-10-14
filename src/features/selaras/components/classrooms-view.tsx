"use client";

import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { phaseForGrade } from "../constants/preview";
import {
  classPath,
  classroomTitle,
  displayDate,
} from "../constants/presentation";
import { usePreview } from "./preview-provider";
import { CreateClassroomDialog } from "./create-classroom-dialog";

export function ClassroomsView() {
  const { classrooms, sessions, allStudents } = usePreview();
  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-[28px] font-bold">Kelas</h1>
          <p className="text-sm text-muted">
            Kelola rombongan belajar dan jadwal pembelajaran kelas rangkap.
          </p>
        </div>
        <CreateClassroomDialog />
      </header>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {classrooms.map((classroom) => {
          const lastSession = sessions
            .filter((session) => session.classroomId === classroom.id)
            .at(-1);
          const first = phaseForGrade(classroom.grades.first);
          const second = phaseForGrade(classroom.grades.second);
          const count = allStudents.filter(
            (student) => student.classroomId === classroom.id,
          ).length;
          return (
            <Link
              key={classroom.id}
              href={classPath(classroom.id)}
              className="block rounded-card"
            >
              <Card className="flex h-full min-h-48 flex-col">
                <div className="flex flex-wrap items-center justify-start gap-2">
                  <div className="mt-3">
                    <Badge tone="primary">
                      {first === second
                        ? `Satu fase (${first})`
                        : `Lintas fase (${first} + ${second})`}
                    </Badge>
                  </div>
                  {/* <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    <span className="size-2 rounded-full bg-primary" />
                    Rombel aktif
                  </span> */}
                  {/* <Badge tone="warning">Data fiktif</Badge> */}
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  {classroomTitle(classroom)}
                </h2>
                {/* <div className="mt-3">
                  <Badge tone="primary">
                    {first === second
                      ? `Satu fase (${first})`
                      : `Lintas fase (${first} + ${second})`}
                  </Badge>
                </div> */}
                <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Users size={15} aria-hidden="true" />
                    {count} siswa
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={15} aria-hidden="true" />
                    {lastSession
                      ? `Sesi terakhir ${displayDate(lastSession.date)}`
                      : "Belum ada sesi"}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
