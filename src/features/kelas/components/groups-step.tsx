"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { GROUP_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_LABELS, GROUP_LEVELS } from "@/features/kelas/constants/groups";
import {
  LITERACY_LEVELS,
  NUMERACY_LEVELS,
} from "@/features/kelas/constants/reference-content";
import { usePreview } from "@/features/shared/components/preview-provider";

const groupSurfaces = {
  A: "bg-[var(--pastel-blue)]",
  B: "bg-[var(--pastel-mint)]",
  C: "bg-[var(--pastel-yellow)]",
};

export function GroupsStep() {
  const { grades, students, groupSubject, moveStudent, classKeys, saving } =
    usePreview();
  const levels =
    groupSubject === "literasi" ? LITERACY_LEVELS : NUMERACY_LEVELS;
  const [message, setMessage] = useState("");
  const [pages, setPages] = useState<Record<string, number>>({});
  return (
    <div className="space-y-ui-group">
      <Callout title={`Susunan kelompok ${groupSubject}`} tone="info">
        Susunan awal mengikuti level {groupSubject}. Gunakan tombol panah untuk
        memindahkan anggota dalam kelas yang sama.
      </Callout>
      {classKeys.map((classKey) => (
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
              const pageKey = `${groupSubject}-${classKey}-${group}`;
              const pageCount = Math.max(1, Math.ceil(members.length / 5));
              const page = Math.min(pages[pageKey] ?? 1, pageCount);
              const pageMembers = members.slice((page - 1) * 5, page * 5);
              const emptyRows = 5 - Math.max(pageMembers.length, 1);
              return (
                <Card key={group} className="min-w-0 p-ui-sm">
                  <div
                    className={`mb-2 rounded-control border-2 border-line p-ui-sm ${groupSurfaces[group]}`}
                  >
                    <h3 className="text-lg font-bold">
                      Kelompok {GROUP_LABELS[group]}
                    </h3>
                    <div className="flex justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold">
                          {members.length} siswa
                        </p>
                      </div>
                      <p className="mt-1 text-xs font-semibold">
                        {GROUP_LEVELS[group]}
                      </p>
                    </div>
                  </div>
                  <ul className="divide-y divide-line">
                    {pageMembers.map((student) => {
                      const level = levels.find(
                        (option) =>
                          option.value ===
                          student[
                            groupSubject === "literasi"
                              ? "literacy"
                              : "numeracy"
                          ],
                      );
                      return (
                        <li
                          key={student.id}
                          className="flex h-16 items-center gap-2 py-1"
                        >
                          <div className="w-full flex items-center justify-between">
                            <p className="break-words text-sm font-semibold">
                              {student.name}
                            </p>
                            <Badge
                              tone={level ? "primary" : "warning"}
                              className="mt-1 max-w-full flex-wrap whitespace-normal before:hidden"
                            >
                              {level ? (
                                <>
                                  <span>Level {level.value}:</span>{" "}
                                  <span>{level.label}</span>
                                </>
                              ) : (
                                "Belum dinilai"
                              )}
                            </Badge>
                          </div>
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
                              disabled: saving || target === group,
                              onSelect: async () => {
                                if (!await moveStudent(student.id, target)) return;
                                setMessage(
                                  `${student.name} dipindahkan ke Kelompok ${GROUP_LABELS[target]} untuk ${groupSubject}, Kelas ${grades[classKey]}.`,
                                );
                              },
                            }))}
                          />
                        </li>
                      );
                    })}
                    {!pageMembers.length && (
                      <li className="flex h-16 items-center text-xs text-muted">
                        Belum ada siswa di kelompok ini.
                      </li>
                    )}
                    {Array.from({ length: emptyRows }, (_, index) => (
                      <li
                        key={`empty-${index}`}
                        aria-hidden="true"
                        className="h-16"
                      />
                    ))}
                  </ul>
                  <div className="mt-ui-sm">
                    <Pagination
                      locale="id"
                      page={page}
                      pageCount={pageCount}
                      disabled={members.length <= 5}
                      onPageChange={(nextPage) =>
                        setPages((current) => ({
                          ...current,
                          [pageKey]: nextPage,
                        }))
                      }
                    />
                  </div>
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
