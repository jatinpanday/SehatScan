export interface ApiErrorBody {
  success: false;
  error?: {
    message?: string;
    details?: unknown;
  };
  message?: string;
}

export interface ApiResponse<T> {
  success: true;
  message?: string;
  data: T;
}
