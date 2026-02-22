import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
  const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', payload);

  return data;
}
