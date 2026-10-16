import assert from "node:assert/strict";
import test from "node:test";
import { GROUP_KEYS, PREVIEW_STUDENTS, phaseForGrade } from "../src/features/kelas/constants/preview.ts";
import { observationSchema, previewStudentSchema } from "../src/features/kelas/validations/observation.ts";
import { groupStudentsBySubject } from "../src/features/kelas/constants/groups.ts";
import { getIndependentTasks } from "../src/features/sesi/constants/independent-tasks.ts";
import { SESSION_ROTATION } from "../src/features/sesi/constants/reference-content.ts";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "../src/features/kelas/constants/reference-content.ts";
import { classroomPreviewSchema } from "../src/features/kelas/validations/classroom.ts";
import { sessionPreviewSchema } from "../src/features/sesi/validations/session.ts";
import { getStudentPage } from "../src/features/kelas/constants/student-list.ts";

test("student cards paginate five rows, combine name/group filters, and stay within their class", () => {
  const first = getStudentPage(PREVIEW_STUDENTS, "first", "", "all", 1);
  assert.equal(first.rows.length, 5);
  assert.equal(first.total, 7);
  assert.equal(first.pageCount, 2);
  assert.equal(getStudentPage(first.rows, "first", "", "all", 1).pageCount, 1);
  assert.equal(getStudentPage(PREVIEW_STUDENTS, "second", "", "all", 2).rows.length, 3);
  const secondPage = getStudentPage(PREVIEW_STUDENTS, "first", "", "all", 2);
  assert.equal(secondPage.rows.length, 2);
  assert.equal(new Set([...first.rows, ...secondPage.rows].map((student) => student.id)).size, 7);
  assert.ok(secondPage.rows.every((student) => student.classKey === "first"));
  const filtered = getStudentPage(PREVIEW_STUDENTS, "first", "  AYU  ", "A", 2);
  assert.deepEqual(filtered.rows.map((student) => student.name), ["Ayu"]);
  assert.equal(filtered.currentPage, 1);
  assert.equal(filtered.pageCount, 1);
  assert.equal(getStudentPage(PREVIEW_STUDENTS, "first", "Ayu", "B", 1).total, 0);
  assert.equal(getStudentPage(PREVIEW_STUDENTS, "second", "Ayu", "all", 1).total, 0);
  assert.deepEqual(getStudentPage([], "first", "", "all", 1).rows, []);
});

test("the public preview has only unique fictional students and keeps class membership separate", () => {
  assert.equal(PREVIEW_STUDENTS.length, 15);
  assert.equal(new Set(PREVIEW_STUDENTS.map((student) => student.id)).size, 15);
  assert.ok(PREVIEW_STUDENTS.every((student) => student.id.startsWith("sample-") && ["first", "second"].includes(student.classKey)));
  assert.notEqual(phaseForGrade("2"), phaseForGrade("3"));
  assert.equal(phaseForGrade("3"), phaseForGrade("4"));
  assert.equal(phaseForGrade("5"), "C");
  assert.equal(phaseForGrade("6"), "C");
});

test("the preview uses the level-table roster, six level options, and a contiguous subject-neutral rotation", () => {
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "first").length, 7);
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "second").length, 8);
  assert.equal(LITERACY_LEVELS.length, 6);
  assert.equal(NUMERACY_LEVELS.length, 6);
  let end = 0;
  for (const block of SESSION_ROTATION) {
    assert.equal(block.start, end);
    assert.ok(block.end > block.start);
    assert.ok(block.shared ? !block.teacher : ["first", "second"].includes(block.teacher ?? ""));
    end = block.end;
  }
  assert.equal(end, 70);
  assert.deepEqual(SESSION_ROTATION.filter((block) => !block.shared).map((block) => block.teacher), ["first", "second", "first", "second"]);
  assert.equal(classroomPreviewSchema.safeParse({ first: "2", second: "2" }).success, false);
});

