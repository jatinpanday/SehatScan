import { LockKeyhole, ServerCog, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/landing/section";

const items = [
  { icon: LockKeyhole, title: "Secure uploads", description: "Files move through protected authenticated upload flows." },
  { icon: UserCheck, title: "Private reports", description: "Report history is scoped to the logged-in user account." },
  { icon: ServerCog, title: "Encrypted storage ready", description: "Built for secure object storage and controlled file retrieval." },
  { icon: ShieldCheck, title: "Privacy-first UX", description: "Clear disclaimers and careful access patterns for health data." },
];

export function SecuritySection() {
  return (
    <Section
      id="security"
      eyebrow="Security"
      title="Designed for private healthcare workflows"
      description="Health reports are sensitive. SehatScan’s product architecture keeps access controlled and user-specific."
      className="bg-white dark:bg-slate-950"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <Card className="h-full bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
