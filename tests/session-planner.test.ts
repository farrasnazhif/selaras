import assert from "node:assert/strict";
import test from "node:test";
import { SESSION_DEFAULTS } from "../src/features/sesi/constants/reference-content.ts";
import { buildSessionPlan, validateSessionPlan, getStudentPacket } from "../src/features/sesi/constants/scheduler.ts";
import { groupStudentsBySubject } from "../src/features/kelas/constants/groups.ts";
import { PREVIEW_STUDENTS } from "../src/features/kelas/constants/preview.ts";
import { reflowPlan } from "../src/features/sesi/constants/plan-editing.ts";
import { taskEditorSchema, taskTemplateSchema, taskPhotoSchema } from "../src/features/sesi/validations/task.ts";
import { TASK_TEMPLATES } from "../src/features/sesi/constants/task-templates.ts";
import type { SessionPreviewInput } from "../src/features/sesi/validations/session.ts";

const grades = { first: "2", second: "3" };
const roster = groupStudentsBySubject(PREVIEW_STUDENTS, "literasi");
function validPlan(input = SESSION_DEFAULTS, classGrades = grades, students = roster) {
  const result = buildSessionPlan(input, students, classGrades);
  assert.ok(result.plan);
  assert.equal(result.validation.valid, true, result.validation.errors.join(" "));
  assert.equal(result.validation.checks.length, 5);
  return result.plan;
}

test("UI-18: deterministic generation covers every group once and supports all block lengths", () => {
  for (const blockMinutes of ["10", "15", "20"] as const) {
    for (const classGrades of [grades, { first: "3", second: "4" }]) {
      const input = { ...SESSION_DEFAULTS, blockMinutes };
      const before = structuredClone({ input, roster });
      const plan = validPlan(input, classGrades);
      assert.deepEqual(plan, buildSessionPlan(input, roster, classGrades).plan);
      assert.deepEqual({ input, roster }, before);
      assert.equal(plan.blocks.length, 60 / Number(blockMinutes) + 2);
      assert.equal(plan.blocks.at(-1)?.end, 70);
      assert.equal(plan.blocks[1].teacherAssignments[0].length, classGrades.first === "3" ? 2 : 1);
      const expectedGroups = new Set(roster.map((student) => `${student.classKey}-${student.group}`));
      for (const block of plan.blocks) {
        assert.equal(block.teacherAssignments.length, 1);
        assert.deepEqual(new Set(block.activities.map((activity) => `${activity.classKey}-${activity.group}`)), expectedGroups);
        assert.equal(block.activities.length, expectedGroups.size);
      }
    }
  }
  assert.equal(validPlan({ ...SESSION_DEFAULTS, duration: "50", blockMinutes: "20" }).blocks.at(-1)?.end, 50);
  const students = roster.map((student) => ({ ...student, literacy: student.classKey === "first" ? "5" : "1" }));
  assert.deepEqual(validPlan(SESSION_DEFAULTS, grades, students).blocks[1].teacherAssignments, [["second"]]);
});

test("V1 rejects double teacher assignments and mismatched teacher/independent status", () => {
  const plan = validPlan();
  plan.blocks[1].teacherAssignments.push(["second"]);
  assert.ok(validateSessionPlan(SESSION_DEFAULTS, roster, grades, plan).checks.find((check) => check.id === "V1")!.errors.length);
  const other = validPlan();
  other.blocks[1].activities[0].mode = "independent";
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, other).valid, false);
});

test("V2 rejects missing/duplicate group activities, missing tasks, and cross-class membership", () => {
  for (const mutate of [
    (plan: ReturnType<typeof validPlan>) => { plan.blocks[1].activities.pop(); },
    (plan: ReturnType<typeof validPlan>) => { plan.blocks[1].activities.push(plan.blocks[1].activities[0]); },
    (plan: ReturnType<typeof validPlan>) => { plan.tasks.pop(); },
    (plan: ReturnType<typeof validPlan>) => { plan.tasks[0].memberIds.push(roster.find((student) => student.classKey === "second")!.id); },
  ]) {
    const plan = validPlan(); mutate(plan);
    const validation = validateSessionPlan(SESSION_DEFAULTS, roster, grades, plan);
    assert.equal(validation.valid, false);
    assert.ok(validation.checks.find((check) => check.id === "V2")!.errors.length);
  }
});

test("V3 rejects gaps, overlap and incorrect duration; V4 rejects a class without core guidance", () => {
  const plan = validPlan(); plan.blocks[2].start++;
  assert.ok(validateSessionPlan(SESSION_DEFAULTS, roster, grades, plan).checks[2].errors.length);
  const shortened = validPlan(); shortened.blocks.at(-1)!.end--;
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, shortened).valid, false);
  const noGuidance = validPlan();
  noGuidance.blocks.filter((block) => block.kind === "core").forEach((block) => { block.teacherAssignments = [["first"]]; });
  assert.ok(validateSessionPlan(SESSION_DEFAULTS, roster, grades, noGuidance).checks[3].errors.length);
});

