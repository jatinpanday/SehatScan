import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Activity } from "lucide-react";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const pulseLines = [
  "M0,50 Q20,20 40,50 Q60,80 80,50 Q100,20 120,50 Q140,80 160,50 Q180,20 200,50",
  "M0,60 Q30,30 60,60 Q90,90 120,60 Q150,30 180,60 Q210,90 240,60",
];

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_560px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Left panel ── */}
      <section
        className="hidden lg:flex lg:flex-col lg:justify-between bg-secondary"
        style={{
          padding: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Decorative circle blobs */}
        <div style={{
          position: "absolute", top: "-10%", right: "-8%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,158,117,0.18) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 70%)",
        }} />

        {/* ECG decorative SVG */}
        <svg
          style={{ position: "absolute", bottom: "28%", left: 0, right: 0, opacity: 0.12 }}
          viewBox="0 0 500 100" preserveAspectRatio="none" height="80"
        >
          <path
            d="M0,50 L60,50 L75,20 L90,80 L105,50 L140,50 L150,35 L160,65 L170,50 L240,50 L255,15 L270,85 L285,50 L340,50 L350,38 L360,62 L370,50 L500,50"
            stroke="#1d9e75" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10}}>
          <div style={{
            background: "#0d3b35",
            borderRadius: 10,
            padding: "7px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Activity size={18} color="#fff" />
          </div>
          <span style={{ color: "#e8f5f0", fontWeight: 600, fontSize: 17, letterSpacing: "0.01em" }}>
            {t("appName")}
          </span>
        </div>

        {/* Hero copy */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
          <p style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            color: "#e8f5f0",
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
            fontWeight: 400,
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}>
            {t("auth.welcome")}
          </p>
          <p style={{ color: "rgba(232,245,240,0.6)", fontSize: 15, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Secure uploads, multilingual analysis, and a calm dashboard for patients and care teams.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { value: "98%", label: "Report accuracy" },
              { value: "multilingual", label: "Analysis" },
              { value: "HIPAA", label: "Compliant" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p style={{ color: "#5dcaa5", fontWeight: 700, fontSize: 20, margin: 0, letterSpacing: "-0.01em" }}>{value}</p>
                <p style={{ color: "rgba(232,245,240,0.5)", fontSize: 12, margin: "2px 0 0", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div style={{
          position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "1.5rem",
        }}>
          <p style={{ color: "rgba(232,245,240,0.55)", fontSize: 13, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
            "SehatScan has transformed how we review patient reports — the clarity is unmatched."
          </p>
          <p style={{ color: "rgba(232,245,240,0.35)", fontSize: 12, margin: "6px 0 0" }}>Dr. Priya Sharma, AIIMS Delhi</p>
        </div>
      </section>

      {/* ── Right panel ── */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#f9f7f4",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "1rem 1.5rem", alignItems: "center" }}>
          <LanguageSwitcher />
          {/* <ThemeToggle /> */}
        </div>

        {/* Form area */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
          <Outlet />
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "rgba(60,60,60,0.4)", fontSize: 12, padding: "1rem", margin: 0 }}>
          © 2026 SehatScan · Privacy · Terms
        </p>
      </section>
    </main>
  );
}