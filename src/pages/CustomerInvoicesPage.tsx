import { useState } from 'react';
import { FileText, DollarSign, ShoppingCart } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
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

export default function CustomerInvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined
  );
  const { data, isLoading, error } = useInvoices();

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

  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-red-600 font-medium'>
                Lỗi khi tải danh sách đơn hàng
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

  const allInvoices = data?.data || [];

  // Filter invoices by status if filter is applied
  const invoices = statusFilter
    ? allInvoices.filter((inv) => inv.Status === statusFilter)
    : allInvoices;

  // Calculate stats from ALL invoices (not filtered)
  const stats = {
    totalSpent: allInvoices.reduce(
      (sum, inv) => sum + Number(inv.Total || 0),
      0
    ),
    totalOrders: allInvoices.length,
    pendingOrders: allInvoices.filter((inv) => inv.Status === 1).length,
    completedOrders: allInvoices.filter((inv) => inv.Status === 4).length,
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Đơn hàng của tôi
            </h1>
            <p className='text-gray-600 mt-2'>
              Quản lý và theo dõi đơn hàng của bạn
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
                Tổng chi tiêu
              </CardTitle>
              <DollarSign className='h-5 w-5 text-green-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900'>
                {formatCurrency(stats.totalSpent)}
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
            <CardTitle>Danh sách Đơn hàng ({invoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceList invoices={invoices} isCustomerView={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
