import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  className?: string;
}

export function LoadingSpinner({ fullPage, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", fullPage && "min-h-screen", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}
