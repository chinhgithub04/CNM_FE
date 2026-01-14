import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useCreateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { ProductBasicInfoForm } from '@/components/features/products/ProductBasicInfoForm';
import { ProductImagesUpload } from '@/components/features/products/ProductImagesUpload';
import {
  ProductVariantsForm,
  type ProductVariant,
} from '@/components/features/products/ProductVariantsForm';

interface FormData {
  Name: string;
  Description: string;
  CategoryId: number | undefined;
  Status: number;
}

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const createProductMutation = useCreateProduct();

  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>(
    []
  );
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: '1',
      Name: '',
      Quantity: 0,
      Price: '',
      Image: null,
      imagePreview: null,
    },
  ]);

  const {
    register,
    handleSubmit,
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

  const categoryId = watch('CategoryId');
  const status = watch('Status');
  const description = watch('Description');

  const categories = categoriesData?.data || [];

  // Handle product images
  const handleProductImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProductImages([...productImages, ...files]);

      // Generate previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeProductImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
    setProductImagePreviews(productImagePreviews.filter((_, i) => i !== index));
  };

  // Handle variants
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        Name: '',
        Quantity: 0,
        Price: '',
        Image: null,
        imagePreview: null,
      },
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  const updateVariant = (
    id: string,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleVariantImageChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setVariants(
          variants.map((v) =>
            v.id === id
              ? { ...v, Image: file, imagePreview: reader.result as string }
              : v
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.CategoryId) {
      alert('Vui lòng chọn danh mục');
      return;
    }

    if (productImages.length === 0) {
      alert('Vui lòng thêm ít nhất một hình ảnh sản phẩm');
      return;
    }

    // Validate variants
    for (const variant of variants) {
      if (!variant.Name.trim()) {
        alert('Vui lòng nhập tên cho tất cả các loại sản phẩm');
        return;
      }
      if (variant.Quantity <= 0) {
        alert('Số lượng phải lớn hơn 0');
        return;
      }
      if (!variant.Price || parseFloat(variant.Price) <= 0) {
        alert('Giá phải lớn hơn 0');
        return;
      }
      if (!variant.Image) {
        alert('Vui lòng thêm hình ảnh cho tất cả các loại sản phẩm');
        return;
      }
    }

    try {
      // Create FormData matching backend API
      const formData = new FormData();
      formData.append('Name', data.Name);
      formData.append('Description', data.Description);
      formData.append('CategoryId', data.CategoryId.toString());
      formData.append('Status', data.Status.toString());

      // Add product images
      productImages.forEach((file) => {
        formData.append('Images', file);
      });

      // Add variant data
      variants.forEach((variant) => {
        formData.append('ProductTypeNames', variant.Name);
        formData.append('ProductTypeQuantities', variant.Quantity.toString());
        formData.append('ProductTypePrices', variant.Price);
        if (variant.Image) {
          formData.append('ProductTypeImages', variant.Image);
        }
      });

      await createProductMutation.mutateAsync(formData as any);
      navigate('/admin/products');
    } catch (error) {
      console.error('Create product error:', error);
    }
  };

  if (isLoadingCategories) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <p className='text-gray-500'>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Tạo Sản phẩm mới</h1>
        <Button variant='outline' onClick={() => navigate('/admin/products')}>
          <X className='w-4 h-4 mr-2' />
          Hủy
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Basic Information */}
        <ProductBasicInfoForm
          register={register}
          errors={errors}
          categories={categories}
          categoryId={categoryId}
          status={status}
          description={description}
          onCategoryChange={(value) => setValue('CategoryId', parseInt(value))}
          onStatusChange={(value) => setValue('Status', parseInt(value))}
          onDescriptionChange={(value) => setValue('Description', value)}
        />

        {/* Product Images */}
        <ProductImagesUpload
          productImages={productImages}
          productImagePreviews={productImagePreviews}
          onImagesChange={handleProductImagesChange}
          onRemoveImage={removeProductImage}
        />

        {/* Product Variants */}
        <ProductVariantsForm
          variants={variants}
          onAddVariant={addVariant}
          onRemoveVariant={removeVariant}
          onUpdateVariant={updateVariant}
          onVariantImageChange={handleVariantImageChange}
        />

        {/* Submit Button */}
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/admin/products')}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            disabled={createProductMutation.isPending}
            size='lg'
          >
            {createProductMutation.isPending ? 'Đang tạo...' : 'Tạo sản phẩm'}
          </Button>
        </div>
      </form>
    </div>
  );
}
