import { useState } from 'react';
import { Plus, FileText, DollarSign, ShoppingCart } from 'lucide-react';
import { useInvoices, useInvoiceStats } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceList, InvoiceFormDialog } from '@/components/features/invoices';
import { formatCurrency } from '@/lib/formatters';

export default function InvoicesPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const { data, isLoading, error } = useInvoices();
    // const { data: statsData, isLoading: isLoadingStats } = useInvoiceStats(); // Backend endpoint doesn't exist

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

    // Calculate stats from invoices data since backend doesn't have /invoices/stats endpoint
    const stats = {
        totalRevenue: invoices.reduce((sum, inv) => sum + (inv.TotalAmount || 0), 0),
        totalOrders: invoices.length,
        pendingOrders: invoices.filter(inv => inv.Status === 'pending').length,
        completedOrders: invoices.filter(inv => inv.Status === 'delivered').length,
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
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Tạo Hoá đơn
                </Button>
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

            {/* Create Dialog */}
            <InvoiceFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
        </div>
    );
}
