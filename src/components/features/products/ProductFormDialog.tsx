import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { Product, CreateProductRequest, UpdateProductRequest, ProductTypeInput } from '@/types/product';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/formatters';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  categories: Array<{ Id: number; Name: string }>;
}

interface FormData {
  Name: string;
  Description: string;
  CategoryId: number | undefined;
  Status: number;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
}: ProductFormDialogProps) {
  const [productTypes, setProductTypes] = useState<ProductTypeInput[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      Name: '',
      Description: '',
      CategoryId: undefined,
      Status: 1,
    },
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const categoryId = watch('CategoryId');
  const status = watch('Status');

  useEffect(() => {
    if (product) {
      reset({
        Name: product.Name,
        Description: product.Description || '',
        CategoryId: product.CategoryId,
        Status: product.Status,
      });
      // For edit mode, we don't populate ProductTypes since backend doesn't support updating them
      setProductTypes([]);
    } else {
      reset({
        Name: '',
        Description: '',
        CategoryId: undefined,
        Status: 1,
      });
      // Start with one empty product type for create mode
      setProductTypes([
        {
          Name: '',
          Quantity: 0,
          ImageUrl: '',
          Price: 0,
          Number: 1,
        },
      ]);
    }
  }, [product, reset, open]);

  const addProductType = () => {
    setProductTypes([
      ...productTypes,
      {
        Name: '',
        Quantity: 0,
        ImageUrl: '',
        Price: 0,
        Number: productTypes.length + 1,
      },
    ]);
  };

  const removeProductType = (index: number) => {
    setProductTypes(productTypes.filter((_, i) => i !== index));
  };

  const updateProductType = (
    index: number,
    field: keyof ProductTypeInput,
    value: string | number
  ) => {
    const newProductTypes = [...productTypes];
    newProductTypes[index] = {
      ...newProductTypes[index],
      [field]: value,
    };
    setProductTypes(newProductTypes);
  };

  const onSubmit = (data: FormData) => {
    if (!data.CategoryId) {
      alert('Vui lòng chọn danh mục');
      return;
    }

    if (product) {
      // Update mode
      const updateData: UpdateProductRequest = {
        Name: data.Name,
        Description: data.Description,
        CategoryId: data.CategoryId,
        Status: data.Status,
      };

      updateProduct.mutate(
        { id: product.Id, data: updateData },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } else {
      // Create mode - validate ProductTypes
      if (productTypes.length === 0) {
        alert('Vui lòng thêm ít nhất một loại sản phẩm');
        return;
      }

      // Validate all product types have required fields
      const hasEmptyFields = productTypes.some(
        (pt) => !pt.Name || pt.Quantity <= 0 || pt.Price <= 0
      );

      if (hasEmptyFields) {
        alert('Vui lòng điền đầy đủ thông tin cho tất cả loại sản phẩm');
        return;
      }

      const createData: CreateProductRequest = {
        Name: data.Name,
        Description: data.Description,
        CreateAt: new Date().toISOString(), // Current datetime
        CategoryId: data.CategoryId,
        Status: data.Status || 1,
        ProductTypes: productTypes,
      };

      createProduct.mutate(createData, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          setProductTypes([]);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {product ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Product Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>
              Tên sản phẩm <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              {...register('Name', {
                required: 'Tên sản phẩm là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên sản phẩm phải có ít nhất 2 ký tự',
                },
              })}
              placeholder='Nhập tên sản phẩm'
            />
            {errors.Name && (
              <p className='text-sm text-red-500'>{errors.Name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>
              Mô tả <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='description'
              {...register('Description', {
                required: 'Mô tả là bắt buộc',
              })}
              placeholder='Nhập mô tả sản phẩm'
            />
            {errors.Description && (
              <p className='text-sm text-red-500'>{errors.Description.message}</p>
            )}
          </div>

          {/* Category */}
          <div className='space-y-2'>
            <Label htmlFor='category'>
              Danh mục <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={categoryId?.toString()}
              onValueChange={(value: string) => setValue('CategoryId', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn danh mục' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.Id} value={category.Id.toString()}>
                    {category.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!categoryId && (
              <p className='text-sm text-red-500'>Danh mục là bắt buộc</p>
            )}
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <Label htmlFor='status'>Trạng thái</Label>
            <Select
              value={status?.toString()}
              onValueChange={(value: string) => setValue('Status', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>Hoạt động</SelectItem>
                <SelectItem value='0'>Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Types - Only for Create Mode */}
          {!product && (
            <div className='space-y-2 border-t pt-4'>
              <div className='flex justify-between items-center'>
                <Label>
                  Loại sản phẩm <span className='text-red-500'>* (Tối thiểu 1)</span>
                </Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addProductType}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Thêm loại
                </Button>
              </div>

              <div className='space-y-3 max-h-60 overflow-y-auto border rounded-md p-2'>
                {productTypes.length === 0 ? (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    Chưa có loại sản phẩm nào. Click "Thêm loại" để thêm.
                  </p>
                ) : (
                  productTypes.map((pt, index) => (
                    <div
                      key={index}
                      className='flex gap-2 items-end border-b pb-2 last:border-b-0'
                    >
                      {/* Name */}
                      <div className='flex-1'>
                        <Label className='text-xs'>Tên loại *</Label>
                        <Input
                          className='h-9'
                          value={pt.Name}
                          onChange={(e) =>
                            updateProductType(index, 'Name', e.target.value)
                          }
                          placeholder='VD: Size M, Màu đỏ'
                        />
                      </div>

                      {/* Quantity */}
                      <div className='w-24'>
                        <Label className='text-xs'>Số lượng *</Label>
                        <Input
                          type='number'
                          min='0'
                          className='h-9'
                          value={pt.Quantity}
                          onChange={(e) =>
                            updateProductType(
                              index,
                              'Quantity',
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>

                      {/* Price */}
                      <div className='w-32'>
                        <Label className='text-xs'>Giá (VNĐ) *</Label>
                        <Input
                          type='number'
                          min='0'
                          className='h-9'
                          value={pt.Price}
                          onChange={(e) =>
                            updateProductType(
                              index,
                              'Price',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>

                      {/* ImageUrl */}
                      <div className='flex-1'>
                        <Label className='text-xs'>URL ảnh</Label>
                        <Input
                          className='h-9'
                          value={pt.ImageUrl}
                          onChange={(e) =>
                            updateProductType(index, 'ImageUrl', e.target.value)
                          }
                          placeholder='https://...'
                        />
                      </div>

                      {/* Delete Button */}
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='h-9'
                        onClick={() => removeProductType(index)}
                        disabled={productTypes.length === 1}
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* Total calculation preview */}
              {productTypes.length > 0 && (
                <div className='bg-gray-50 p-2 rounded text-sm'>
                  <strong>Tổng số lượng:</strong>{' '}
                  {productTypes.reduce((sum, pt) => sum + (pt.Quantity || 0), 0)} |{' '}
                  <strong>Giá thấp nhất:</strong>{' '}
                  {formatCurrency(
                    Math.min(...productTypes.map((pt) => pt.Price || 0))
                  )}{' '}
                  | <strong>Giá cao nhất:</strong>{' '}
                  {formatCurrency(
                    Math.max(...productTypes.map((pt) => pt.Price || 0))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Note for Edit Mode */}
          {product && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3'>
              <p className='text-sm text-yellow-800'>
                <strong>Lưu ý:</strong> Chỉnh sửa loại sản phẩm (ProductTypes) chưa được hỗ trợ.
                Bạn chỉ có thể cập nhật thông tin cơ bản của sản phẩm.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className='flex justify-end space-x-2 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={
                createProduct.isPending ||
                updateProduct.isPending ||
                !categoryId
              }
            >
              {createProduct.isPending || updateProduct.isPending
                ? 'Đang xử lý...'
                : product
                  ? 'Cập nhật'
                  : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
