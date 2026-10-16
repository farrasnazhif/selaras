import { CLASS_KEYS, GROUP_KEYS, phaseForGrade } from "../../kelas/constants/preview.ts";
import { GROUP_LABELS } from "../../kelas/constants/groups.ts";
import { sessionPreviewSchema, type SessionPreviewInput } from "../validations/session.ts";
import { taskTemplateSchema } from "../validations/task.ts";
import { getIndependentTasks } from "./independent-tasks.ts";
import type { ClassKey, PreviewStudent } from "@/features/shared/types/preview";
import type { PlanCheck, PlanValidation, SessionPlan, StudentPacket } from "../types/schedule.ts";

function occupiedGroups(roster: PreviewStudent[]) {
  return CLASS_KEYS.flatMap((classKey) => GROUP_KEYS.filter((group) => roster.some((student) => student.classKey === classKey && student.group === group)).map((group) => ({ classKey, group })));
}
function rosterErrors(input: SessionPreviewInput, roster: PreviewStudent[], grades: Record<ClassKey, string>) {
  const errors: string[] = [];
  if (!CLASS_KEYS.every((key) => /^[1-6]$/.test(grades[key])) || grades.first === grades.second) errors.push("Pilih dua tingkat kelas berbeda dari kelas 1–6.");
  if (new Set(roster.map((student) => student.id)).size !== roster.length) errors.push("Daftar siswa memuat anggota ganda.");
  if (new Set(roster.map((student) => student.classroomId)).size > 1) errors.push("Siswa harus berasal dari pasangan kelas yang sama.");
  for (const key of CLASS_KEYS) if (!roster.some((student) => student.classKey === key)) errors.push(`Tambahkan siswa Kelas ${grades[key]}.`);
  const field = input.focus === "literasi" ? "literacy" : "numeracy";
  if (roster.some((student) => !CLASS_KEYS.includes(student.classKey) || !GROUP_KEYS.includes(student.group) || !/^[1-6]$/.test(student[field] ?? ""))) errors.push("Lengkapi level dan kelompok semua siswa pada fokus yang dipilih.");
  return errors;
}

