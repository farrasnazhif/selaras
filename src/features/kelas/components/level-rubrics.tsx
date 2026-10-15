"use client";

import { useState } from "react";
import { BookOpen, Calculator, SpellCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "@/features/kelas/constants/reference-content";

export function LevelRubrics() {
  return <div className="grid gap-4 xl:grid-cols-2">{[{ title: "Panduan level literasi", icon: SpellCheck, levels: LITERACY_LEVELS }, { title: "Panduan level numerasi", icon: Calculator, levels: NUMERACY_LEVELS }].map(({ title, icon: Icon, levels }) => <Card key={title} className="p-4"><h3 className="mb-4 flex items-center gap-2 text-sm font-bold"><Icon size={18} className="text-accent-ink" aria-hidden="true" />{title}</h3><dl className="divide-y divide-line">{levels.map((level) => <div key={level.value} className="grid gap-1 py-2 text-xs leading-relaxed sm:grid-cols-[100px_1fr]"><dt className="font-semibold">{level.label}</dt><dd className="text-muted">{level.description}</dd></div>)}</dl></Card>)}</div>;
}

export function DiagnosticGuide() {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen} title="Panduan level" description="Gunakan panduan ini untuk mengenali kemampuan membaca dan berhitung siswa." trigger={<Button size="xs" variant="quiet"><BookOpen size={16} aria-hidden="true" />Panduan level</Button>}><LevelRubrics /></Dialog>;
}
