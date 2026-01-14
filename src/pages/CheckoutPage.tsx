import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateInvoice } from '@/hooks/useInvoice';
import { getProductById } from '@/services/productService';
import { removeCartItem } from '@/services/cartService';
import { getProductImage } from '@/utils/cloudinary';
import { formatCurrency } from '@/utils/formatters';
import type { InvoiceItemCreate } from '@/types/invoice';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

interface CheckoutItem {
  ProductTypeId: number;
  ProductId: number;
  ProductTypeName: string;
  ProductName?: string;
  ImageUrl: string | null;
  Quantity: number;
  UnitPrice: number;
}

interface CheckoutLocationState {
  items: CheckoutItem[];
  fromCart?: boolean;
}

function CheckoutForm({
  items,
  fromCart,
}: {
  items: CheckoutItem[];
  fromCart?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const createInvoiceMutation = useCreateInvoice();

  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.UnitPrice * item.Quantity, 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    setIsProcessing(true);

    try {
      // Create invoice on backend
      const invoiceItems: InvoiceItemCreate[] = items.map((item) => ({
        ProductTypeId: item.ProductTypeId,
        Quantity: item.Quantity,
        Amount: item.UnitPrice * item.Quantity,
      }));

      const response = await createInvoiceMutation.mutateAsync({
        Address: address,
        Items: invoiceItems,
        Notes: notes || undefined,
      });

      if (response.code !== '201' || !response.data) {
        toast.error(response.message || 'Không thể tạo đơn hàng');
        setIsProcessing(false);
        return;
      }

      // Clear cart items if checkout is from cart page
      if (fromCart) {
        const deletePromises = items.map((item) =>
          removeCartItem(item.ProductTypeId)
        );
        await Promise.all(deletePromises);
      }

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?invoice_id=${response.data.Id}`,
        },
      });

      if (error) {
        toast.error(error.message || 'Thanh toán thất bại');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(
        error?.response?.data?.message || 'Đã xảy ra lỗi khi thanh toán'
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Delivery Address */}
      <div className='space-y-2'>
        <Label htmlFor='address'>
          Địa chỉ giao hàng <span className='text-destructive'>*</span>
        </Label>
        <Textarea
          id='address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='Nhập địa chỉ giao hàng của bạn'
          rows={3}
          required
        />
      </div>

      {/* Notes */}
      <div className='space-y-2'>
        <Label htmlFor='notes'>Ghi chú (Tùy chọn)</Label>
        <Textarea
          id='notes'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='Ghi chú cho đơn hàng'
          rows={2}
        />
      </div>

      {/* Payment Element */}
      <div className='space-y-2'>
        <Label>Thông tin thanh toán</Label>
        <div className='border rounded-lg p-4'>
          <PaymentElement />
        </div>
      </div>

      {/* Total */}
      <div className='flex justify-between items-center pt-4 border-t'>
        <span className='text-lg font-semibold'>Tổng cộng:</span>
        <span className='text-2xl font-bold text-primary'>
          {formatCurrency(total)}
        </span>
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        className='w-full'
        size='lg'
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
      </Button>
    </form>
  );
}

function CheckoutItemRow({ item }: { item: CheckoutItem }) {
  const { data: productData } = useQuery({
    queryKey: ['product', item.ProductId],
    queryFn: () => getProductById(item.ProductId),
    enabled: !item.ProductName,
  });

  const productName =
    item.ProductName || productData?.data?.Name || 'Đang tải...';
  const imageUrl = item.ImageUrl ? getProductImage(item.ImageUrl) : null;

  return (
    <div className='flex items-center gap-4 py-4 border-b last:border-0'>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={item.ProductTypeName}
          className='w-16 h-16 object-cover rounded'
        />
      ) : (
        <div className='w-16 h-16 bg-muted rounded flex items-center justify-center'>
          <span className='text-muted-foreground text-xs'>
            {productName.charAt(0)}
          </span>
        </div>
      )}
      <div className='flex-1'>
        <p className='font-medium'>{productName}</p>
        <p className='text-sm text-muted-foreground'>{item.ProductTypeName}</p>
        <p className='text-sm text-muted-foreground'>
          Số lượng: {item.Quantity}
        </p>
      </div>
      <div className='text-right'>
        <p className='font-semibold'>
          {formatCurrency(item.UnitPrice * item.Quantity)}
        </p>
        <p className='text-sm text-muted-foreground'>
          {formatCurrency(item.UnitPrice)}/sp
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutLocationState;
  const createInvoiceMutation = useCreateInvoice();

  const [clientSecret, setClientSecret] = useState<string>('');

  const items = state?.items || [];
  const fromCart = state?.fromCart || false;

  useEffect(() => {
    if (items.length === 0) {
      toast.error('Không có sản phẩm để thanh toán');
      navigate('/cart');
      return;
    }

    // Create payment intent by calling backend
    const createPaymentIntent = async () => {
      try {
        const invoiceItems: InvoiceItemCreate[] = items.map((item) => ({
          ProductTypeId: item.ProductTypeId,
          Quantity: item.Quantity,
          Amount: item.UnitPrice * item.Quantity,
        }));

        const response = await createInvoiceMutation.mutateAsync({
          Address: 'Temporary address for payment initialization',
          Items: invoiceItems,
        });

        if (response.code === '201' && response.data?.ClientSecret) {
          setClientSecret(response.data.ClientSecret);
        } else {
          toast.error(response.message || 'Không thể khởi tạo thanh toán');
          navigate('/cart');
        }
      } catch (error) {
        console.error('Payment intent error:', error);
        toast.error('Không thể khởi tạo thanh toán');
        navigate('/cart');
      }
    };

    createPaymentIntent();
  }, [items.length, navigate]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.UnitPrice * item.Quantity, 0);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const appearance = {
    theme: 'stripe' as const,
  };

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold mb-8'>Thanh toán</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* LEFT SIDE - Order Summary */}
          <div className='lg:col-span-1'>
            <div className='border rounded-lg p-6'>
              <h2 className='text-xl font-semibold mb-4'>Đơn hàng của bạn</h2>
              <div className='space-y-0'>
                {items.map((item, index) => (
                  <CheckoutItemRow key={index} item={item} />
                ))}
              </div>
              <div className='flex justify-between items-center pt-4 mt-4 border-t'>
                <span className='font-semibold'>Tổng cộng:</span>
                <span className='text-xl font-bold text-primary'>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Checkout Form */}
          <div className='lg:col-span-2'>
            <div className='border rounded-lg p-6'>
              <h2 className='text-xl font-semibold mb-6'>
                Thông tin thanh toán
              </h2>
              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance }}
                >
                  <CheckoutForm items={items} fromCart={fromCart} />
                </Elements>
              ) : (
                <div className='space-y-4'>
                  <div className='h-10 bg-muted animate-pulse rounded' />
                  <div className='h-32 bg-muted animate-pulse rounded' />
                  <div className='h-10 bg-muted animate-pulse rounded' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
