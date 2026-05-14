import { useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/FormField";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

type OtpForm = z.infer<typeof schema>;

export default function OtpVerificationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const form = useForm<OtpForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: searchParams.get("email") ?? "", otp: "" },
  });

  const verify = useMutation({
    mutationFn: ({ email, otp }: OtpForm) => authService.verifyOtp(email, otp),
    onSuccess: () => toast.success("Email verified. You can log in now."),
  });

  const resend = useMutation({
    mutationFn: (email: string) => authService.sendOtp(email),
    onSuccess: () => toast.success("OTP sent"),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.verifyOtp")}</CardTitle>
        <CardDescription>{t("auth.checkEmail")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => verify.mutate(values))}>
          <FormField label={t("auth.email")} type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
          <FormField label={t("auth.otp")} inputMode="numeric" error={form.formState.errors.otp?.message} {...form.register("otp")} />
          <Button className="w-full" type="submit" disabled={verify.isPending}>
            {verify.isPending ? t("common.loading") : t("auth.verifyOtp")}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <Button variant="link" className="px-0" onClick={() => resend.mutate(form.getValues("email"))}>
            Resend OTP
          </Button>
          <Link className="font-medium text-primary hover:underline" to={ROUTES.login}>
            {t("auth.login")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
