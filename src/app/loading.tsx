import { SelarasLoadingState } from "@/components/ui/selaras-loading-state";

export default function Loading() {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <SelarasLoadingState />
    </div>
  );
}