export function validateSessionPlan(input: SessionPreviewInput, roster: PreviewStudent[], grades: Record<ClassKey, string>, plan: SessionPlan): PlanValidation {
  const checks: PlanCheck[] = [
    { id: "V1", label: "Satu penugasan guru tiap blok", errors: [] },
    { id: "V2", label: "Semua kelompok memiliki kegiatan", errors: [] },
    { id: "V3", label: "Pembagian waktu sesuai durasi", errors: [] },
    { id: "V4", label: "Kedua kelas mendapat pendampingan", errors: [] },
    { id: "V5", label: "Tugas tanpa membaca untuk yang membutuhkan", errors: [] },
  ];
  const groups = occupiedGroups(roster);
  const groupId = (item: { classKey: string; group: string }) => `${item.classKey}-${item.group}`;
  const expectedGroups = groups.map(groupId).sort();
  const field = input.focus === "literasi" ? "literacy" : "numeracy";
  const taskIds = plan.tasks.map((task) => task.id);
  if (new Set(taskIds).size !== taskIds.length) checks[1].errors.push("Tugas memiliki ID ganda.");
  for (const group of groups) {
    const members = roster.filter((student) => student.classKey === group.classKey && student.group === group.group);
    const tasks = plan.tasks.filter((task) => groupId(task) === groupId(group));
    const assignedIds = [...new Set(tasks.flatMap((task) => task.memberIds))].sort();
    if (JSON.stringify(assignedIds) !== JSON.stringify(members.map((student) => student.id).sort())) checks[1].errors.push(`Pembagian tugas Kelompok ${GROUP_LABELS[group.group]}, Kelas ${grades[group.classKey]} belum mencakup semua anggota.`);
  }
  for (const task of plan.tasks) {
    if (!expectedGroups.includes(groupId(task)) || !task.memberIds.length || new Set(task.memberIds).size !== task.memberIds.length || task.memberIds.some((id) => !roster.some((student) => student.id === id && groupId(student) === groupId(task) && student[field] === task.level))) checks[1].errors.push("Anggota tugas tidak sesuai kelas, kelompok, atau levelnya.");
    const template = taskTemplateSchema.safeParse(task.template);
    if (!task.template) checks[1].errors.push(`Isi tugas sesuai kelas untuk Kelompok ${GROUP_LABELS[task.group]}, Kelas ${grades[task.classKey]} sebelum menyimpan.`);
    else if (!template.success) checks[1].errors.push(`Periksa isi tugas Kelompok ${GROUP_LABELS[task.group]}, Kelas ${grades[task.classKey]}: ${template.error.issues.map((issue) => issue.message).join(" ")}`);
    if ((task.level === "1" || task.level === "2") && (!task.template || task.template.requiresReading || task.template.content.kind === "written")) checks[4].errors.push("Tugas level 1–2 harus berupa kegiatan visual tanpa membaca.");
    if ((task.level === "1" || task.level === "2") && task.template?.photo && !task.template.photo.nonReadingConfirmed) checks[4].errors.push("Konfirmasi bahwa foto untuk level 1–2 tidak mengharuskan membaca.");
    if (task.level === "6" && (task.template?.id !== `class-task-${grades[task.classKey]}` || task.template.content.kind !== "written")) checks[1].errors.push("Gunakan tugas sesuai kelas untuk siswa yang melampaui kemampuan dasar.");
  }
  let end = 0;
  const core = plan.blocks.filter((block) => block.kind === "core");
  for (const [index, block] of plan.blocks.entries()) {
    const teacher = block.teacherAssignments[0] ?? [];
    if (block.teacherAssignments.length !== 1 || !teacher.length || new Set(teacher).size !== teacher.length || teacher.some((key) => !CLASS_KEYS.includes(key))) checks[0].errors.push(`Blok ${index + 1} harus memiliki tepat satu penugasan guru.`);
    if (block.kind !== "core" && (teacher.length !== 2 || !CLASS_KEYS.every((key) => teacher.includes(key)))) checks[0].errors.push("Pembuka dan penutup harus bersama kedua kelas.");
    const activityGroups = block.activities.map(groupId).sort();
    if (JSON.stringify(activityGroups) !== JSON.stringify(expectedGroups)) checks[1].errors.push(`Kegiatan kelompok pada blok ${index + 1} tidak lengkap atau ganda.`);
    for (const activity of block.activities) {
      if (activity.mode !== (teacher.includes(activity.classKey) ? "teacher" : "independent")) checks[0].errors.push(`Status pendampingan blok ${index + 1} tidak sesuai penugasan guru.`);
      const expectedTasks = plan.tasks.filter((task) => groupId(task) === groupId(activity)).map((task) => task.id).sort();
      if (activity.mode === "independent" && JSON.stringify([...activity.taskIds].sort()) !== JSON.stringify(expectedTasks)) checks[1].errors.push(`Tugas mandiri blok ${index + 1} tidak sesuai kelompok.`);
      if (activity.mode === "teacher" && activity.taskIds.length) checks[1].errors.push("Kegiatan bersama guru tidak boleh sekaligus ditugaskan mandiri.");
    }
    if (!Number.isInteger(block.start) || !Number.isInteger(block.end) || block.start !== end || block.end <= block.start || (block.kind === "core" ? ![10, 15, 20].includes(block.end - block.start) : block.end - block.start !== 5)) checks[2].errors.push(`Waktu blok ${index + 1} tidak sesuai.`);
    if (block.note && block.note.length > 300) checks[1].errors.push("Catatan kegiatan maksimal 300 karakter.");
    end = block.end;
  }
  if (end !== Number(input.duration) || plan.blocks[0]?.kind !== "opening" || plan.blocks.at(-1)?.kind !== "closing" || plan.blocks.filter((block) => block.kind !== "core").length !== 2 || !core.length) checks[2].errors.push("Jadwal harus mencakup pembuka, blok inti, dan penutup dengan durasi tepat.");
  for (const key of CLASS_KEYS) if (!core.some((block) => block.teacherAssignments.length === 1 && block.teacherAssignments[0].includes(key))) checks[3].errors.push(`Kelas ${grades[key]} belum mendapat pendampingan pada blok inti.`);
  const samePhase = phaseForGrade(grades.first) === phaseForGrade(grades.second);
  if (plan.mode !== (samePhase ? "same-phase" : "cross-phase") || (samePhase ? core[0]?.teacherAssignments[0]?.length !== 2 : core.some((block) => block.teacherAssignments[0]?.length !== 1))) checks[0].errors.push("Penugasan guru belum mengikuti pasangan fase kelas.");
  const parsed = sessionPreviewSchema.safeParse(input);
  const errors = [...(parsed.success ? [] : parsed.error.issues.map((issue) => issue.message)), ...rosterErrors(input, roster, grades), ...checks.flatMap((check) => check.errors)];
  return { valid: errors.length === 0, errors: [...new Set(errors)], checks };
}

