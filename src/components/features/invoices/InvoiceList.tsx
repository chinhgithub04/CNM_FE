import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import type { Invoice } from '@/types/invoice';
import { InvoiceStatusLabels, InvoiceStatusColors } from '@/types/invoice';

interface InvoiceListProps {
  invoices: Invoice[];
  isCustomerView?: boolean;
}

export function InvoiceList({
  invoices,
  isCustomerView = false,
}: InvoiceListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleView = (invoiceId: number) => {
    if (isCustomerView) {
      navigate(`/orders/${invoiceId}`);
    } else {
      navigate(`/admin/invoices/${invoiceId}`);
    }
  };

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

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (invoices.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Chưa có hoá đơn nào.</p>
      </div>
    );
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead className='text-right'>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentInvoices.map((invoice) => (
              <TableRow key={invoice.Id}>
                <TableCell className='font-medium'>#{invoice.Id}</TableCell>
                <TableCell className='max-w-xs truncate'>
                  {invoice.Address}
                </TableCell>
                <TableCell className='text-right font-semibold'>
                  {formatCurrency(invoice.Total)}
                </TableCell>
                <TableCell>{getStatusBadge(invoice.Status)}</TableCell>
                <TableCell>{formatDateTime(invoice.CreateAt)}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleView(invoice.Id)}
                      title='Xem chi tiết'
                    >
                      <Eye className='h-4 w-4 text-gray-600' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
