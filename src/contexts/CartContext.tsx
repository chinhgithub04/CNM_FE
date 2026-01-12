import { createContext, useContext, type ReactNode } from 'react';
import { useCart as useCartQuery } from '@/hooks/useCart';
import type { Cart } from '@/types/cart';

interface CartContextType {
  cart: Cart | null | undefined;
  isLoading: boolean;
  error: Error | null;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useCartQuery();

  const cart = data?.data;

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + item.Quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, isLoading, error, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
