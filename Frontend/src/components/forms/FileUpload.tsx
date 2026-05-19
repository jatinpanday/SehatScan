import { UploadCloud } from "lucide-react";
import { cn } from "@/utils/cn";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  error?: string;
}

export function FileUpload({ value, onChange, accept = ".pdf,.png,.jpg,.jpeg", error }: FileUploadProps) {
  return (
    <div>
      <label
        className={cn(
          "flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-card p-6 text-center transition hover:border-primary",
          error && "border-destructive",
        )}
      >
        <UploadCloud className="mb-3 h-9 w-9 text-primary" />
        <span className="font-medium">{value ? value.name : "Choose report file"}</span>
        <span className="mt-1 text-sm text-muted-foreground">PDF, PNG, JPG up to backend upload limit</span>
        <input
          className="sr-only"
          type="file"
          accept={accept}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </label>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
