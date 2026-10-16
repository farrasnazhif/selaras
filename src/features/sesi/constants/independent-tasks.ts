import { GRADE_OPTIONS, phaseForGrade } from "../../kelas/constants/preview.ts";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "../../kelas/constants/reference-content.ts";
import type { PreviewStudent, Subject } from "@/features/shared/types/preview";

const PRACTICE = {
  literasi: {
    "3": "Membaca kata sederhana",
    "4": "Membaca paragraf pendek",
    "5": "Membaca cerita pendek dengan lancar",
  },
  numerasi: {
    "3": "Mengenal angka 11-99",
    "4": "Pengurangan dua angka dengan meminjam",
    "5": "Pembagian bilangan tiga angka dengan satu angka",
  },
};

type TaskGuidance = {
  level: string | null;
  students: PreviewStudent[];
  mode: "non-reading" | "practice" | "phase" | "unassessed";
  title: string;
  instruction: string;
};

// shortcut: guidance only, replace with reviewed worksheets and phase tasks when the content bank is approved.
export function getIndependentTasks(members: PreviewStudent[], subject: Subject, grade: string) {
  const levels = subject === "literasi" ? LITERACY_LEVELS : NUMERACY_LEVELS;
  const field = subject === "literasi" ? "literacy" : "numeracy";
  const phase = GRADE_OPTIONS.some((option) => option.value === grade) ? phaseForGrade(grade) : null;
  return [...levels.map((level) => level.value), null].flatMap<TaskGuidance>((level) => {
    const students = members.filter((student) => {
      const value = levels.some((option) => option.value === student[field]) ? student[field] : null;
      return value === level;
    });
    if (!students.length) return [];
    if (level === "1" || level === "2") return [{
      level, students, mode: "non-reading",
      title: subject === "literasi" ? "Mencocokkan gambar" : "Berhitung dengan benda konkret",
      instruction: "Gunakan gambar atau benda konkret. Tugas tidak boleh mengharuskan siswa membaca kata, soal, atau petunjuk tertulis.",
    }];
    if (level === "3" || level === "4" || level === "5") return [{
      level, students, mode: "practice",
      title: PRACTICE[subject][level],
      instruction: "Berikan latihan sesuai kemampuan ini. Latihan boleh tertulis.",
    }];
    if (level === "6") return [{
      level, students, mode: "phase",
      title: phase ? `Tugas fase ${phase}` : "Tugas sesuai fase kelas",
      instruction: phase ? `Pilih tugas ${subject} berdasarkan capaian fase ${phase} untuk kelas ${grade}. Tugas fase belum dipilih.` : "Fase kelas belum tersedia. Tetapkan kelas sebelum memilih tugas fase.",
    }];
    return [{ level, students, mode: "unassessed", title: "Belum dinilai", instruction: "Tetapkan level siswa sebelum memilih tugas mandiri." }];
  });
}
