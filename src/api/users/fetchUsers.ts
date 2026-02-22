import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';
import type { UserItem } from './types';

export async function fetchUsers(): Promise<ApiResponse<UserItem[]>> {
  const { data } = await axiosInstance.get<ApiResponse<UserItem[]>>('/users');

  return data;
}
