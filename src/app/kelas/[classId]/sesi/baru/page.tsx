import { PAGE_METADATA } from "@/constants/metadata";
import { SessionBuilderView } from "@/features/sesi/components/session-builder-view";

export const metadata = PAGE_METADATA.sessionCreate;

export default function NewSessionPage() {
  return <SessionBuilderView />;
}
