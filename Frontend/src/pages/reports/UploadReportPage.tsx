import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FileUpload } from "@/components/forms/FileUpload";
import { PageContainer } from "@/components/layout/PageContainer";
import { queryKeys } from "@/constants/queryKeys";
import { reportService } from "@/services/report.service";
import { useAppSelector } from "@/store/hooks";
import type { ReportType } from "@/types/report";

const reportTypes: ReportType[] = ["lab", "imaging", "prescription", "discharge_summary", "vaccination", "other"];

export default function UploadReportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useAppSelector((state) => state.language.currentLanguage);
  const userId = useAppSelector((state) => state.user.profile?.id);
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState<ReportType>("other");
  const [fileError, setFileError] = useState<string>();

  const upload = useMutation({
    mutationFn: reportService.uploadReport,
    onSuccess: (data) => {
      toast.success("Report uploaded successfully");
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.reports.list(userId) });
      }
      navigate(`/analysis/${data.reportId}`);
    },
  });

  const handleSubmit = () => {
    if (!file) {
      setFileError("Please choose a report file");
      return;
    }
    setFileError(undefined);
    upload.mutate({ file, reportType, language });
  };

  return (
    <PageContainer title={t("reports.uploadTitle")} subtitle={t("reports.uploadSubtitle")}>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>{t("reports.chooseFile")}</CardTitle>
          <CardDescription>Files are sent securely to the backend upload endpoint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FileUpload
            value={file}
            onChange={(nextFile) => {
              setFile(nextFile);
              setFileError(undefined);
            }}
            error={fileError}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reportType">{t("reports.fileType")}</Label>
              <Select id="reportType" value={reportType} onChange={(event) => setReportType(event.target.value as ReportType)}>
                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("reports.language")}</Label>
              <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                {language === "hi" ? "हिन्दी" : "English"}
              </div>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={upload.isPending}>
            {upload.isPending ? t("common.loading") : t("reports.upload")}
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
