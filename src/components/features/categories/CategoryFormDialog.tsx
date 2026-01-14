import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Category } from '@/types/category';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { getCategoryThumbnail } from '@/utils/cloudinary';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CategoryFormDialogProps {
  category?: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  Name: string;
  Description: string;
  Status: number;
  Image?: FileList;
}

export function CategoryFormDialog({
  category,
  open,
  onOpenChange,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const [imagePreview, setImagePreview] = useState<string | null>(
    getCategoryThumbnail(category?.ImageUrl) || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      Name: category?.Name || '',
      Description: category?.Description || '',
      Status: category?.Status ?? 1,
    },
  });

  const status = watch('Status');
  const imageFile = watch('Image');

  useEffect(() => {
    if (category) {
      reset({
        Name: category.Name,
        Description: category.Description || '',
        Status: category.Status ?? 1,
      });
      setImagePreview(getCategoryThumbnail(category.ImageUrl) || null);
    } else {
      reset({
        Name: '',
        Description: '',
        Status: 1,
      });
      setImagePreview(null);
    }
  }, [category, reset]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const onSubmit = (data: FormData) => {
    if (isEditing) {
      // Update mode
      const updateData: any = {
        Name: data.Name,
        Description: data.Description,
        Status: data.Status,
      };

      // Only include Image if a new file was selected
      if (data.Image && data.Image.length > 0) {
        updateData.Image = data.Image[0];
      }

      updateMutation.mutate(
        { id: category.Id, data: updateData },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
            setImagePreview(null);
          },
        }
      );
    } else {
      // Create mode - Image is required
      if (!data.Image || data.Image.length === 0) {
        return;
      }

      createMutation.mutate(
        {
          Name: data.Name,
          Description: data.Description,
          Status: data.Status,
          Image: data.Image[0],
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
            setImagePreview(null);
          },
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa Danh mục' : 'Tạo Danh mục mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Cập nhật thông tin danh mục bên dưới.'
              : 'Điền thông tin để tạo danh mục mới.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='Name'>
              Tên <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='Name'
              {...register('Name', {
                required: 'Tên danh mục là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên phải có ít nhất 2 ký tự',
                },
                maxLength: {
                  value: 100,
                  message: 'Tên không được vượt quá 100 ký tự',
                },
              })}
              placeholder='Nhập tên danh mục'
              disabled={isPending}
            />
            {errors.Name && (
              <p className='text-sm text-red-600'>{errors.Name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='Description'>
              Mô tả <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='Description'
              {...register('Description', {
                required: 'Mô tả là bắt buộc',
                maxLength: {
                  value: 500,
                  message: 'Mô tả không được vượt quá 500 ký tự',
                },
              })}
              placeholder='Nhập mô tả danh mục'
              disabled={isPending}
            />
            {errors.Description && (
              <p className='text-sm text-red-600'>
                {errors.Description.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='Image'>
              Hình ảnh {!isEditing && <span className='text-red-500'>*</span>}
            </Label>
            <Input
              id='Image'
              type='file'
              accept='image/*'
              className='cursor-pointer'
              {...register('Image', {
                required: isEditing ? false : 'Hình ảnh là bắt buộc',
              })}
              disabled={isPending}
            />
            {errors.Image && (
              <p className='text-sm text-red-600'>{errors.Image.message}</p>
            )}
            {imagePreview && (
              <div className='mt-2'>
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='w-32 h-32 object-cover rounded border'
                />
              </div>
            )}
          </div>

          {/* Status Selector */}
          <div className='space-y-2'>
            <Label htmlFor='Status'>Trạng thái</Label>
            <Select
              value={status?.toString()}
              onValueChange={(value) => setValue('Status', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>Hiện</SelectItem>
                <SelectItem value='0'>Ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending
                ? isEditing
                  ? 'Đang cập nhật...'
                  : 'Đang tạo...'
                : isEditing
                ? 'Cập nhật'
                : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
