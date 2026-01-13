import { Link, useNavigate } from 'react-router-dom'; 
import { ShoppingCart, Plus } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext'; 
import { toast } from 'sonner'; 
import type { Product } from '@/types/product';

interface ShopProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ShopProductGrid({ products, isLoading }: ShopProductGridProps) {
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
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

  const handleQuickAdd = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Bạn chưa đăng nhập!", {
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
        action: {
          label: "Đăng nhập ngay",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    const firstVariant = product.ProductTypes?.[0];
    if (firstVariant) {
        toast.promise(
            addToCartMutation.mutateAsync({
                ProductTypeId: firstVariant.Id,
                Quantity: 1
            }),
            {
                loading: 'Đang thêm...',
                success: `Đã thêm vào giỏ hàng!`,
                error: 'Thử lại sau nhé!',
            }
        );
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-muted-foreground italic">Không tìm thấy sản phẩm phù hợp.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {products.map((product) => (
        <Link 
            key={product.Id} 
            to={`/products/${product.Id}`}
            className="group block h-full"
        >
          <Card className="h-full overflow-hidden transition-all hover:shadow-md border-slate-200 flex flex-col">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img
                src={getDisplayImage(product)}
                alt={product.Name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2">
                 {product.Status === 1 && <Badge className="bg-green-500 text-[10px] md:text-xs px-1.5">Mới</Badge>}
              </div>
              
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0 hidden md:flex justify-center bg-white/20 backdrop-blur-md">
                  <Button 
                    size="sm" 
                    className="w-full shadow-lg" 
                    onClick={(e) => handleQuickAdd(e, product)}
                    disabled={addToCartMutation.isPending} 
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                  </Button>
              </div>
            </div>

            <CardContent className="p-3 md:p-4 flex flex-col flex-1">
              <h3 className="line-clamp-2 text-[13px] md:text-sm font-medium text-gray-900 group-hover:text-primary min-h-[2.2rem] leading-snug">
                {product.Name}
              </h3>
              
              <div className="mt-2 flex items-center justify-between">
                 <p className="text-sm md:text-lg font-bold text-primary">
                    {getDisplayPrice(product)}
                 </p>

                 <Button 
                    size="icon" 
                    variant="secondary" 
                    className="md:hidden h-8 w-8 rounded-full shadow-sm active:scale-95 transition-transform"
                    onClick={(e) => handleQuickAdd(e, product)}
                 >
                    <Plus className="h-4 w-4 text-primary" />
                 </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}