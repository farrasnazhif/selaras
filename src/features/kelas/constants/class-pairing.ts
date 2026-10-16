import type { PreviewClassroom, PreviewStudent } from "@/features/shared/types/preview";

export function canCombineGrades(first: string, second: string) {
  if (!/^[1-6]$/.test(first) || !/^[1-6]$/.test(second)) return false;
  const lower = Math.min(Number(first), Number(second));
  const upper = Math.max(Number(first), Number(second));
  return lower % 2 === 1 && upper === lower + 1;
}

export function combineIndependentClassrooms(classrooms: PreviewClassroom[], students: PreviewStudent[], selectedIds: string[], id: string) {
  const selected = classrooms.filter((classroom) => selectedIds.includes(classroom.id)).sort((first, second) => Number(first.grades.first) - Number(second.grades.first));
  if (selectedIds.length !== 2 || new Set(selectedIds).size !== 2 || selected.length !== 2 || selected.some((classroom) => !classroom.independent) || !canCombineGrades(selected[0].grades.first, selected[1].grades.first) || classrooms.some((classroom) => classroom.id === id)) return { ok: false as const, error: "Pilih dua kelas mandiri dari pasangan 1+2, 3+4, atau 5+6." };
  const classroom: PreviewClassroom = { id, grades: { first: selected[0].grades.first, second: selected[1].grades.first }, sourceIds: { first: selected[0].id, second: selected[1].id } };
  return {
    ok: true as const,
    classroom,
    classrooms: [classroom, ...classrooms.filter((item) => !selectedIds.includes(item.id))],
    students: students.map((student) => student.classroomId === selected[0].id ? { ...student, classroomId: id, classKey: "first" as const } : student.classroomId === selected[1].id ? { ...student, classroomId: id, classKey: "second" as const } : student),
  };
}
