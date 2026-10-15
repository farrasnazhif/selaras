"use client";

import { useState } from "react";
import { ArrowLeftRight, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { CLASS_KEYS, GROUP_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_LABELS } from "@/features/kelas/constants/groups";
import { usePreview } from "@/features/shared/components/preview-provider";

const groupSurfaces = {
  A: "bg-[var(--pastel-blue)]",
  B: "bg-[var(--pastel-mint)]",
  C: "bg-[var(--pastel-yellow)]",
};

export function GroupsStep() {
  const { grades, students, moveStudent } = usePreview();
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-ui-group">
      <div className="flex flex-wrap items-center justify-between gap-ui-sm rounded-window border-2 border-line bg-surface p-ui-sm">
        <div className="max-w-xl">
          <p className="text-sm font-semibold">Susunan kelompok</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Atur anggota tiap kelompok. Gunakan tombol panah di samping nama siswa untuk memindahkannya ke kelompok lain dalam kelas yang sama.
          </p>
        </div>
      </div>
      {CLASS_KEYS.map((classKey) => (
        <section key={classKey} aria-labelledby={`groups-${classKey}`}>
          <div className="mb-ui-sm flex items-center gap-ui-sm">
            <h2 id={`groups-${classKey}`} className="text-xl font-extrabold">
              Kelas {grades[classKey]}
            </h2>
            <Badge tone="neutral">
              {
                students.filter((student) => student.classKey === classKey)
                  .length
              }{" "}
              siswa
            </Badge>
          </div>
          <div className="grid items-start gap-ui-sm md:grid-cols-3">
            {GROUP_KEYS.map((group) => {
              const members = students.filter(
                (student) =>
                  student.classKey === classKey && student.group === group,
              );
              return (
                <Card key={group} className="min-w-0 p-ui-sm">
                  <div
                    className={`mb-2 rounded-control border-2 border-line p-ui-sm ${groupSurfaces[group]}`}
                  >
                    <h3 className="text-lg font-bold">
                      Kelompok {GROUP_LABELS[group]}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {members.length} siswa
                    </p>
                  </div>
                  {members.length ? (
                    <ul className="divide-y divide-line">
                      {members.map((student) => (
                        <li
                          key={student.id}
                          className="flex items-center gap-2 py-ui-sm"
                        >
                          <span className="min-w-0 flex-1 break-words text-sm font-semibold">
                            {student.name}
                          </span>
                          <DropdownMenu
                            trigger={
                              <IconButton
                                size="xs"
                                variant="quiet"
                                label={`Pindahkan ${student.name} dalam kelas ${grades[classKey]}`}
                              >
                                <ArrowLeftRight size={15} />
                              </IconButton>
                            }
                            items={GROUP_KEYS.map((target) => ({
                              id: target,
                              label: `Ke Kelompok ${GROUP_LABELS[target]}`,
                              disabled: target === group,
                              onSelect: () => {
                                moveStudent(student.id, target);
                                setMessage(
                                  `${student.name} dipindahkan ke Kelompok ${GROUP_LABELS[target]}, Kelas ${grades[classKey]}.`,
                                );
                              },
                            }))}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      title="Kelompok kosong"
                      icon={<Users size={22} />}
                    />
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      ))}
      <p role="status" className="min-h-5 text-sm text-muted">
        {message}
      </p>
    </div>
  );
}
