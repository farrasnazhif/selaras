"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode, ReactElement } from "react";

export function Dialog({
  title,
  description,
  open,
  onOpenChange,
  children,
  trigger,
  busy = false,
}: {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  trigger?: ReactElement;
  busy?: boolean;
}) {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!busy) onOpenChange(next);
      }}
    >
      {trigger && <BaseDialog.Trigger render={trigger} />}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="dialog-backdrop" />
        <BaseDialog.Popup className="dialog-popup">
          <BaseDialog.Title className="text-2xl leading-[1.25] font-[750] pr-8">
            {title}
          </BaseDialog.Title>
          <BaseDialog.Description className="mt-2 text-sm text-muted">
            {description}
          </BaseDialog.Description>
          <BaseDialog.Close
            className="dialog-close"
            aria-label="Close dialog"
            disabled={busy}
          >
            <X size={18} />
          </BaseDialog.Close>
          <div className="mt-6">{children}</div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
