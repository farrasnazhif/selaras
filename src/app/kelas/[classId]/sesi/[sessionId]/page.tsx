import { SessionDetailView } from "@/features/sesi/components/session-detail-view";

export const metadata = { title: "Sesi pembelajaran" };

export default async function SessionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <SessionDetailView sessionId={sessionId} />;
}
