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
import { useUsers } from '@/hooks/useUsers';
import { useProducts } from '@/hooks/useProducts';
import type {
    CreateInvoiceRequest,
    UpdateInvoiceRequest,
    Invoice,
    InvoiceItemInput,
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
    CustomerId: string;
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
    const { data: usersData } = useUsers();
    const { data: productsData } = useProducts();

    const [items, setItems] = useState<InvoiceItemInput[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            CustomerId: '',
            Status: 'pending',
            Notes: '',
        },
    });

    const selectedCustomerId = watch('CustomerId');
    const selectedStatus = watch('Status');

    useEffect(() => {
        if (invoice) {
            reset({
                CustomerId: invoice.CustomerId,
                Status: invoice.Status,
                Notes: invoice.Notes || '',
            });
            setItems(
                invoice.Items.map((item) => ({
                    ProductId: item.ProductId,
                    ProductTypeId: item.ProductTypeId,
                    Quantity: item.Quantity,
                    Price: item.Price,
                }))
            );
        } else {
            reset({
                CustomerId: '',
                Status: 'pending',
                Notes: '',
            });
            setItems([]);
        }
    }, [invoice, reset]);

    const addItem = () => {
        setItems([...items, { ProductId: 0, ProductTypeId: 0, Quantity: 1, Price: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (
        index: number,
        field: keyof InvoiceItemInput,
        value: any
    ) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // If ProductTypeId is changed, automatically update ProductId and Price
        if (field === 'ProductTypeId') {
            const productTypeId = parseInt(value);
            // Find the product type from all products
            let foundProductType: any = null;
            let foundProductId: number = 0;

            for (const product of products) {
                const productType = product.ProductTypes?.find(
                    (pt: any) => pt.Id === productTypeId
                );
                if (productType) {
                    foundProductType = productType;
                    foundProductId = product.Id;
                    break;
                }
            }

            if (foundProductType) {
                newItems[index].ProductId = foundProductId;
                newItems[index].Price = foundProductType.Price;
            }
        }

        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.Quantity * item.Price, 0);
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (items.length === 0) {
                alert('Vui lòng thêm ít nhất một sản phẩm');
                return;
            }

            if (isEditMode) {
                const updateData: UpdateInvoiceRequest = {
                    CustomerId: data.CustomerId,
                    Status: data.Status as any,
                    Notes: data.Notes,
                    Items: items,
                };
                await updateInvoiceMutation.mutateAsync({
                    id: invoice.Id,
                    data: updateData,
                });
            } else {
                const createData: CreateInvoiceRequest = {
                    CustomerId: data.CustomerId,
                    Status: data.Status as any,
                    Notes: data.Notes,
                    Items: items,
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

    const users = usersData?.data || [];
    const products = productsData?.data || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Chỉnh sửa Hoá đơn' : 'Tạo Hoá đơn Mới'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Cập nhật thông tin hoá đơn.'
                            : 'Tạo hoá đơn mới cho khách hàng.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='CustomerId'>
                            Khách hàng <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            value={selectedCustomerId}
                            onValueChange={(value) => setValue('CustomerId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Chọn khách hàng' />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.Id} value={user.Id}>
                                        {user.FullName} - {user.Email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.CustomerId && (
                            <p className='text-sm text-red-600'>{errors.CustomerId.message}</p>
                        )}
                    </div>

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

                    {/* Items Section */}
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center'>
                            <Label>Sản phẩm</Label>
                            <Button type='button' variant='outline' size='sm' onClick={addItem}>
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
                                                        (product.ProductTypes || []).map((productType) => (
                                                            <SelectItem
                                                                key={productType.Id}
                                                                value={productType.Id.toString()}
                                                            >
                                                                {product.Name} - {productType.Name} ({formatCurrency(productType.Price)})
                                                            </SelectItem>
                                                        ))
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
                                            <Label className='text-xs'>Đơn giá</Label>
                                            <Input
                                                type='text'
                                                className='h-9 bg-gray-50'
                                                value={formatCurrency(item.Price)}
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
