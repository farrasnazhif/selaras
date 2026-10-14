import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export function ClassUnavailable() {
  return <Card><h1 className="sr-only">Data tidak tersedia</h1><EmptyState title="Data tidak tersedia" description="Kelas atau sesi ini tidak ada dalam pratinjau. Data yang dibuat sementara hilang setelah halaman dimuat ulang." icon={<GraduationCap size={25} />} action={<Button variant="secondary" nativeButton={false} role="link" render={<Link href="/kelas" />}>Kembali ke kelas</Button>} /></Card>;
}
