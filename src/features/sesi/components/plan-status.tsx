import { CheckCircle2, AlertCircle } from "lucide-react";
import { Notice } from "@/components/ui/notice";
import type { PlanValidation } from "@/features/sesi/types/schedule";

export function PlanStatus({ validation }: { validation: PlanValidation }) {
  return <Notice tone={validation.valid ? "success" : "error"}>
    <div className="flex items-start gap-2">{validation.valid ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}<p className="font-bold">{validation.valid ? "Tidak ada bentrok. Jadwal lolos lima pemeriksaan." : "Jadwal belum dapat disimpan atau dicetak."}</p></div>
    {!validation.valid && <ul className="mt-2 list-disc space-y-1 pl-5">{validation.errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    {validation.checks.length > 0 && <ul className="mt-ui-sm grid gap-2 text-xs sm:grid-cols-2">{validation.checks.map((check) => <li key={check.id} className="flex items-center gap-2"><span aria-hidden="true">{check.errors.length ? "!" : "✓"}</span>{check.label}</li>)}</ul>}
  </Notice>;
}
