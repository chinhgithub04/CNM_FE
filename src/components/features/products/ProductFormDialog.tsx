// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Plus, Trash2 } from 'lucide-react';
// import type { Product, UpdateProductRequest } from '@/types/product';
// import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';

// interface ProductFormDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   product?: Product;
//   categories: Array<{ Id: number; Name: string }>;
// }

// interface FormData {
//   Name: string;
//   Description: string;
//   CategoryId: number | undefined;
//   Status: number;
// }

// export function ProductFormDialog({
//   open,
//   onOpenChange,
//   product,
//   categories,
// }: ProductFormDialogProps) {
//   const [productImages, setProductImages] = useState<string[]>(['']);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       Name: '',
//       Description: '',
//       CategoryId: undefined,
//       Status: 1,
//     },
//   });

//   const createProduct = useCreateProduct();
//   const updateProduct = useUpdateProduct();

//   const categoryId = watch('CategoryId');
//   const status = watch('Status');
//   const isEditing = !!product;

//   useEffect(() => {
//     if (product && open) {
//       // Edit mode - populate fields
//       reset({
//         Name: product.Name,
//         Description: product.Description || '',
//         CategoryId: product.CategoryId,
//         Status: product.Status,
//       });

//       // Populate images if available
//       if (product.Images && product.Images.length > 0) {
//         setProductImages(product.Images.map(img => img.ImageUrl));
//       } else {
//         setProductImages(['']);
//       }
//     } else if (open) {
//       // Create mode - reset to empty
//       reset({
//         Name: '',
//         Description: '',
//         CategoryId: undefined,
//         Status: 1,
//       });
//       setProductImages(['']);
//     }
//   }, [product, reset, open]);

//   const addImage = () => {
//     setProductImages([...productImages, '']);
//   };

//   const removeImage = (index: number) => {
//     if (productImages.length > 1) {
//       setProductImages(productImages.filter((_, i) => i !== index));
//     }
//   };

//   const updateImage = (index: number, value: string) => {
//     const newImages = [...productImages];
//     newImages[index] = value;
//     setProductImages(newImages);
//   };

//   const onSubmit = (data: FormData) => {
//     if (!data.CategoryId) {
//       alert('Vui lòng chọn danh mục');
//       return;
//     }

//     // Filter out empty image URLs
//     const validImages = productImages.filter(img => img.trim());

//     if (isEditing) {
//       // Update mode
//       const updateData: UpdateProductRequest = {
//         Name: data.Name,
//         Description: data.Description,
//         CategoryId: data.CategoryId,
//         Status: data.Status,
//       };

//       updateProduct.mutate(
//         { id: product.Id, data: updateData },
//         {
//           onSuccess: () => {
//             onOpenChange(false);
//             reset();
//             setProductImages(['']);
//           },
//         }
//       );
//     } else {
//       // Create mode
//       const createData: any = {
//         Name: data.Name,
//         Description: data.Description,
//         CategoryId: data.CategoryId,
//         Status: data.Status,
//         CreateAt: new Date().toISOString(),
//         ProductTypes: [], // Empty array - backend may need to accept this
//         Images: validImages.length > 0 ? validImages.map(url => ({
//           Url: url,
//           Description: data.Name
//         })) : undefined,
//       };

//       createProduct.mutate(createData, {
//         onSuccess: () => {
//           onOpenChange(false);
//           reset();
//           setProductImages(['']);
//         },
//         onError: (error: any) => {
//           alert('Lỗi khi tạo sản phẩm: ' + (error.message || 'Vui lòng thử lại'));
//         },
//       });
//     }
//   };

//   const isPending = createProduct.isPending || updateProduct.isPending;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className='max-w-2xl'>
//         <DialogHeader>
//           <DialogTitle>
//             {isEditing ? 'Chỉnh sửa Sản phẩm' : 'Tạo Sản phẩm mới'}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
//           {/* Product Name */}
//           <div className='space-y-2'>
//             <Label htmlFor='Name'>
//               Tên sản phẩm <span className='text-red-500'>*</span>
//             </Label>
//             <Input
//               id='Name'
//               {...register('Name', {
//                 required: 'Tên sản phẩm là bắt buộc',
//                 minLength: {
//                   value: 2,
//                   message: 'Tên phải có ít nhất 2 ký tự',
//                 },
//               })}
//               disabled={isPending}
//               placeholder='Nhập tên sản phẩm'
//             />
//             {errors.Name && (
//               <p className='text-sm text-red-600'>{errors.Name.message}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div className='space-y-2'>
//             <Label htmlFor='Description'>Mô tả</Label>
//             <Textarea
//               id='Description'
//               {...register('Description')}
//               rows={3}
//               disabled={isPending}
//               placeholder='Nhập mô tả sản phẩm'
//             />
//           </div>

//           {/* Category */}
//           <div className='space-y-2'>
//             <Label htmlFor='CategoryId'>
//               Danh mục <span className='text-red-500'>*</span>
//             </Label>
//             <Select
//               value={categoryId?.toString()}
//               onValueChange={(value) => setValue('CategoryId', parseInt(value))}
//               disabled={isPending}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder='Chọn danh mục' />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((category) => (
//                   <SelectItem key={category.Id} value={category.Id.toString()}>
//                     {category.Name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.CategoryId && (
//               <p className='text-sm text-red-600'>{errors.CategoryId.message}</p>
//             )}
//           </div>

//           {/* Images Management */}
//           <div className='space-y-2'>
//             <div className='flex items-center justify-between'>
//               <Label>Hình ảnh sản phẩm</Label>
//               <Button
//                 type='button'
//                 variant='outline'
//                 size='sm'
//                 onClick={addImage}
//                 disabled={isPending}
//               >
//                 <Plus className='h-4 w-4 mr-1' />
//                 Thêm ảnh
//               </Button>
//             </div>

//             <div className='space-y-2'>
//               {productImages.map((image, index) => (
//                 <div key={index} className='flex gap-2 items-start'>
//                   <div className='flex-1'>
//                     <Input
//                       value={image}
//                       onChange={(e) => updateImage(index, e.target.value)}
//                       placeholder={`URL hình ảnh ${index + 1} (https://...)`}
//                       disabled={isPending}
//                     />
//                   </div>
//                   {productImages.length > 1 && (
//                     <Button
//                       type='button'
//                       variant='outline'
//                       size='icon'
//                       onClick={() => removeImage(index)}
//                       disabled={isPending}
//                     >
//                       <Trash2 className='h-4 w-4 text-red-600' />
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Status */}
//           <div className='space-y-2'>
//             <Label htmlFor='Status'>Trạng thái</Label>
//             <Select
//               value={status?.toString()}
//               onValueChange={(value) => setValue('Status', parseInt(value))}
//               disabled={isPending}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder='Chọn trạng thái' />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value='1'>Hiện</SelectItem>
//                 <SelectItem value='0'>Ẩn</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <DialogFooter>
//             <Button
//               type='button'
//               variant='outline'
//               onClick={() => onOpenChange(false)}
//               disabled={isPending}
//             >
//               Hủy
//             </Button>
//             <Button type='submit' disabled={isPending}>
//               {isPending
//                 ? isEditing
//                   ? 'Đang cập nhật...'
//                   : 'Đang tạo...'
//                 : isEditing
//                   ? 'Cập nhật'
//                   : 'Tạo mới'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
