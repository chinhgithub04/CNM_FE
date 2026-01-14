import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
} from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { buildCloudinaryUrl } from '@/utils/cloudinary';
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

export default function CreateUpdateProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: productData, isLoading: isLoadingProduct } = useProduct(
    id ? parseInt(id) : 0
  );
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>(
    []
  );
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
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
    reset,
    formState: { errors, isDirty },
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

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && productData?.data) {
      const product = productData.data;

      // Reset form with new data to clear dirty state
      reset({
        Name: product.Name,
        Description: product.Description || '',
        CategoryId: product.CategoryId,
        Status: product.Status,
      });

      // Set product images from existing URLs
      if (product.Images && product.Images.length > 0) {
        const imagePreviews = product.Images.map(
          (img) => buildCloudinaryUrl(img.Url, { width: 400 }) || img.Url
        );
        const originalUrls = product.Images.map((img) => img.Url);
        setProductImagePreviews(imagePreviews);
        setExistingImageUrls(originalUrls);
        setProductImages([]);
      } else {
        setProductImagePreviews([]);
        setExistingImageUrls([]);
        setProductImages([]);
      }

      // Set variants from existing data
      if (product.ProductTypes && product.ProductTypes.length > 0) {
        const existingVariants = product.ProductTypes.map((type) => {
          const price = type.price_item?.Price || type.Price || 0;
          return {
            id: `existing-${type.Id}`,
            Name: type.Name,
            Quantity: type.Quantity,
            Price: price.toString(),
            Image: null,
            imagePreview: type.ImageUrl
              ? buildCloudinaryUrl(type.ImageUrl, { width: 200 }) ||
                type.ImageUrl
              : null,
          };
        });
        setVariants(existingVariants);
      } else {
        setVariants([
          {
            id: '1',
            Name: '',
            Quantity: 0,
            Price: '',
            Image: null,
            imagePreview: null,
          },
        ]);
      }
    } else if (!isEditMode) {
      // Reset to initial state for create mode
      reset({
        Name: '',
        Description: '',
        CategoryId: undefined,
        Status: 1,
      });
      setProductImages([]);
      setProductImagePreviews([]);
      setExistingImageUrls([]);
      setVariants([
        {
          id: '1',
          Name: '',
          Quantity: 0,
          Price: '',
          Image: null,
          imagePreview: null,
        },
      ]);
    }
  }, [isEditMode, productData, reset]);

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
    // Check if this is an existing image or new image
    if (index < existingImageUrls.length) {
      // Removing an existing image
      setExistingImageUrls(existingImageUrls.filter((_, i) => i !== index));
    } else {
      // Removing a new image
      const newImageIndex = index - existingImageUrls.length;
      setProductImages(productImages.filter((_, i) => i !== newImageIndex));
    }
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

  // Utility function to convert URL to File
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
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

    // In create mode, check productImages. In edit mode, check productImagePreviews
    if (isEditMode) {
      if (productImagePreviews.length === 0) {
        alert('Vui lòng thêm ít nhất một hình ảnh sản phẩm');
        return;
      }
    } else {
      if (productImages.length === 0) {
        alert('Vui lòng thêm ít nhất một hình ảnh sản phẩm');
        return;
      }
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
      // In edit mode, existing variants have imagePreview but no Image file
      // In create mode, all variants must have Image
      const isExistingVariant = variant.id.startsWith('existing-');
      if (!variant.Image && !variant.imagePreview) {
        alert('Vui lòng thêm hình ảnh cho tất cả các loại sản phẩm');
        return;
      }
      if (!isEditMode && !variant.Image) {
        alert('Vui lòng thêm hình ảnh cho tất cả các loại sản phẩm');
        return;
      }
    }

    try {
      if (isEditMode) {
        // Update mode - only send changed fields
        const formData = new FormData();

        // Only append changed basic fields
        if (data.Name !== productData?.data?.Name) {
          formData.append('Name', data.Name);
        }
        if (data.Description !== (productData?.data?.Description || '')) {
          formData.append('Description', data.Description);
        }
        if (data.CategoryId !== productData?.data?.CategoryId) {
          formData.append('CategoryId', data.CategoryId.toString());
        }
        if (data.Status !== productData?.data?.Status) {
          formData.append('Status', data.Status.toString());
        }

        // Add product images (existing + new) if any changes
        if (productImages.length > 0 || existingImageUrls.length !== productData?.data?.Images?.length) {
          try {
            // First, convert existing image URLs to Files
            const existingImageFiles = await Promise.all(
              existingImageUrls.map((url, index) =>
                urlToFile(url, `existing-image-${index}.jpg`)
              )
            );
            
            // Append existing images first
            existingImageFiles.forEach((file) => {
              formData.append('Images', file);
            });
            
            // Then append new images
            productImages.forEach((file) => {
              formData.append('Images', file);
            });
          } catch (error) {
            console.error('Error converting images:', error);
            alert('Lỗi khi xử lý hình ảnh. Vui lòng thử lại.');
            return;
          }
        }

        // Add variant data if changed
        const hasVariantChanges = variants.some(
          (v) => v.id.startsWith('existing-') === false || v.Image !== null
        );
        if (hasVariantChanges) {
          variants.forEach((variant) => {
            formData.append('ProductTypeNames', variant.Name);
            formData.append(
              'ProductTypeQuantities',
              variant.Quantity.toString()
            );
            formData.append('ProductTypePrices', variant.Price);
            if (variant.Image) {
              formData.append('ProductTypeImages', variant.Image);
            }
          });
        }

        await updateProductMutation.mutateAsync({
          id: parseInt(id!),
          data: formData as any,
        });
      } else {
        // Create mode - send all data
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
      }
      navigate('/admin/products');
    } catch (error) {}
  };

  if (isLoadingCategories || (isEditMode && isLoadingProduct)) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <p className='text-gray-500'>Đang tải...</p>
      </div>
    );
  }

  // Check if form has changes (dirty fields)
  const hasVariantChanges = () => {
    if (!isEditMode) return false;
    // Check if there are new variants
    const hasNewVariants = variants.some((v) => !v.id.startsWith('existing-'));
    // Check if any existing variant has a new Image file
    const hasNewVariantImages = variants.some((v) => v.Image !== null);
    return hasNewVariants || hasNewVariantImages;
  };

  const hasChanges = isDirty || productImages.length > 0 || hasVariantChanges();

  const isPending =
    createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>
          {isEditMode ? 'Chỉnh sửa Sản phẩm' : 'Tạo Sản phẩm mới'}
        </h1>
        <Button
          variant='outline'
          onClick={() => {
            navigate('/admin/products');
          }}
        >
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
          onCategoryChange={(value) => {
            const parsed = parseInt(value);
            if (!isNaN(parsed)) {
              setValue('CategoryId', parsed, { shouldDirty: true });
            }
          }}
          onStatusChange={(value) =>
            setValue('Status', parseInt(value), { shouldDirty: true })
          }
          onDescriptionChange={(value) => {
            setValue('Description', value, { shouldDirty: true });
          }}
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
            disabled={isPending || (isEditMode && !hasChanges)}
            size='lg'
          >
            {isPending
              ? isEditMode
                ? 'Đang lưu...'
                : 'Đang tạo...'
              : isEditMode
              ? 'Lưu thay đổi'
              : 'Tạo sản phẩm'}
          </Button>
        </div>
      </form>
    </div>
  );
}
