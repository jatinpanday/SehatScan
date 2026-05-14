import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, description, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-24", className)}>
      <div className="container">
        {title ? (
          <motion.div
            className="mx-auto mb-12 max-w-3xl text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55 }}
          >
            {eyebrow ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
            ) : null}
          </motion.div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
