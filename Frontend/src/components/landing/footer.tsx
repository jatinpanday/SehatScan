import { Activity, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { footerLinks } from "@/components/landing/landing-data";

export function LandingFooter() {
  return (
    <footer className="border-t bg-white py-10 dark:bg-slate-950">
      <div className="container grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <a href="#" className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white">
            <span className="rounded-md bg-primary p-2 text-primary-foreground">
              <Activity className="h-5 w-5" />
            </span>
            SehatScan
          </a>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            AI-powered medical report analysis for simple, multilingual health understanding.
          </p>
          <div className="mt-5 flex gap-3 text-slate-500">
            <a href="mailto:contact@sehatscan.ai" aria-label="Email" className="transition hover:text-primary">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="transition hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="transition hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" aria-label="GitHub" className="transition hover:text-primary">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <p className="font-semibold">Product</p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-600 transition hover:text-primary dark:text-slate-300">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold">Company</p>
          <div className="mt-4 grid gap-3">
            <a href="#security" className="text-sm text-slate-600 transition hover:text-primary dark:text-slate-300">
              Privacy Policy
            </a>
            <a href="#faq" className="text-sm text-slate-600 transition hover:text-primary dark:text-slate-300">
              Terms
            </a>
            <a href="mailto:contact@sehatscan.ai" className="text-sm text-slate-600 transition hover:text-primary dark:text-slate-300">
              Contact
            </a>
          </div>
        </div>
      </div>
      <div className="container mt-8 border-t pt-6 text-sm text-slate-500">
        © {new Date().getFullYear()} SehatScan. AI insights are informational and not medical advice.
      </div>
    </footer>
  );
}
