import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Category } from '@/types/category';
import { useDeleteCategory } from '@/hooks/useCategories';
import { getCategoryThumbnail } from '@/utils/cloudinary';
import { formatShortDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoryFormDialog } from '@/components/features/categories/CategoryFormDialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const deleteMutation = useDeleteCategory();

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
        },
      });
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (categories.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <p className='text-gray-500'>Không tìm thấy danh mục nào</p>
        <p className='text-sm text-gray-400 mt-2'>
          Tạo danh mục đầu tiên để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='rounded-md border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-20'>Ảnh</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCategories.map((category) => (
              <TableRow key={category.Id}>
                <TableCell>
                  {getCategoryThumbnail(category.ImageUrl) ? (
                    <img
                      src={getCategoryThumbnail(category.ImageUrl)!}
                      alt={category.Name}
                      className='w-16 h-16 object-cover rounded-md border'
                    />
                  ) : (
                    <div className='w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs'>
                      Không có ảnh
                    </div>
                  )}
                </TableCell>
                <TableCell className='font-medium'>{category.Name}</TableCell>
                <TableCell>
                  {category.Description || (
                    <span className='text-gray-400 italic'>Không có mô tả</span>
                  )}
                </TableCell>
                <TableCell>{formatShortDate(category.CreateAt)}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setEditingCategory(category)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setDeletingId(category.Id)}
                    >
                      <Trash2 className='h-4 w-4 text-red-600' />
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
      {editingCategory && (
        <CategoryFormDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open: boolean) => !open && setEditingCategory(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Danh mục sẽ bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeletingId(null)}
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
