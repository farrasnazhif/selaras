"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="max-w-[496px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Card>
        <h1 className="text-[32px] leading-[1.2] font-[750] tracking-[-0.4px]">Something went wrong</h1>
        <p className="text-muted mt-2 mb-6">
          Please try again. If the problem continues, check your Supabase
          configuration.
        </p>
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
      </Card>
    </main>
  );
}
