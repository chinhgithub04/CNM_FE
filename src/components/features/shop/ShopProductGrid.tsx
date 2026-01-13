import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/hooks/useCart'; 
import { useAddToCart } from '@/hooks/useCart';
import type { Product } from '@/types/product';

interface ShopProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ShopProductGrid({ products, isLoading }: ShopProductGridProps) {
  const addToCartMutation = useAddToCart();

  const getDisplayPrice = (product: Product) => {
    if (!product.ProductTypes || product.ProductTypes.length === 0) return 'Liên hệ';
    
    const prices = product.ProductTypes.map(pt => {
        const priceVal = pt.Price || pt.price_item?.Price;
        return priceVal ? Number(priceVal) : null;
    }).filter((p): p is number => p !== null);

    if (prices.length === 0) return 'Hết hàng';
    return formatCurrency(Math.min(...prices));
  };

  const getDisplayImage = (product: Product) => {
     const variantImg = product.ProductTypes?.find(pt => pt.ImageUrl)?.ImageUrl;
     const productImg = product.Images?.[0]?.Url;
     return variantImg || productImg || '/placeholder.png'; 
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); 
    const firstVariant = product.ProductTypes?.[0];
    if (firstVariant) {
        addToCartMutation.mutate({
            ProductTypeId: firstVariant.Id,
            Quantity: 1
        });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[350px] bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Không tìm thấy sản phẩm nào.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link 
            key={product.Id} 
            to={`/products/${product.Id}`}
            className="group block h-full"
        >
          <Card className="h-full overflow-hidden transition-all hover:shadow-lg border-slate-200">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img
                src={getDisplayImage(product)}
                alt={product.Name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2">
                 {product.Status === 1 && <Badge className="bg-green-500">Mới</Badge>}
              </div>
              
              {/* Overlay button action */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex gap-2 justify-center bg-white/10 backdrop-blur-sm">
                  <Button size="sm" className="w-full" onClick={(e) => handleQuickAdd(e, product)}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Thêm
                  </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary min-h-[2.5rem]">
                {product.Name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                 <p className="text-lg font-bold text-primary">
                    {getDisplayPrice(product)}
                 </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}