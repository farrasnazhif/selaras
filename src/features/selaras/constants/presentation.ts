import type { PreviewClassroom } from "../types/preview";

export function classroomTitle(classroom: PreviewClassroom) {
  return `Kelas Rangkap ${classroom.grades.first}-${classroom.grades.second}`;
}
export function classPath(id: string) {
  return `/kelas/${encodeURIComponent(id)}`;
}
export function displayDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
