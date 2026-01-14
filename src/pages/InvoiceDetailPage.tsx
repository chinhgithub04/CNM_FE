import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Truck, Package } from 'lucide-react';
import { useInvoiceAdmin, useUpdateInvoice } from '@/hooks/useInvoices';
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

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoiceId = parseInt(id || '0');

  const { data, isLoading, error } = useInvoiceAdmin(invoiceId);
  const updateInvoiceMutation = useUpdateInvoice();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
          <p className='mt-4 text-gray-600'>Đang tải hoá đơn...</p>
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
                Lỗi khi tải thông tin hoá đơn
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                {error?.message || 'Đã xảy ra lỗi không mong muốn'}
              </p>
              <Button
                onClick={() => navigate('/admin/invoices')}
                className='mt-4'
              >
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invoice = data.data;

  const handleStatusUpdate = (newStatus: number) => {
    setPendingStatus(newStatus);
    setConfirmDialogOpen(true);
  };

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (pendingStatus === null) return;

    await updateInvoiceMutation.mutateAsync({
      id: invoiceId,
      data: { Status: pendingStatus },
    });
    setConfirmDialogOpen(false);
    setPendingStatus(null);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    await updateInvoiceMutation.mutateAsync({
      id: invoiceId,
      data: { Status: 5, Notes: `Đã hủy: ${rejectReason}` },
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

  const getStatusButtonIcon = (status: number) => {
    switch (status) {
      case 1:
        return <Check className='h-4 w-4 mr-2' />;
      case 2:
        return <Truck className='h-4 w-4 mr-2' />;
      case 3:
        return <Package className='h-4 w-4 mr-2' />;
      default:
        return null;
    }
  };

  const canUpdateStatus = invoice.Status <= 3;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate('/admin/invoices')}
          className='gap-2 -ml-2 text-gray-600 hover:text-gray-900'
        >
          <ArrowLeft className='h-4 w-4' />
          Quay lại danh sách
        </Button>
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Hoá đơn #{invoice.Id}
            </h1>
            <p className='text-sm text-gray-500 mt-2'>
              Ngày tạo: {formatDateTime(invoice.CreateAt)}
            </p>
          </div>
          <div>{getStatusBadge(invoice.Status)}</div>
        </div>
      </div>

      {/* Invoice Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin hoá đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <p className='text-sm font-medium text-gray-500'>
                Địa chỉ giao hàng
              </p>
              <p className='text-base text-gray-900 mt-1'>{invoice.Address}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Tổng tiền</p>
              <p className='text-2xl font-bold text-blue-600 mt-1'>
                {formatCurrency(invoice.Total)}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Mã thanh toán</p>
              <p className='text-base text-gray-900 mt-1 truncate'>
                {invoice.PaymentIntentId || 'N/A'}
              </p>
            </div>
            {invoice.VoucherId && (
              <div>
                <p className='text-sm font-medium text-gray-500'>Mã voucher</p>
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

      {/* Action Buttons */}
      {canUpdateStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Thao tác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex gap-3'>
              {invoice.Status === 1 && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate(2)}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    {getStatusButtonIcon(1)}
                    Xác nhận
                  </Button>
                  <Button onClick={handleReject} variant='destructive'>
                    <X className='h-4 w-4 mr-2' />
                    Hủy đơn
                  </Button>
                </>
              )}
              {invoice.Status === 2 && (
                <Button
                  onClick={() => handleStatusUpdate(3)}
                  className='bg-purple-600 hover:bg-purple-700'
                >
                  {getStatusButtonIcon(2)}
                  Giao hàng ngay
                </Button>
              )}
              {invoice.Status === 3 && (
                <Button
                  onClick={() => handleStatusUpdate(4)}
                  className='bg-green-600 hover:bg-green-700'
                >
                  {getStatusButtonIcon(3)}
                  Đã giao hàng
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Status Update Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận cập nhật</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "
              {pendingStatus && InvoiceStatusLabels[pendingStatus]}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setConfirmDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={confirmStatusUpdate}
              disabled={updateInvoiceMutation.isPending}
            >
              {updateInvoiceMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do hủy đơn hàng
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
  );
}
