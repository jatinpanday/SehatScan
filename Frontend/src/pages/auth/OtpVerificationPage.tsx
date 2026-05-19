import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { ArrowRight, Mail, RotateCcw, Activity } from "lucide-react";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

type OtpForm = z.infer<typeof schema>;

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  border: "1.5px solid #e0dbd2",
  borderRadius: 12,
  padding: "0 14px",
  fontSize: 15,
  fontFamily: "inherit",
  background: "#fff",
  color: "#1a1a1a",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#5a5a5a",
  marginBottom: 6,
  letterSpacing: "0.01em",
};

const errorStyle: React.CSSProperties = {
  color: "#c0392b",
  fontSize: 12,
  marginTop: 4,
};

export default function OtpVerificationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<OtpForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
    },
  });

  const getFocusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { borderColor: "#1d9e75", boxShadow: "0 0 0 3px rgba(29,158,117,0.12)" }
      : {};

  const verify = useMutation({
    mutationFn: ({ email, otp }: OtpForm) => authService.verifyOtp(email, otp),
    onSuccess: () => {
      toast.success("Email verified! Please log in to continue.");
      navigate(ROUTES.login);
    },
  });

  const resend = useMutation({
    mutationFn: (email: string) => authService.sendOtp(email),
    onSuccess: () => toast.success("New OTP sent to your email."),
  });

  /* ── OTP digit box handlers ── */
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    const joined = next.join("");
    form.setValue("otp", joined, { shouldValidate: joined.length === 6 });
    if (value && index < 5) digitRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? "");
    setOtpDigits(next);
    form.setValue("otp", next.join(""), { shouldValidate: true });
    digitRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const emailValue = form.watch("email");

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>

      {/* Mobile logo */}
      <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
        <div style={{ background: "#0d3b35", borderRadius: 9, padding: "6px 7px", display: "flex" }}>
          <Activity size={17} color="#5dcaa5" />
        </div>
        <span style={{ fontWeight: 600, fontSize: 16, color: "#0d3b35", fontFamily: "'DM Sans', sans-serif" }}>SehatScan</span>
      </div>

      {/* Heading */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "2rem",
          fontWeight: 400,
          color: "#0a2e2a",
          margin: "0 0 6px",
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
        }}>
          Check your inbox
        </h1>
        <p style={{ color: "#888", fontSize: 14, margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
          We sent a 6-digit code to{" "}
          {emailValue
            ? <strong style={{ color: "#0d3b35", fontWeight: 600 }}>{emailValue}</strong>
            : "your email address"
          }
        </p>
      </div>

      {/* Form */}
      <form
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
        onSubmit={form.handleSubmit((values) => verify.mutate(values))}
      >
        {/* Email */}
        <div>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            style={{ ...inputStyle, ...getFocusStyle("email") }}
            onFocus={() => setFocusedField("email")}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p style={errorStyle}>{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* OTP digit boxes */}
        <div>
          <label style={labelStyle}>{t("auth.otp")} · 6-digit code</label>
          <div style={{ display: "flex", gap: 8 }} onPaste={handleDigitPaste}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { digitRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(i, e)}
                onFocus={() => setFocusedField(`otp-${i}`)}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: "100%",
                  height: 52,
                  border: "1.5px solid",
                  borderColor: digit ? "#1d9e75" : focusedField === `otp-${i}` ? "#1d9e75" : "#e0dbd2",
                  borderRadius: 12,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  color: "#0a2e2a",
                  background: digit ? "rgba(29,158,117,0.06)" : "#fff",
                  outline: "none",
                  boxShadow: focusedField === `otp-${i}` ? "0 0 0 3px rgba(29,158,117,0.12)" : "none",
                  transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
                  caretColor: "#1d9e75",
                }}
              />
            ))}
          </div>
          {form.formState.errors.otp && (
            <p style={errorStyle}>{form.formState.errors.otp.message}</p>
          )}

          {/* Expiry hint */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb", fontSize: 12, marginTop: 8 }}>
            Code expires in 10 minutes.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={verify.isPending}
          style={{
            height: 50,
            width: "100%",
            background: verify.isPending ? "#5dcaa5" : "#0d3b35",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: verify.isPending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.2s",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => { if (!verify.isPending) (e.currentTarget.style.background = "#0a2e2a"); }}
          onMouseLeave={(e) => { if (!verify.isPending) (e.currentTarget.style.background = "#0d3b35"); }}
        >
          {verify.isPending ? (
            t("common.loading")
          ) : (
            <>
              Verify email
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.5rem 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#e8e4de" }} />
        <span style={{ color: "#ccc", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>didn't get it?</span>
        <div style={{ flex: 1, height: "1px", background: "#e8e4de" }} />
      </div>

      {/* Resend + Back to login */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          disabled={resend.isPending}
          onClick={() => resend.mutate(form.getValues("email"))}
          style={{
            flex: 1,
            height: 44,
            background: "#fff",
            border: "1.5px solid #e0dbd2",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "inherit",
            color: resend.isPending ? "#bbb" : "#0d3b35",
            cursor: resend.isPending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { if (!resend.isPending) e.currentTarget.style.borderColor = "#1d9e75"; }}
          onMouseLeave={(e) => { if (!resend.isPending) e.currentTarget.style.borderColor = "#e0dbd2"; }}
        >
          <RotateCcw size={14} />
          {resend.isPending ? "Sending…" : "Resend code"}
        </button>

        <Link
          to={ROUTES.login}
          style={{
            flex: 1,
            height: 44,
            background: "#fff",
            border: "1.5px solid #e0dbd2",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            color: "#555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8c4be"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0dbd2"; }}
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}