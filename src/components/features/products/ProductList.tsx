import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/types/product';
import { useDeleteProduct } from '@/hooks/useProducts';
import { getProductImage } from '@/utils/cloudinary';
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
import { Badge } from '@/components/ui/badge';
import { ProductDetailDialog } from '@/components/features/products/ProductDetailDialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProductListProps {
  products: Product[];
  categories: Array<{ Id: number; Name: string }>;
}

export function ProductList({ products, categories }: ProductListProps) {
  const navigate = useNavigate();
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
        },
      });
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.Id === categoryId);
    return category?.Name || 'N/A';
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <p className='text-gray-500'>Không tìm thấy sản phẩm nào</p>
        <p className='text-sm text-gray-400 mt-2'>
          Tạo sản phẩm đầu tiên để bắt đầu
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
              <TableHead>Danh mục</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => {
              const imageUrl =
                product.Images && product.Images.length > 0
                  ? getProductImage(product.Images[0].Url)
                  : null;

              return (
                <TableRow key={product.Id}>
                  <TableCell>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.Name}
                        className='w-16 h-16 object-cover rounded-md border'
                      />
                    ) : (
                      <div className='w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs'>
                        Không có ảnh
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='font-medium'>{product.Name}</TableCell>
                  <TableCell>{getCategoryName(product.CategoryId)}</TableCell>
                  <TableCell>{formatShortDate(product.CreateAt)}</TableCell>
                  <TableCell>
                    {product.Status === 1 ? (
                      <Badge variant='default'>Hoạt động</Badge>
                    ) : (
                      <Badge variant='secondary'>Không hoạt động</Badge>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          navigate(`/admin/products/${product.Id}`)
                        }
                        title='Chỉnh sửa'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setDeletingId(product.Id)}
                        title='Xóa'
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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
      {
        /* Detail Dialog */
        <ProductDetailDialog
          open={!!viewingProduct}
          onOpenChange={(open: boolean) => !open && setViewingProduct(null)}
          product={viewingProduct}
          categoryName={
            viewingProduct
              ? getCategoryName(viewingProduct.CategoryId)
              : undefined
          }
        />
      }
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn.
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
