import type { ClassKey, PreviewAssessment, PreviewStudent } from "@/features/shared/types/preview";

export const EXAMPLE_CLASS_ID = "kelas-rangkap-2-3";
export const CLASS_KEYS: ClassKey[] = ["first", "second"];
export const GROUP_KEYS = ["A", "B", "C"] as const;
export const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6].map((grade) => ({ value: String(grade), label: `Kelas ${grade}` }));

// Fictional, fixed seed 7173: rounded N(3, 1), clamped to levels 1–5; never sampled during render.
// Columns: name, current literacy/numeracy, previous literacy/numeracy.
const ROSTER: Record<ClassKey, [string, number, number, number, number][]> = {
  first: [
    ["Ayu", 3, 2, 3, 3],
    ["Bima", 3, 4, 3, 3],
    ["Citra", 3, 3, 2, 3],
    ["Dimas", 1, 4, 4, 2],
    ["Eka", 5, 3, 5, 4],
    ["Fajar", 4, 3, 1, 3],
    ["Gita", 4, 4, 3, 4],
    ["Adi", 3, 4, 2, 3],
    ["Bagas", 2, 4, 3, 5],
    ["Deni", 3, 3, 4, 4],
    ["Elin", 4, 3, 4, 3],
    ["Farah", 3, 2, 4, 5],
    ["Galih", 3, 3, 2, 3],
    ["Hadi", 4, 3, 4, 4],
    ["Intan", 3, 2, 4, 3],
    ["Jihan", 4, 4, 3, 3],
    ["Kevin", 3, 1, 2, 4],
    ["Lia", 4, 5, 4, 3],
    ["Miko", 4, 2, 3, 3],
    ["Nina", 3, 3, 1, 3],
    ["Putra", 3, 4, 4, 4],
    ["Raka", 2, 3, 4, 5],
    ["Sari", 2, 3, 1, 3],
    ["Tania", 2, 1, 2, 2],
    ["Umar", 1, 3, 1, 2],
    ["Vina", 4, 2, 3, 3],
    ["Wawan", 2, 2, 2, 4],
    ["Yani", 3, 3, 3, 3],
    ["Zahra", 3, 2, 4, 2],
    ["Adit", 2, 3, 1, 4],
    ["Bella", 3, 3, 3, 3],
    ["Candra", 2, 3, 3, 4],
  ],
  second: [
    ["Hana", 3, 2, 4, 2],
    ["Indra", 4, 3, 3, 4],
    ["Joko", 4, 3, 3, 4],
    ["Kirana", 3, 3, 4, 3],
    ["Lestari", 2, 3, 5, 3],
    ["Maya", 2, 1, 3, 2],
    ["Nanda", 4, 2, 3, 2],
    ["Oka", 2, 2, 2, 3],
    ["Prita", 2, 3, 2, 1],
    ["Qori", 1, 3, 4, 3],
    ["Ratih", 3, 4, 4, 2],
    ["Sinta", 1, 3, 3, 4],
    ["Taufik", 2, 4, 3, 4],
    ["Uli", 5, 2, 5, 3],
    ["Vito", 4, 3, 3, 4],
    ["Winda", 4, 2, 2, 2],
    ["Yuda", 4, 2, 4, 1],
    ["Zaki", 1, 1, 4, 3],
    ["Anisa", 2, 3, 4, 3],
    ["Beni", 2, 2, 2, 4],
    ["Chika", 3, 5, 4, 3],
    ["Daffa", 3, 3, 4, 2],
    ["Elsa", 4, 4, 4, 3],
    ["Fikri", 2, 4, 3, 3],
    ["Gina", 3, 2, 2, 3],
    ["Hilmi", 3, 3, 3, 3],
    ["Ika", 3, 3, 4, 2],
    ["Jesi", 2, 3, 3, 3],
    ["Karin", 3, 3, 3, 4],
    ["Lukman", 4, 4, 3, 3],
    ["Nisa", 2, 2, 2, 2],
    ["Rani", 3, 4, 5, 4],
  ],
};

export const PREVIEW_STUDENTS: PreviewStudent[] = CLASS_KEYS.flatMap((classKey, classIndex) =>
  ROSTER[classKey].map(([name, literacy, numeracy], index) => ({
    id: `sample-${String(classIndex * 32 + index + 1).padStart(2, "0")}`,
    name,
    classKey,
    group: GROUP_KEYS[index % GROUP_KEYS.length],
    classroomId: EXAMPLE_CLASS_ID,
    literacy: String(literacy),
    numeracy: String(numeracy),
  })),
);

export const PREVIEW_ASSESSMENTS: PreviewAssessment[] = PREVIEW_STUDENTS.flatMap((student, index) => {
  const [, , , previousLiteracy, previousNumeracy] = ROSTER[student.classKey][index % 32];
  return [
    { id: `${student.id}-literasi-awal`, studentId: student.id, subject: "literasi", level: String(previousLiteracy), recordedAt: "2026-10-07T12:00:00" },
    { id: `${student.id}-numerasi-awal`, studentId: student.id, subject: "numerasi", level: String(previousNumeracy), recordedAt: "2026-10-07T12:00:00" },
    { id: `${student.id}-literasi-terbaru`, studentId: student.id, subject: "literasi", level: student.literacy!, recordedAt: "2026-10-14T12:00:00" },
    { id: `${student.id}-numerasi-terbaru`, studentId: student.id, subject: "numerasi", level: student.numeracy!, recordedAt: "2026-10-14T12:00:00" },
  ];
});

export function phaseForGrade(grade: string) {
  return Number(grade) <= 2 ? "A" : Number(grade) <= 4 ? "B" : "C";
}
