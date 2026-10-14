"use client";

import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import type { ReactElement, ReactNode } from "react";
import { Button } from "./button";
import { Notice } from "./notice";

export function AlertDialog({ open, onOpenChange, title, description, children, trigger, error, busy = false }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; children: ReactNode; trigger?: ReactElement; error?: string; busy?: boolean;
}) {
  return <BaseAlertDialog.Root open={open} onOpenChange={(next) => { if (!busy) onOpenChange(next); }}>
    {trigger && <BaseAlertDialog.Trigger render={trigger} />}
    <BaseAlertDialog.Portal><BaseAlertDialog.Backdrop className="dialog-backdrop" />
      <BaseAlertDialog.Popup className="dialog-popup">
        <BaseAlertDialog.Title className="text-2xl leading-[1.25] font-[750]">{title}</BaseAlertDialog.Title>
        <BaseAlertDialog.Description className="mt-2 text-sm text-muted">{description}</BaseAlertDialog.Description>
        {error && <div className="mt-4"><Notice>{error}</Notice></div>}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <BaseAlertDialog.Close disabled={busy} render={<Button variant="secondary" />}>Cancel</BaseAlertDialog.Close>{children}
        </div>
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  </BaseAlertDialog.Root>;
}
