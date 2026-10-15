import { Atom, Germ, Sigma, VectorPolygon } from "lucide-react";

export const classroomCardVariants = [
  {
    banner: "/images/kelas/banner-1.png",
    icon: Atom,
    iconColor: "text-purple-500",
  },
  {
    banner: "/images/kelas/banner-2.png",
    icon: Germ,
    iconColor: "text-pink-500",
  },
  {
    banner: "/images/kelas/banner-3.png",
    icon: Sigma,
    iconColor: "text-blue-500",
  },
  {
    banner: "/images/kelas/banner-4.png",
    icon: VectorPolygon,
    iconColor: "text-green-500",
  },
];

export function getClassroomCardVariant(classroomId: string) {
  const id = String(classroomId);

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }

  const index = (hash >>> 0) % classroomCardVariants.length;

  return classroomCardVariants[index];
}
