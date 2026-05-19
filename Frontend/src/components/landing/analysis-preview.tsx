import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportRows } from "@/components/landing/landing-data";
import { Section } from "@/components/landing/section";

export function AnalysisPreviewSection() {
  return (
    <Section
      id="preview"
      eyebrow="Dashboard preview"
      title="A realistic AI report analysis workspace"
      description="Users can reopen their report, review extracted findings, and prepare safer doctor conversations."
      className="bg-white dark:bg-slate-950"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65 }}
        className="overflow-hidden rounded-lg border bg-slate-950 shadow-2xl shadow-slate-900/20"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-teal-400 p-2 text-slate-950">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-white">SehatScan Analysis</p>
              <p className="text-sm text-slate-400">Uploaded blood report · English</p>
            </div>
          </div>
          <Badge className="bg-emerald-400 text-slate-950">Analysis completed</Badge>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[0.78fr_1.22fr]">
          <Card className="border-white/10 bg-white/[0.06] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-teal-300" />
                Uploaded report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[4/5] rounded-lg border border-white/10 bg-white p-5 text-slate-900">
                <div className="mb-5 h-3 w-32 rounded bg-slate-200" />
                <div className="space-y-3">
                  {reportRows.map((row) => (
                    <div key={row.marker} className="grid grid-cols-3 gap-2 border-b pb-2 text-xs">
                      <span className="font-medium">{row.marker}</span>
                      <span>{row.value}</span>
                      <span className={row.status === "Low" ? "text-amber-600" : "text-emerald-600"}>{row.status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 space-y-2">
                  <div className="h-2 rounded bg-slate-100" />
                  <div className="h-2 w-11/12 rounded bg-slate-100" />
                  <div className="h-2 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Presigned file access for the report owner
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="border-white/10 bg-white text-slate-950 dark:bg-slate-900 dark:text-white">
              <CardHeader>
                <CardTitle className="text-base">AI-generated summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-slate-600 dark:text-slate-300">
                  Your report shows low hemoglobin and low Vitamin D. These may relate to fatigue,
                  nutritional gaps, or other causes. Discuss symptoms, diet, and follow-up testing
                  with your doctor.
                </p>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-amber-900 dark:text-amber-100">
                    <AlertTriangle className="h-5 w-5" />
                    Abnormal values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-md bg-white p-3 dark:bg-slate-950/60">
                    <p className="font-semibold">Hemoglobin · Low</p>
                    <p className="text-slate-600 dark:text-slate-300">10.8 g/dL vs 13.0 - 17.0</p>
                  </div>
                  <div className="rounded-md bg-white p-3 dark:bg-slate-950/60">
                    <p className="font-semibold">Vitamin D · Low</p>
                    <p className="text-slate-600 dark:text-slate-300">18 ng/mL vs 30 - 100</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-teal-900 dark:text-teal-100">
                    <CheckCircle2 className="h-5 w-5" />
                    Precautions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    <li>Do not self-medicate based only on a report.</li>
                    <li>Ask if iron or Vitamin D supplements are appropriate.</li>
                    <li>Share symptoms like fatigue or dizziness with your clinician.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