test("session context accepts curriculum subject names while validating a separate skill focus (UI-17)", () => {
  const input = { lessonSubject: "Bahasa Indonesia", topic: "", focus: "literasi", duration: "70", blockMinutes: "15", date: "2026-10-14" };
  for (const lessonSubject of ["Bahasa Indonesia", "Matematika", "PPKn", "SBdP", "PJOK", "IPAS", "Muatan lokal"]) {
    for (const focus of ["literasi", "numerasi"]) {
      const parsed = sessionPreviewSchema.parse({ ...input, lessonSubject: `  ${lessonSubject}  `, topic: "  Lingkungan sekolah  ", focus });
      assert.equal(parsed.lessonSubject, lessonSubject);
      assert.equal(parsed.topic, "Lingkungan sekolah");
      assert.equal(parsed.focus, focus);
    }
  }
  assert.equal(sessionPreviewSchema.parse(input).topic, "");
  assert.equal(sessionPreviewSchema.safeParse({ ...input, lessonSubject: "  " }).success, false);
  assert.equal(sessionPreviewSchema.safeParse({ ...input, lessonSubject: "a".repeat(81) }).success, false);
  assert.equal(sessionPreviewSchema.safeParse({ ...input, topic: "a".repeat(161) }).success, false);
  assert.equal(sessionPreviewSchema.safeParse({ ...input, focus: "PJOK" }).success, false);
  assert.equal(sessionPreviewSchema.safeParse({ ...input, date: "2026-02-31" }).success, false);
  assert.equal(sessionPreviewSchema.safeParse({ ...input, duration: "90" }).success, false);
});

test("preview entry rejects blank names/observations and retains trimmed content", () => {
  assert.equal(observationSchema.safeParse({ note: "   " }).success, false);
  assert.equal(previewStudentSchema.safeParse({ name: "  " }).success, false);
  assert.deepEqual(observationSchema.parse({ note: "  Mengamati benda di sekitar.  " }), { note: "Mengamati benda di sekitar." });
  assert.deepEqual(previewStudentSchema.parse({ name: "  Siswa Fiktif  " }), { name: "Siswa Fiktif" });
});

test("six subject levels retain exactly three group choices", () => {
  assert.deepEqual(GROUP_KEYS, ["A", "B", "C"]);
  for (const levels of [LITERACY_LEVELS, NUMERACY_LEVELS]) {
    assert.deepEqual(levels.map((level) => level.value), ["1", "2", "3", "4", "5", "6"]);
    assert.equal(levels[5].label, "Sesuai fase");
    assert.equal(levels[5].description, "Sudah melampaui level dasar; tugas mengikuti capaian fase kelasnya");
  }
});

test("mixed-group guidance follows each member's subject level without changing memberships", () => {
  const members = ["1", "2", "3", "4", "5", "6", null, "invalid"].map((level, index) => ({
    ...PREVIEW_STUDENTS[0], id: `task-${index}`, group: "A" as const, literacy: level, numeracy: level,
  }));
  const original = structuredClone(members);
  for (const subject of ["literasi", "numerasi"] as const) {
    const tasks = getIndependentTasks(members, subject, "3");
    assert.deepEqual(tasks.filter((task) => task.mode === "non-reading").map((task) => task.level), ["1", "2"]);
    assert.ok(tasks.filter((task) => task.mode === "non-reading").every((task) => task.instruction.includes("tidak boleh")));
    assert.deepEqual(tasks.filter((task) => task.mode === "practice").map((task) => task.level), ["3", "4", "5"]);
    const phaseTask = tasks.find((task) => task.level === "6")!;
    assert.equal(phaseTask.mode, "phase");
    assert.equal(phaseTask.title, "Tugas fase B");
    assert.ok(phaseTask.instruction.includes("belum dipilih"));
    assert.equal(tasks.find((task) => task.mode === "unassessed")?.students.length, 2);
    const assigned = tasks.flatMap((task) => task.students.map((student) => student.id));
    assert.equal(assigned.length, members.length);
    assert.equal(new Set(assigned).size, members.length);
  }
  assert.deepEqual(members, original);
  assert.deepEqual(getIndependentTasks([], "literasi", "2"), []);
  const numeracyOnly = { ...members[0], literacy: "1", numeracy: "6" };
  assert.equal(getIndependentTasks([numeracyOnly], "literasi", "2")[0].mode, "non-reading");
  assert.equal(getIndependentTasks([numeracyOnly], "numerasi", "2")[0].mode, "phase");
});

