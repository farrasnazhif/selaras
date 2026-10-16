import assert from "node:assert/strict";
import test from "node:test";
import { validateFiles, formatFileSize } from "../src/lib/file-validation.ts";
import { getMonthDays, getWeekDays, shiftMonth, shiftDay } from "../src/lib/calendar.ts";
import { getTableRows } from "../src/lib/table.ts";

test("file selection validates extension, MIME, size, and count without losing valid files", () => {
  const text = new File(["a"], "notes.TXT", { type: "text/plain" });
  const image = new File(["image"], "photo.png", { type: "image/png" });
  const invalid = new File(["bad"], "program.exe", { type: "application/octet-stream" });
  const large = new File(["x".repeat(20)], "large.txt", { type: "text/plain" });
  const result = validateFiles([text, invalid, large, image, text], { accept: ".txt,image/*", maxSize: 10, maxFiles: 2 });
  assert.deepEqual(result.accepted, [text, image]);
  assert.deepEqual(result.errors, ["program.exe: unsupported file type.", "large.txt: exceeds the 10 B limit.", "notes.TXT: file limit reached."]);
  assert.deepEqual(validateFiles([image], { accept: " image/png " }).accepted, [image]);
  assert.deepEqual(validateFiles([text], { maxFiles: 0 }).accepted, []);
  assert.deepEqual(validateFiles([text], { maxSize: 1 }).accepted, [text]);
  assert.deepEqual(validateFiles([text, image]).accepted, [text, image]);
  assert.equal(formatFileSize(1024), "1.0 KB");
  assert.equal(formatFileSize(1024 * 1024), "1.0 MB");
});

test("calendar dates handle leap years, week offsets, and month/year boundaries", () => {
  assert.equal(getMonthDays("2024-02").days.length, 29);
  assert.equal(getMonthDays("2026-02").days.length, 28);
  assert.equal(getMonthDays("2026-10").offset, 4);
  assert.equal(getMonthDays("2026-10").days.at(-1), "2026-10-31");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(shiftDay("2024-02-28", 1), "2024-02-29");
  assert.equal(shiftDay("2026-12-31", 1), "2027-01-01");
  assert.equal(shiftDay("2026-10-01", -7), "2026-09-24");
});

test("table filtering and numeric sorting preserve caller data and handle empty results", () => {
  const rows = [{ name: "Zoe", count: 2 }, { name: "Alex", count: 10 }, { name: "Sam", count: 1 }];
  const columns = [{ id: "name", value: (row: typeof rows[number]) => row.name }, { id: "count", value: (row: typeof rows[number]) => row.count }];
  assert.deepEqual(getTableRows(rows, columns, " ALEX ", null), [rows[1]]);
  assert.deepEqual(getTableRows(rows, columns, "unknown", null), []);
  assert.deepEqual(getTableRows(rows, columns, "", { id: "count", direction: "asc" }), [rows[2], rows[0], rows[1]]);
  assert.deepEqual(getTableRows(rows, columns, "", { id: "count", direction: "desc" }), [rows[1], rows[0], rows[2]]);
  assert.deepEqual(getTableRows(rows, columns, "", { id: "name", direction: "asc" }), [rows[1], rows[2], rows[0]]);
  assert.deepEqual(rows.map((row) => row.name), ["Zoe", "Alex", "Sam"]);
  assert.deepEqual(getTableRows([], columns, "", null), []);
});

test("weekly schedules include Monday through Sunday across year and leap-day boundaries", () => {
  assert.deepEqual(getWeekDays("2027-01-03"), ["2026-12-28", "2026-12-29", "2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02", "2027-01-03"]);
  assert.deepEqual(getWeekDays("2024-02-29"), ["2024-02-26", "2024-02-27", "2024-02-28", "2024-02-29", "2024-03-01", "2024-03-02", "2024-03-03"]);
  assert.equal(getWeekDays("2026-10-12")[0], "2026-10-12");
});
