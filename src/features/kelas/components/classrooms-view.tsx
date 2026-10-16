"use client";

import Link from "next/link";
import { ArrowRight, Combine, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import {
  classPath,
  classroomTitle,
} from "@/features/shared/constants/presentation";
import { usePreview } from "@/features/shared/components/preview-provider";
import { SearchInput } from "@/components/ui/search-input";
import { canCombineGrades } from "../constants/class-pairing";
import { ClassroomCard } from "./classroom-card";

export function ClassroomsView() {
  const { classrooms, allStudents, combineClassrooms } = usePreview();
  const [query, setQuery] = useState("");
  const [combining, setCombining] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const first = classrooms.find((classroom) => classroom.id === selected[0]);
  const visible = classrooms.filter(
    (classroom) =>
      (!combining || classroom.independent) &&
      `${classroomTitle(classroom)} Kelas ${classroom.grades.first} Kelas ${classroom.grades.second}`
        .toLocaleLowerCase("id")
        .includes(query.trim().toLocaleLowerCase("id")),
  );
  function reset() {
    setCombining(false);
    setSelected([]);
    setError("");
  }
  function toggle(id: string) {
    setError("");
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 2
          ? [...current, id]
          : current,
    );
  }
  function combine() {
    const result = combineClassrooms(selected);
    if (!result.id) {
      setError(result.error ?? "Kelas belum dapat digabung.");
      return;
    }
    reset();
    setQuery("");
    setMessage(
      "Kelas berhasil digabung. Buka pasangan kelas untuk menyusun sesi.",
    );
  }
  return (
    <div className="space-y-ui-md pb-28">
      <header className="flex flex-wrap items-center justify-between gap-ui-sm border-b border-line pb-ui-md">
        <div>
          <h1 className="text-2xl font-bold md:text-[28px]">Ruang Kelas</h1>
          <p className="mt-1 text-sm text-muted">
            Kelola kelas dan gabungkan dua kelas untuk belajar bersama.
          </p>
        </div>
        <SearchInput
          label="Cari kelas"
          placeholder="Cari kelas"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
          clearLabel="Hapus pencarian kelas"
          className="w-full sm:w-64"
        />
      </header>
      {combining && (
        <Notice tone="info">
          Pilih dua kelas mandiri. Pasangan yang tersedia: Kelas 1 dengan 2, 3
          dengan 4, atau 5 dengan 6. Setelah itu, tekan panah untuk
          menggabungkan.
        </Notice>
      )}
      {error && <Notice>{error}</Notice>}
      {message && !combining && <Notice tone="success">{message}</Notice>}
      <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((classroom) => {
          const members = allStudents.filter(
            (student) => student.classroomId === classroom.id,
          );
          if (!classroom.independent)
            return (
              <Link
                key={classroom.id}
                href={classPath(classroom.id)}
                aria-label={`Buka ${classroomTitle(classroom)}`}
                className="flex flex-col items-stretch gap-ui-sm rounded-window bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:col-span-2 sm:flex-row"
              >
                <div className="min-w-0 flex-1">
                  <ClassroomCard
                    identity={
                      classroom.sourceIds?.first ?? `${classroom.id}-first`
                    }
                    grade={classroom.grades.first}
                    members={members.filter(
                      (student) => student.classKey === "first",
                    )}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full bg-white text-ink"
                >
                  <Plus size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <ClassroomCard
                    identity={
                      classroom.sourceIds?.second ?? `${classroom.id}-second`
                    }
                    grade={classroom.grades.second}
                    members={members.filter(
                      (student) => student.classKey === "second",
                    )}
                  />
                </div>
              </Link>
            );
          const active = selected.includes(classroom.id);
          const disabled =
            !active &&
            (selected.length >= 2 ||
              (!!first &&
                !canCombineGrades(first.grades.first, classroom.grades.first)));
          const card = (
            <ClassroomCard
              identity={classroom.id}
              grade={classroom.grades.first}
              members={members}
              selected={active}
            />
          );
          return combining ? (
            <button
              key={classroom.id}
              type="button"
              aria-pressed={active}
              aria-label={`${active ? "Batalkan pilihan" : "Pilih"} Kelas ${classroom.grades.first}, ${members.length} siswa`}
              disabled={disabled}
              onClick={() => toggle(classroom.id)}
              className="rounded-card text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {card}
            </button>
          ) : (
            <Link
              key={classroom.id}
              href={classPath(classroom.id)}
              className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {card}
            </Link>
          );
        })}
      </div>
      {!visible.length && (
        <p role="status" className="py-8 text-sm text-muted">
          {combining
            ? "Tidak ada kelas mandiri yang sesuai. Batalkan pilihan untuk kembali ke semua kelas."
            : "Tidak ada kelas yang sesuai."}
        </p>
      )}
      <div
        className="fixed bottom-ui-md right-ui-md z-30 flex items-center gap-ui-sm"
        role="group"
        aria-label="Gabungkan kelas"
      >
        {combining && (
          <>
            <Button variant="secondary" onClick={reset}>
              Batal
            </Button>
            <span
              aria-live="polite"
              aria-label={`${selected.length} dari 2 kelas dipilih`}
              className="rounded-control border border-line bg-white px-ui-sm py-2 text-sm font-bold"
            >
              {selected.length}/2
            </span>
          </>
        )}
        <Button
          variant="primary"
          className="!h-16 !w-16 !rounded-full !p-0"
          aria-label={
            combining
              ? "Gabungkan dua kelas terpilih"
              : "Pilih kelas untuk digabung"
          }
          disabled={combining && selected.length !== 2}
          onClick={
            combining
              ? combine
              : () => {
                  setCombining(true);
                  setSelected([]);
                  setError("");
                  setMessage("");
                  setQuery("");
                }
          }
        >
          {combining ? (
            <ArrowRight size={28} aria-hidden="true" />
          ) : (
            <Combine size={28} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
