"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ClassKey } from "@/features/shared/types/preview";
import type { SessionPlan, ScheduleBlock } from "@/features/sesi/types/schedule";
import { reflowPlan } from "@/features/sesi/constants/plan-editing";

export function ScheduleEditor({ plan, grades, blockMinutes, onChange }: {
  plan: SessionPlan; grades: Record<ClassKey, string>; blockMinutes: string; onChange: (plan: SessionPlan) => void;
}) {
  const coreCount = plan.blocks.filter((block) => block.kind === "core").length;
  function changeBlock(index: number, change: Partial<ScheduleBlock>) {
    onChange(reflowPlan({ ...plan, blocks: plan.blocks.map((block, position) => position === index ? { ...block, ...change } : block) }));
  }
  function move(index: number, direction: number) {
    const blocks = [...plan.blocks];
    [blocks[index], blocks[index + direction]] = [blocks[index + direction], blocks[index]];
    onChange(reflowPlan({ ...plan, blocks }));
  }
  function add() {
    const previous = plan.blocks.filter((block) => block.kind === "core").at(-1);
    const teacher: ClassKey[] = !coreCount && plan.mode === "same-phase" ? ["first", "second"] : [previous?.teacherAssignments[0]?.[0] === "first" ? "second" : "first"];
    const block: ScheduleBlock = { ...plan.blocks[0], start: 0, end: Number(blockMinutes), kind: "core", teacherAssignments: [teacher], note: "" };
    onChange(reflowPlan({ ...plan, blocks: [...plan.blocks.slice(0, -1), block, plan.blocks.at(-1)!] }));
  }
  return <section className="space-y-ui-sm" aria-label="Ubah blok jadwal">
    <p className="text-sm text-muted">Pembuka dan penutup tetap 5 menit. Waktu dihitung ulang setelah perubahan. Kedua kelas tetap harus mendapat giliran bersama guru.</p>
    {plan.blocks.map((block, index) => block.kind === "core" ? <div key={index} className="space-y-ui-sm rounded-card border border-line bg-white p-ui-sm">
      <div className="flex flex-wrap items-center justify-between gap-ui-sm">
        <h3 className="text-sm font-bold">Blok {index}, menit {block.start}–{block.end}</h3>
        <div className="flex gap-2">
          <IconButton size="xs" variant="secondary" label={`Naikkan blok ${index}`} disabled={index <= 1} onClick={() => move(index, -1)}><ArrowUp size={15} aria-hidden="true" /></IconButton>
          <IconButton size="xs" variant="secondary" label={`Turunkan blok ${index}`} disabled={index >= plan.blocks.length - 2} onClick={() => move(index, 1)}><ArrowDown size={15} aria-hidden="true" /></IconButton>
          <IconButton size="xs" variant="danger" label={`Hapus blok ${index}`} onClick={() => onChange(reflowPlan({ ...plan, blocks: plan.blocks.filter((_, position) => position !== index) }))}><Trash2 size={15} aria-hidden="true" /></IconButton>
        </div>
      </div>
      <div className="grid gap-ui-sm sm:grid-cols-2">
        <div className="field"><label htmlFor={`block-duration-${index}`}>Lama giliran</label><Select value={String(block.end - block.start)} options={[{ value: "10", label: "10 menit" }, { value: "15", label: "15 menit" }, { value: "20", label: "20 menit" }]} onValueChange={(value) => { if (value) changeBlock(index, { end: block.start + Number(value) }); }} triggerProps={{ id: `block-duration-${index}` }} /></div>
        <div className="field"><label htmlFor={`block-teacher-${index}`}>Bersama guru</label><Select value={block.teacherAssignments[0]?.length === 2 ? "both" : block.teacherAssignments[0]?.[0]} options={[{ value: "first", label: `Kelas ${grades.first}` }, { value: "second", label: `Kelas ${grades.second}` }, ...(plan.mode === "same-phase" ? [{ value: "both", label: "Kedua kelas bersama" }] : [])]} onValueChange={(value) => { if (value) changeBlock(index, { teacherAssignments: [value === "both" ? ["first", "second"] : [value as ClassKey]] }); }} triggerProps={{ id: `block-teacher-${index}` }} /></div>
      </div>
      <div className="field"><label htmlFor={`block-note-${index}`}>Kegiatan bersama guru (opsional)</label><Input id={`block-note-${index}`} maxLength={300} value={block.note ?? ""} placeholder="Bahas bacaan dan tinjau pekerjaan siswa" onChange={(event) => changeBlock(index, { note: event.target.value })} /><p className="text-xs text-muted">Catatan ini ikut dicetak. Hindari nama siswa dan label level.</p></div>
    </div> : <p key={index} className="rounded-control bg-inset p-ui-sm text-sm font-semibold">{block.kind === "opening" ? "Pembukaan bersama" : "Penutup bersama"}, 5 menit</p>)}
    <Button size="xs" variant="secondary" disabled={Number(plan.blocks.at(-1)?.end) + Number(blockMinutes) > 240} onClick={add}><Plus size={15} aria-hidden="true" />Tambah blok</Button>
  </section>;
}
