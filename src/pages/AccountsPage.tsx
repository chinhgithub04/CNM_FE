// import { useState } from 'react';
// import { Plus, Users } from 'lucide-react';
// import { useUsers } from '@/hooks/useUsers';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { AccountList, AccountFormDialog } from '@/components/features/accounts';

export default function AccountsPage() {
  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // const { data, isLoading, error } = useUsers();
  // if (isLoading) {
  //     return (
  //         <div className='flex items-center justify-center py-12'>
  //             <div className='text-center'>
  //                 <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
  //                 <p className='mt-4 text-gray-600'>Đang tải tài khoản...</p>
  //             </div>
  //         </div>
  //     );
  // }
  // if (error) {
  //     return (
  //         <div className='flex items-center justify-center py-12'>
  //             <Card className='w-full max-w-md'>
  //                 <CardContent className='pt-6'>
  //                     <div className='text-center'>
  //                         <p className='text-red-600 font-medium'>
  //                             Lỗi khi tải danh sách tài khoản
  //                         </p>
  //                         <p className='text-sm text-gray-500 mt-2'>
  //                             {error.message || 'Đã xảy ra lỗi không mong muốn'}
  //                         </p>
  //                     </div>
  //                 </CardContent>
  //             </Card>
  //         </div>
  //     );
  // }
  // const users = data?.data || [];
  // return (
  //     <div className='space-y-6'>
  //         <div className='flex items-center justify-between'>
  //             <div>
  //                 <h1 className='text-3xl font-bold text-gray-900'>Quản lý Tài khoản</h1>
  //                 <p className='text-gray-600 mt-2'>
  //                     Quản lý tài khoản người dùng trong hệ thống
  //                 </p>
  //             </div>
  //             <Button onClick={() => setIsCreateDialogOpen(true)}>
  //                 <Plus className='mr-2 h-4 w-4' />
  //                 Thêm Tài khoản
  //             </Button>
  //         </div>
  //         {/* Statistics */}
  //         <div className='grid gap-4 md:grid-cols-3'>
  //             <Card>
  //                 <CardHeader className='flex flex-row items-center justify-between pb-2'>
  //                     <CardTitle className='text-sm font-medium text-gray-600'>
  //                         Tổng Tài khoản
  //                     </CardTitle>
  //                     <Users className='h-5 w-5 text-gray-400' />
  //                 </CardHeader>
  //                 <CardContent>
  //                     <div className='text-2xl font-bold text-gray-900'>{users.length}</div>
  //                 </CardContent>
  //             </Card>
  //             <Card>
  //                 <CardHeader className='flex flex-row items-center justify-between pb-2'>
  //                     <CardTitle className='text-sm font-medium text-gray-600'>
  //                         Đang hoạt động
  //                     </CardTitle>
  //                     <Users className='h-5 w-5 text-green-400' />
  //                 </CardHeader>
  //                 <CardContent>
  //                     <div className='text-2xl font-bold text-gray-900'>
  //                         {users.filter((u) => u.Status === 1).length}
  //                     </div>
  //                 </CardContent>
  //             </Card>
  //             <Card>
  //                 <CardHeader className='flex flex-row items-center justify-between pb-2'>
  //                     <CardTitle className='text-sm font-medium text-gray-600'>
  //                         Vô hiệu hóa
  //                     </CardTitle>
  //                     <Users className='h-5 w-5 text-red-400' />
  //                 </CardHeader>
  //                 <CardContent>
  //                     <div className='text-2xl font-bold text-gray-900'>
  //                         {users.filter((u) => u.Status === 0).length}
  //                     </div>
  //                 </CardContent>
  //             </Card>
  //         </div>
  //         {/* User List */}
  //         <Card>
  //             <CardHeader>
  //                 <CardTitle>Danh sách Tài khoản ({users.length})</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //                 <AccountList users={users} />
  //             </CardContent>
  //         </Card>
  //         {/* Create Dialog */}
  //         <AccountFormDialog
  //             open={isCreateDialogOpen}
  //             onOpenChange={setIsCreateDialogOpen}
  //         />
  //     </div>
  // );
}
