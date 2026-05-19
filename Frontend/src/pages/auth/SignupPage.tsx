import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSignup } from "@/hooks/useAuthActions";
import { ROUTES } from "@/constants/routes";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  preferredLanguage: z.enum(["en", "hi"]),
});

type SignupForm = z.infer<typeof schema>;

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
  boxSizing: "border-box",
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

export default function SignupPage() {
  const { t } = useTranslation();
  const signup = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const form = useForm<SignupForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", preferredLanguage: "en" },
  });

  const getFocusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { borderColor: "#1d9e75", boxShadow: "0 0 0 3px rgba(29,158,117,0.12)" }
      : {};

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>

      {/* Mobile logo */}
      <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
        <div style={{ background: "#0d3b35", borderRadius: 9, padding: "6px 7px", display: "flex" }}>
          <Activity size={17} color="#5dcaa5" />
        </div>
        <span style={{ fontWeight: 600, fontSize: 16, color: "#0d3b35" }}>SehatScan</span>
      </div>

      {/* Heading */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "2rem",
          fontWeight: 400,
          color: "#0a2e2a",
          margin: "0 0 6px",
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
        }}>
          Create your account
        </h1>
        <p style={{ color: "#888", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          Get started with AI-powered health report analysis.
        </p>
      </div>

      {/* Form */}
      <form
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
        onSubmit={form.handleSubmit((values) => signup.mutate(values))}
      >
        {/* Name */}
        <div>
          <label style={labelStyle}>{t("auth.name")}</label>
          <input
            type="text"
            autoComplete="name"
            placeholder="Dr. Priya Sharma"
            style={{ ...inputStyle, ...getFocusStyle("name") }}
            onFocus={() => setFocusedField("name")}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p style={errorStyle}>{form.formState.errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>{t("auth.email")}</label>
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

        {/* Password */}
        <div>
          <label style={labelStyle}>{t("auth.password")}</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              style={{ ...inputStyle, paddingRight: 44, ...getFocusStyle("password") }}
              onFocus={() => setFocusedField("password")}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              style={{
                position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#aaa",
                display: "flex", alignItems: "center", padding: 0,
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p style={errorStyle}>{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Language */}
        <div>
          <label style={labelStyle}>Preferred language</label>
          <select
            style={{
              ...inputStyle,
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              paddingRight: 40,
            }}
            {...form.register("preferredLanguage")}
          >
            <option value="en">🌐 English</option>
            <option value="hi">🇮🇳 हिन्दी</option>
          </select>
        </div>

        {/* Terms note */}
        <p style={{ color: "#aaa", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
          By signing up, you agree to our{" "}
          <span style={{ color: "#1d9e75", cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "#1d9e75", cursor: "pointer" }}>Privacy Policy</span>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={signup.isPending}
          className="bg-secondary"
          style={{
            marginTop: 4,
            height: 40,
            width: "100%",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: signup.isPending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.2s",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => { if (!signup.isPending) (e.target as HTMLElement).style.background = "#0a2e2a"; }}
          onMouseLeave={(e) => { if (!signup.isPending) (e.target as HTMLElement).style.background = "#0d3b35"; }}
        >
          {signup.isPending ? (
            t("common.loading")
          ) : (
            <>
              {t("auth.signup")}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <p style={{ textAlign: "center", color: "#888", fontSize: 14, margin: "1.5rem 0 0" }}>
        {t("auth.hasAccount")}{" "}
        <Link
          to={ROUTES.login}
          style={{ color: "#1d9e75", fontWeight: 600, textDecoration: "none" }}
        >
          {t("auth.login")} →
        </Link>
      </p>
    </div>
  );
}
