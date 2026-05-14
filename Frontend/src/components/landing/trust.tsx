import { motion } from "framer-motion";
import { trustItems } from "@/components/landing/landing-data";

export function TrustSection() {
  return (
    <section className="border-y bg-white py-8 dark:bg-slate-950">
      <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="flex gap-3 rounded-lg border bg-slate-50/80 p-4 dark:bg-slate-900/60"
          >
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
