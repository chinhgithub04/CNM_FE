import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getProductImage } from '@/utils/cloudinary';
import { formatCurrency } from '@/utils/formatters';
import type { CartItem } from '@/types/cart';

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onQuantityChange: (productTypeId: number, quantity: number) => void;
  onDelete: (productTypeId: number) => void;
}

function CartItemRow({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onDelete,
}: CartItemRowProps) {
  const { data: productData, isLoading: isLoadingProduct } = useProduct(
    item.ProductType?.ProductId || 0
  );

  const product = productData?.data;
  const productType = item.ProductType;

  // Get price
  const unitPrice = useMemo(() => {
    if (!productType) return 0;
    if (productType.Price) {
      return parseFloat(productType.Price);
    }
    return 0;
  }, [productType]);

  const totalPrice = unitPrice * item.Quantity;

  // Get image URL
  const imageUrl = productType?.ImageUrl
    ? getProductImage(productType.ImageUrl)
    : null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.Quantity + delta;
    if (newQuantity >= 1 && productType) {
      onQuantityChange(productType.Id, newQuantity);
    }
  };

  if (isLoadingProduct) {
    return (
      <TableRow>
        <TableCell>
          <Checkbox disabled />
        </TableCell>
        <TableCell colSpan={4}>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-muted animate-pulse rounded' />
            <div className='flex-1'>
              <div className='h-4 bg-muted animate-pulse rounded w-1/2 mb-2' />
              <div className='h-3 bg-muted animate-pulse rounded w-1/3' />
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (!productType) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className='w-12'>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell>
        <Link
          to={`/products/${item.ProductType?.ProductId}`}
          className='flex items-center gap-4 hover:opacity-80 transition-opacity'
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productType.Name}
              className='w-16 h-16 object-cover rounded'
            />
          ) : (
            <div className='w-16 h-16 bg-muted rounded flex items-center justify-center'>
              <span className='text-muted-foreground text-xs'>
                {product?.Name?.charAt(0) || 'P'}
              </span>
            </div>
          )}
          <div className='flex flex-col'>
            <span className='font-medium'>
              {product?.Name || 'Đang tải...'}
            </span>
            <span className='text-sm text-muted-foreground'>
              {productType.Name}
            </span>
          </div>
        </Link>
      </TableCell>
      <TableCell className='text-right'>{formatCurrency(unitPrice)}</TableCell>
      <TableCell>
        <div className='flex items-center justify-center border rounded-lg w-fit mx-auto'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleQuantityChange(-1)}
            disabled={item.Quantity <= 1}
            className='h-8 w-8'
          >
            <Minus className='h-4 w-4' />
          </Button>
          <span className='px-4 font-semibold min-w-12 text-center'>
            {item.Quantity}
          </span>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleQuantityChange(1)}
            className='h-8 w-8'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </TableCell>
      <TableCell className='text-right font-semibold'>
        {formatCurrency(totalPrice)}
      </TableCell>
      <TableCell className='text-right'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onDelete(productType.Id)}
          className='h-8 w-8 text-destructive hover:text-destructive'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const cart = data?.data;
  const cartItems = cart?.items || [];

  // Handle checkout navigation
  const handleCheckout = () => {
    if (selectedItems.size === 0) return;

    const checkoutItems = cartItems
      .filter(
        (item) => item.ProductType && selectedItems.has(item.ProductType.Id)
      )
      .map((item) => ({
        ProductTypeId: item.ProductType!.Id,
        ProductId: item.ProductType!.ProductId,
        ProductTypeName: item.ProductType!.Name,
        ImageUrl: item.ProductType!.ImageUrl,
        Quantity: item.Quantity,
        UnitPrice: item.ProductType!.Price
          ? parseFloat(item.ProductType!.Price)
          : 0,
      }));

    navigate('/checkout', { state: { items: checkoutItems, fromCart: true } });
  };

  // Toggle single item selection
  const toggleItemSelection = (productTypeId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productTypeId)) {
        newSet.delete(productTypeId);
      } else {
        newSet.add(productTypeId);
      }
      return newSet;
    });
  };

  // Toggle all items selection
  const toggleAllSelection = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(
        new Set(
          cartItems
            .map((item) => item.ProductType?.Id)
            .filter(Boolean) as number[]
        )
      );
    }
  };

  // Handle quantity update
  const handleQuantityChange = (productTypeId: number, quantity: number) => {
    updateCartItemMutation.mutate({ productTypeId, quantity });
  };

  // Handle single item delete
  const handleDeleteSingle = (productTypeId: number) => {
    setItemToDelete(productTypeId);
    setIsDeleteDialogOpen(true);
  };

  // Handle multiple items delete
  const handleDeleteMultiple = () => {
    if (selectedItems.size === 0) return;
    setItemToDelete(null);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (itemToDelete) {
      // Delete single item
      removeCartItemMutation.mutate(itemToDelete);
    } else {
      // Delete multiple items
      selectedItems.forEach((productTypeId) => {
        removeCartItemMutation.mutate(productTypeId);
      });
      setSelectedItems(new Set());
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Calculate totals
  const { selectedTotal, cartTotal } = useMemo(() => {
    let selected = 0;
    let total = 0;

    cartItems.forEach((item) => {
      const productType = item.ProductType;
      if (!productType) return;

      let unitPrice = 0;
      if (productType.Price) {
        unitPrice = parseFloat(productType.Price);
      }

      const itemTotal = unitPrice * item.Quantity;
      total += itemTotal;

      if (selectedItems.has(productType.Id)) {
        selected += itemTotal;
      }
    });

    return { selectedTotal: selected, cartTotal: total };
  }, [cartItems, selectedItems]);

  if (isLoading) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-bold mb-8'>Giỏ hàng</h1>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              <div className='h-64 bg-muted animate-pulse rounded-lg' />
            </div>
            <div className='h-48 bg-muted animate-pulse rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <p className='text-destructive'>Không thể tải giỏ hàng</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-bold mb-8'>Giỏ hàng</h1>
          <div className='text-center py-12'>
            <p className='text-muted-foreground mb-4'>
              Giỏ hàng của bạn đang trống
            </p>
            <Button onClick={() => (window.location.href = '/')}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold mb-8'>Giỏ hàng</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items Table */}
          <div className='lg:col-span-2'>
            <div className='border rounded-lg overflow-hidden'>
              {/* Action Bar */}
              {selectedItems.size > 0 && (
                <div className='bg-muted/50 p-4 border-b flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Đã chọn {selectedItems.size} sản phẩm
                  </span>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={handleDeleteMultiple}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Xoá tất cả
                  </Button>
                </div>
              )}

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-12'>
                      <Checkbox
                        checked={
                          selectedItems.size === cartItems.length &&
                          cartItems.length > 0
                        }
                        onCheckedChange={toggleAllSelection}
                      />
                    </TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className='text-right'>Giá</TableHead>
                    <TableHead className='text-center'>Số lượng</TableHead>
                    <TableHead className='text-right'>Tổng tiền</TableHead>
                    <TableHead className='w-12'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <CartItemRow
                      key={item.ProductTypeId}
                      item={item}
                      isSelected={selectedItems.has(item.ProductType?.Id || 0)}
                      onSelect={() =>
                        item.ProductType &&
                        toggleItemSelection(item.ProductType.Id)
                      }
                      onQuantityChange={handleQuantityChange}
                      onDelete={handleDeleteSingle}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Cart Summary */}
          <div>
            <div className='border rounded-lg p-6 sticky top-20'>
              <h2 className='text-xl font-semibold mb-4'>Tổng quan đơn hàng</h2>

              <div className='space-y-3 mb-6'>
                {selectedItems.size > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Tổng tiền ({selectedItems.size} sản phẩm):
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(selectedTotal)}
                    </span>
                  </div>
                )}

                <div className='flex justify-between pt-3 border-t'>
                  <span className='font-semibold'>Tổng cộng:</span>
                  <span className='text-2xl font-bold text-primary'>
                    {formatCurrency(
                      selectedItems.size > 0 ? selectedTotal : cartTotal
                    )}
                  </span>
                </div>
              </div>

              <Button
                className='w-full'
                size='lg'
                disabled={selectedItems.size === 0 && cartItems.length > 0}
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </Button>

              {selectedItems.size === 0 && cartItems.length > 0 && (
                <p className='text-xs text-muted-foreground text-center mt-2'>
                  Vui lòng chọn sản phẩm để thanh toán
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xoá</DialogTitle>
              <DialogDescription>
                {itemToDelete
                  ? 'Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?'
                  : `Bạn có chắc chắn muốn xoá ${selectedItems.size} sản phẩm đã chọn khỏi giỏ hàng?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setItemToDelete(null);
                }}
              >
                Huỷ
              </Button>
              <Button variant='destructive' onClick={confirmDelete}>
                Xoá
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
