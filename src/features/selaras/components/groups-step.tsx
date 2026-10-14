"use client";

import { useState } from "react";
import { ArrowLeftRight, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { CLASS_KEYS, GROUP_KEYS } from "../constants/preview";
import { GROUP_LABELS } from "../constants/reference-content";
import { usePreview } from "./preview-provider";

const groupSurfaces = {
  A: "bg-[var(--pastel-blue)]",
  B: "bg-[var(--pastel-mint)]",
  C: "bg-[var(--pastel-yellow)]",
};

export function GroupsStep() {
  const { grades, students, moveStudent } = usePreview();
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-window border border-line bg-surface p-4">
        <div className="max-w-xl">
          <p className="text-sm font-semibold">Susunan kelompok contoh</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Pembagian ini untuk menjelajahi antarmuka, bukan hasil pengelompokan
            berdasarkan level. Coba pindahkan siswa dalam kelas yang sama.
          </p>
        </div>
        <div>
          <Button variant="secondary" disabled aria-describedby="grouping-hint">
            <Sparkles size={16} aria-hidden="true" />
            Kelompokkan otomatis
          </Button>
          {/* <p id="grouping-hint" className="mt-2 max-w-52 text-xs text-muted">
            Aturan pengelompokan otomatis belum ditetapkan.
          </p> */}
        </div>
      </div>
      {CLASS_KEYS.map((classKey) => (
        <section key={classKey} aria-labelledby={`groups-${classKey}`}>
          <div className="mb-4 flex items-center gap-3">
            <h2 id={`groups-${classKey}`} className="text-2xl font-bold">
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
          <div className="grid items-start gap-4 sm:grid-cols-3">
            {GROUP_KEYS.map((group) => {
              const members = students.filter(
                (student) =>
                  student.classKey === classKey && student.group === group,
              );
              return (
                <Card key={group} className="min-w-0 p-4">
                  <div
                    className={`mb-4 rounded-control p-3 ${groupSurfaces[group]}`}
                  >
                    <h3 className="text-lg font-bold">
                      Kelompok {GROUP_LABELS[group]}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {members.length} siswa · level bervariasi
                    </p>
                  </div>
                  {members.length ? (
                    <ul className="divide-y divide-line">
                      {members.map((student) => (
                        <li
                          key={student.id}
                          className="flex items-center gap-2 py-3"
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
