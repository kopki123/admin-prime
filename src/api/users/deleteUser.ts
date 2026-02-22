import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';

export async function deleteUser(id: number): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.delete<ApiResponse<boolean>>(`/users/${id}`);

  return data;
}
