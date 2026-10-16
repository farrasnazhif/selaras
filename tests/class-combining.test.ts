import assert from "node:assert/strict";
import test from "node:test";
import { canCombineGrades, combineIndependentClassrooms } from "../src/features/kelas/constants/class-pairing.ts";
import { INDEPENDENT_CLASSROOMS, INDEPENDENT_STUDENTS } from "../src/features/kelas/constants/independent-classes.ts";
import { PREVIEW_STUDENTS, EXAMPLE_CLASS_ID } from "../src/features/kelas/constants/preview.ts";
import type { PreviewStudent } from "../src/features/shared/types/preview.ts";
import { classroomPreviewSchema } from "../src/features/kelas/validations/classroom.ts";

const legacy = { id: EXAMPLE_CLASS_ID, grades: { first: "2", second: "3" } };
const classrooms = [...INDEPENDENT_CLASSROOMS, legacy];
const students = [...PREVIEW_STUDENTS, ...INDEPENDENT_STUDENTS];

test("UI-20: new combinations allow same and neighboring grades in either order", () => {
  for (let first = 1; first <= 6; first++) for (let second = 1; second <= 6; second++) {
    const expected = Math.abs(first - second) <= 1;
    assert.equal(canCombineGrades(String(first), String(second)), expected);
    assert.equal(classroomPreviewSchema.safeParse({ first: String(first), second: String(second) }).success, expected);
  }
  assert.equal(canCombineGrades("0", "1"), false);
  assert.equal(canCombineGrades("5", "7"), false);
});

test("UI-20: seeded independent cards each own 32 unique pupils", () => {
  assert.deepEqual(INDEPENDENT_CLASSROOMS.map((classroom) => classroom.grades.first), ["1", "2", "3", "4", "5", "6"]);
  assert.equal(INDEPENDENT_STUDENTS.length, 192);
  assert.equal(new Set(INDEPENDENT_STUDENTS.map((student) => student.id)).size, 192);
  for (const classroom of INDEPENDENT_CLASSROOMS) {
    const members = INDEPENDENT_STUDENTS.filter((student) => student.classroomId === classroom.id);
    assert.equal(members.length, 32);
    assert.ok(members.every((student) => student.classKey === "first" && /^[1-6]$/.test(student.literacy!) && /^[1-6]$/.test(student.numeracy!)));
  }
});

test("UI-20: combining preserves identity, levels and legacy records without mutating inputs", () => {
  const before = structuredClone({ classrooms, students });
  const result = combineIndependentClassrooms(classrooms, students, ["kelas-2", "kelas-1"], "new-combined");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.classroom.grades, { first: "1", second: "2" });
  assert.deepEqual(result.classroom.sourceIds, { first: "kelas-1", second: "kelas-2" });
  assert.equal(result.classrooms.length, classrooms.length - 1);
  assert.ok(result.classrooms.includes(legacy));
  assert.deepEqual(result.students.filter((student) => student.classroomId === EXAMPLE_CLASS_ID), PREVIEW_STUDENTS);
  for (const original of INDEPENDENT_STUDENTS) {
    const updated: PreviewStudent = result.students.find((student) => student.id === original.id)!;
    if (original.classroomId !== "kelas-1" && original.classroomId !== "kelas-2") {
      assert.deepEqual(updated, original);
      continue;
    }
    assert.equal(updated.classroomId, "new-combined");
    assert.equal(updated.classKey, original.classroomId === "kelas-1" ? "first" : "second");
    assert.equal(updated.literacy, original.literacy);
    assert.equal(updated.numeracy, original.numeracy);
    assert.equal(updated.group, original.group);
  }
  assert.equal(new Set(result.students.map((student) => student.id)).size, students.length);
  assert.deepEqual({ classrooms, students }, before);
});

test("UI-20: additional seeded pairs combine their own 64 pupils and preserve other classes", () => {
  for (const [first, second] of [["kelas-2", "kelas-3"], ["kelas-3", "kelas-4"], ["kelas-4", "kelas-5"], ["kelas-5", "kelas-6"]]) {
    const result = combineIndependentClassrooms(classrooms, students, [second, first], "additional-pair");
    assert.equal(result.ok, true);
    if (!result.ok) continue;
    assert.equal(result.students.filter((student) => student.classroomId === "additional-pair").length, 64);
    assert.equal(result.classrooms.length, classrooms.length - 1);
    assert.deepEqual(result.classroom.sourceIds, { first, second });
    assert.deepEqual(result.students.filter((student) => student.classroomId !== "additional-pair"), students.filter((student) => student.classroomId !== first && student.classroomId !== second));
  }
});

test("UI-20: duplicate, missing and already combined selections leave data unchanged", () => {
  const before = structuredClone({ classrooms, students });
  for (const ids of [["kelas-1"], ["kelas-1", "kelas-1"], ["kelas-1", "unknown"], ["kelas-1", EXAMPLE_CLASS_ID], ["kelas-1", "kelas-3"], ["kelas-1", "kelas-6"]]) {
    assert.equal(combineIndependentClassrooms(classrooms, students, ids, "new-id").ok, false);
  }
  assert.equal(combineIndependentClassrooms(classrooms, students, ["kelas-1", "kelas-2"], EXAMPLE_CLASS_ID).ok, false);
  assert.deepEqual({ classrooms, students }, before);
});
