"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible } from "@/components/ui/collapsible";
import { IconButton } from "@/components/ui/icon-button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { CLASS_KEYS, GROUP_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_LABELS } from "@/features/kelas/constants/groups";
import { usePreview } from "@/features/shared/components/preview-provider";

const groupTones = { A: "bg-[var(--info-tint)] text-info-ink", B: "bg-green-tint text-green", C: "bg-orange-tint text-orange" };

export function GroupsStep() {
  const { grades, students, moveStudent } = usePreview();
  const [message, setMessage] = useState("");
  return (
    <section className="space-y-ui-md" aria-labelledby="student-groups">
      <header><h2 id="student-groups" className="text-xl font-extrabold">Kelompok siswa</h2><p className="mt-1 text-sm text-muted">Buka anggota untuk melihat atau memindahkan siswa.</p></header>
      <div className="space-y-ui-group">
        {CLASS_KEYS.map((classKey) => <section key={classKey} aria-labelledby={`groups-${classKey}`}>
          <h3 id={`groups-${classKey}`} className="mb-ui-sm text-lg font-bold">Kelas {grades[classKey]}</h3>
          <div className="grid items-start gap-ui-sm md:grid-cols-3">
            {GROUP_KEYS.map((group) => {
              const members = students.filter((student) => student.classKey === classKey && student.group === group);
              return <Card key={group} className="min-w-0 space-y-ui-sm p-ui-sm">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`rounded-control px-3 py-1.5 text-sm font-bold ${groupTones[group]}`}>{GROUP_LABELS[group]}</h4>
                  <Badge tone="neutral">{members.length} siswa</Badge>
                </div>
                {members.length ? <Collapsible label="Lihat anggota">
                  <ul className="divide-y divide-line">
                    {members.map((student) => <li key={student.id} className="flex items-center gap-2 py-1">
                      <span className="min-w-0 flex-1 break-words text-sm font-semibold">{student.name}</span>
                      <DropdownMenu trigger={<IconButton size="xs" variant="quiet" label={`Pindahkan ${student.name} dalam kelas ${grades[classKey]}`}><ArrowLeftRight size={15} /></IconButton>}
                        items={GROUP_KEYS.map((target) => ({
                          id: target, label: `Ke Kelompok ${GROUP_LABELS[target]}`, disabled: target === group,
                          onSelect: () => { moveStudent(student.id, target); setMessage(`${student.name} dipindahkan ke Kelompok ${GROUP_LABELS[target]}, Kelas ${grades[classKey]}.`); },
                        }))} />
                    </li>)}
                  </ul>
                </Collapsible> : <p className="text-sm text-muted">Belum ada anggota.</p>}
              </Card>;
            })}
          </div>
        </section>)}
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>{message}</p>
    </section>
  );
}
