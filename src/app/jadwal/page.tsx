import { PAGE_METADATA } from "@/constants/metadata";
import { JadwalView } from "@/features/jadwal/components/jadwal-view";

export const metadata = PAGE_METADATA.jadwal;

export default function JadwalPage() {
  return <JadwalView />;
}
