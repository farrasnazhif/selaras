import assert from "node:assert/strict";
import test from "node:test";
import { createDemoWorkspace } from "../src/features/shared/constants/demo-workspace.ts";
import { emptyWorkspace, workspaceSchema, workspaceForStorage } from "../src/features/shared/validations/workspace.ts";
import { combineIndependentClassrooms } from "../src/features/kelas/constants/class-pairing.ts";
import { groupStudentsBySubject } from "../src/features/kelas/constants/groups.ts";
import { buildSessionPlan } from "../src/features/sesi/constants/scheduler.ts";
import { SESSION_DEFAULTS } from "../src/features/sesi/constants/reference-content.ts";

// These tests make no database or AI requests.
test("UI-24: new teachers are empty; the optional seed has 12 sectioned classes and isolated fictional pupils", () => {
  assert.equal(workspaceSchema.safeParse(emptyWorkspace).success, true);
  const state = workspaceSchema.parse(createDemoWorkspace());
  assert.equal(state.classrooms.length, 12);
  assert.equal(state.students.length, 384);
  assert.equal(new Set(state.students.map((student) => student.id)).size, 384);
  assert.deepEqual(state.classrooms.map((value) => value.grades.first + value.sections?.first), ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"]);
  assert.ok(state.classrooms.every((value) => state.students.filter((student) => student.classroomId === value.id).length === 32));
  assert.equal(state.assessments.length, 768);
  assert.equal(state.sessions.length, 0);
});

test("UI-24: combining preserves sections, identities, and history while validating workspace references", () => {
  const state = createDemoWorkspace();
  assert.equal(combineIndependentClassrooms(state.classrooms, state.students, ["kelas-1a", "kelas-1a"], "combined").ok, false);
  const result = combineIndependentClassrooms(state.classrooms, state.students, ["kelas-1a", "kelas-2b"], "combined");
  assert.ok(result.ok);
  const next = workspaceSchema.parse({ ...state, classrooms: result.classrooms, students: result.students });
  assert.deepEqual(next.classrooms[0].sections, { first: "A", second: "B" });
  assert.equal(next.assessments.length, state.assessments.length);
  assert.deepEqual(next.students.map((student) => student.id), state.students.map((student) => student.id));
  for (const bad of [
    { ...state, students: [...state.students, state.students[0]] },
    { ...state, classrooms: [] },
    { ...state, observations: [{ id: "note", studentId: "other-teacher-student", note: "Private", recordedAt: new Date().toISOString() }] },
    { ...state, groupOverrides: { literasi: { unknown: "B" }, numerasi: {} } },
  ]) assert.equal(workspaceSchema.safeParse(bad).success, false);
});

test("UI-20/UI-24: same-grade sections preserve identity/history and produce savable same-phase sessions", () => {
  const state = createDemoWorkspace();
  const before = structuredClone(state);
  const paired = combineIndependentClassrooms(state.classrooms, state.students, ["kelas-3b", "kelas-3a"], "same-grade");
  assert.ok(paired.ok);
  assert.deepEqual(paired.classroom.grades, { first: "3", second: "3" });
  assert.deepEqual(paired.classroom.sections, { first: "A", second: "B" });
  assert.deepEqual(paired.classroom.sourceIds, { first: "kelas-3a", second: "kelas-3b" });
  const merged = workspaceSchema.parse({ ...state, classrooms: paired.classrooms, students: paired.students });
  assert.deepEqual(merged.students.map((student) => student.id), state.students.map((student) => student.id));
  assert.deepEqual(merged.assessments, state.assessments);
  for (const focus of ["literasi", "numerasi"] as const) {
    const roster = groupStudentsBySubject(merged.students.filter((student) => student.classroomId === "same-grade"), focus);
    for (const classKey of ["first", "second"]) assert.equal(roster.filter((student) => student.classKey === classKey).length, 32);
    const input = { ...SESSION_DEFAULTS, focus, phaseTasks: { literasi: { first: "Latihan dari buku kelas.", second: "Latihan dari buku kelas." }, numerasi: { first: "Latihan dari buku kelas.", second: "Latihan dari buku kelas." } } };
    const result = buildSessionPlan(input, roster, paired.classroom.grades);
    assert.ok(result.plan);
    assert.equal(result.validation.valid, true);
    assert.equal(result.plan.mode, "same-phase");
    assert.deepEqual(result.plan.blocks.find((block) => block.kind === "core")?.teacherAssignments, [["first", "second"]]);
    assert.equal(workspaceSchema.safeParse({ ...merged, sessions: [{ ...input, id: "same-grade-session", classroomId: "same-grade", grades: paired.classroom.grades, roster, plan: result.plan }] }).success, true);
  }
  assert.deepEqual(state, before);
});

test("UI-24: persisted snapshots keep content and AI provenance but exclude local photos without mutation", () => {
  const state = createDemoWorkspace();
  const paired = combineIndependentClassrooms(state.classrooms, state.students, ["kelas-1a", "kelas-2a"], "combined");
  assert.ok(paired.ok);
  const roster = groupStudentsBySubject(paired.students.filter((student) => student.classroomId === "combined"), "literasi");
  const grades = paired.classroom.grades;
  const input = { ...SESSION_DEFAULTS, phaseTasks: { literasi: { first: "Baca materi dari buku kelas.", second: "Baca dan diskusikan cerita dari buku kelas." }, numerasi: { first: "Latihan dari buku kelas.", second: "Latihan dari buku kelas." } } };
  const generated = buildSessionPlan(input, roster, grades);
  assert.ok(generated.plan);
  assert.ok(generated.validation.valid);
  const task = generated.plan.tasks.find((task) => task.template);
  assert.ok(task?.template);
  task.template.aiGenerated = true;
  task.template.photo = { src: "data:image/png;base64,aGVsbG8=", alt: "Gambar", width: 1, height: 1, nonReadingConfirmed: true };
  const next = workspaceSchema.parse({ ...state, classrooms: paired.classrooms, students: paired.students, sessions: [{ ...input, id: "session", classroomId: "combined", grades, roster, plan: generated.plan }] });
  const stored = workspaceForStorage(next);
  assert.ok(next.sessions[0].plan.tasks.some((task) => task.template?.photo));
  assert.ok(stored.sessions[0].plan.tasks.every((task) => !task.template?.photo));
  assert.equal(stored.sessions[0].plan.tasks.find((item) => item.id === task.id)?.template?.aiGenerated, true);
  assert.equal(workspaceSchema.safeParse(stored).success, true);
  stored.sessions[0].plan.blocks[0].end = 99;
  assert.equal(workspaceSchema.safeParse(stored).success, false);
});
