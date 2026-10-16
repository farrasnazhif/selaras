import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Card } from "@/components/ui/card";
import { displayDate } from "@/features/shared/constants/presentation";
import type { PreviewStudent } from "@/features/shared/types/preview";
import { getClassroomCardVariant } from "../constants/card-variants";

export function ClassroomCard({
  grade,
  identity,
  members,
  lastSessionDate,
  selected = false,
}: {
  grade: string;
  identity: string;
  members: PreviewStudent[];
  lastSessionDate?: string;
  selected?: boolean;
}) {
  const variant = getClassroomCardVariant(identity);
  const Icon = variant.icon;
  return (
    <Card
      className={`relative flex h-full min-h-48 flex-col overflow-hidden !p-0 ${selected ? "!border-primary" : ""}`}
    >
      <div className="relative h-18 w-full shrink-0 overflow-hidden rounded-t-xl">
        <Image
          src={variant.banner}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-w-0 items-center gap-2">
          <Icon
            size={24}
            strokeWidth={2.5}
            className={`shrink-0 ${variant.iconColor}`}
            aria-hidden="true"
          />
          <h3 className="text-xl font-bold">Kelas {grade}</h3>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
          <span
            role="img"
            aria-label={`${members.length} siswa`}
            className="flex shrink-0 items-center gap-2"
          >
            <span
              aria-hidden="true"
              className="[&_.ui-avatar]:!h-6 [&_.ui-avatar]:!w-6 [&_.ui-avatar]:!text-xs"
            >
              <AvatarGroup
                people={members
                  .slice(0, 3)
                  .map((student) => ({ name: student.name }))}
                max={3}
              />
            </span>
            <span aria-hidden="true" className="text-xs font-bold">
              {members.length}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} className="shrink-0" aria-hidden="true" />
            {lastSessionDate
              ? `Sesi terakhir ${displayDate(lastSessionDate)}`
              : "Belum ada sesi"}
          </span>
        </div>
      </div>
    </Card>
  );
}
