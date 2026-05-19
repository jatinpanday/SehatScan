import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/hooks/useAuthActions";
import { ROUTES } from "@/constants/routes";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof schema>;

/* ── Shared input style ── */
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

export default function LoginPage() {
  const { t } = useTranslation();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
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
          <Activity size={17} color="#fff" />
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
          Welcome back
        </h1>
        <p style={{ color: "#888", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          Access your AI-powered health dashboard securely.
        </p>
      </div>

      {/* Form */}
      <form
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
        onSubmit={form.handleSubmit((values) => login.mutate(values))}
      >
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>{t("auth.password")}</label>
            <button
              type="button"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 12, color: "#1d9e75", fontWeight: 500, fontFamily: "inherit" }}
            >
              Forgot password?
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
                transition: "color 0.15s",
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

        {/* Submit */}
        <button
          type="submit"
          className="bg-secondary"
          disabled={login.isPending}
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
            cursor: login.isPending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.2s, transform 0.1s",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => { if (!login.isPending) (e.target as HTMLElement).style.background = "#0a2e2a"; }}
          onMouseLeave={(e) => { if (!login.isPending) (e.target as HTMLElement).style.background = "#0d3b35"; }}
        >
          {login.isPending ? (
            t("common.loading")
          ) : (
            <>
              {t("auth.login")}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.75rem 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#e8e4de" }} />
        <span style={{ color: "#bbb", fontSize: 12 }}>or</span>
        <div style={{ flex: 1, height: "1px", background: "#e8e4de" }} />
      </div>

      {/* Sign up link */}
      <p style={{ textAlign: "center", color: "#888", fontSize: 14, margin: 0 }}>
        {t("auth.noAccount")}{" "}
        <Link
          to={ROUTES.signup}
          style={{ color: "#1d9e75", fontWeight: 600, textDecoration: "none" }}
        >
          {t("auth.signup")} →
        </Link>
      </p>
    </div>
  );
}
