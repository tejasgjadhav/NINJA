"use client";

import { useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { QUESTIONS } from "@/data/questions";
import type { ChatMessage as ChatMessageData } from "@/types/assessment";
import type { AssessmentAnswers } from "@/types/domain";
import { saveAnswers } from "@/lib/storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AmountInput } from "./amount-input";
import { AssessmentProgress } from "./assessment-progress";
import { ChatMessage } from "./chat-message";
import { OptionChips } from "./option-chips";
import { TypingIndicator } from "./typing-indicator";

const TYPING_MS = 700;
const REDIRECT_MS = 1400;

const CLOSING_TEXT =
  "Thank you. Your Investment Policy Statement and model portfolio are being prepared.";

type PartialAnswers = Partial<
  Pick<
    AssessmentAnswers,
    | "investorType"
    | "objective"
    | "horizon"
    | "riskTolerance"
    | "amountCr"
    | "constraints"
  >
>;

interface State {
  stepIndex: number;
  messages: ChatMessageData[];
  answers: PartialAnswers;
  phase: "typing" | "awaiting_input" | "done";
}

type Action =
  | { type: "ADVISOR_MESSAGE"; text: string }
  | { type: "ANSWER"; label: string; value: string | number | string[] }
  | { type: "CLOSING" };

const initialState: State = {
  stepIndex: 0,
  messages: [],
  answers: {},
  phase: "typing",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADVISOR_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: `m${state.messages.length}`, from: "advisor", text: action.text },
        ],
        phase: "awaiting_input",
      };
    case "ANSWER": {
      const question = QUESTIONS[state.stepIndex];
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: `m${state.messages.length}`, from: "client", text: action.label },
        ],
        answers: {
          ...state.answers,
          [question.id]: action.value,
        } as PartialAnswers,
        stepIndex: state.stepIndex + 1,
        phase: "typing",
      };
    }
    case "CLOSING":
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: `m${state.messages.length}`, from: "advisor", text: CLOSING_TEXT },
        ],
        phase: "done",
      };
  }
}

export function ChatAssessment() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const bottomRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const currentQuestion =
    state.stepIndex < QUESTIONS.length ? QUESTIONS[state.stepIndex] : null;

  // Typing pause before each advisor message. The cleanup clears the pending
  // timer, which also prevents double-firing under React strict mode.
  useEffect(() => {
    if (state.phase !== "typing") return;
    const timer = setTimeout(() => {
      if (state.stepIndex < QUESTIONS.length) {
        dispatch({
          type: "ADVISOR_MESSAGE",
          text: QUESTIONS[state.stepIndex].advisorText,
        });
      } else {
        dispatch({ type: "CLOSING" });
      }
    }, TYPING_MS);
    return () => clearTimeout(timer);
  }, [state.phase, state.stepIndex]);

  // Persist answers and hand over to the dashboard after the closing message.
  useEffect(() => {
    if (state.phase !== "done") return;
    const timer = setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      saveAnswers({
        // all six answers are present once phase reaches 'done'
        ...(state.answers as Required<PartialAnswers>),
        completedAt: new Date().toISOString(),
        version: 1,
      });
      router.push("/dashboard");
    }, REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [state.phase, state.answers, router]);

  // Keep the latest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.messages.length, state.phase]);

  function handleChipAnswer(values: string[], labels: string[]) {
    const question = QUESTIONS[state.stepIndex];
    if (question.kind === "multi") {
      dispatch({ type: "ANSWER", value: values, label: labels.join(" · ") });
    } else {
      dispatch({ type: "ANSWER", value: values[0], label: labels[0] });
    }
  }

  function handleAmount(amountCr: number, label: string) {
    dispatch({ type: "ANSWER", value: amountCr, label });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 sm:py-8">
      <AssessmentProgress
        stepIndex={state.stepIndex}
        total={QUESTIONS.length}
        title={currentQuestion?.title ?? "Assessment complete"}
      />

      <div className="rounded-xl border bg-card shadow-sm">
        <ScrollArea className="h-[420px] sm:h-[480px]">
          <div className="flex flex-col gap-3 p-4">
            {state.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {state.phase === "typing" && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="min-h-24">
        {state.phase === "awaiting_input" && currentQuestion && (
          currentQuestion.kind === "amount" ? (
            <AmountInput
              key={currentQuestion.id}
              question={currentQuestion}
              onSubmit={handleAmount}
            />
          ) : (
            <OptionChips
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleChipAnswer}
            />
          )
        )}
        {state.phase === "done" && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Preparing your Investment Policy Statement and model portfolio…
          </div>
        )}
      </div>
    </div>
  );
}
