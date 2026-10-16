import type { ReactNode } from "react";
import { requireTeacher } from "@/features/auth/api/require-teacher";
import { AuthProvider } from "@/providers/auth-provider";
import { PreviewProvider } from "./preview-provider";
import { PreviewShell } from "./preview-shell";

export async function TeacherLayout({ children }: { children: ReactNode }) {
  const user = await requireTeacher();
  return (
    <AuthProvider initialUser={user}>
      <PreviewShell>
        <PreviewProvider key={user.id}>{children}</PreviewProvider>
      </PreviewShell>
    </AuthProvider>
  );
}
