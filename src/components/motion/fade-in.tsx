"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  /** seconds */
  delay?: number;
  /** rise distance in px */
  y?: number;
  className?: string;
  /** animate on scroll into view (default) vs on mount */
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
  once = true,
}: FadeInProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
