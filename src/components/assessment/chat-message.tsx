"use client";

import { motion } from "framer-motion";

import type { ChatMessage as ChatMessageData } from "@/types/assessment";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isAdvisor = message.from === "advisor";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.21, 0.65, 0.36, 1] }}
      className={cn("flex", isAdvisor ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed",
          isAdvisor
            ? "border border-border/60 bg-muted text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isAdvisor && (
          <p className="mb-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            NINJA Advisory
          </p>
        )}
        <p>{message.text}</p>
      </div>
    </motion.div>
  );
}
