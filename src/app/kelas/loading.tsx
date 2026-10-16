import { SelarasLoadingState } from "@/components/ui/selaras-loading-state";

export default function Loading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <SelarasLoadingState label="Memuat kelas Anda…" />
    </div>
  );
}
