import type { GroupKey, PreviewStudent, Subject } from "@/features/shared/types/preview";

export const GROUP_LABELS = { A: "Biru", B: "Hijau", C: "Oranye" };
export const GROUP_COLORS = { A: "var(--cyan)", B: "var(--lime)", C: "var(--yellow)" };
export const GROUP_LEVELS = { A: "Level 1–2", B: "Level 3–5", C: "Level 6" };

export function groupStudentsBySubject(students: PreviewStudent[], subject: Subject, overrides: Partial<Record<string, GroupKey>> = {}) {
  const field = subject === "literasi" ? "literacy" : "numeracy";
  return students.map((student) => {
    const level = student[field];
    let group = student.group;
    if (level === "1" || level === "2") group = "A";
    else if (level === "3" || level === "4" || level === "5") group = "B";
    else if (level === "6") group = "C";
    const override = Object.hasOwn(overrides, student.id) ? overrides[student.id] : undefined;
    return { ...student, group: override ?? group };
  });
}
