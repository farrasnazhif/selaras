"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleCheck,
  Eye,
  Info,
  Layers3,
  RefreshCw,
  Save,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { classPath, classroomTitle } from "../constants/presentation";
import {
  sessionPreviewSchema,
  type SessionPreviewInput,
} from "../validations/session";
import { usePreview } from "./preview-provider";
import { ClassUnavailable } from "./class-unavailable";
import { RotationGrid } from "./rotation-grid";
import { SessionTaskSummary } from "./session-task-summary";

const defaults: SessionPreviewInput = {
  subject: "literasi",
  duration: "70",
  blockMinutes: "15",
  date: "2026-10-14",
};

export function SessionBuilderView() {
  const { classroom, students, saveSession } = usePreview();
  const router = useRouter();
  const [preview, setPreview] = useState(defaults);
  const [printing, setPrinting] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionPreviewInput>({
    resolver: zodResolver(sessionPreviewSchema),
    defaultValues: defaults,
  });
  const values = useWatch({ control });
  const changed = Object.keys(defaults).some(
    (key) =>
      values[key as keyof SessionPreviewInput] !==
      preview[key as keyof SessionPreviewInput],
  );
  if (!classroom) return <ClassUnavailable />;
  const available =
    preview.subject === "literasi" &&
    classroom.grades.first === "2" &&
    classroom.grades.second === "3" &&
    students.length > 0;
  const path = classPath(classroom.id);
  function save() {
    setSaving(true);
    const id = saveSession(preview);
    router.push(`${path}/sesi/${id}`);
  }
  return (
    <div className="space-y-5">
      <div className="print-hidden">
        <Breadcrumbs
          items={[
            { label: "Kelas", href: "/kelas" },
            { label: classroomTitle(classroom), href: path },
            { label: "Sesi", href: `${path}/sesi` },
            { label: "Susun Sesi Baru" },
          ]}
        />
      </div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[28px] font-bold">Susun Sesi Pembelajaran</h1>
        </div>
        <span className="text-xs text-muted">
          Model rotasi terpandu · dua jalur
        </span>
      </header>
      <Card className="print-hidden p-5">
        <form
          onSubmit={handleSubmit((input) => {
            setPreview(input);
            setPrinting(false);
          })}
          noValidate
          className="grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-5"
        >
          {[
            {
              name: "subject" as const,
              label: "Mata pelajaran",
              options: [
                { value: "literasi", label: "Literasi" },
                { value: "numerasi", label: "Numerasi" },
              ],
            },
            {
              name: "duration" as const,
              label: "Durasi",
              options: [{ value: "70", label: "70 menit" }],
            },
            {
              name: "blockMinutes" as const,
              label: "Panjang blok",
              options: [{ value: "15", label: "15 menit" }],
            },
          ].map(({ name, label, options }) => (
            <div key={name} className="field">
              <label htmlFor={`session-${name}`}>{label}</label>
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <Select
                    options={options}
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                    triggerProps={{
                      id: `session-${name}`,
                      ref: field.ref,
                      onBlur: field.onBlur,
                    }}
                  />
                )}
              />
            </div>
          ))}
          <div className="field">
            <label htmlFor="session-date">Tanggal</label>
            <Input
              id="session-date"
              type="date"
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "session-date-error" : undefined}
              {...register("date")}
            />
            {errors.date && (
              <p id="session-date-error" className="field-error">
                {errors.date.message}
              </p>
            )}
          </div>
          <Button type="submit" variant="secondary" className="mb-1">
            <RefreshCw size={16} aria-hidden="true" />
            Susun jadwal
          </Button>
        </form>
      </Card>
      {changed && (
        <p role="status" className="text-sm text-muted">
          Pengaturan berubah. Klik Susun jadwal untuk memperbarui pratinjau.
        </p>
      )}
      {available ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-green-tint px-4 py-3 text-xs text-green">
            <span className="flex items-center gap-2">
              <CircleCheck size={16} aria-hidden="true" />
              Contoh rotasi silang: satu giliran bimbingan guru pada tiap blok.
            </span>
            <span className="font-semibold">Template contoh</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>Petunjuk kelompok mandiri:</span>
            <span>Biru · Hijau · Oranye</span>
            <span className="ml-auto">
              {preview.duration} menit · blok {preview.blockMinutes} menit
            </span>
          </div>
          <RotationGrid builder={!printing} />
          {printing && <SessionTaskSummary />}
          <div className="print-hidden grid gap-4 xl:grid-cols-3">
            {[
              {
                title: "V1 · Rotasi bersilang",
                text: "Pada contoh ini, guru membimbing satu kelas saat kelas pendamping mengerjakan kegiatan mandiri.",
                icon: Users,
              },
              {
                title: "V2 · Durasi proporsional",
                text: "Dalam contoh 70 menit ini, tiap kelas mendapat 30 menit bimbingan, dengan pembuka dan penutup bersama.",
                icon: CircleCheck,
              },
              {
                title: "Diferensiasi jalur",
                text: "Kelompok Biru, Hijau, dan Oranye memiliki tugas contoh yang dapat ditinjau guru sebelum digunakan.",
                icon: Layers3,
              },
            ].map(({ title, text, icon: Icon }) => (
              <Card key={title} className="p-4">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <Icon size={17} className="text-green" aria-hidden="true" />
                  {title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {text}
                </p>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <EmptyState
            title="Template belum tersedia"
            description="Referensi menyediakan contoh Literasi untuk Kelas 2–3. Kegiatan Numerasi dan pasangan lain tetap menunggu konten; tambahkan siswa bila rombel masih kosong."
          />
        </Card>
      )}
      <div className="print-hidden flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="flex max-w-xl items-start gap-2 text-xs leading-relaxed text-muted">
          <Info size={15} className="shrink-0" aria-hidden="true" />
          Sesi hanya disimpan sementara di pratinjau. Konten contoh dapat
          ditinjau guru sebelum digunakan.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={!available || changed}
            onClick={() => setPrinting((current) => !current)}
          >
            <Eye size={16} aria-hidden="true" />
            {printing ? "Kembali ke editor" : "Pratinjau cetak"}
          </Button>
          {printing && (
            <Button variant="secondary" onClick={() => window.print()}>
              Cetak / Simpan PDF
            </Button>
          )}
          <Button
            variant="primary"
            loading={saving}
            disabled={!available || changed || saving}
            onClick={save}
          >
            <Save size={16} aria-hidden="true" />
            Simpan sesi
          </Button>
        </div>
      </div>
      <Link
        href={`${path}/sesi`}
        className="print-hidden inline-block text-sm text-accent-ink underline underline-offset-4"
      >
        Kembali ke daftar sesi
      </Link>
    </div>
  );
}
