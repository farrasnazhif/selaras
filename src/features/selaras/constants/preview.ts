import { EXAMPLE_CLASS_ID } from "./reference-content";
import type { ClassKey, PreviewStudent } from "../types/preview";

export const CLASS_KEYS: ClassKey[] = ["first", "second"];
export const GROUP_KEYS = ["A", "B", "C"] as const;
export const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6].map((grade) => ({ value: String(grade), label: `Kelas ${grade}` }));

export const PREVIEW_STUDENTS: PreviewStudent[] = [
  { id: "sample-01", name: "Ayu", classKey: "first", group: "A", classroomId: EXAMPLE_CLASS_ID, literacy: "1", numeracy: "1" },
  { id: "sample-02", name: "Bima", classKey: "first", group: "A", classroomId: EXAMPLE_CLASS_ID, literacy: "1", numeracy: "2" },
  { id: "sample-03", name: "Citra", classKey: "first", group: "A", classroomId: EXAMPLE_CLASS_ID, literacy: "2", numeracy: "2" },
  { id: "sample-04", name: "Dimas", classKey: "first", group: "B", classroomId: EXAMPLE_CLASS_ID, literacy: "2", numeracy: "3" },
  { id: "sample-05", name: "Eka", classKey: "first", group: "B", classroomId: EXAMPLE_CLASS_ID, literacy: "3", numeracy: "3" },
  { id: "sample-06", name: "Fajar", classKey: "first", group: "C", classroomId: EXAMPLE_CLASS_ID, literacy: "3", numeracy: "4" },
  { id: "sample-07", name: "Gita", classKey: "first", group: "C", classroomId: EXAMPLE_CLASS_ID, literacy: "2", numeracy: "2" },
  { id: "sample-08", name: "Hana", classKey: "second", group: "A", classroomId: EXAMPLE_CLASS_ID, literacy: "2", numeracy: "3" },
  { id: "sample-09", name: "Indra", classKey: "second", group: "A", classroomId: EXAMPLE_CLASS_ID, literacy: "3", numeracy: "3" },
  { id: "sample-10", name: "Joko", classKey: "second", group: "A", classroomId: EXAMPLE_CLASS_ID, literacy: "4", numeracy: "4" },
  { id: "sample-11", name: "Kirana", classKey: "second", group: "A", classroomId: EXAMPLE_CLASS_ID, literacy: "5", numeracy: "5" },
  { id: "sample-12", name: "Lestari", classKey: "second", group: "B", classroomId: EXAMPLE_CLASS_ID, literacy: "3", numeracy: "4" },
  { id: "sample-13", name: "Maya", classKey: "second", group: "B", classroomId: EXAMPLE_CLASS_ID, literacy: "4", numeracy: "4" },
  { id: "sample-14", name: "Nanda", classKey: "second", group: "B", classroomId: EXAMPLE_CLASS_ID, literacy: "2", numeracy: "2" },
  { id: "sample-15", name: "Oka", classKey: "second", group: "B", classroomId: EXAMPLE_CLASS_ID, literacy: "5", numeracy: "5" },
];

export function phaseForGrade(grade: string) {
  return Number(grade) <= 2 ? "A" : Number(grade) <= 4 ? "B" : "C";
}
