// // Component for displaying detailed invoice information
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Badge } from '@/components/ui/badge';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import { formatCurrency, formatDateTime } from '@/lib/formatters';
// import type { Invoice } from '@/types/invoice';
// import { InvoiceStatusLabels, InvoiceStatusColors } from '@/types/invoice';
// import { Separator } from '@/components/ui/separator';

// interface InvoiceDetailDialogProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     invoice: Invoice | null;
// }

// export function InvoiceDetailDialog({
//     open,
//     onOpenChange,
//     invoice,
// }: InvoiceDetailDialogProps) {
//     if (!invoice) return null;

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

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className='sm:max-w-[700px]'>
//                 <DialogHeader>
//                     <DialogTitle>Chi tiết Hoá đơn #{invoice.OrderNumber}</DialogTitle>
//                     <DialogDescription>
//                         Thông tin chi tiết về hoá đơn và sản phẩm
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className='space-y-6'>
//                     {/* Invoice Info */}
//                     <div className='grid grid-cols-2 gap-4'>
//                         <div>
//                             <p className='text-sm font-medium text-gray-500'>Khách hàng</p>
//                             <p className='text-base font-semibold text-gray-900'>
//                                 {invoice.CustomerName}
//                             </p>
//                         </div>
//                         <div>
//                             <p className='text-sm font-medium text-gray-500'>Email</p>
//                             <p className='text-base text-gray-900'>
//                                 {invoice.CustomerEmail || 'N/A'}
//                             </p>
//                         </div>
//                         <div>
//                             <p className='text-sm font-medium text-gray-500'>Trạng thái</p>
//                             <div className='mt-1'>{getStatusBadge(invoice.Status)}</div>
//                         </div>
//                         <div>
//                             <p className='text-sm font-medium text-gray-500'>Ngày tạo</p>
//                             <p className='text-base text-gray-900'>
//                                 {formatDateTime(invoice.CreatedAt)}
//                             </p>
//                         </div>
//                     </div>

//                     {invoice.Notes && (
//                         <div>
//                             <p className='text-sm font-medium text-gray-500'>Ghi chú</p>
//                             <p className='text-base text-gray-900 mt-1'>{invoice.Notes}</p>
//                         </div>
//                     )}

//                     <Separator />

//                     {/* Items Table */}
//                     <div>
//                         <h3 className='text-lg font-semibold mb-3'>Sản phẩm</h3>
//                         <div className='rounded-md border'>
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>Tên sản phẩm</TableHead>
//                                         <TableHead>Loại</TableHead>
//                                         <TableHead className='text-center'>Số lượng</TableHead>
//                                         <TableHead className='text-right'>Đơn giá</TableHead>
//                                         <TableHead className='text-right'>Thành tiền</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {invoice.Items.map((item) => (
//                                         <TableRow key={item.Id}>
//                                             <TableCell className='font-medium'>
//                                                 {item.ProductName}
//                                             </TableCell>
//                                             <TableCell>{item.ProductTypeName || 'N/A'}</TableCell>
//                                             <TableCell className='text-center'>
//                                                 {item.Quantity}
//                                             </TableCell>
//                                             <TableCell className='text-right'>
//                                                 {formatCurrency(item.Price)}
//                                             </TableCell>
//                                             <TableCell className='text-right font-semibold'>
//                                                 {formatCurrency(item.SubTotal)}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </div>
//                     </div>

//                     <Separator />

//                     {/* Total */}
//                     <div className='flex justify-between items-center'>
//                         <p className='text-lg font-semibold text-gray-900'>Tổng cộng:</p>
//                         <p className='text-2xl font-bold text-blue-600'>
//                             {formatCurrency(invoice.TotalAmount)}
//                         </p>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
