import apiClient from './apiClient';
import type { Cart, CartItemCreate } from '@/types/cart';
import type { Response } from '@/types/common';

export const getMyCart = async (): Promise<Response<Cart>> => {
  const response = await apiClient.get<Response<Cart>>('/cart/me');
  return response.data;
};

export const addToCart = async (
  item: CartItemCreate
): Promise<Response<Cart>> => {
  const response = await apiClient.post<Response<Cart>>('/cart', item);
  return response.data;
};

export const updateCartItem = async (
  productTypeId: number,
  quantity: number
): Promise<Response<Cart>> => {
  const response = await apiClient.put<Response<Cart>>(
    `/cart/items/${productTypeId}`,
    null,
    {
      params: { quantity },
    }
  );
  return response.data;
};

export const removeCartItem = async (
  productTypeId: number
): Promise<Response<Cart>> => {
  const response = await apiClient.delete<Response<Cart>>(
    `/cart/items/${productTypeId}`
  );
  return response.data;
};
