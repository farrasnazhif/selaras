import Image from "next/image";
import type { StudentTaskPhoto } from "@/features/sesi/types/schedule";

export function TaskPhoto({ photo }: { photo: StudentTaskPhoto }) {
  return <figure className="task-photo space-y-2">
    <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="eager" unoptimized className="mx-auto h-auto max-h-[480px] w-full rounded-control object-contain" />
    <figcaption className="break-words text-xs text-muted">{photo.alt}</figcaption>
  </figure>;
}
