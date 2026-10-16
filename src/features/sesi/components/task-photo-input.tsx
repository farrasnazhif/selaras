"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { MAX_TASK_PHOTO_BYTES, MAX_TASK_PHOTO_PIXELS, TASK_PHOTO_ACCEPT } from "@/features/sesi/constants/task-photos";
import type { TaskPhotoAttachment } from "@/features/sesi/types/schedule";
import { TaskPhoto } from "./task-photo";

export function TaskPhotoInput({ value, onChange, lowLevel, onBusyChange, error }: {
  value?: TaskPhotoAttachment; onChange: (value?: TaskPhotoAttachment) => void; lowLevel: boolean; onBusyChange: (busy: boolean) => void; error?: string;
}) {
  const id = useId();
  const reader = useRef<FileReader | null>(null);
  const [busy, setBusy] = useState(false);
  const [readError, setReadError] = useState("");
  useEffect(() => () => { const current = reader.current; reader.current = null; if (current?.readyState === FileReader.LOADING) current.abort(); }, []);
  function receive(files: File[]) {
    const file = files[0];
    if (!file) return;
    const current = new FileReader();
    reader.current?.abort();
    reader.current = current;
    setBusy(true); onBusyChange(true); setReadError("");
    function finish(message?: string) {
      if (reader.current !== current) return;
      reader.current = null;
      setBusy(false); onBusyChange(false);
      if (message) setReadError(message);
    }
    current.onerror = () => finish("Foto tidak dapat dibaca. Coba pilih file lain.");
    current.onload = () => {
      if (reader.current !== current) return;
      if (typeof current.result !== "string") { finish("Foto tidak dapat dibaca. Coba pilih file lain."); return; }
      const src = current.result;
      const image = new window.Image();
      image.onerror = () => finish("Foto tidak dapat dibuka. Gunakan JPG, PNG, atau WebP yang valid.");
      image.onload = () => {
        if (reader.current !== current) return;
        if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth > 10000 || image.naturalHeight > 10000 || image.naturalWidth * image.naturalHeight > MAX_TASK_PHOTO_PIXELS) { finish("Dimensi foto terlalu besar. Pilih foto yang lebih kecil."); return; }
        onChange({ src, alt: "Foto kegiatan", width: image.naturalWidth, height: image.naturalHeight, nonReadingConfirmed: false });
        finish();
      };
      image.src = src;
    };
    try { current.readAsDataURL(file); } catch { finish("Foto tidak dapat dibaca. Coba pilih file lain."); }
  }
  return <section className="space-y-ui-sm" aria-label="Foto kegiatan opsional">
    <h3 className="text-sm font-bold">Foto kegiatan (opsional)</h3>
    <Dropzone locale="id" label={value ? "Pilih foto pengganti" : "Tambahkan foto lembar tugas atau kegiatan"} accept={TASK_PHOTO_ACCEPT} maxFiles={1} maxSize={MAX_TASK_PHOTO_BYTES} disabled={busy} onFilesAccepted={receive} />
    <p className="text-xs text-muted">Foto hanya disimpan di sesi browser ini. Periksa agar foto tidak menampilkan nama siswa atau label level.</p>
    {busy && <p role="status" className="text-sm text-muted">Membaca foto…</p>}
    {(readError || error) && <div id={`${id}-error`}><Notice>{readError || error}</Notice></div>}
    {value && <>
      <TaskPhoto photo={value} />
      <div className="field"><label htmlFor={`${id}-alt`}>Keterangan foto</label><Input id={`${id}-alt`} maxLength={160} aria-invalid={!!error && !value.alt.trim()} aria-describedby={error ? `${id}-error` : undefined} value={value.alt} onChange={(event) => onChange({ ...value, alt: event.target.value })} /></div>
      {lowLevel && <label htmlFor={`${id}-non-reading`} className="flex min-h-11 items-start gap-2 text-sm"><Checkbox id={`${id}-non-reading`} aria-invalid={!!error && !value.nonReadingConfirmed} aria-describedby={error ? `${id}-error` : undefined} checked={value.nonReadingConfirmed} onCheckedChange={(checked) => onChange({ ...value, nonReadingConfirmed: checked })} /><span>Foto hanya berisi kegiatan gambar atau benda yang tidak mengharuskan siswa membaca.</span></label>}
      <Button type="button" size="xs" variant="danger" disabled={busy} onClick={() => { onChange(undefined); setReadError(""); }}><Trash2 size={14} aria-hidden="true" />Hapus foto</Button>
    </>}
  </section>;
}
