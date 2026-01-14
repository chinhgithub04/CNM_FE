import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useInvoice, useUpdateInvoice } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { buildCloudinaryUrl } from '@/utils/cloudinary';
import { InvoiceStatusLabels, InvoiceStatusColors } from '@/types/invoice';

export default function CustomerInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoiceId = parseInt(id || '0');

  const { data, isLoading, error } = useInvoice(invoiceId);
  const updateInvoiceMutation = useUpdateInvoice();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
          <p className='mt-4 text-gray-600'>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-red-600 font-medium'>
                Lỗi khi tải thông tin đơn hàng
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                {error?.message || 'Đã xảy ra lỗi không mong muốn'}
              </p>
              <Button onClick={() => navigate('/orders')} className='mt-4'>
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invoice = data.data;

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn');
      return;
    }

    await updateInvoiceMutation.mutateAsync({
      id: invoiceId,
      data: { Status: 5, Notes: `Khách hàng hủy: ${rejectReason}` },
    });
    setRejectDialogOpen(false);
    setRejectReason('');
  };

  const getStatusBadge = (status: number) => {
    const label = InvoiceStatusLabels[status] || 'Không xác định';
    const color = InvoiceStatusColors[status] || 'yellow';

    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      blue: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      green: 'bg-green-100 text-green-800 hover:bg-green-100',
      purple: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
      cyan: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100',
      red: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return <Badge className={colorClasses[color]}>{label}</Badge>;
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='space-y-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate('/orders')}
            className='gap-2 -ml-2 text-gray-600 hover:text-gray-900'
          >
            <ArrowLeft className='h-4 w-4' />
            Quay lại danh sách
          </Button>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Đơn hàng #{invoice.Id}
              </h1>
              <p className='text-sm text-gray-500 mt-2'>
                Ngày đặt: {formatDateTime(invoice.CreateAt)}
              </p>
            </div>
            <div>{getStatusBadge(invoice.Status)}</div>
          </div>
        </div>

        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  Địa chỉ giao hàng
                </p>
                <p className='text-base text-gray-900 mt-1'>
                  {invoice.Address}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Tổng tiền</p>
                <p className='text-2xl font-bold text-blue-600 mt-1'>
                  {formatCurrency(invoice.Total)}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  Mã thanh toán
                </p>
                <p className='text-base text-gray-900 mt-1 truncate'>
                  {invoice.PaymentIntentId || 'N/A'}
                </p>
              </div>
              {invoice.VoucherId && (
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Mã voucher
                  </p>
                  <p className='text-base text-gray-900 mt-1'>
                    {invoice.VoucherId}
                  </p>
                </div>
              )}
            </div>
            {invoice.Notes && (
              <div className='mt-4'>
                <p className='text-sm font-medium text-gray-500'>Ghi chú</p>
                <p className='text-base text-gray-900 mt-1'>{invoice.Notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm ({invoice.Items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã loại sản phẩm</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead className='text-center'>Số lượng</TableHead>
                    <TableHead className='text-right'>Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.Items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        #{item.ProductTypeId}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          {item.ProductTypeImageUrl && (
                            <img
                              src={
                                buildCloudinaryUrl(item.ProductTypeImageUrl, {
                                  width: 64,
                                  height: 64,
                                }) || undefined
                              }
                              alt={item.ProductName || 'Product'}
                              className='w-16 h-16 object-cover rounded'
                            />
                          )}
                          <div>
                            <p className='font-medium text-gray-900'>
                              {item.ProductName || 'N/A'}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {item.ProductTypeName || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        {item.Quantity}
                      </TableCell>
                      <TableCell className='text-right font-semibold'>
                        {formatCurrency(item.Amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className='flex justify-end mt-4 pt-4 border-t'>
              <div className='text-right'>
                <p className='text-sm text-gray-500'>Tổng cộng</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {formatCurrency(invoice.Total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Only show cancel button for pending orders */}
        {invoice.Status === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex gap-3'>
                <Button onClick={handleReject} variant='destructive'>
                  <X className='h-4 w-4 mr-2' />
                  Hủy đơn hàng
                </Button>
              </div>
              <p className='text-sm text-gray-500 mt-3'>
                * Bạn chỉ có thể hủy đơn hàng khi đơn hàng đang ở trạng thái
                "Chờ xử lý"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hủy đơn hàng</DialogTitle>
              <DialogDescription>
                Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='reject-reason'>
                  Lý do <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  id='reject-reason'
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder='Nhập lý do hủy đơn hàng'
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setRejectDialogOpen(false);
                  setRejectReason('');
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={confirmReject}
                disabled={updateInvoiceMutation.isPending}
                variant='destructive'
              >
                {updateInvoiceMutation.isPending
                  ? 'Đang xử lý...'
                  : 'Xác nhận hủy'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
