import { Callout } from "@/components/ui/callout";
import type { PlanValidation } from "@/features/sesi/types/schedule";

export function PlanStatus({ validation }: { validation: PlanValidation }) {
  return (
    <Callout
      title={
        validation.valid
          ? "Tidak ada bentrok. Jadwal lolos lima pemeriksaan."
          : "Jadwal belum dapat disimpan atau dicetak."
      }
      tone={validation.valid ? "info" : "danger"}
    >
      {!validation.valid && (
        <ul className="list-disc space-y-1 pl-5">
          {validation.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      {validation.checks.length > 0 && (
        <ul className="mt-ui-sm grid gap-2 text-xs sm:grid-cols-2">
          {validation.checks.map((check) => (
            <li key={check.id} className="flex items-center gap-2">
              <span aria-hidden="true">
                {check.errors.length ? "!" : "✓"}
              </span>
              {check.label}
            </li>
          ))}
        </ul>
      )}
    </Callout>
  );
}
