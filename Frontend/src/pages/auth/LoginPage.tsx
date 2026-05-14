import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/FormField";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/hooks/useAuthActions";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const login = useLogin();
  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.login")}</CardTitle>
        <CardDescription>{t("auth.welcome")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => login.mutate(values))}>
          <FormField
            label={t("auth.email")}
            type="email"
            autoComplete="email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <FormField
            label={t("auth.password")}
            type="password"
            autoComplete="current-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <Button className="w-full" type="submit" disabled={login.isPending}>
            {login.isPending ? t("common.loading") : t("auth.login")}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link className="font-medium text-primary hover:underline" to={ROUTES.signup}>
            {t("auth.signup")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
