import type { ReactNode } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";

const calloutIcons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
};

export function Callout({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: keyof typeof calloutIcons;
}) {
  const Icon = calloutIcons[tone];
  return (
    <div
      className={`callout callout-${tone}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
