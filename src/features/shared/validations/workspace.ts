import { z } from "zod";
import type { PreviewClassroom, PreviewStudent, PreviewSession, PreviewAssessment, PreviewObservation, Subject, GroupKey } from "../types/preview";
import { sessionPreviewSchema } from "../../sesi/validations/session.ts";
import { taskTemplateSchema } from "../../sesi/validations/task.ts";
import { validateSessionPlan } from "../../sesi/constants/scheduler.ts";
import { canCombineGrades } from "../../kelas/constants/class-pairing.ts";

const id = z.string().min(1).max(200);
const level = z.enum(["1", "2", "3", "4", "5", "6"]);
const subject = z.enum(["literasi", "numerasi"]);
const group = z.enum(["A", "B", "C"]);
const classKey = z.enum(["first", "second"]);
const grades = z.object({ first: level, second: z.union([level, z.literal("")]) });
const studentSchema = z.object({
  id, name: z.string().trim().min(1).max(80), classroomId: id, classKey, group,
  literacy: level.nullable(), numeracy: level.nullable(),
});
export const teacherClassroomSchema = z.object({
  id, independent: z.literal(true).optional(), grades,
  sections: z.object({ first: z.string().max(10), second: z.string().max(10) }).optional(),
  sourceIds: z.object({ first: id, second: id }).optional(),
}).refine((value) => value.independent
  ? value.grades.second === ""
  : canCombineGrades(value.grades.first, value.grades.second),
{ message: "Pasangan kelas tidak tersedia." });
const planSchema = z.object({
  mode: z.enum(["same-phase", "cross-phase"]),
  tasks: z.array(z.object({
    id, classKey, group, level, memberIds: z.array(id), template: taskTemplateSchema.nullable(),
  })),
  blocks: z.array(z.object({
    start: z.number().int(), end: z.number().int(),
    kind: z.enum(["opening", "core", "closing"]), note: z.string().max(300).optional(),
    teacherAssignments: z.array(z.array(classKey)),
    activities: z.array(z.object({ classKey, group, mode: z.enum(["teacher", "independent"]), taskIds: z.array(id) })),
  })),
});
const sessionSchema = sessionPreviewSchema.extend({
  id, classroomId: id, grades, roster: z.array(studentSchema), plan: planSchema,
});

export type TeacherWorkspace = {
  classrooms: PreviewClassroom[];
  students: PreviewStudent[];
  sessions: PreviewSession[];
  assessments: PreviewAssessment[];
  observations: PreviewObservation[];
  groupOverrides: Record<Subject, Partial<Record<string, GroupKey>>>;
};

export const workspaceSchema: z.ZodType<TeacherWorkspace> = z.object({
  classrooms: z.array(teacherClassroomSchema),
  students: z.array(studentSchema),
  sessions: z.array(sessionSchema),
  assessments: z.array(z.object({ id, studentId: id, subject, level, recordedAt: z.iso.datetime() })),
  observations: z.array(z.object({ id, studentId: id, note: z.string().trim().min(1).max(1000), recordedAt: z.iso.datetime() })),
  groupOverrides: z.object({ literasi: z.record(id, group), numerasi: z.record(id, group) }),
}).superRefine((state, context) => {
  function issue(message: string) { context.addIssue({ code: "custom", message }); }
  for (const collection of [state.classrooms, state.students, state.sessions, state.assessments, state.observations]) {
    if (new Set(collection.map((value) => value.id)).size !== collection.length) issue("Data memiliki ID ganda.");
  }
  const classes = new Map(state.classrooms.map((value) => [value.id, value]));
  const students = new Set(state.students.map((value) => value.id));
  for (const student of state.students) {
    const classroom = classes.get(student.classroomId);
    if (!classroom || (classroom.independent && student.classKey !== "first")) issue("Kelas siswa tidak tersedia.");
  }
  for (const record of [...state.assessments, ...state.observations]) {
    if (!students.has(record.studentId)) issue("Siswa pada riwayat tidak tersedia.");
  }
  for (const overrides of Object.values(state.groupOverrides)) {
    if (Object.keys(overrides).some((key) => !students.has(key))) issue("Anggota kelompok tidak tersedia.");
  }
  for (const session of state.sessions) {
    const classroom = classes.get(session.classroomId);
    if (!classroom || classroom.independent || session.roster.some((student) => student.classroomId !== session.classroomId || !students.has(student.id))) {
      issue("Kelas atau anggota sesi tidak tersedia.");
    }
    if (!validateSessionPlan(session, session.roster, session.grades, session.plan).valid) issue("Sesi tidak lolos pemeriksaan jadwal.");
  }
});

export const emptyWorkspace: TeacherWorkspace = {
  classrooms: [], students: [], sessions: [], assessments: [], observations: [],
  groupOverrides: { literasi: {}, numerasi: {} },
};

// Photos remain browser-only until a separately validated attachment-storage flow is available.
export function workspaceForStorage(state: TeacherWorkspace): TeacherWorkspace {
  return {
    ...state,
    sessions: state.sessions.map((session) => ({
      ...session,
      plan: { ...session.plan, tasks: session.plan.tasks.map((task) => {
        if (!task.template) return task;
        const template = { ...task.template };
        delete template.photo;
        return { ...task, template };
      }) },
    })),
  };
}
