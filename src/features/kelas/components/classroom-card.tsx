import Image from "next/image";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Card } from "@/components/ui/card";
import type { PreviewStudent } from "@/features/shared/types/preview";
import { getClassroomCardVariant } from "../constants/card-variants";

export function ClassroomCard({ grade, identity, members, selected = false }: { grade: string; identity: string; members: PreviewStudent[]; selected?: boolean }) {
  const variant = getClassroomCardVariant(identity);
  const Icon = variant.icon;
  return <Card className={`h-full min-h-48 overflow-hidden !p-0 ${selected ? "!border-primary" : ""}`}>
    <div className="relative h-18 overflow-hidden"><Image src={variant.banner} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" /></div>
    <div className="space-y-ui-sm p-ui-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2"><Icon size={20} className={`shrink-0 ${variant.iconColor}`} aria-hidden="true" /><h2 className="text-base font-extrabold">Kelas {grade}</h2></div>
        <span role="img" aria-label={`${members.length} siswa`} className="flex shrink-0 items-center gap-2"><span aria-hidden="true" className="[&_.ui-avatar]:!h-6 [&_.ui-avatar]:!w-6 [&_.ui-avatar]:!text-xs"><AvatarGroup people={members.slice(0, 3).map((student) => ({ name: student.name }))} max={3} /></span><span aria-hidden="true" className="text-xs font-bold">{members.length}</span></span>
      </div>
      <p className="text-xs leading-relaxed text-muted">Kelola siswa dan kegiatan belajar Kelas {grade}.</p>
    </div>
  </Card>;
}
