"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PREVIEW_STUDENTS } from "../constants/preview";
import { EXAMPLE_CLASS_ID, EXAMPLE_SESSION_ID } from "../constants/reference-content";
import type { ClassKey, GroupKey, PreviewAssessment, PreviewClassroom, PreviewObservation, PreviewSession, PreviewStudent, Subject } from "../types/preview";

type PreviewContextValue = {
  classrooms: PreviewClassroom[];
  allStudents: PreviewStudent[];
  classroom: PreviewClassroom | null;
  createClassroom: (grades: Record<ClassKey, string>) => string;
  sessions: PreviewSession[];
  saveSession: (session: Omit<PreviewSession, "id" | "classroomId" | "roster" | "grades">) => string;
  assessments: PreviewAssessment[];
  setLevel: (studentId: string, subject: Subject, level: string) => void;
  grades: Record<ClassKey, string>;
  students: PreviewStudent[];
  addStudent: (classKey: ClassKey, name: string) => void;
  moveStudent: (studentId: string, group: GroupKey) => void;
  observations: PreviewObservation[];
  addObservation: (studentId: string, note: string) => void;
};
const PreviewContext = createContext<PreviewContextValue | null>(null);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [classrooms, setClassrooms] = useState<PreviewClassroom[]>([{ id: EXAMPLE_CLASS_ID, grades: { first: "2", second: "3" } }]);
  const [allStudents, setStudents] = useState(PREVIEW_STUDENTS);
  const [sessions, setSessions] = useState<PreviewSession[]>([{ id: EXAMPLE_SESSION_ID, classroomId: EXAMPLE_CLASS_ID, subject: "literasi", date: "2026-10-14", duration: "70", blockMinutes: "15", roster: PREVIEW_STUDENTS, grades: { first: "2", second: "3" } }]);
  const [assessments, setAssessments] = useState<PreviewAssessment[]>(() => PREVIEW_STUDENTS.flatMap((student) => [
    { id: `${student.id}-literasi`, studentId: student.id, subject: "literasi", level: student.literacy!, recordedAt: "2026-10-14T12:00:00" },
    { id: `${student.id}-numerasi`, studentId: student.id, subject: "numerasi", level: student.numeracy!, recordedAt: "2026-10-14T12:00:00" },
  ]));
  const classId = pathname.split("/")[2] ?? EXAMPLE_CLASS_ID;
  const classroom = classrooms.find((item) => item.id === classId) ?? null;
  const grades = classroom?.grades ?? { first: "2", second: "3" };
  const students = allStudents.filter((student) => student.classroomId === classId);
  const [observations, setObservations] = useState<PreviewObservation[]>([]);

  return (
    <PreviewContext.Provider value={{
      classrooms,
      allStudents,
      classroom,
      createClassroom: (classGrades) => {
        const id = `kelas-rangkap-${classGrades.first}-${classGrades.second}-${crypto.randomUUID()}`;
        setClassrooms((current) => [...current, { id, grades: classGrades }]);
        return id;
      },
      sessions,
      saveSession: (session) => {
        const id = crypto.randomUUID();
        setSessions((current) => [...current, { ...session, id, classroomId: classId, roster: students.map((student) => ({ ...student })), grades: { ...grades } }]);
        return id;
      },
      assessments,
      setLevel: (studentId, subject, level) => {
        const field = subject === "literasi" ? "literacy" : "numeracy";
        const student = students.find((item) => item.id === studentId);
        if (!student || student[field] === level || !["1", "2", "3", "4", "5"].includes(level)) return;
        setStudents((current) => current.map((item) => item.id === studentId ? { ...item, [field]: level } : item));
        setAssessments((current) => [...current, { id: crypto.randomUUID(), studentId, subject, level, recordedAt: new Date().toISOString() }]);
      },
      grades,
      students,
      addStudent: (classKey, name) => setStudents((current) => [...current, { id: crypto.randomUUID(), name, classKey, group: "A", classroomId: classId, literacy: null, numeracy: null }]),
      moveStudent: (studentId, group) => setStudents((current) => current.map((student) => student.id === studentId ? { ...student, group } : student)),
      observations,
      addObservation: (studentId, note) => setObservations((current) => [...current, { id: crypto.randomUUID(), studentId, note, recordedAt: new Date().toISOString() }]),
    }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const value = useContext(PreviewContext);
  if (!value) throw new Error("Selaras preview requires PreviewProvider.");
  return value;
}
