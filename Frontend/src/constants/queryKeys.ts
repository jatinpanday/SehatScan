export const queryKeys = {
  reports: {
    all: ["reports"] as const,
    list: (userId: string) => ["reports", userId, "list"] as const,
    detail: (userId: string, reportId: string) => ["reports", userId, "detail", reportId] as const,
  },
} as const;
