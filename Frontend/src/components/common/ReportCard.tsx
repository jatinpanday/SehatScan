import { Link } from "react-router-dom";
import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Report } from "@/types/report";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">{report.originalFileName}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {report.reportType.replaceAll("_", " ")} · {new Date(report.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={report.status === "completed" ? "success" : "warning"}>{report.status}</Badge>
          {report.fileUrl ? (
            <Button asChild variant="outline" size="sm">
              <a href={report.fileUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                View
              </a>
            </Button>
          ) : null}
          <Button asChild variant="outline" size="sm">
            <Link to={`/analysis/${report.id}`}>Analyze</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
