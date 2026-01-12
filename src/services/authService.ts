import type {
  LoginRequest,
  Token,
  RegisterRequest,
  UserResponse,
} from '@/types/auth';
import type { Response } from '@/types/common';
import apiClient from './apiClient';

export const loginUser = async (
  data: LoginRequest
): Promise<Response<Token>> => {
  const response = await apiClient.post<Response<Token>>('/login', data);
  return response.data;
};

export const registerUser = async (
  data: RegisterRequest
): Promise<Response<UserResponse>> => {
  const response = await apiClient.post<Response<UserResponse>>(
    '/register',
    data
  );
  return response.data;
};

export const refreshToken = async (token: string): Promise<Response<Token>> => {
  const response = await apiClient.post<Response<Token>>(
    '/auth/refresh-token',
    { token }
  );
  return response.data;
};

export const revokeToken = async (token: string): Promise<Response<null>> => {
  const response = await apiClient.post<Response<null>>('/auth/revoke-token', {
    token,
  });
  return response.data;
};
