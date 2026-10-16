import { INDEPENDENT_STUDENTS } from "../../kelas/constants/independent-classes.ts";
import type { TeacherWorkspace } from "../validations/workspace.ts";

export function createDemoWorkspace(): TeacherWorkspace {
  const classrooms = [1, 2, 3, 4, 5, 6].flatMap((grade) => ["A", "B"].map((section) => ({
    id: `kelas-${grade}${section.toLowerCase()}`,
    independent: true as const,
    grades: { first: String(grade), second: "" },
    sections: { first: section, second: "" },
  })));
  const names = INDEPENDENT_STUDENTS.filter((student) => student.classroomId === "kelas-1").map((student) => student.name);
  const distribution = ["1", "2", "2", "3", "3", "3", "3", "4", "4", "4", "5", "6"];
  const students = classrooms.flatMap((classroom, classIndex) => names.map((name, index) => ({
    id: `${classroom.id}-siswa-${index + 1}`, name, classroomId: classroom.id,
    classKey: "first" as const, group: "A" as const,
    literacy: distribution[(index + classIndex * 3) % distribution.length],
    numeracy: distribution[(index * 5 + classIndex) % distribution.length],
  })));
  const recordedAt = new Date().toISOString();
  return {
    classrooms, students, sessions: [], observations: [], groupOverrides: { literasi: {}, numerasi: {} },
    assessments: students.flatMap((student) => [
      { id: `${student.id}-literasi`, studentId: student.id, subject: "literasi" as const, level: student.literacy, recordedAt },
      { id: `${student.id}-numerasi`, studentId: student.id, subject: "numerasi" as const, level: student.numeracy, recordedAt },
    ]),
  };
}
