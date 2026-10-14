import type { ClassKey, GroupKey, PreviewStudent } from "../types/preview";

const PAGE_SIZE = 5;

export function getStudentPage(
  students: PreviewStudent[],
  classKey: ClassKey,
  query: string,
  group: GroupKey | "all",
  page: number,
) {
  const search = query.trim().toLocaleLowerCase("id");
  const filtered = students.filter((student) =>
    student.classKey === classKey &&
    (group === "all" || student.group === group) &&
    student.name.toLocaleLowerCase("id").includes(search),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  return {
    rows: filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    total: filtered.length,
    pageCount,
    currentPage,
  };
}
