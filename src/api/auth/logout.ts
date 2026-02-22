import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';

export async function logout(): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.post<ApiResponse<boolean>>('/auth/logout');

  return data;
}
