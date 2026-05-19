import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileScan, LockKeyhole, Sparkles, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { supportedReportTypes } from "@/components/landing/landing-data";

export function HeroSection() {
  return (
  <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f7fffd_0%,#edf9f7_42%,#ffffff_100%)] py-20 sm:py-24 lg:py-28">
  {/* rgb(13 59 53) soft tint glows */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(13,59,53,0.14),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(13,59,53,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(13,59,53,0.08),transparent_38%)]" />

  {/* white grid strokes */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.85)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.85)_1px,transparent_1px)] bg-[size:46px_46px] opacity-70" />

  {/* subtle green overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(13,59,53,0.04)_0%,transparent_45%,rgba(13,59,53,0.06)_100%)]" />


      <div className="container relative grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge className="mb-6 border-secondary/20 bg-white/75 px-3 py-1 text-secondary shadow-sm dark:bg-white/10">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            AI healthcare clarity for every report
          </Badge>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-6xl dark:text-white">
            Understand Your Health Reports Instantly with AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            SehatScan scans medical reports, explains abnormal values, and turns complex health
            data into simple English or Hindi insights you can discuss with your doctor.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg shadow-teal-700/15">
              <Link to={ROUTES.uploadReport}>
                <UploadCloud className="h-5 w-5" />
                Upload Report
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/70 dark:bg-white/5">
              <a href="#preview">
                Try Demo
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {supportedReportTypes.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              >
                <item.icon className="h-4 w-4 text-secondary" />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="relative"
        >
          <Card className="overflow-hidden border-white/80 bg-white/80 shadow-2xl shadow-teal-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <CardContent className="p-0">
              <div className="border-b bg-slate-950 px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-200">AI Report Workspace</p>
                    <p className="mt-1 font-semibold">Blood Report Analysis</p>
                  </div>
                  <Badge className="bg-emerald-400 text-slate-950">Secure</Badge>
                </div>
              </div>
              <div className="grid gap-4 p-5">
                <div className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-950/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-secondary/10 p-2 text-secondary">
                      <FileScan className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">blood-report-may.pdf</p>
                      <p className="text-sm text-slate-500">OCR completed in 8 seconds</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    <p className="font-semibold">AI Summary</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Hemoglobin and Vitamin D appear below the reference range. Consider discussing
                    fatigue, diet, supplementation, and follow-up testing with your clinician.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                      Abnormal value
                    </p>
                    <p className="mt-2 text-xl font-semibold">Hemoglobin 10.8</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Reference: 13.0 - 17.0</p>
                  </div>
                  <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/30">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      Private
                    </p>
                    <p className="mt-2 text-xl font-semibold">Account-only access</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Report history stays user-scoped.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
