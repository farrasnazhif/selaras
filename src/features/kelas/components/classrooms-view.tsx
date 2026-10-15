"use client";

import Link from "next/link";
import { Atom, CalendarDays, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  classPath,
  classroomTitle,
  displayDate,
} from "@/features/shared/constants/presentation";
import { usePreview } from "@/features/shared/components/preview-provider";
import { CreateClassroomDialog } from "@/features/kelas/components/create-classroom-dialog";

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
          const count = allStudents.filter(
            (student) => student.classroomId === classroom.id,
          ).length;
          return (
            <Link
              key={classroom.id}
              href={classPath(classroom.id)}
              className="block rounded-card"
            >
              <Card className="relative flex flex-col h-full min-h-48 p-0">
                {/* banner */}
                <div className="h-24 w-full shrink-0 overflow-hidden bg-purple-500 rounded-t-xl">
                  <div
                    className="h-full w-full scale-110"
                    style={{
                      background:
                        "radial-gradient(ellipse at 15% 30%, #43135f 0%, transparent 35%), radial-gradient(ellipse at 55% 80%, #db69ed 0%, transparent 45%), radial-gradient(ellipse at 90% 10%, #9639c9 0%, transparent 45%), #b94be1",
                      filter: "blur(18px)",
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Atom />
                    <h2 className="text-xl font-bold">
                      {classroomTitle(classroom)}
                    </h2>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
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
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
