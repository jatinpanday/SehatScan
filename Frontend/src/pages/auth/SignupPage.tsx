import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/forms/FormField";
import { ROUTES } from "@/constants/routes";
import { useSignup } from "@/hooks/useAuthActions";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  preferredLanguage: z.enum(["en", "hi"]),
});

type SignupForm = z.infer<typeof schema>;

export default function SignupPage() {
  const { t } = useTranslation();
  const signup = useSignup();
  const form = useForm<SignupForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", preferredLanguage: "en" },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.signup")}</CardTitle>
        <CardDescription>{t("auth.checkEmail")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => signup.mutate(values))}>
          <FormField label={t("auth.name")} error={form.formState.errors.name?.message} {...form.register("name")} />
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
            autoComplete="new-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred language</Label>
            <Select id="preferredLanguage" {...form.register("preferredLanguage")}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </Select>
          </div>
          <Button className="w-full" type="submit" disabled={signup.isPending}>
            {signup.isPending ? t("common.loading") : t("auth.signup")}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {t("auth.hasAccount")}{" "}
          <Link className="font-medium text-primary hover:underline" to={ROUTES.login}>
            {t("auth.login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
