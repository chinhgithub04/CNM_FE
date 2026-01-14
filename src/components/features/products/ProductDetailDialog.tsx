import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categoryName?: string;
}

export function ProductDetailDialog({
  open,
  onOpenChange,
  product,
  categoryName,
}: ProductDetailDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Chi tiết Sản phẩm</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Product Info */}
          <div className='space-y-2'>
            <div>
              <span className='font-semibold'>Tên sản phẩm: </span>
              <span>{product.Name}</span>
            </div>
            <div>
              <span className='font-semibold'>Mô tả: </span>
              {product.Description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.Description }}
                  className='prose prose-sm max-w-none mt-2'
                />
              ) : (
                <span>Không có</span>
              )}
            </div>
            <div>
              <span className='font-semibold'>Danh mục: </span>
              <span>{categoryName || 'Không xác định'}</span>
            </div>
            <div>
              <span className='font-semibold'>Trạng thái: </span>
              <Badge variant={product.Status === 1 ? 'default' : 'secondary'}>
                {product.Status === 1 ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>
            <div>
              <span className='font-semibold'>Ngày tạo: </span>
              <span>
                {new Date(product.CreateAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Product Types */}
          {product.ProductTypes && product.ProductTypes.length > 0 && (
            <div>
              <h3 className='font-semibold mb-2'>Các loại sản phẩm:</h3>
              <div className='space-y-2'>
                {product.ProductTypes.map((type) => (
                  <div key={type.Id} className='p-3 border rounded-md'>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium'>{type.Name}</span>
                      <div className='space-x-4 text-sm'>
                        {type.price_item && (
                          <span>
                            Giá: {type.price_item.Price.toLocaleString('vi-VN')}{' '}
                            VNĐ
                          </span>
                        )}
                        <span>Kho: {type.Quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          <div>
            <h3 className='font-semibold mb-2'>Hình ảnh sản phẩm:</h3>

            {/* Image Grid */}
            {product.Images && product.Images.length > 0 ? (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {product.Images.map((image, index) => (
                  <div key={image.Id} className='relative'>
                    <img
                      src={image.Url}
                      alt={`Product ${index + 1}`}
                      className='w-full h-40 object-cover rounded-md border'
                    />
                    {/* Image Number Badge */}
                    <div className='absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded'>
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>Chưa có ảnh nào</p>
            )}
          </div>
        </div>

        <div className='flex justify-end mt-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            <X className='w-4 h-4 mr-2' />
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
