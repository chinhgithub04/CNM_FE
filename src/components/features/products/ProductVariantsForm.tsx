import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ProductVariant {
  id: string;
  Name: string;
  Quantity: number;
  Price: string;
  Image: File | null;
  imagePreview: string | null;
}

interface ProductVariantsFormProps {
  variants: ProductVariant[];
  onAddVariant: () => void;
  onRemoveVariant: (id: string) => void;
  onUpdateVariant: (
    id: string,
    field: keyof ProductVariant,
    value: any
  ) => void;
  onVariantImageChange: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export function ProductVariantsForm({
  variants,
  onAddVariant,
  onRemoveVariant,
  onUpdateVariant,
  onVariantImageChange,
}: ProductVariantsFormProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Loại sản phẩm</CardTitle>
          <Button type='button' variant='outline' onClick={onAddVariant}>
            <Plus className='w-4 h-4 mr-2' />
            Thêm loại
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {variants.map((variant, index) => (
          <div
            key={variant.id}
            className='p-4 border rounded-lg space-y-4 relative'
          >
            {variants.length > 1 && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute top-2 right-2'
                onClick={() => onRemoveVariant(variant.id)}
              >
                <Trash2 className='w-4 h-4 text-red-600' />
              </Button>
            )}

            <h3 className='font-medium'>Loại {index + 1}</h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label>
                  Tên loại <span className='text-red-500'>*</span>
                </Label>
                <Input
                  value={variant.Name}
                  onChange={(e) =>
                    onUpdateVariant(variant.id, 'Name', e.target.value)
                  }
                  placeholder='VD: Màu đỏ, Size M'
                />
              </div>

              <div className='space-y-2'>
                <Label>
                  Số lượng <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='number'
                  min='1'
                  value={variant.Quantity}
                  onChange={(e) =>
                    onUpdateVariant(
                      variant.id,
                      'Quantity',
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder='0'
                />
              </div>

              <div className='space-y-2'>
                <Label>
                  Giá (VNĐ) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  value={variant.Price}
                  onChange={(e) =>
                    onUpdateVariant(variant.id, 'Price', e.target.value)
                  }
                  placeholder='0'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label>
                Hình ảnh <span className='text-red-500'>*</span>
              </Label>
              {variant.imagePreview ? (
                <div className='flex items-center gap-4'>
                  <img
                    src={variant.imagePreview}
                    alt={variant.Name}
                    className='w-24 h-24 object-cover rounded-lg border'
                  />
                  <label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => onVariantImageChange(variant.id, e)}
                      className='hidden'
                    />
                    <Button type='button' variant='outline' asChild>
                      <span>
                        <Upload className='w-4 h-4 mr-2' />
                        Thay đổi
                      </span>
                    </Button>
                  </label>
                </div>
              ) : (
                <label className='border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => onVariantImageChange(variant.id, e)}
                    className='hidden'
                  />
                  <Upload className='w-6 h-6 text-muted-foreground mb-1' />
                  <p className='text-sm text-muted-foreground'>Tải ảnh lên</p>
                </label>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
