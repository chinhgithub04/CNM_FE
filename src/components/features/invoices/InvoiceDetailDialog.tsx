// Component for displaying detailed invoice information
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import type { Invoice } from '@/types/invoice';
import { InvoiceStatusLabels, InvoiceStatusColors } from '@/types/invoice';
import { Separator } from '@/components/ui/separator';

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceDetailDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  const getStatusBadge = (status: Invoice['Status']) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-175'>
        <DialogHeader>
          <DialogTitle>Chi tiết Hoá đơn #{invoice.Id}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hoá đơn và sản phẩm
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Invoice Info */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-gray-500'>Mã đơn</p>
              <p className='text-base font-semibold text-gray-900'>
                #{invoice.Id}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Trạng thái</p>
              <div className='mt-1'>{getStatusBadge(invoice.Status)}</div>
            </div>
            <div className='col-span-2'>
              <p className='text-sm font-medium text-gray-500'>
                Địa chỉ giao hàng
              </p>
              <p className='text-base text-gray-900'>{invoice.Address}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Ngày tạo</p>
              <p className='text-base text-gray-900'>
                {formatDateTime(invoice.CreateAt)}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Mã thanh toán</p>
              <p className='text-base text-gray-900 truncate'>
                {invoice.PaymentIntentId || 'N/A'}
              </p>
            </div>
          </div>

          {invoice.Notes && (
            <div>
              <p className='text-sm font-medium text-gray-500'>Ghi chú</p>
              <p className='text-base text-gray-900 mt-1'>{invoice.Notes}</p>
            </div>
          )}

          <Separator />

          {/* Items Table */}
          <div>
            <h3 className='text-lg font-semibold mb-3'>Sản phẩm</h3>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã loại sản phẩm</TableHead>
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
          </div>

          <Separator />

          {/* Total */}
          <div className='flex justify-between items-center'>
            <p className='text-lg font-semibold text-gray-900'>Tổng cộng:</p>
            <p className='text-2xl font-bold text-blue-600'>
              {formatCurrency(invoice.Total)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
