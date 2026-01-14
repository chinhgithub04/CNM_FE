import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateInvoice, useUpdateInvoice } from '@/hooks/useInvoices';
import { useProducts } from '@/hooks/useProducts';
import type {
  InvoiceCreate,
  InvoiceItemCreate,
  Invoice,
  InvoiceAdminUpdate,
} from '@/types/invoice';
import { InvoiceStatusLabels } from '@/types/invoice';
import { formatCurrency } from '@/lib/formatters';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
}

interface FormData {
  Address: string;
  Status: string;
  Notes: string;
}

export function InvoiceFormDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceFormDialogProps) {
  const isEditMode = !!invoice;
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const { data: productsData } = useProducts();

  const [items, setItems] = useState<InvoiceItemCreate[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      Address: '',
      Status: '1',
      Notes: '',
    },
  });

  const selectedStatus = watch('Status');

  useEffect(() => {
    if (invoice) {
      reset({
        Address: invoice.Address,
        Status: invoice.Status.toString(),
        Notes: invoice.Notes || '',
      });
      setItems(
        invoice.Items.map((item) => ({
          ProductTypeId: item.ProductTypeId,
          Quantity: item.Quantity,
          Amount: item.Amount,
        }))
      );
    } else {
      reset({
        Address: '',
        Status: '1',
        Notes: '',
      });
      setItems([]);
    }
  }, [invoice, reset]);

  const addItem = () => {
    setItems([...items, { ProductTypeId: 0, Quantity: 1, Amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItemCreate,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If ProductTypeId is changed, automatically update Amount
    if (field === 'ProductTypeId') {
      const productTypeId = parseInt(value);
      // Find the product type from all products
      let foundProductType: any = null;

      for (const product of products) {
        const productType = product.ProductTypes?.find(
          (pt: any) => pt.Id === productTypeId
        );
        if (productType) {
          foundProductType = productType;
          break;
        }
      }

      if (foundProductType) {
        const price =
          foundProductType.price_item?.Price || foundProductType.Price || 0;
        newItems[index].Amount = price * newItems[index].Quantity;
      }
    }

    // If Quantity is changed, recalculate Amount
    if (field === 'Quantity') {
      const productTypeId = newItems[index].ProductTypeId;
      let foundProductType: any = null;

      for (const product of products) {
        const productType = product.ProductTypes?.find(
          (pt: any) => pt.Id === productTypeId
        );
        if (productType) {
          foundProductType = productType;
          break;
        }
      }

      if (foundProductType) {
        const price =
          foundProductType.price_item?.Price || foundProductType.Price || 0;
        newItems[index].Amount = price * parseInt(value);
      }
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.Amount || 0), 0);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (items.length === 0) {
        alert('Vui lòng thêm ít nhất một sản phẩm');
        return;
      }

      if (!data.Address.trim()) {
        alert('Vui lòng nhập địa chỉ giao hàng');
        return;
      }

      if (isEditMode) {
        const updateData: InvoiceAdminUpdate = {
          Status: parseInt(data.Status),
          Address: data.Address,
        };
        await updateInvoiceMutation.mutateAsync({
          id: invoice.Id,
          data: updateData,
        });
      } else {
        const createData: InvoiceCreate = {
          Address: data.Address,
          Items: items,
          Notes: data.Notes,
        };
        await createInvoiceMutation.mutateAsync(createData);
      }
      onOpenChange(false);
      reset();
      setItems([]);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const products = productsData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-175 max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Chỉnh sửa Hoá đơn' : 'Tạo Hoá đơn Mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin hoá đơn.'
              : 'Tạo hoá đơn mới cho đơn hàng.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='Address'>
              Địa chỉ giao hàng <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='Address'
              {...register('Address', {
                required: 'Địa chỉ giao hàng là bắt buộc',
              })}
              placeholder='Nhập địa chỉ giao hàng'
              rows={2}
            />
            {errors.Address && (
              <p className='text-sm text-red-600'>{errors.Address.message}</p>
            )}
          </div>

          {isEditMode && (
            <div className='space-y-2'>
              <Label htmlFor='Status'>Trạng thái</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setValue('Status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(InvoiceStatusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Items Section - Only show on create */}
          {!isEditMode && (
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <Label>
                  Sản phẩm <span className='text-red-500'>*</span>
                </Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addItem}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Thêm sản phẩm
                </Button>
              </div>

              <div className='space-y-2 max-h-60 overflow-y-auto border rounded-md p-2'>
                {items.length === 0 ? (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    Chưa có sản phẩm nào
                  </p>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={index}
                      className='flex gap-2 items-end border-b pb-2 last:border-b-0'
                    >
                      <div className='flex-1'>
                        <Label className='text-xs'>Loại sản phẩm</Label>
                        <Select
                          value={item.ProductTypeId?.toString() || '0'}
                          onValueChange={(value) =>
                            updateItem(index, 'ProductTypeId', parseInt(value))
                          }
                        >
                          <SelectTrigger className='h-9'>
                            <SelectValue placeholder='Chọn loại' />
                          </SelectTrigger>
                          <SelectContent>
                            {products.flatMap((product) =>
                              (product.ProductTypes || []).map(
                                (productType) => {
                                  const price =
                                    productType.price_item?.Price ||
                                    productType.Price ||
                                    0;
                                  return (
                                    <SelectItem
                                      key={productType.Id}
                                      value={productType.Id.toString()}
                                    >
                                      {product.Name} - {productType.Name} (
                                      {formatCurrency(
                                        typeof price === 'number'
                                          ? price
                                          : parseFloat(price) || 0
                                      )}
                                      )
                                    </SelectItem>
                                  );
                                }
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='w-24'>
                        <Label className='text-xs'>Số lượng</Label>
                        <Input
                          type='number'
                          min='1'
                          className='h-9'
                          value={item.Quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              'Quantity',
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                      </div>
                      <div className='w-32'>
                        <Label className='text-xs'>Thành tiền</Label>
                        <Input
                          type='text'
                          className='h-9 bg-gray-50'
                          value={formatCurrency(item.Amount)}
                          readOnly
                          disabled
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='h-9'
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className='flex justify-between items-center pt-2 border-t'>
                  <p className='font-semibold'>Tổng cộng:</p>
                  <p className='text-lg font-bold text-blue-600'>
                    {formatCurrency(calculateTotal())}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='Notes'>Ghi chú</Label>
            <Textarea
              id='Notes'
              {...register('Notes')}
              placeholder='Nhập ghi chú (tùy chọn)'
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={
                createInvoiceMutation.isPending ||
                updateInvoiceMutation.isPending
              }
            >
              {createInvoiceMutation.isPending ||
              updateInvoiceMutation.isPending
                ? 'Đang lưu...'
                : isEditMode
                ? 'Cập nhật'
                : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
