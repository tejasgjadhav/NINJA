import { Progress } from "@/components/ui/progress";

interface AssessmentProgressProps {
  /** number of questions answered so far (0–total) */
  stepIndex: number;
  total: number;
  /** current question title, or a completion label */
  title: string;
}

export function AssessmentProgress({
  stepIndex,
  total,
  title,
}: AssessmentProgressProps) {
  const current = Math.min(stepIndex + 1, total);
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Question {current} of {total}
        </span>
        <span className="truncate text-xs text-muted-foreground">{title}</span>
      </div>
      <Progress value={(stepIndex / total) * 100} />
    </div>
  );
}
