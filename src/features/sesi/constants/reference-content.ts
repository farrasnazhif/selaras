import type { ClassKey } from "@/features/shared/types/preview";

export const EXAMPLE_SESSION_ID = "literasi-2026-10-14";
export type RotationBlock = {
  start: number;
  end: number;
  shared?: { title: string; description: string };
  teacher?: ClassKey;
};

// shortcut: fixed preview timing, replace when production duration and allocation rules are accepted.
export const SESSION_ROTATION: RotationBlock[] = [
  { start: 0, end: 5, shared: { title: "Pembukaan bersama", description: "Sampaikan tujuan belajar dan jelaskan tugas untuk kedua kelas." } },
  { start: 5, end: 20, teacher: "first" },
  { start: 20, end: 35, teacher: "second" },
  { start: 35, end: 50, teacher: "first" },
  { start: 50, end: 65, teacher: "second" },
  { start: 65, end: 70, shared: { title: "Penutup bersama", description: "Tinjau hasil belajar kedua kelas dan kumpulkan tugas." } },
];
