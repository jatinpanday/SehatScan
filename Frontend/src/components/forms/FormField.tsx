import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightSlot?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, rightSlot, ...props }, ref) => {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={fieldId}>{label}</Label>
        {rightSlot}
      </div>
      <Input id={fieldId} aria-invalid={Boolean(error)} ref={ref} {...props} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
  },
);

FormField.displayName = "FormField";
