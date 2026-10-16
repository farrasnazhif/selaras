import type { SessionPlan } from "@/features/sesi/types/schedule";

export type ClassKey = "first" | "second";
export type GroupKey = "A" | "B" | "C";

// Teacher-facing models; UI-24 persists these inside an owner-scoped workspace snapshot.
export type PreviewStudent = {
  id: string;
  name: string;
  classKey: ClassKey;
  group: GroupKey;
  classroomId: string;
  literacy: string | null;
  numeracy: string | null;
};

export type Subject = "literasi" | "numerasi";
export type PreviewClassroom = {
  id: string;
  independent?: true;
  sourceIds?: Record<ClassKey, string>;
  grades: Record<ClassKey, string>;
  sections?: Record<ClassKey, string>;
};
export type PreviewSession = {
  id: string;
  classroomId: string;
  lessonSubject: string;
  topic: string;
  focus: Subject;
  date: string;
  duration: string;
  blockMinutes: "10" | "15" | "20";
  phaseTasks: Record<Subject, Record<ClassKey, string>>;
  plan: SessionPlan;
  roster: PreviewStudent[];
  grades: Record<ClassKey, string>;
};
export type SessionDraft = Omit<PreviewSession, "id" | "classroomId">;

export type PreviewAssessment = {
  id: string;
  studentId: string;
  subject: Subject;
  level: string;
  recordedAt: string;
};

export type PreviewObservation = {
  id: string;
  studentId: string;
  note: string;
  recordedAt: string;
};
