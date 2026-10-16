import type { PreviewClassroom } from "@/features/shared/types/preview";

export function classroomTitle(classroom: PreviewClassroom) {
  const first = classroom.grades.first + (classroom.sections?.first ?? "");
  const second = classroom.grades.second + (classroom.sections?.second ?? "");
  if (classroom.independent) return `Kelas ${first}`;
  return `Kelas Rangkap ${first}-${second}`;
}
export function classPath(id: string) {
  return `/kelas/${encodeURIComponent(id)}`;
}
export function displayDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
