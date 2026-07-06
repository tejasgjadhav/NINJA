"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format";

interface ReviewLetterProps {
  letter: { subject: string; paragraphs: string[] };
  /** ISO date the assessment was completed (drives the letter date) */
  dateIso: string;
}

const SIGN_OFF = ["Yours sincerely,", "Portfolio Advisory Desk", "NINJA Advisory"];

export function ReviewLetter({ letter, dateIso }: ReviewLetterProps) {
  const [copied, setCopied] = useState(false);

  const copyLetter = async () => {
    const text = [
      `NINJA Advisory · ${formatDate(dateIso)}`,
      "",
      `Subject: ${letter.subject}`,
      "",
      ...letter.paragraphs.flatMap((p) => [p, ""]),
      ...SIGN_OFF,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (permissions / insecure context) — ignore
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl [--card-spacing:--spacing(8)]">
      <CardContent className="flex flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-xl font-semibold">
              NINJA Advisory
            </span>
            <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Institutional Wealth Management
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {formatDate(dateIso)}
            </span>
            <Button variant="ghost" size="sm" onClick={copyLetter}>
              {copied ? (
                <Check data-icon="inline-start" className="size-3.5" />
              ) : (
                <Copy data-icon="inline-start" className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy letter"}
            </Button>
          </div>
        </header>

        <Separator />

        <p className="text-sm font-semibold">Subject: {letter.subject}</p>

        <div className="flex flex-col gap-4">
          {letter.paragraphs.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1 pt-2 text-sm">
          <span>Yours sincerely,</span>
          <span className="mt-4 font-medium">Portfolio Advisory Desk</span>
          <span className="text-muted-foreground">NINJA Advisory</span>
        </div>
      </CardContent>
    </Card>
  );
}
