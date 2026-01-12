import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { getProductImage } from '@/utils/cloudinary';
import { formatCurrency } from '@/utils/formatters';
import type { Product } from '@/types/product';

export function ProductGrid() {
  const { data, isLoading, error } = useProducts(1, 10);

  if (isLoading) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-8'>Sản phẩm nổi bật</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className='space-y-3'>
                <div className='aspect-square bg-muted animate-pulse rounded-lg' />
                <div className='h-4 bg-muted animate-pulse rounded' />
                <div className='h-4 bg-muted animate-pulse rounded w-2/3' />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <p className='text-destructive'>Không thể tải sản phẩm</p>
        </div>
      </div>
    );
  }

  const products = data?.data || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-3xl font-bold'>Sản phẩm nổi bật</h2>
          <Button variant='outline'>Xem tất cả</Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {products.map((product: Product) => (
            <ProductCard key={product.Id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const firstImageUrl =
    product.Images && product.Images.length > 0 ? product.Images[0].Url : null;
  const imageUrl = getProductImage(firstImageUrl);

  const getPriceDisplay = () => {
    if (!product.ProductTypes || product.ProductTypes.length === 0) {
      return 'Giá không có sẵn';
    }

    const prices = product.ProductTypes.map((pt) => {
      if (pt.Price) {
        return parseFloat(pt.Price);
      }
      if (pt.price_item?.Price) {
        return pt.price_item.Price;
      }
      return null;
    }).filter((price): price is number => price !== null && !isNaN(price));

    if (prices.length === 0) {
      return 'Giá không có sẵn';
    }

    const minPrice = Math.min(...prices);
    return formatCurrency(minPrice);
  };

  return (
    <div className='group cursor-pointer'>
      <div className='relative overflow-hidden rounded-lg aspect-square bg-muted mb-3'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.Name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5'>
            <span className='text-5xl font-bold text-primary/30'>
              {product.Name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className='space-y-1'>
        <h3 className='font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors'>
          {product.Name}
        </h3>
        <p className='text-sm font-bold text-primary'>{getPriceDisplay()}</p>
      </div>
    </div>
  );
}