test("V5 rejects written tasks for either low level even after a manual group move", () => {
  for (const focus of ["literasi", "numerasi"] as const) {
    const students = groupStudentsBySubject(PREVIEW_STUDENTS, focus).map((student, index) => index === 0 ? { ...student, group: "C" as const } : student);
    const input = { ...SESSION_DEFAULTS, focus };
    const plan = validPlan(input, grades, students);
    const lowTask = plan.tasks.find((task) => task.level === "1")!;
    assert.equal(lowTask.template!.requiresReading, false);
    lowTask.template = structuredClone(TASK_TEMPLATES[focus]["3"]);
    const result = validateSessionPlan(input, students, grades, plan);
    assert.equal(result.valid, false);
    assert.ok(result.checks[4].errors.length);
  }
});

test("invalid timing, empty classes, missing levels and missing class tasks cannot be saved", () => {
  for (const change of [{ duration: "71" }, { duration: "10" }, { duration: "999999" }, { duration: "30", blockMinutes: "20" }, { blockMinutes: "12" }]) {
    assert.equal(buildSessionPlan({ ...SESSION_DEFAULTS, ...change } as SessionPreviewInput, roster, grades).validation.valid, false);
  }
  assert.equal(buildSessionPlan(SESSION_DEFAULTS, [], grades).validation.valid, false);
  assert.equal(buildSessionPlan(SESSION_DEFAULTS, roster.filter((student) => student.classKey === "first"), grades).validation.valid, false);
  assert.equal(buildSessionPlan(SESSION_DEFAULTS, [{ ...roster[0], literacy: null }, ...roster.slice(1)], grades).validation.valid, false);
  const students = roster.map((student, index) => index === 0 ? { ...student, literacy: "6" } : student);
  assert.equal(buildSessionPlan(SESSION_DEFAULTS, students, grades).validation.valid, false);
  const input = { ...SESSION_DEFAULTS, phaseTasks: { ...SESSION_DEFAULTS.phaseTasks, literasi: { first: "Baca halaman 20 buku kelas. Jawab pertanyaan pertama.", second: "" } } };
  const plan = validPlan(input, grades, students);
  assert.equal(plan.tasks.find((task) => task.level === "6")!.template!.content.kind, "written");
});

test("student projection excludes identities and ability metadata; snapshots remain independent", () => {
  const plan = validPlan();
  const packet = getStudentPacket(SESSION_DEFAULTS, plan, grades);
  const text = JSON.stringify(packet);
  for (const student of roster) {
    assert.ok(!text.includes(student.name));
    assert.ok(!text.includes(student.id));
  }
  assert.doesNotMatch(text, /memberIds|literacy|numeracy|requiresReading|phase|level|Pemula|Sesuai fase/);
  assert.equal(packet.groups.length, new Set(roster.map((student) => `${student.classKey}-${student.group}`)).size);
  const snapshot = structuredClone({ input: SESSION_DEFAULTS, roster, plan });
  const packetBefore = structuredClone(packet);
  plan.tasks[0].template!.title = "Diubah";
  assert.notEqual(snapshot.plan.tasks[0].template!.title, "Diubah");
  assert.deepEqual(packet, packetBefore);
  assert.notEqual(TASK_TEMPLATES.literasi["1"].title, "Diubah");
  const lowTask = packet.groups[0].activities[0];
  assert.equal(lowTask.instruction, "");
  assert.notEqual(lowTask.content.kind, "written");
});


test("UI-19: manual mixed blocks retain edits, reflow time and validate independently of the generator", () => {
  const original = validPlan();
  const before = structuredClone(original);
  const blocks = original.blocks.map((block, index) => index === 1 ? { ...block, end: block.start + 10, note: "Bahas bacaan bersama." } : block);
  const edited = reflowPlan({ ...original, blocks });
  const input = { ...SESSION_DEFAULTS, duration: String(edited.blocks.at(-1)!.end) };
  assert.equal(input.duration, "65");
  assert.equal(buildSessionPlan(input, roster, grades).validation.valid, false);
  assert.equal(validateSessionPlan(input, roster, grades, edited).valid, true);
  assert.equal(edited.blocks[1].note, "Bahas bacaan bersama.");
  assert.equal(edited.blocks[2].start, 15);
  assert.deepEqual(original, before);
  const reordered = reflowPlan({ ...edited, blocks: [edited.blocks[0], edited.blocks[2], edited.blocks[1], ...edited.blocks.slice(3)] });
  assert.equal(reordered.blocks[2].note, "Bahas bacaan bersama.");
  assert.equal(validateSessionPlan(input, roster, grades, reordered).valid, true);
  const removed = reflowPlan({ ...edited, blocks: [edited.blocks[0], ...edited.blocks.slice(2)] });
  assert.equal(validateSessionPlan({ ...input, duration: String(removed.blocks.at(-1)!.end) }, roster, grades, removed).valid, true);
});

