import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/components/landing/landing-data";
import { Section } from "@/components/landing/section";

export function TestimonialsSection() {
  return (
    <Section
      eyebrow="Testimonials"
      title="Built for patients, families, and health-conscious users"
      description="SehatScan is shaped around the moment when a report arrives and the user needs calm, useful context."
      className="bg-slate-50 dark:bg-slate-900/50"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
          >
            <Card className="h-full bg-white dark:bg-slate-950">
              <CardContent className="p-6">
                <Quote className="mb-5 h-7 w-7 text-primary" />
                <p className="leading-7 text-slate-700 dark:text-slate-200">"{testimonial.quote}"</p>
                <div className="mt-6 border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
