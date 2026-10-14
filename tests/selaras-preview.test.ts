import assert from "node:assert/strict";
import test from "node:test";
import { PREVIEW_STUDENTS, phaseForGrade } from "../src/features/selaras/constants/preview.ts";
import { observationSchema, previewStudentSchema } from "../src/features/selaras/validations/observation.ts";
import { LITERACY_ROTATION, LITERACY_LEVELS, NUMERACY_LEVELS } from "../src/features/selaras/constants/reference-content.ts";
import { classroomPreviewSchema } from "../src/features/selaras/validations/classroom.ts";
import { sessionPreviewSchema } from "../src/features/selaras/validations/session.ts";
import { getStudentPage } from "../src/features/selaras/constants/student-list.ts";

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

test("the screenshot fixture uses the level-table roster, five level options, and a contiguous 70-minute rotation", () => {
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "first").length, 7);
  assert.equal(PREVIEW_STUDENTS.filter((student) => student.classKey === "second").length, 8);
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
