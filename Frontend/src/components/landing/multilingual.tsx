import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/landing/section";

export function MultilingualSection() {
  return (
    <Section
      eyebrow="Multilingual"
      title="Simple explanations in English and Hindi"
      description="SehatScan makes healthcare information easier for users and families who prefer plain, bilingual explanations."
      className="bg-slate-50 dark:bg-slate-900/50"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">
            <Languages className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold">Healthcare clarity should not depend on jargon.</h3>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            Users can switch languages and read summaries, precautions, abnormal values, and
            doctor questions in a more familiar format.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Card className="bg-white dark:bg-slate-950">
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold text-primary">English</p>
              <p className="text-lg font-semibold">Your hemoglobin is below the reference range.</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Ask your doctor whether diet, iron levels, or follow-up tests should be reviewed.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-950">
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold text-primary">हिन्दी</p>
              <p className="text-lg font-semibold">आपका हीमोग्लोबिन सामान्य सीमा से कम है।</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                डॉक्टर से आहार, आयरन स्तर या आगे की जांच के बारे में पूछें।
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