test("UI-19: groups can receive multiple tasks; every block stays linked to the edited tasks", () => {
  const original = validPlan();
  const extra = { ...structuredClone(original.tasks[0]), id: "extra-activity" };
  extra.template!.title = "Pasangan tambahan";
  extra.template!.content = { kind: "picture-match", values: [2, 1, 0, 2] };
  const plan = reflowPlan({ ...original, tasks: [...original.tasks, extra] });
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, plan).valid, true);
  assert.ok(plan.blocks.flatMap((block) => block.activities).some((activity) => activity.taskIds.includes(extra.id)));
  const packet = getStudentPacket(SESSION_DEFAULTS, plan, grades);
  assert.ok(packet.groups.flatMap((group) => group.activities).some((activity) => activity.title === "Pasangan tambahan"));
  assert.equal(packet.groups[0].activities.at(-1)!.instruction, "");
  const noTasks = reflowPlan({ ...plan, tasks: [] });
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, noTasks).valid, false);
  const unsafe = structuredClone(plan);
  unsafe.tasks[0].template = structuredClone(TASK_TEMPLATES.literasi["3"]);
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, unsafe).valid, false);
});

test("UI-19: task forms reject reading for low levels, invalid patterns and blank exercises", () => {
  const visual = { level: "1", title: "Pasangkan bentuk", kind: "picture-match", instruction: "Jelaskan secara lisan.", passage: "", questions: "", values: "0, 2, 1" };
  assert.equal(taskEditorSchema.safeParse(visual).success, true);
  assert.equal(taskEditorSchema.safeParse({ ...visual, kind: "written", questions: "Baca kata." }).success, false);
  assert.equal(taskEditorSchema.safeParse({ ...visual, values: "0, 9" }).success, false);
  assert.equal(taskEditorSchema.safeParse({ ...visual, kind: "count-match", values: "0, 2" }).success, false);
  assert.equal(taskEditorSchema.safeParse({ ...visual, kind: "count-match", values: "2, 9" }).success, true);
  assert.equal(taskEditorSchema.safeParse({ ...visual, level: "6" }).success, false);
  assert.equal(taskEditorSchema.safeParse({ ...visual, level: "3", kind: "written", questions: "  " }).success, false);
  assert.equal(taskTemplateSchema.safeParse({ id: "visual", title: "Pasangan", instruction: "Jelaskan lisan.", requiresReading: false, content: { kind: "written", questions: ["Baca kata."] } }).success, false);
});


test("UI-21: photos are optional, local-only, and low-level photos require teacher declaration", () => {
  const photo = { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==", alt: "Gambar pasangan benda", width: 1, height: 1, nonReadingConfirmed: false };
  assert.equal(taskPhotoSchema.safeParse(photo).success, true);
  assert.equal(taskPhotoSchema.safeParse({ ...photo, src: "https://example.com/student.png" }).success, false);
  assert.equal(taskPhotoSchema.safeParse({ ...photo, src: "data:image/svg+xml;base64,AAAA" }).success, false);
  assert.equal(taskPhotoSchema.safeParse({ ...photo, width: 10000, height: 10000 }).success, false);
  const plan = validPlan();
  plan.tasks[0].template!.photo = photo;
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, plan).valid, false);
  plan.tasks[0].template!.photo.nonReadingConfirmed = true;
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, plan).valid, true);
  const packet = getStudentPacket(SESSION_DEFAULTS, plan, grades);
  const outputPhoto = packet.groups[0].activities[0].photo!;
  assert.equal(outputPhoto.src, photo.src);
  assert.equal(outputPhoto.alt, photo.alt);
  assert.ok(!("nonReadingConfirmed" in outputPhoto));
  assert.ok(!("name" in outputPhoto));
  const snapshot = structuredClone(packet);
  plan.tasks[0].template!.photo = undefined;
  assert.equal(validateSessionPlan(SESSION_DEFAULTS, roster, grades, plan).valid, true);
  assert.equal(getStudentPacket(SESSION_DEFAULTS, plan, grades).groups[0].activities[0].photo, undefined);
  assert.equal(snapshot.groups[0].activities[0].photo!.src, photo.src);
});
