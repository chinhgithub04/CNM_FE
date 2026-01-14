import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Category {
  Id: number;
  Name: string;
}

interface FormData {
  Name: string;
  Description: string;
  CategoryId: number | undefined;
  Status: number;
}

interface ProductBasicInfoFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  categories: Category[];
  categoryId: number | undefined;
  status: number;
  description: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function ProductBasicInfoForm({
  register,
  errors,
  categories,
  categoryId,
  status,
  description,
  onCategoryChange,
  onStatusChange,
  onDescriptionChange,
}: ProductBasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='Name'>
            Tên sản phẩm <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='Name'
            {...register('Name', {
              required: 'Tên sản phẩm là bắt buộc',
              minLength: {
                value: 2,
                message: 'Tên phải có ít nhất 2 ký tự',
              },
            })}
            placeholder='Nhập tên sản phẩm'
          />
          {errors.Name && (
            <p className='text-sm text-red-600'>{errors.Name.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='Description'>Mô tả</Label>
          <ReactQuill
            theme='snow'
            value={description}
            onChange={onDescriptionChange}
            placeholder='Nhập mô tả sản phẩm'
            className='bg-white'
            style={{ height: '200px', marginBottom: '55px' }}
          />
          {errors.Description && (
            <p className='text-sm text-red-600'>{errors.Description.message}</p>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='CategoryId'>
              Danh mục <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={categoryId?.toString()}
              onValueChange={onCategoryChange}
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
          </div>

          <div className='space-y-2'>
            <Label htmlFor='Status'>Trạng thái</Label>
            <Select value={status?.toString()} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>Hiện</SelectItem>
                <SelectItem value='0'>Ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
