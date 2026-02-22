import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders,
} from 'axios';
import axios, { AxiosHeaders } from 'axios';
import { i18n } from '@/plugins/i18n';
import { keysToCamel, keysToSnake } from '@/utils';
import type { ApiResponse, ErrorResponse } from './types';

export const RequestErrorCodes = {
  OFFLINE: 0,
  TIMEOUT: -1,
  BAD_REQUEST: -2,
  BAD_RESPONSE: -3,
  UNKNOWN: -999,
} as const;

export type RequestErrorCodes = (typeof RequestErrorCodes)[keyof typeof RequestErrorCodes];

const errorMessageKeys = {
  [RequestErrorCodes.OFFLINE]: 'api_error_message.offline',
  [RequestErrorCodes.TIMEOUT]: 'api_error_message.timeout',
  [RequestErrorCodes.BAD_REQUEST]: 'api_error_message.bad_request',
  [RequestErrorCodes.BAD_RESPONSE]: 'api_error_message.bad_response',
  [RequestErrorCodes.UNKNOWN]: 'api_error_message.unknown',
} as const satisfies Record<RequestErrorCodes, string>;

const getErrorMessage = (code: RequestErrorCodes): string => {
  return i18n.global.t(errorMessageKeys[code]);
};

function cleanObject(obj: unknown): unknown {
  // FormData：不處理，原樣回傳
  if (typeof FormData !== 'undefined' && obj instanceof FormData) return obj;

  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj
      .filter((value) => value !== undefined)
      .map((value) => cleanObject(value));
  }

  const newObj: Record<string, unknown> = {};

  Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    newObj[key] = typeof value === 'object' ? cleanObject(value) : value;
  });

  return newObj;
}

function createFallbackConfig(error: AxiosError<ErrorResponse>): InternalAxiosRequestConfig {
  return (error.config ?? {
    headers: new AxiosHeaders(),
  }) as InternalAxiosRequestConfig;
}

function normalizeHttpError(error: AxiosError<ErrorResponse>): ApiResponse<null> {
  const responseData = error.response?.data;
  const statusCode = error.response?.status;
  const serverCode = typeof responseData?.code === 'number' ? responseData.code : undefined;
  const serverMessage = typeof responseData?.message === 'string' ? responseData.message : undefined;

  if (error.code === 'ERR_NETWORK') {
    return {
      success: false,
      code: RequestErrorCodes.OFFLINE,
      message: getErrorMessage(RequestErrorCodes.OFFLINE),
      data: null,
    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      success: false,
      code: RequestErrorCodes.TIMEOUT,
      message: getErrorMessage(RequestErrorCodes.TIMEOUT),
      data: null,
    };
  }

  if (serverCode !== undefined || serverMessage) {
    const fallbackCode = statusCode && statusCode >= 500
      ? RequestErrorCodes.BAD_RESPONSE
      : RequestErrorCodes.BAD_REQUEST;

    return {
      success: false,
      code: serverCode ?? statusCode ?? fallbackCode,
      message: serverMessage ?? getErrorMessage(fallbackCode),
      data: null,
    };
  }

  if (error.code === 'ERR_BAD_RESPONSE') {
    return {
      success: false,
      code: statusCode ?? RequestErrorCodes.BAD_RESPONSE,
      message: getErrorMessage(RequestErrorCodes.BAD_RESPONSE),
      data: null,
    };
  }

  if (error.code === 'ERR_BAD_REQUEST') {
    return {
      success: false,
      code: statusCode ?? RequestErrorCodes.BAD_REQUEST,
      message: getErrorMessage(RequestErrorCodes.BAD_REQUEST),
      data: null,
    };
  }

  return {
    success: false,
    code: RequestErrorCodes.UNKNOWN,
    message: getErrorMessage(RequestErrorCodes.UNKNOWN),
    data: null,
  };
}

function toErrorResponse(error: AxiosError<ErrorResponse>): AxiosResponse<ApiResponse<null>> {
  return {
    data: normalizeHttpError(error),
    status: error.response?.status ?? 0,
    statusText: error.response?.statusText ?? 'REQUEST_ERROR',
    headers: (error.response?.headers ?? {}) as RawAxiosResponseHeaders,
    config: createFallbackConfig(error),
    request: error.request,
  };
}

export function getAxiosErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const anyErr = err as any;
    if (typeof anyErr?.message === 'string') return anyErr.message;
    if (typeof anyErr?.data?.message === 'string') return anyErr.data.message;
  }

  if (axios.isAxiosError(err)) {
    if (err.code === 'ERR_CANCELED') return '';
    const data = err.response?.data as any;
    return data?.message || err.message || '';
  }

  if (err instanceof Error) return err.message;

  return '';
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 60 * 1000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// request
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = keysToSnake(cleanObject(config.data));
    }

    if (config.params) {
      config.params = keysToSnake(cleanObject(config.params));
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    if (response.data) {
      response.data = keysToCamel(response.data);
    }

    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    return Promise.reject(toErrorResponse(error));
  },
);
