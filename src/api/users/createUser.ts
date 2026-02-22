import { axiosInstance } from '../axiosInstance';
import type { ApiResponse } from '../types';
import type { UserItem, UserPayload } from './types';

export async function createUser(payload: UserPayload): Promise<ApiResponse<UserItem>> {
  const { data } = await axiosInstance.post<ApiResponse<UserItem>>('/users', payload);

  return data;
}
