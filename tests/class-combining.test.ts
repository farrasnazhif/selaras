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

test("UI-20: new combinations only allow fixed neighboring pairs in either order", () => {
  for (let first = 1; first <= 6; first++) for (let second = 1; second <= 6; second++) {
    const expected = [[1, 2], [2, 1], [3, 4], [4, 3], [5, 6], [6, 5]].some(([a, b]) => a === first && b === second);
    assert.equal(canCombineGrades(String(first), String(second)), expected);
    assert.equal(classroomPreviewSchema.safeParse({ first: String(first), second: String(second) }).success, expected);
  }
  assert.equal(canCombineGrades("0", "1"), false);
  assert.equal(canCombineGrades("5", "7"), false);
});

test("UI-20: seeded independent cards each own 32 unique pupils", () => {
  assert.equal(INDEPENDENT_CLASSROOMS.length, 2);
  assert.equal(new Set(INDEPENDENT_STUDENTS.map((student) => student.id)).size, 64);
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
  assert.equal(result.classrooms.length, 2);
  assert.ok(result.classrooms.includes(legacy));
  assert.deepEqual(result.students.filter((student) => student.classroomId === EXAMPLE_CLASS_ID), PREVIEW_STUDENTS);
  for (const original of INDEPENDENT_STUDENTS) {
    const updated: PreviewStudent = result.students.find((student) => student.id === original.id)!;
    assert.equal(updated.classroomId, "new-combined");
    assert.equal(updated.classKey, original.classroomId === "kelas-1" ? "first" : "second");
    assert.equal(updated.literacy, original.literacy);
    assert.equal(updated.numeracy, original.numeracy);
    assert.equal(updated.group, original.group);
  }
  assert.equal(new Set(result.students.map((student) => student.id)).size, students.length);
  assert.deepEqual({ classrooms, students }, before);
});

test("UI-20: duplicate, missing and already combined selections leave data unchanged", () => {
  const before = structuredClone({ classrooms, students });
  for (const ids of [["kelas-1"], ["kelas-1", "kelas-1"], ["kelas-1", "unknown"], ["kelas-1", EXAMPLE_CLASS_ID]]) {
    assert.equal(combineIndependentClassrooms(classrooms, students, ids, "new-id").ok, false);
  }
  assert.equal(combineIndependentClassrooms(classrooms, students, ["kelas-1", "kelas-2"], EXAMPLE_CLASS_ID).ok, false);
  assert.deepEqual({ classrooms, students }, before);
});
