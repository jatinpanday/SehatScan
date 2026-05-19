import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function FinalCTASection() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(20,184,166,0.22),rgba(14,165,233,0.12),rgba(15,23,42,0.95))] p-8 sm:p-12"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">Start today</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Start Understanding Your Health Better
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Upload a report, get a clear AI summary, and walk into your next appointment with
              better questions.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={ROUTES.uploadReport}>
                  <UploadCloud className="h-5 w-5" />
                  Upload Report
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                <Link to={ROUTES.signup}>
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
