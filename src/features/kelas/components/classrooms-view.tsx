"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Card } from "@/components/ui/card";
import {
  classPath,
  classroomTitle,
  displayDate,
} from "@/features/shared/constants/presentation";
import { usePreview } from "@/features/shared/components/preview-provider";
import { getClassroomCardVariant } from "../constants/card-variants";
import Image from "next/image";
import { SearchInput } from "@/components/ui/search-input";

export function ClassroomsView() {
  const { classrooms, sessions, allStudents } = usePreview();
  const [query, setQuery] = useState("");
  const visible = classrooms.filter((classroom) => classroomTitle(classroom).toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")));
  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-5">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold md:text-[28px]">Ruang Kelas</h1>
          <p className="text-sm text-muted">Kelola Ruangan Kelas Anda</p>
        </div>

        <SearchInput label="Cari kelas" placeholder="Cari kelas" value={query} onChange={(event) => setQuery(event.target.value)} className="w-36 shrink-0 sm:w-56" />
      </header>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((classroom) => {
          const lastSession = sessions
            .filter((session) => session.classroomId === classroom.id)
            .at(-1);
          const members = allStudents.filter((student) => student.classroomId === classroom.id);
          const count = members.length;
          const variant = getClassroomCardVariant(classroom.id);
          const Icon = variant.icon;
          return (
            <Link
              key={classroom.id}
              href={classPath(classroom.id)}
              className="block rounded-card"
            >
              <Card className="relative flex flex-col h-full min-h-48 p-0">
                {/* banner */}
                <div className="relative h-18 w-full shrink-0 overflow-hidden rounded-t-[18px]">
                  <Image
                    src={variant.banner}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={24}
                      strokeWidth={2.5}
                      className={`shrink-0 ${variant.iconColor}`}
                      aria-hidden="true"
                    />
                    <h2 className="text-xl font-bold">
                      {classroomTitle(classroom)}
                    </h2>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
                    <span role="img" aria-label={`${count} siswa`} className="flex items-center gap-2">
                      <span aria-hidden="true"><AvatarGroup people={members.slice(0, 3).map((student) => ({ name: student.name }))} max={3} /></span>
                      <span aria-hidden="true" className="text-sm font-bold">{count}</span>
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
      {!visible.length && <p role="status" className="py-8 text-sm text-muted">Tidak ada kelas yang sesuai.</p>}
    </div>
  );
}
