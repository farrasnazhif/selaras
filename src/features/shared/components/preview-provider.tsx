"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { EXAMPLE_CLASS_ID, PREVIEW_STUDENTS } from "@/features/kelas/constants/preview";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "@/features/kelas/constants/reference-content";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import { INDEPENDENT_CLASSROOMS, INDEPENDENT_STUDENTS } from "@/features/kelas/constants/independent-classes";
import { combineIndependentClassrooms } from "@/features/kelas/constants/class-pairing";
import { classroomPreviewSchema } from "@/features/kelas/validations/classroom";
import { groupStudentsBySubject } from "@/features/kelas/constants/groups";
import { buildSessionPlan, validateSessionPlan } from "@/features/sesi/constants/scheduler";
import { sessionPreviewSchema } from "@/features/sesi/validations/session";
import { SESSION_DEFAULTS, EXAMPLE_SESSION_ID } from "@/features/sesi/constants/reference-content";
import type { ClassKey, GroupKey, PreviewAssessment, PreviewClassroom, PreviewObservation, PreviewSession, PreviewStudent, SessionDraft, Subject } from "@/features/shared/types/preview";

type PreviewContextValue = {
  classrooms: PreviewClassroom[];
  allStudents: PreviewStudent[];
  classroom: PreviewClassroom | null;
  createClassroom: (grades: Record<ClassKey, string>) => string | null;
  combineClassrooms: (selectedIds: string[]) => { id: string | null; error?: string };
  classKeys: ClassKey[];
  sessions: PreviewSession[];
  saveSession: (session: SessionDraft, sessionId?: string) => { id: string | null; errors: string[] };
  assessments: PreviewAssessment[];
  setLevel: (studentId: string, subject: Subject, level: string) => void;
  grades: Record<ClassKey, string>;
  students: PreviewStudent[];
  groupSubject: Subject;
  setGroupSubject: (subject: Subject) => void;
  getStudentsForSubject: (subject: Subject) => PreviewStudent[];
  addStudent: (classKey: ClassKey, name: string) => void;
  moveStudent: (studentId: string, group: GroupKey) => void;
  observations: PreviewObservation[];
  addObservation: (studentId: string, note: string) => void;
};
const INITIAL_STUDENTS = [...PREVIEW_STUDENTS, ...INDEPENDENT_STUDENTS];
const PreviewContext = createContext<PreviewContextValue | null>(null);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [classrooms, setClassrooms] = useState<PreviewClassroom[]>([...INDEPENDENT_CLASSROOMS, { id: EXAMPLE_CLASS_ID, grades: { first: "2", second: "3" } }]);
  const [allStudents, setStudents] = useState(INITIAL_STUDENTS);
  const [groupSubject, setGroupSubject] = useState<Subject>("literasi");
  const [groupOverrides, setGroupOverrides] = useState<Record<Subject, Partial<Record<string, GroupKey>>>>({ literasi: {}, numerasi: {} });
  const [sessions, setSessions] = useState<PreviewSession[]>(() => {
    const roster = groupStudentsBySubject(PREVIEW_STUDENTS, "literasi");
    const grades = { first: "2", second: "3" };
    const result = buildSessionPlan(SESSION_DEFAULTS, roster, grades);
    return result.plan && result.validation.valid ? [structuredClone({ ...SESSION_DEFAULTS, id: EXAMPLE_SESSION_ID, classroomId: EXAMPLE_CLASS_ID, roster, grades, plan: result.plan })] : [];
  });
  const [assessments, setAssessments] = useState<PreviewAssessment[]>(() => INITIAL_STUDENTS.flatMap((student) => [
    { id: `${student.id}-literasi`, studentId: student.id, subject: "literasi", level: student.literacy!, recordedAt: "2026-10-14T12:00:00" },
    { id: `${student.id}-numerasi`, studentId: student.id, subject: "numerasi", level: student.numeracy!, recordedAt: "2026-10-14T12:00:00" },
  ]));
  const classId = pathname.split("/")[2] ?? EXAMPLE_CLASS_ID;
  const classroom = classrooms.find((item) => item.id === classId) ?? null;
  const classKeys = classroom?.independent ? ["first"] as ClassKey[] : CLASS_KEYS;
  const grades = classroom?.grades ?? { first: "2", second: "3" };
  const groupedStudents = groupStudentsBySubject(allStudents, groupSubject, groupOverrides[groupSubject]);
  const students = groupedStudents.filter((student) => student.classroomId === classId);
  const [observations, setObservations] = useState<PreviewObservation[]>([]);
  function getStudentsForSubject(subject: Subject) {
    return groupStudentsBySubject(allStudents.filter((student) => student.classroomId === classId), subject, groupOverrides[subject]);
  }

  return (
    <PreviewContext.Provider value={{
      classrooms,
      allStudents: groupedStudents,
      classroom,
      classKeys,
      createClassroom: (classGrades) => {
        if (!classroomPreviewSchema.safeParse(classGrades).success) return null;
        const id = `kelas-rangkap-${classGrades.first}-${classGrades.second}-${crypto.randomUUID()}`;
        setClassrooms((current) => [...current, { id, grades: classGrades }]);
        return id;
      },
      combineClassrooms: (selectedIds) => {
        const id = `kelas-rangkap-${crypto.randomUUID()}`;
        const result = combineIndependentClassrooms(classrooms, allStudents, selectedIds, id);
        if (!result.ok) return { id: null, error: result.error };
        setClassrooms(result.classrooms);
        setStudents(result.students);
        return { id };
      },
      sessions,
      saveSession: (session, sessionId) => {
        const validation = validateSessionPlan(session, session.roster, session.grades, session.plan);
        if (!classroom || classroom.independent || session.roster.some((student) => student.classroomId !== classId) || (sessionId && !sessions.some((item) => item.id === sessionId && item.classroomId === classId))) return { id: null, errors: ["Sesi atau kelas tidak tersedia."] };
        if (!validation.valid) return { id: null, errors: validation.errors };
        const id = sessionId ?? crypto.randomUUID();
        const snapshot = structuredClone({ ...sessionPreviewSchema.parse(session), id, classroomId: classId, roster: session.roster, grades: session.grades, plan: session.plan });
        setSessions((current) => sessionId ? current.map((item) => item.id === id ? snapshot : item) : [...current, snapshot]);
        return { id, errors: [] };
      },
      assessments,
      setLevel: (studentId, subject, level) => {
        const field = subject === "literasi" ? "literacy" : "numeracy";
        const student = students.find((item) => item.id === studentId);
        if (!student || student[field] === level || !(subject === "literasi" ? LITERACY_LEVELS : NUMERACY_LEVELS).some((option) => option.value === level)) return;
        setStudents((current) => current.map((item) => item.id === studentId ? { ...item, [field]: level } : item));
        setAssessments((current) => [...current, { id: crypto.randomUUID(), studentId, subject, level, recordedAt: new Date().toISOString() }]);
      },
      grades,
      students,
      groupSubject,
      setGroupSubject,
      getStudentsForSubject,
      addStudent: (classKey, name) => {
        if (!classroom || !classKeys.includes(classKey)) return;
        setStudents((current) => [...current, { id: crypto.randomUUID(), name, classKey, group: "A", classroomId: classId, literacy: null, numeracy: null }]);
      },
      moveStudent: (studentId, group) => {
        if (!students.some((student) => student.id === studentId)) return;
        setGroupOverrides((current) => ({ ...current, [groupSubject]: { ...current[groupSubject], [studentId]: group } }));
      },
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
