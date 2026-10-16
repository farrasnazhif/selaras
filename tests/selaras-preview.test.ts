import assert from "node:assert/strict";
import test from "node:test";
import { PREVIEW_ASSESSMENTS, PREVIEW_STUDENTS, phaseForGrade } from "../src/features/kelas/constants/preview.ts";
import { observationSchema, previewStudentSchema } from "../src/features/kelas/validations/observation.ts";
import { LITERACY_ROTATION } from "../src/features/sesi/constants/reference-content.ts";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "../src/features/kelas/constants/reference-content.ts";
import { classroomPreviewSchema } from "../src/features/kelas/validations/classroom.ts";
import { sessionPreviewSchema } from "../src/features/sesi/validations/session.ts";
import { getStudentPage } from "../src/features/kelas/constants/student-list.ts";

test("student cards paginate five rows, combine name/group filters, and stay within their class", () => {
  const first = getStudentPage(PREVIEW_STUDENTS, "first", "", "all", 1);
  assert.equal(first.rows.length, 5);
  assert.equal(first.total, 32);
  assert.equal(first.pageCount, 7);
  assert.equal(getStudentPage(first.rows, "first", "", "all", 1).pageCount, 1);
  assert.equal(getStudentPage(PREVIEW_STUDENTS, "second", "", "all", 2).rows.length, 5);
  const secondPage = getStudentPage(PREVIEW_STUDENTS, "first", "", "all", 2);
  assert.equal(secondPage.rows.length, 5);
  assert.equal(new Set([...first.rows, ...secondPage.rows].map((student) => student.id)).size, 10);
  assert.ok(secondPage.rows.every((student) => student.classKey === "first"));
  assert.equal(getStudentPage(PREVIEW_STUDENTS, "first", "", "all", 7).rows.length, 2);
  const filtered = getStudentPage(PREVIEW_STUDENTS, "first", "  AYU  ", "A", 2);
  assert.deepEqual(filtered.rows.map((student) => student.name), ["Ayu"]);
  assert.equal(filtered.currentPage, 1);
  assert.equal(filtered.pageCount, 1);
  assert.equal(getStudentPage(PREVIEW_STUDENTS, "first", "Ayu", "B", 1).total, 0);
  assert.equal(getStudentPage(PREVIEW_STUDENTS, "second", "Ayu", "all", 1).total, 0);
  assert.deepEqual(getStudentPage([], "first", "", "all", 1).rows, []);
});

test("the public preview has only unique fictional students and keeps class membership separate", () => {
  assert.equal(PREVIEW_STUDENTS.length, 64);
  assert.equal(new Set(PREVIEW_STUDENTS.map((student) => student.id)).size, 64);
  assert.ok(PREVIEW_STUDENTS.every((student) => student.id.startsWith("sample-") && ["first", "second"].includes(student.classKey)));
  assert.notEqual(phaseForGrade("2"), phaseForGrade("3"));
  assert.equal(phaseForGrade("3"), phaseForGrade("4"));
  assert.equal(phaseForGrade("5"), "C");
  assert.equal(phaseForGrade("6"), "C");
});

test("the expanded demo keeps 32 students per class, five levels, and a contiguous 70-minute rotation", () => {
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "first").length, 32);
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "second").length, 32);
  assert.equal(LITERACY_LEVELS.length, 5);
  assert.equal(NUMERACY_LEVELS.length, 5);
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

test("every demo student has a group and ordered previous/current levels with varied progress", () => {
  const changes = new Set<number>();
  for (const student of PREVIEW_STUDENTS) {
    assert.ok(["A", "B", "C"].includes(student.group));
    for (const subject of ["literasi", "numerasi"] as const) {
      const history = PREVIEW_ASSESSMENTS.filter((entry) => entry.studentId === student.id && entry.subject === subject);
      assert.equal(history.length, 2);
      assert.ok(history[0].recordedAt < history[1].recordedAt);
      assert.ok(history.every((entry) => ["1", "2", "3", "4", "5"].includes(entry.level)));
      assert.equal(history[1].level, student[subject === "literasi" ? "literacy" : "numeracy"]);
      changes.add(Math.sign(Number(history[1].level) - Number(history[0].level)));
    }
  }
  assert.deepEqual([...changes].sort(), [-1, 0, 1]);
  const middle = PREVIEW_ASSESSMENTS.filter((entry) => ["2", "3", "4"].includes(entry.level));
  assert.ok(middle.length > PREVIEW_ASSESSMENTS.length / 2);
});
