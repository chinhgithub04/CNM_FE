import { useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { Product } from '@/types/product';
import { useDeleteProduct } from '@/hooks/useProducts';
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
import { ProductFormDialog } from '@/components/features/products/ProductFormDialog';
import { ProductDetailDialog } from '@/components/features/products/ProductDetailDialog';

interface ProductListProps {
  products: Product[];
  categories: Array<{ Id: number; Name: string }>;
}

export function ProductList({ products, categories }: ProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.Id === categoryId);
    return category?.Name || 'N/A';
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
              <TableHead className='w-[80px]'>Ảnh</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.Id}>
                <TableCell>
                  {product.Images && product.Images.length > 0 ? (
                    <img
                      src={product.Images[0].ImageUrl}
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
                <TableCell>
                  {product.Description || (
                    <span className='text-gray-400 italic'>Không có mô tả</span>
                  )}
                </TableCell>
                <TableCell>{getCategoryName(product.CategoryId)}</TableCell>
                <TableCell>{formatDate(product.CreateAt)}</TableCell>
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
                      onClick={() => setViewingProduct(product)}
                      title='Xem chi tiết'
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setEditingProduct(product)}
                      title='Chỉnh sửa'
                    >
                      <Pencil className='h-4 w-4' />
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {editingProduct && (
        <ProductFormDialog
          product={editingProduct}
          categories={categories}
          open={!!editingProduct}
          onOpenChange={(open: boolean) => !open && setEditingProduct(null)}
        />
      )}

      {/* Detail Dialog */}
      <ProductDetailDialog
        open={!!viewingProduct}
        onOpenChange={(open: boolean) => !open && setViewingProduct(null)}
        product={viewingProduct}
        categoryName={viewingProduct ? getCategoryName(viewingProduct.CategoryId) : undefined}
      />

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