export function buildSessionPlan(input: SessionPreviewInput, roster: PreviewStudent[], grades: Record<ClassKey, string>) {
  const parsed = sessionPreviewSchema.safeParse(input);
  const errors = parsed.success ? rosterErrors(parsed.data, roster, grades) : parsed.error.issues.map((issue) => issue.message);
  const samePhase = phaseForGrade(grades.first) === phaseForGrade(grades.second);
  const count = (Number(input.duration) - 10) / Number(input.blockMinutes);
  if (!Number.isInteger(count)) errors.push("Untuk susun otomatis, sisa durasi setelah pembuka dan penutup harus habis dibagi panjang blok.");
  if (!samePhase && count < 2) errors.push("Untuk bergantian, sediakan minimal dua blok inti.");
  if (errors.length) return { plan: null, validation: { valid: false, errors, checks: [] } satisfies PlanValidation };
  const values = parsed.success ? parsed.data : input;
  const groups = occupiedGroups(roster);
  const tasks = groups.flatMap(({ classKey, group }) => getIndependentTasks(roster.filter((student) => student.classKey === classKey && student.group === group), values.focus, grades[classKey], values.phaseTasks[values.focus][classKey]).map((task) => ({
    id: `${classKey}-${group}-${task.level}`, classKey, group, level: task.level!, memberIds: task.students.map((student) => student.id), template: task.template ? structuredClone(task.template) : null,
  })));
  const field = values.focus === "literasi" ? "literacy" : "numeracy";
  const minimum = (key: ClassKey) => Math.min(...roster.filter((student) => student.classKey === key).map((student) => Number(student[field])));
  const first: ClassKey = minimum("first") <= minimum("second") ? "first" : "second";
  const second: ClassKey = first === "first" ? "second" : "first";
  const plan: SessionPlan = { mode: samePhase ? "same-phase" : "cross-phase", tasks, blocks: [] };
  function append(start: number, end: number, kind: "opening" | "core" | "closing", teacher: ClassKey[]) {
    plan.blocks.push({ start, end, kind, teacherAssignments: [teacher], activities: groups.map(({ classKey, group }) => ({
      classKey, group, mode: teacher.includes(classKey) ? "teacher" : "independent",
      taskIds: teacher.includes(classKey) ? [] : tasks.filter((task) => task.classKey === classKey && task.group === group).map((task) => task.id),
    })) });
  }
  append(0, 5, "opening", [...CLASS_KEYS]);
  for (let index = 0; index < count; index++) {
    const offset = samePhase ? index - 1 : index;
    append(5 + index * Number(values.blockMinutes), 5 + (index + 1) * Number(values.blockMinutes), "core", samePhase && index === 0 ? [...CLASS_KEYS] : [offset % 2 === 0 ? first : second]);
  }
  append(Number(values.duration) - 5, Number(values.duration), "closing", [...CLASS_KEYS]);
  return { plan, validation: validateSessionPlan(values, roster, grades, plan) };
}

export function getStudentPacket(input: Pick<SessionPreviewInput, "lessonSubject" | "topic" | "date">, plan: SessionPlan, grades: Record<ClassKey, string>): StudentPacket {
  return {
    lessonSubject: input.lessonSubject, topic: input.topic, date: input.date,
    groups: CLASS_KEYS.flatMap((classKey) => GROUP_KEYS.flatMap((group) => {
      const tasks = plan.tasks.filter((task) => task.classKey === classKey && task.group === group && task.template);
      return tasks.length ? [{ classLabel: `Kelas ${grades[classKey]}`, groupLabel: GROUP_LABELS[group], activities: tasks.map((task, index) => ({
        number: index + 1, title: task.template!.title,
        instruction: task.template!.requiresReading ? task.template!.instruction : "",
        content: structuredClone(task.template!.content),
        ...(task.template!.photo ? { photo: { src: task.template!.photo.src, alt: task.template!.photo.alt, width: task.template!.photo.width, height: task.template!.photo.height } } : {}),
      })) }] : [];
    })),
    blocks: plan.blocks.map((block) => ({ start: block.start, end: block.end,
      note: block.note,
      teacher: block.teacherAssignments[0].map((key) => `Kelas ${grades[key]}`).join(" dan "),
      activities: block.activities.map((activity) => `Kelas ${grades[activity.classKey]}, Kelompok ${GROUP_LABELS[activity.group]}: ${activity.mode === "teacher" ? "bersama guru" : "tugas mandiri"}`),
    })),
  };
}
