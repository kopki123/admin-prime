import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';

export async function fetchMyPermissions(): Promise<ApiResponse<string[]>> {
  const { data } = await axiosInstance.get<ApiResponse<string[]>>('/my/permissions');

  return data;
}
