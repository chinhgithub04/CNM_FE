import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const invoiceId = searchParams.get('invoice_id');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    if (redirectStatus !== 'succeeded' || !invoiceId) {
      navigate('/', { replace: true });
    }
  }, [redirectStatus, invoiceId, navigate]);

  if (redirectStatus !== 'succeeded' || !invoiceId) {
    return null;
  }

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
            {/* Success Icon */}
            <div className='flex justify-center mb-6'>
              <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckCircle2 className='w-12 h-12 text-green-600' />
              </div>
            </div>

            {/* Success Message */}
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Thanh toán thành công!
            </h1>
            <p className='text-gray-600 mb-2'>
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
            </p>
            <p className='text-sm text-gray-500 mb-8'>
              Mã đơn hàng: <span className='font-semibold'>#{invoiceId}</span>
            </p>

            {/* Order Details */}
            <div className='bg-gray-50 rounded-lg p-6 mb-8 text-left'>
              <h2 className='font-semibold text-lg mb-4'>Thông tin đơn hàng</h2>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Mã đơn hàng:</span>
                  <span className='font-medium'>#{invoiceId}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Trạng thái thanh toán:</span>
                  <span className='text-green-600 font-medium'>
                    Đã thanh toán
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Trạng thái đơn hàng:</span>
                  <span className='text-blue-600 font-medium'>Đang xử lý</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                variant='outline'
                size='lg'
                onClick={() => navigate('/')}
                className='flex-1 sm:flex-initial'
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                size='lg'
                onClick={() => navigate('/orders')}
                className='flex-1 sm:flex-initial'
              >
                Theo dõi đơn hàng
              </Button>
            </div>

            {/* Additional Info */}
            <div className='mt-8 pt-6 border-t text-sm text-gray-500'>
              <p>Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.</p>
              <p className='mt-2'>
                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
