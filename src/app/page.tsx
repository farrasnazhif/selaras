import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="landing-page min-h-dvh flex items-center justify-center p-6"
    >
      <div className="flex gap-2">
        <Button
          variant="primary"
          nativeButton={false}
          role="link"
          render={<Link href="/sandbox" />}
        >
          Open sandbox
        </Button>
        <Button
          variant="secondary"
          nativeButton={false}
          role="link"
          render={<Link href="/kelas" />}
        >
          Open Selaras
        </Button>
      </div>
    </main>
  );
}
