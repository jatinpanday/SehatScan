import { motion } from "framer-motion";
import { howItWorks } from "@/components/landing/landing-data";
import { Section } from "@/components/landing/section";

export function HowItWorksSection() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="From upload to insight in three focused steps"
      description="The product flow is designed for people who want clarity before a doctor conversation, not another dense medical document."
      className="bg-slate-50 dark:bg-slate-900/50"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {howItWorks.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="relative rounded-lg border bg-white p-6 shadow-soft dark:bg-slate-950"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="text-5xl font-semibold text-slate-100 dark:text-slate-800">0{index + 1}</span>
            </div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
