export type ClassKey = "first" | "second";
export type GroupKey = "A" | "B" | "C";

// UI fixtures, not the eventual student/session database contracts.
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
  grades: Record<ClassKey, string>;
};
export type PreviewSession = {
  id: string;
  classroomId: string;
  lessonSubject: string;
  topic: string;
  focus: Subject;
  date: string;
  duration: string;
  blockMinutes: string;
  roster: PreviewStudent[];
  grades: Record<ClassKey, string>;
};
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
