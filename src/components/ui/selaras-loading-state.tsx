import { LoaderCircle } from "lucide-react";

export function SelarasLoadingState({
  label = "Memuat Selaras…",
}: {
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      lang="id"
      className="inline-flex text-primary"
    >
      <LoaderCircle size={32} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
    </span>
  );
}
