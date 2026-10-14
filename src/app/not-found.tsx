import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
export default function NotFound() {
  return (
    <main id="main-content" className="max-w-[496px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Card>
        <h1 className="text-[32px] leading-[1.2] font-[750] tracking-[-0.4px]">Page not found</h1>
        <Button
          variant="secondary"
          className="mt-6"
          nativeButton={false}
          role="link"
          render={<Link href="/" />}
        >
          Back home
        </Button>
      </Card>
    </main>
  );
}
