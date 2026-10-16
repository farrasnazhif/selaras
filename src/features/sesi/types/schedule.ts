import type { ClassKey, GroupKey } from "@/features/shared/types/preview";

export type TaskContent =
  | { kind: "picture-match" | "count-match" | "count-number"; values?: number[] }
  | { kind: "written"; passage?: string; questions: string[] };
export type TaskPhotoAttachment = { src: string; alt: string; width: number; height: number; nonReadingConfirmed: boolean };
export type StudentTaskPhoto = Pick<TaskPhotoAttachment, "src" | "alt" | "width" | "height">;
export type TaskTemplate = {
  id: string;
  title: string;
  instruction: string;
  requiresReading: boolean;
  photo?: TaskPhotoAttachment;
  content: TaskContent;
};
export type PlannedTask = {
  id: string;
  classKey: ClassKey;
  group: GroupKey;
  level: string;
  memberIds: string[];
  template: TaskTemplate | null;
};
export type GroupActivity = {
  classKey: ClassKey;
  group: GroupKey;
  mode: "teacher" | "independent";
  taskIds: string[];
};
export type ScheduleBlock = {
  start: number;
  end: number;
  kind: "opening" | "core" | "closing";
  note?: string;
  teacherAssignments: ClassKey[][];
  activities: GroupActivity[];
};
export type SessionPlan = {
  mode: "same-phase" | "cross-phase";
  tasks: PlannedTask[];
  blocks: ScheduleBlock[];
};
export type PlanCheck = { id: "V1" | "V2" | "V3" | "V4" | "V5"; label: string; errors: string[] };
export type PlanValidation = { valid: boolean; errors: string[]; checks: PlanCheck[] };

// Student output deliberately has no roster, member IDs, levels, or phase metadata.
export type StudentGroupSheet = {
  classLabel: string;
  groupLabel: string;
  activities: { number: number; title: string; instruction: string; content: TaskContent; photo?: StudentTaskPhoto }[];
};
export type StudentPacket = {
  lessonSubject: string;
  topic: string;
  date: string;
  groups: StudentGroupSheet[];
  blocks: { start: number; end: number; teacher: string; note?: string; activities: string[] }[];
};
