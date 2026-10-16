import assert from "node:assert/strict";
import test from "node:test";
import { GROUP_KEYS, PREVIEW_STUDENTS, phaseForGrade } from "../src/features/kelas/constants/preview.ts";
import { observationSchema, previewStudentSchema } from "../src/features/kelas/validations/observation.ts";
import { getIndependentTasks } from "../src/features/sesi/constants/independent-tasks.ts";
import { LITERACY_ROTATION } from "../src/features/sesi/constants/reference-content.ts";
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

test("the screenshot fixture uses the level-table roster, six level options, and a contiguous 70-minute rotation", () => {
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "first").length, 7);
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "second").length, 8);
  assert.equal(LITERACY_LEVELS.length, 6);
  assert.equal(NUMERACY_LEVELS.length, 6);
  let end = 0;
  for (const block of LITERACY_ROTATION) {
    assert.equal(block.start, end);
    assert.ok(block.end > block.start);
    assert.ok(block.shared ? !block.teacher : ["first", "second"].includes(block.teacher ?? ""));
    end = block.end;
  }
  assert.equal(end, 70);
  assert.equal(classroomPreviewSchema.safeParse({ first: "2", second: "2" }).success, false);
  assert.equal(sessionPreviewSchema.safeParse({ subject: "literasi", duration: "70", blockMinutes: "15", date: "2026-02-31" }).success, false);
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
