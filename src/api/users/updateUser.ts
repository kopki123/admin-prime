import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';
import type { UserItem, UserPayload } from './types';

export async function updateUser(id: number, payload: UserPayload): Promise<ApiResponse<UserItem>> {
  const { data } = await axiosInstance.put<ApiResponse<UserItem>>(`/users/${id}`, payload);

  return data;
}
