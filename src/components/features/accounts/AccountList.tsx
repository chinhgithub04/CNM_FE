import { useState } from 'react';
import { Pencil, UserCheck, UserX } from 'lucide-react';
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
import { useToggleUserStatus } from '@/hooks/useUsers';
import type { User } from '@/types/user';
import { AccountFormDialog } from '@/components/features/accounts/AccountFormDialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface AccountListProps {
  users: User[];
}

export function AccountList({ users }: AccountListProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleStatusMutation = useToggleUserStatus();

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleToggleStatus = async (userId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    await toggleStatusMutation.mutateAsync({ id: userId, status: newStatus });
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
          Hoạt động
        </Badge>
      );
    }
    return (
      <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
        Vô hiệu hóa
      </Badge>
    );
  };

  const getRoleDisplay = (roles: User['Roles']) => {
    if (!roles || roles.length === 0) return 'Người dùng';
    const roleName = roles[0].Name;
    if (roleName === 'Admin') return 'Quản trị viên';
    if (roleName === 'Customer') return 'Người dùng';
    return roleName;
  };

  if (users.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Chưa có tài khoản nào.</p>
      </div>
    );
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tên đăng nhập</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.Id}>
                <TableCell className='font-medium'>{user.FullName}</TableCell>
                <TableCell>{user.Email || 'N/A'}</TableCell>
                <TableCell>{user.UserName || 'N/A'}</TableCell>
                <TableCell>{getRoleDisplay(user.Roles)}</TableCell>
                <TableCell>{getStatusBadge(user.Status)}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(user)}
                      title='Chỉnh sửa'
                    >
                      <Pencil className='h-4 w-4 text-blue-600' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleToggleStatus(user.Id, user.Status)}
                      title={user.Status === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    >
                      {user.Status === 1 ? (
                        <UserX className='h-4 w-4 text-orange-600' />
                      ) : (
                        <UserCheck className='h-4 w-4 text-green-600' />
                      )}
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

      {/* Edit Dialog */}
      <AccountFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={editingUser}
      />
    </>
  );
}
