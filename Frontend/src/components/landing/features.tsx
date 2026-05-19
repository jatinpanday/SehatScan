import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { features } from "@/components/landing/landing-data";
import { Section } from "@/components/landing/section";

export function FeaturesSection() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Everything users need to decode complex health reports"
      description="SehatScan combines report scanning, AI analysis, language support, and secure access into one calm healthcare workspace."
      className="bg-white dark:bg-slate-950"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            whileHover={{ y: -6 }}
          >
            <Card className="h-full border-slate-200/80 bg-white transition-shadow hover:shadow-xl hover:shadow-teal-900/10 dark:border-white/10 dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="mb-5 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
