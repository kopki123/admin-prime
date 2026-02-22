export interface Meta {
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
  };
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown, M = unknown> {
  success: boolean;
  code?: number;
  message?: string;
  data: T;
  meta?: M;
}

export type SuccessResponse<T = unknown, M = unknown> = ApiResponse<T, M> & { success: true };
export type ErrorResponse<T = unknown, M = unknown> = ApiResponse<T, M> & { success: false };

export type HttpErrorPayload = ErrorResponse<unknown, unknown>;
