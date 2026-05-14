import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisFinding } from "@/types/report";

interface AnalysisCardProps {
  finding: AnalysisFinding;
}

export function AnalysisCard({ finding }: AnalysisCardProps) {
  const variant =
    finding.status === "critical" ? "destructive" : finding.status === "attention" ? "warning" : "success";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          {finding.label}
          <Badge variant={variant}>{finding.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{finding.value}</p>
      </CardContent>
    </Card>
  );
}
