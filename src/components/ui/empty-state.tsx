import type { ReactNode } from "react";
import { FolderOpen } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon = <FolderOpen size={24} />,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="ui-empty-state">
      <span className="state-icon">{icon}</span>
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      <p className="mt-2 max-w-xs text-xs text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
