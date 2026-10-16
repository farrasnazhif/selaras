import type { PreviewClassroom, PreviewStudent } from "@/features/shared/types/preview";

export const INDEPENDENT_CLASSROOMS: PreviewClassroom[] = [1, 2].map((grade) => ({
  id: `kelas-${grade}`, independent: true, grades: { first: String(grade), second: "" },
}));
const NAMES = ["Adi", "Alya", "Bagas", "Bella", "Cahya", "Dara", "Deni", "Dewi", "Evan", "Farah", "Fikri", "Gilang", "Hasna", "Ilham", "Intan", "Jihan", "Kevin", "Laila", "Lutfi", "Mila", "Nabil", "Nadia", "Putra", "Putri", "Rafi", "Rara", "Rizki", "Salma", "Sinta", "Tegar", "Wulan", "Yusuf"];
const LEVELS = ["1", "2", "2", "3", "3", "3", "3", "4", "4", "4", "5", "6"];
export const INDEPENDENT_STUDENTS: PreviewStudent[] = INDEPENDENT_CLASSROOMS.flatMap((classroom, classIndex) => NAMES.map((name, index) => ({
  id: `sample-grade-${classroom.grades.first}-${index + 1}`, name, classroomId: classroom.id,
  classKey: "first", group: "A", literacy: LEVELS[(index + classIndex * 3) % LEVELS.length], numeracy: LEVELS[(index * 5 + classIndex) % LEVELS.length],
})));
