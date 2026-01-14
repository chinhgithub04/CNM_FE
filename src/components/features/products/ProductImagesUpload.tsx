import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductImagesUploadProps {
  productImages: File[];
  productImagePreviews: string[];
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function ProductImagesUpload({
  productImages,
  productImagePreviews,
  onImagesChange,
  onRemoveImage,
}: ProductImagesUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hình ảnh sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          {productImagePreviews.length === 0 ? (
            <label className='border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors'>
              <input
                type='file'
                multiple
                accept='image/*'
                onChange={onImagesChange}
                className='hidden'
              />
              <Plus className='w-8 h-8 text-muted-foreground mb-2' />
              <p className='text-sm text-muted-foreground'>
                Thêm hình ảnh sản phẩm
              </p>
            </label>
          ) : (
            <>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {productImagePreviews.map((preview, index) => (
                  <div key={index} className='relative group'>
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className='w-full h-32 object-cover rounded-lg border'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                      onClick={() => onRemoveImage(index)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>
              <label className='inline-block'>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={onImagesChange}
                  className='hidden'
                />
                <Button type='button' variant='outline' asChild>
                  <span>
                    <Plus className='w-4 h-4 mr-2' />
                    Thêm ảnh khác
                  </span>
                </Button>
              </label>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
