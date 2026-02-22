import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';

interface CheckLoginStatusResponse {
  userId: number;
  username: string;
  avatar: string;
}

export async function checkLoginStatus(): Promise<ApiResponse<CheckLoginStatusResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<CheckLoginStatusResponse>>('/auth/status');

  return data;
}
