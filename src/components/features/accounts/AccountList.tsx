// import { useState } from 'react';
// import { Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
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
// import { useDeleteUser, useToggleUserStatus } from '@/hooks/useUsers';
// import { formatDate } from '@/lib/formatters';
// import type { User } from '@/types/user';
// import { AccountFormDialog } from '@/components/features/accounts/AccountFormDialog';

// interface AccountListProps {
//     users: User[];
// }

// export function AccountList({ users }: AccountListProps) {
//     const [editingUser, setEditingUser] = useState<User | null>(null);
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//     const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

//     const deleteUserMutation = useDeleteUser();
//     const toggleStatusMutation = useToggleUserStatus();

//     const handleEdit = (user: User) => {
//         setEditingUser(user);
//         setIsEditDialogOpen(true);
//     };

//     const handleDelete = async () => {
//         if (deletingUserId) {
//             await deleteUserMutation.mutateAsync(deletingUserId);
//             setDeletingUserId(null);
//         }
//     };

//     const handleToggleStatus = async (userId: string, currentStatus: number) => {
//         const newStatus = currentStatus === 1 ? 0 : 1;
//         await toggleStatusMutation.mutateAsync({ id: userId, status: newStatus });
//     };

//     const getStatusBadge = (status: number) => {
//         if (status === 1) {
//             return (
//                 <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
//                     Hoạt động
//                 </Badge>
//             );
//         }
//         return (
//             <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
//                 Vô hiệu hóa
//             </Badge>
//         );
//     };

//     const getRoleDisplay = (roles: User['Roles']) => {
//         if (!roles || roles.length === 0) return 'Người dùng';
//         return roles.map((r) => r.Name).join(', ');
//     };

//     if (users.length === 0) {
//         return (
//             <div className='text-center py-12'>
//                 <p className='text-gray-500'>Chưa có tài khoản nào.</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className='rounded-md border'>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Họ tên</TableHead>
//                             <TableHead>Email</TableHead>
//                             <TableHead>Tên đăng nhập</TableHead>
//                             <TableHead>Vai trò</TableHead>
//                             <TableHead>Trạng thái</TableHead>
//                             <TableHead>Ngày tạo</TableHead>
//                             <TableHead className='text-right'>Thao tác</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {users.map((user) => (
//                             <TableRow key={user.Id}>
//                                 <TableCell className='font-medium'>{user.FullName}</TableCell>
//                                 <TableCell>{user.Email || 'N/A'}</TableCell>
//                                 <TableCell>{user.UserName || 'N/A'}</TableCell>
//                                 <TableCell>{getRoleDisplay(user.Roles)}</TableCell>
//                                 <TableCell>{getStatusBadge(user.Status)}</TableCell>
//                                 <TableCell>
//                                     {user.CreatedAt ? formatDate(user.CreatedAt) : 'N/A'}
//                                 </TableCell>
//                                 <TableCell className='text-right'>
//                                     <div className='flex justify-end gap-2'>
//                                         <Button
//                                             variant='ghost'
//                                             size='sm'
//                                             onClick={() =>
//                                                 handleToggleStatus(user.Id, user.Status)
//                                             }
//                                             title={
//                                                 user.Status === 1
//                                                     ? 'Vô hiệu hóa'
//                                                     : 'Kích hoạt'
//                                             }
//                                         >
//                                             {user.Status === 1 ? (
//                                                 <UserX className='h-4 w-4 text-orange-600' />
//                                             ) : (
//                                                 <UserCheck className='h-4 w-4 text-green-600' />
//                                             )}
//                                         </Button>
//                                         <Button
//                                             variant='ghost'
//                                             size='sm'
//                                             onClick={() => handleEdit(user)}
//                                         >
//                                             <Pencil className='h-4 w-4 text-blue-600' />
//                                         </Button>
//                                         <Button
//                                             variant='ghost'
//                                             size='sm'
//                                             onClick={() => setDeletingUserId(user.Id)}
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

//             {/* Edit Dialog */}
//             <AccountFormDialog
//                 open={isEditDialogOpen}
//                 onOpenChange={setIsEditDialogOpen}
//                 user={editingUser}
//             />

//             {/* Delete Confirmation Dialog */}
//             <AlertDialog
//                 open={!!deletingUserId}
//                 onOpenChange={() => setDeletingUserId(null)}
//             >
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể
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
