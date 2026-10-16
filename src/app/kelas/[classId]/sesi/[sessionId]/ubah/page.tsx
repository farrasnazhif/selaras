import { PAGE_METADATA } from "@/constants/metadata";
import { SessionBuilderView } from "@/features/sesi/components/session-builder-view";

export const metadata = PAGE_METADATA.sessionEdit;

export default async function EditSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <SessionBuilderView key={sessionId} sessionId={sessionId} />;
}
