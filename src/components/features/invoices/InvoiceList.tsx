// import { useState } from 'react';
// import { Eye, Pencil, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { useDeleteInvoice } from '@/hooks/useInvoices';
// import { formatCurrency, formatDateTime } from '@/lib/formatters';
// import type { Invoice } from '@/types/invoice';
// import { InvoiceStatusLabels, InvoiceStatusColors } from '@/types/invoice';
// import { InvoiceDetailDialog } from '@/components/features/invoices/InvoiceDetailDialog';
// import { InvoiceFormDialog } from '@/components/features/invoices/InvoiceFormDialog';

// interface InvoiceListProps {
//     invoices: Invoice[];
// }

// export function InvoiceList({ invoices }: InvoiceListProps) {
//     const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
//     const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
//     const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//     const [deletingInvoiceId, setDeletingInvoiceId] = useState<number | null>(
//         null
//     );

//     const deleteInvoiceMutation = useDeleteInvoice();

//     const handleView = (invoice: Invoice) => {
//         setViewingInvoice(invoice);
//         setIsDetailDialogOpen(true);
//     };

//     const handleEdit = (invoice: Invoice) => {
//         setEditingInvoice(invoice);
//         setIsEditDialogOpen(true);
//     };

//     const handleDelete = async () => {
//         if (deletingInvoiceId) {
//             await deleteInvoiceMutation.mutateAsync(deletingInvoiceId);
//             setDeletingInvoiceId(null);
//         }
//     };

//     const getStatusBadge = (status: Invoice['Status']) => {
//         const label = InvoiceStatusLabels[status];
//         const color = InvoiceStatusColors[status];

//         const colorClasses = {
//             yellow: 'bg-yellow-100 text-yellow-800',
//             blue: 'bg-blue-100 text-blue-800',
//             green: 'bg-green-100 text-green-800',
//             purple: 'bg-purple-100 text-purple-800',
//             cyan: 'bg-cyan-100 text-cyan-800',
//             red: 'bg-red-100 text-red-800',
//         };

//         return (
//             <Badge className={`${colorClasses[color]} hover:${colorClasses[color]}`}>
//                 {label}
//             </Badge>
//         );
//     };

//     if (invoices.length === 0) {
//         return (
//             <div className='text-center py-12'>
//                 <p className='text-gray-500'>Chưa có hoá đơn nào.</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className='rounded-md border'>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Mã đơn</TableHead>
//                             <TableHead>Khách hàng</TableHead>
//                             <TableHead>Email</TableHead>
//                             <TableHead className='text-right'>Tổng tiền</TableHead>
//                             <TableHead>Trạng thái</TableHead>
//                             <TableHead>Ngày tạo</TableHead>
//                             <TableHead className='text-right'>Thao tác</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {invoices.map((invoice) => (
//                             <TableRow key={invoice.Id}>
//                                 <TableCell className='font-medium'>
//                                     {invoice.OrderNumber}
//                                 </TableCell>
//                                 <TableCell>{invoice.CustomerName}</TableCell>
//                                 <TableCell>{invoice.CustomerEmail || 'N/A'}</TableCell>
//                                 <TableCell className='text-right font-semibold'>
//                                     {formatCurrency(invoice.TotalAmount)}
//                                 </TableCell>
//                                 <TableCell>{getStatusBadge(invoice.Status)}</TableCell>
//                                 <TableCell>{formatDateTime(invoice.CreatedAt)}</TableCell>
//                                 <TableCell className='text-right'>
//                                     <div className='flex justify-end gap-2'>
//                                         <Button
//                                             variant='ghost'
//                                             size='sm'
//                                             onClick={() => handleView(invoice)}
//                                             title='Xem chi tiết'
//                                         >
//                                             <Eye className='h-4 w-4 text-gray-600' />
//                                         </Button>
//                                         <Button
//                                             variant='ghost'
//                                             size='sm'
//                                             onClick={() => handleEdit(invoice)}
//                                             title='Chỉnh sửa'
//                                         >
//                                             <Pencil className='h-4 w-4 text-blue-600' />
//                                         </Button>
//                                         <Button
//                                             variant='ghost'
//                                             size='sm'
//                                             onClick={() => setDeletingInvoiceId(invoice.Id)}
//                                             title='Xóa'
//                                         >
//                                             <Trash2 className='h-4 w-4 text-red-600' />
//                                         </Button>
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* Detail Dialog */}
//             <InvoiceDetailDialog
//                 open={isDetailDialogOpen}
//                 onOpenChange={setIsDetailDialogOpen}
//                 invoice={viewingInvoice}
//             />

//             {/* Edit Dialog */}
//             <InvoiceFormDialog
//                 open={isEditDialogOpen}
//                 onOpenChange={setIsEditDialogOpen}
//                 invoice={editingInvoice}
//             />

//             {/* Delete Confirmation Dialog */}
//             <AlertDialog
//                 open={!!deletingInvoiceId}
//                 onOpenChange={() => setDeletingInvoiceId(null)}
//             >
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             Bạn có chắc chắn muốn xóa hoá đơn này? Hành động này không thể
//                             hoàn tác.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Hủy</AlertDialogCancel>
//                         <AlertDialogAction
//                             onClick={handleDelete}
//                             className='bg-red-600 hover:bg-red-700'
//                         >
//                             Xóa
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </>
//     );
// }
