import type { Metadata } from "next";
import Link from "next/link";

import { ChatAssessment } from "@/components/assessment/chat-assessment";

export const metadata: Metadata = {
  title: "Portfolio Assessment — NINJA Advisory",
};

export default function AssessmentPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className="font-serif text-lg font-semibold tracking-tight"
          >
            NINJA Advisory
          </Link>
          <span className="text-sm text-muted-foreground">
            Client Suitability Assessment
          </span>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <ChatAssessment />
      </main>
    </div>
  );
}
