import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, action, children }: PageContainerProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
