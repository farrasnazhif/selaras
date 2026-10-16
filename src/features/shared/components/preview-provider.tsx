"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { SelarasLoadingState } from "@/components/ui/selaras-loading-state";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "../hooks/use-workspace";
import { teacherClassroomSchema, type TeacherWorkspace } from "../validations/workspace";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import { combineIndependentClassrooms } from "@/features/kelas/constants/class-pairing";
import { observationSchema, previewStudentSchema } from "@/features/kelas/validations/observation";
import { groupStudentsBySubject } from "@/features/kelas/constants/groups";
import { validateSessionPlan } from "@/features/sesi/constants/scheduler";
import { sessionPreviewSchema } from "@/features/sesi/validations/session";
import type { ClassKey, GroupKey, PreviewAssessment, PreviewClassroom, PreviewObservation, PreviewSession, PreviewStudent, SessionDraft, Subject } from "../types/preview";

type PreviewContextValue = {
  classrooms: PreviewClassroom[];
  allStudents: PreviewStudent[];
  classroom: PreviewClassroom | null;
  createClassroom: (grades: Record<ClassKey, string>, section?: string) => Promise<string | null>;
  combineClassrooms: (selectedIds: string[]) => Promise<{ id: string | null; error?: string }>;
  classKeys: ClassKey[];
  sessions: PreviewSession[];
  saveSession: (session: SessionDraft, sessionId?: string) => Promise<{ id: string | null; errors: string[] }>;
  assessments: PreviewAssessment[];
  setLevel: (studentId: string, subject: Subject, level: string) => Promise<boolean>;
  grades: Record<ClassKey, string>;
  students: PreviewStudent[];
  groupSubject: Subject;
  setGroupSubject: (subject: Subject) => void;
  getStudentsForSubject: (subject: Subject) => PreviewStudent[];
  addStudent: (classKey: ClassKey, name: string) => Promise<boolean>;
  moveStudent: (studentId: string, group: GroupKey) => Promise<boolean>;
  observations: PreviewObservation[];
  addObservation: (studentId: string, note: string) => Promise<boolean>;
  saving: boolean;
};
const PreviewContext = createContext<PreviewContextValue | null>(null);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAuth();
  const workspace = useWorkspace(user?.id ?? "");
  const [groupSubject, setGroupSubject] = useState<Subject>("literasi");
  const [error, setError] = useState("");
  const busy = useRef(false);
  if (!user) return null;
  if (workspace.isPending) return <div className="flex min-h-[60dvh] items-center justify-center"><SelarasLoadingState label="Memuat kelas Anda…" /></div>;
  if (!workspace.data) return <div className="space-y-ui-sm p-ui-md"><Callout tone="danger" title="Kelas belum dapat dimuat">Periksa koneksi dan konfigurasi Supabase. Data Anda belum diubah.</Callout><Button onClick={() => workspace.refetch()}>Coba lagi</Button></div>;

  const { classrooms, students: allStudents, sessions, assessments, observations, groupOverrides } = workspace.data.state;
  const classId = pathname.split("/")[2] ?? "";
  const classroom = classrooms.find((item) => item.id === classId) ?? null;
  const classKeys = classroom?.independent ? ["first"] as ClassKey[] : CLASS_KEYS;
  const grades = classroom?.grades ?? { first: "1", second: "2" };
  const groupedStudents = groupStudentsBySubject(allStudents, groupSubject, groupOverrides[groupSubject]);
  const students = groupedStudents.filter((student) => student.classroomId === classId);
  async function persist(update: (state: TeacherWorkspace) => TeacherWorkspace) {
    if (busy.current) return false;
    busy.current = true;
    setError("");
    try { await workspace.commit(update); return true; }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Perubahan belum tersimpan. Coba lagi."); return false; }
    finally { busy.current = false; }
  }

  return (
    <PreviewContext.Provider value={{
      classrooms, allStudents: groupedStudents, classroom, classKeys, sessions, assessments, observations,
      grades, students, groupSubject, setGroupSubject, saving: workspace.saving,
      getStudentsForSubject: (subject) => groupStudentsBySubject(allStudents.filter((student) => student.classroomId === classId), subject, groupOverrides[subject]),
      createClassroom: async (classGrades, section = "") => {
        const id = crypto.randomUUID();
        const candidate = teacherClassroomSchema.safeParse({ id, grades: classGrades,
          ...(!classGrades.second ? { independent: true, sections: { first: section, second: "" } } : {}),
        });
        if (!candidate.success) return null;
        if (!classGrades.second && classrooms.some((item) => CLASS_KEYS.some((key) => item.grades[key] === classGrades.first && (item.sections?.[key] ?? "") === section))) {
          setError("Kelas dengan nama tersebut sudah ada.");
          return null;
        }
        const saved = await persist((current) => ({ ...current, classrooms: [...current.classrooms, candidate.data] }));
        return saved ? id : null;
      },
      combineClassrooms: async (selectedIds) => {
        const id = crypto.randomUUID();
        const result = combineIndependentClassrooms(classrooms, allStudents, selectedIds, id);
        if (!result.ok) return { id: null, error: result.error };
        const saved = await persist((current) => ({ ...current, classrooms: result.classrooms, students: result.students }));
        return saved ? { id } : { id: null, error: "Kelas belum tergabung. Periksa pesan penyimpanan dan coba lagi." };
      },
      saveSession: async (session, sessionId) => {
        const validation = validateSessionPlan(session, session.roster, session.grades, session.plan);
        if (!classroom || classroom.independent || session.roster.some((student) => student.classroomId !== classId) || (sessionId && !sessions.some((item) => item.id === sessionId && item.classroomId === classId))) return { id: null, errors: ["Sesi atau kelas tidak tersedia."] };
        if (!validation.valid) return { id: null, errors: validation.errors };
        const id = sessionId ?? crypto.randomUUID();
        const snapshot = structuredClone({ ...sessionPreviewSchema.parse(session), id, classroomId: classId, roster: session.roster, grades: session.grades, plan: session.plan });
        const saved = await persist((current) => ({ ...current, sessions: sessionId ? current.sessions.map((item) => item.id === id ? snapshot : item) : [...current.sessions, snapshot] }));
        return saved ? { id, errors: [] } : { id: null, errors: ["Sesi belum tersimpan. Data formulir tetap tersedia; coba lagi."] };
      },
      setLevel: async (studentId, subject, level) => {
        const field = subject === "literasi" ? "literacy" : "numeracy";
        const student = students.find((item) => item.id === studentId);
        if (!student || !/^[1-6]$/.test(level)) return false;
        if (student[field] === level) return true;
        return persist((current) => ({ ...current,
          students: current.students.map((item) => item.id === studentId ? { ...item, [field]: level } : item),
          assessments: [...current.assessments, { id: crypto.randomUUID(), studentId, subject, level, recordedAt: new Date().toISOString() }],
        }));
      },
      addStudent: async (classKey, name) => {
        const parsed = previewStudentSchema.safeParse({ name });
        if (!classroom || !classKeys.includes(classKey) || !parsed.success) return false;
        return persist((current) => ({ ...current, students: [...current.students, { id: crypto.randomUUID(), name: parsed.data.name, classKey, group: "A", classroomId: classId, literacy: null, numeracy: null }] }));
      },
      moveStudent: async (studentId, group) => {
        if (!students.some((student) => student.id === studentId) || !["A", "B", "C"].includes(group)) return false;
        return persist((current) => ({ ...current, groupOverrides: { ...current.groupOverrides, [groupSubject]: { ...current.groupOverrides[groupSubject], [studentId]: group } } }));
      },
      addObservation: async (studentId, note) => {
        const parsed = observationSchema.safeParse({ note });
        if (!students.some((student) => student.id === studentId) || !parsed.success) return false;
        return persist((current) => ({ ...current, observations: [...current.observations, { id: crypto.randomUUID(), studentId, note: parsed.data.note, recordedAt: new Date().toISOString() }] }));
      },
    }}>
      {error && <div className="print-hidden mx-auto max-w-[1250px] p-ui-sm"><Callout tone="danger" title="Perubahan belum tersimpan">{error}</Callout></div>}
      {workspace.saving && <p role="status" className="print-hidden px-ui-sm text-sm text-muted">Menyimpan perubahan…</p>}
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const value = useContext(PreviewContext);
  if (!value) throw new Error("Selaras requires an authenticated teacher workspace.");
  return value;
}
