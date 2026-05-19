import { motion } from "framer-motion";
import { faqs } from "@/components/landing/landing-data";
import { Section } from "@/components/landing/section";

export function FAQSection() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Questions users usually ask before uploading a report"
      description="Clear expectations matter when AI meets healthcare."
      className="bg-white dark:bg-slate-950"
    >
      <div className="mx-auto max-w-3xl divide-y rounded-lg border bg-white dark:bg-slate-900">
        {faqs.map((faq, index) => (
          <motion.details
            key={faq.question}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="group p-5 open:bg-slate-50 dark:open:bg-slate-950"
          >
            <summary className="cursor-pointer list-none text-base font-semibold">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-xl text-primary group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
          </motion.details>
        ))}
      </div>
    </Section>
  );
}
