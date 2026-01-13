import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductSlider } from '@/components/features/products/ProductSlider';
import { getProductImage } from '@/utils/cloudinary';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import type { ProductType } from '@/types/product';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProduct(Number(id));
  const addToCartMutation = useAddToCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductType | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <div className='aspect-square bg-muted animate-pulse rounded-lg' />
              <div className='h-20 bg-muted animate-pulse rounded-lg' />
            </div>
            <div className='space-y-4'>
              <div className='h-8 bg-muted animate-pulse rounded' />
              <div className='h-6 bg-muted animate-pulse rounded w-1/3' />
              <div className='h-20 bg-muted animate-pulse rounded' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <p className='text-destructive'>Không thể tải thông tin sản phẩm</p>
        </div>
      </div>
    );
  }

  const product = data.data;

  // Set default variant if not selected
  const currentVariant =
    selectedVariant ||
    (product.ProductTypes && product.ProductTypes.length > 0
      ? product.ProductTypes[0]
      : null);

  // Get current price
  const getCurrentPrice = () => {
    if (!currentVariant) return 'Giá không có sẵn';

    let price: number | null = null;
    if (currentVariant.Price) {
      price = parseFloat(currentVariant.Price);
    } else if (currentVariant.price_item?.Price) {
      price = currentVariant.price_item.Price;
    }

    return price ? formatCurrency(price) : 'Giá không có sẵn';
  };

  // Get current quantity
  const getCurrentQuantity = () => {
    return currentVariant?.Quantity || 0;
  };

  // Get main image
  const mainImageUrl =
    product.Images && product.Images.length > 0
      ? getProductImage(product.Images[selectedImageIndex]?.Url)
      : null;

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const maxQuantity = getCurrentQuantity();
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!currentVariant) return;

    addToCartMutation.mutate(
      {
        ProductTypeId: currentVariant.Id,
        Quantity: quantity,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(true);
        },
      }
    );
  };

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* LEFT SIDE */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div className='relative aspect-square bg-muted rounded-lg overflow-hidden'>
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={product.Name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5'>
                  <span className='text-6xl font-bold text-primary/30'>
                    {product.Name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Product Slider */}
            {product.Images && product.Images.length > 1 && (
              <ProductSlider
                images={product.Images}
                selectedImageIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                getImageUrl={(url) => getProductImage(url)}
              />
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className='space-y-6'>
            {/* Product Name */}
            <h1 className='text-3xl font-bold'>{product.Name}</h1>

            {/* Product Price */}
            <div className='text-3xl font-bold text-primary'>
              {getCurrentPrice()}
            </div>

            {/* Variant Selection */}
            {product.ProductTypes && product.ProductTypes.length > 0 && (
              <div className='space-y-3'>
                <h3 className='font-semibold text-lg'>Phân loại:</h3>
                <div className='flex flex-wrap gap-3'>
                  {product.ProductTypes.map((variant) => {
                    const isSelected = currentVariant?.Id === variant.Id;
                    const variantImageUrl = getProductImage(variant.ImageUrl);

                    return (
                      <button
                        key={variant.Id}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                        }}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        {variantImageUrl && (
                          <img
                            src={variantImageUrl}
                            alt={variant.Name}
                            className='w-8 h-8 rounded object-cover'
                          />
                        )}
                        <span className='font-medium'>{variant.Name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Information */}
            <div className='text-muted-foreground'>
              Số lượng còn lại:{' '}
              <span className='font-semibold text-foreground'>
                {getCurrentQuantity()}
              </span>
            </div>

            {/* Action Row */}
            <div className='flex items-center gap-4'>
              {/* Quantity Selector */}
              <div className='flex items-center border rounded-lg'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='px-4 font-semibold min-w-12 text-center'>
                  {quantity}
                </span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= getCurrentQuantity()}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant='outline'
                className='flex-1'
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || !currentVariant}
              >
                {addToCartMutation.isPending
                  ? 'Đang thêm...'
                  : 'Thêm vào giỏ hàng'}
              </Button>

              {/* Buy Now Button */}
              <Button
                className='flex-1'
                onClick={() => {
                  if (!currentVariant || !product) return;

                  const checkoutItems = [
                    {
                      ProductTypeId: currentVariant.Id,
                      ProductId: product.Id,
                      ProductTypeName: currentVariant.Name,
                      ProductName: product.Name,
                      ImageUrl: currentVariant.ImageUrl,
                      Quantity: quantity,
                      UnitPrice: currentVariant.Price
                        ? parseFloat(currentVariant.Price)
                        : currentVariant.price_item?.Price || 0,
                    },
                  ];

                  navigate('/checkout', { state: { items: checkoutItems } });
                }}
                disabled={!currentVariant}
              >
                Mua ngay
              </Button>
            </div>

            {/* Product Description */}
            {product.Description && (
              <div className='space-y-3 pt-6 border-t'>
                <h3 className='font-semibold text-lg'>Mô tả sản phẩm:</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  {product.Description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Success Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thành công!</DialogTitle>
              <DialogDescription>
                Sản phẩm đã được thêm vào giỏ hàng của bạn.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Tiếp tục mua sắm
              </Button>
              <Button onClick={() => navigate('/cart')}>Đi đến giỏ hàng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
