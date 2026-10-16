import { SessionBuilderView } from "@/features/sesi/components/session-builder-view";

export const metadata = { title: "Ubah sesi pembelajaran" };

export default async function EditSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <SessionBuilderView key={sessionId} sessionId={sessionId} />;
}
