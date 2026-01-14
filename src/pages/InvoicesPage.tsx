import { useState } from 'react';
import { FileText, DollarSign, ShoppingCart } from 'lucide-react';
import { useAllInvoices } from '@/hooks/useInvoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvoiceList } from '@/components/features/invoices';
import { formatCurrency } from '@/lib/formatters';
import { InvoiceStatusLabels } from '@/types/invoice';

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined
  );
  const { data, isLoading, error } = useAllInvoices(statusFilter);
  const { data: allInvoicesData } = useAllInvoices(); // For stats calculation

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

  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-red-600 font-medium'>
                Lỗi khi tải danh sách hoá đơn
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                {error.message || 'Đã xảy ra lỗi không mong muốn'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invoices = data?.data || [];
  const allInvoices = allInvoicesData?.data || [];

  // Calculate stats from ALL invoices (not filtered)
  const stats = {
    totalRevenue: allInvoices.reduce(
      (sum, inv) => sum + Number(inv.Total || 0),
      0
    ),
    totalOrders: allInvoices.length,
    pendingOrders: allInvoices.filter((inv) => inv.Status === 1).length,
    completedOrders: allInvoices.filter((inv) => inv.Status === 4).length,
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Quản lý Hoá đơn</h1>
          <p className='text-gray-600 mt-2'>
            Quản lý hoá đơn và đơn hàng của khách hàng
          </p>
        </div>
        <div className='w-64'>
          <Select
            value={statusFilter?.toString() || 'all'}
            onValueChange={(value) =>
              setStatusFilter(value === 'all' ? undefined : parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Lọc theo trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              {Object.entries(InvoiceStatusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Tổng Doanh thu
            </CardTitle>
            <DollarSign className='h-5 w-5 text-green-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {formatCurrency(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Tổng Đơn hàng
            </CardTitle>
            <ShoppingCart className='h-5 w-5 text-blue-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.totalOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Chờ xử lý
            </CardTitle>
            <FileText className='h-5 w-5 text-yellow-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.pendingOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Hoàn thành
            </CardTitle>
            <FileText className='h-5 w-5 text-green-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.completedOrders}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Hoá đơn ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceList invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  );
}
