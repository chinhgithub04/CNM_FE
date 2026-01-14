import apiClient from './apiClient';
import type { User, CreateUserRequest, UpdateUserRequest } from '@/types/user';
import type { Response } from '@/types/common';

/**
 * Get all users
 */
export const getUsers = async (): Promise<Response<User[]>> => {
  const response = await apiClient.get<Response<User[]>>('/users');
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<Response<User>> => {
  const response = await apiClient.get<Response<User>>(`/users/${id}`);
  return response.data;
};

/**
 * Create new user
 */
export const createUser = async (
  data: CreateUserRequest
): Promise<Response<User>> => {
  const response = await apiClient.post<Response<User>>('/users', data);
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  data: UpdateUserRequest
): Promise<Response<User>> => {
  const response = await apiClient.put<Response<User>>(`/users/${id}`, data);
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<Response<void>> => {
  const response = await apiClient.delete<Response<void>>(`/users/${id}`);
  return response.data;
};

/**
 * Update user role
 */
export const updateUserRole = async (
  id: string,
  role: string
): Promise<Response<User>> => {
  const response = await apiClient.put<Response<User>>(`/users/${id}/role`, {
    Role: role,
  });
  return response.data;
};

/**
 * Toggle user status (activate/deactivate)
 */
export const toggleUserStatus = async (
  id: string,
  status: number
): Promise<Response<User>> => {
  const response = await apiClient.put<Response<User>>(`/users/${id}`, {
    Status: status,
  });
  return response.data;
};