test("level six uses the class phase and never falls back to a basic exercise", () => {
  const student = { ...PREVIEW_STUDENTS[0], literacy: "6", numeracy: "6" };
  for (const subject of ["literasi", "numerasi"] as const) {
    for (const [grade, phase] of [["1", "A"], ["2", "A"], ["3", "B"], ["4", "B"], ["5", "C"], ["6", "C"]]) {
      const [task] = getIndependentTasks([student], subject, grade);
      assert.equal(task.mode, "phase");
      assert.equal(task.title, `Tugas fase ${phase}`);
    }
    assert.equal(getIndependentTasks([student], subject, "unknown")[0].title, "Tugas sesuai fase kelas");
  }
});

test("grouping uses the selected subject's level and preserves every student's class", () => {
  const students = ["1", "2", "3", "4", "5", "6"].map((level, index) => ({
    ...PREVIEW_STUDENTS[index === 5 ? 7 : index], literacy: level, numeracy: String(6 - index),
  }));
  const original = structuredClone(students);
  const literacy = groupStudentsBySubject(students, "literasi");
  const numeracy = groupStudentsBySubject(students, "numerasi");
  assert.deepEqual(literacy.map((student) => student.group), ["A", "A", "B", "B", "B", "C"]);
  assert.deepEqual(numeracy.map((student) => student.group), ["C", "B", "B", "B", "A", "A"]);
  for (const result of [literacy, numeracy]) {
    assert.equal(new Set(result.map((student) => student.id)).size, students.length);
    assert.deepEqual(result.map((student) => [student.id, student.classKey, student.classroomId]), students.map((student) => [student.id, student.classKey, student.classroomId]));
  }
  assert.deepEqual(students, original);
  assert.deepEqual(groupStudentsBySubject([], "literasi"), []);
  const filtered = getStudentPage(numeracy, "first", "", "C", 1);
  assert.deepEqual(filtered.rows.map((student) => student.id), [students[0].id]);
});

test("manual subject adjustments persist while automatic groups follow reassessments", () => {
  const student = { ...PREVIEW_STUDENTS[0], literacy: "1", numeracy: "6" };
  const overrides = { [student.id]: "B" as const };
  const saved = groupStudentsBySubject([student], "literasi", overrides);
  assert.equal(saved[0].group, "B");
  assert.equal(groupStudentsBySubject([student], "numerasi")[0].group, "C");
  student.literacy = "6";
  assert.equal(groupStudentsBySubject([student], "literasi", overrides)[0].group, "B");
  assert.equal(groupStudentsBySubject([student], "literasi")[0].group, "C");
  assert.equal(saved[0].literacy, "1");
  assert.equal(saved[0].group, "B");
});

test("missing levels keep current membership without inventing an assessment", () => {
  const student = { ...PREVIEW_STUDENTS[0], literacy: null, numeracy: null, group: "C" as const };
  const [grouped] = groupStudentsBySubject([student], "literasi");
  assert.equal(grouped.group, "C");
  assert.equal(grouped.literacy, null);
  assert.equal(getIndependentTasks([grouped], "literasi", "2")[0].mode, "unassessed");
  assert.equal(groupStudentsBySubject([{ ...student, id: "toString", literacy: "1" }], "literasi")[0].group, "A");
});
