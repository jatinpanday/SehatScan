import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
        <div>
          <h3 className="font-semibold text-destructive">{title}</h3>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          {onRetry ? (
            <Button className="mt-4" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
