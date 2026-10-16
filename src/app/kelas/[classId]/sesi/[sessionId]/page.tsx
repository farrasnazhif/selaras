import { PAGE_METADATA } from "@/constants/metadata";
import { SessionDetailView } from "@/features/sesi/components/session-detail-view";

export const metadata = PAGE_METADATA.sessionDetail;

export default async function SessionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <SessionDetailView sessionId={sessionId} />;
}
