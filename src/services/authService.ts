import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types/auth';
import type { Response } from '../types/common';
import apiClient from './apiClient';

export const loginUser = async (
  data: LoginRequest
): Promise<Response<LoginResponse>> => {
  const response = await apiClient.post<Response<LoginResponse>>(
    '/auth/login',
    data
  );
  return response.data;
};

export const registerUser = async (
  data: RegisterRequest
): Promise<Response<LoginResponse>> => {
  const response = await apiClient.post<Response<LoginResponse>>(
    '/auth/register',
    data
  );
  return response.data;
};

export const refreshToken = async (
  token: string
): Promise<Response<LoginResponse>> => {
  const response = await apiClient.post<Response<LoginResponse>>(
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
