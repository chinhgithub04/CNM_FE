import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts'; 
import { useCategories } from '@/hooks/useCategories'; 
import { ShopProductGrid } from '@/components/features/shop/ShopProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  FilterX, 
  ArrowUpDown, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: productsData, isLoading } = useProducts(page, pageSize);
  const { data: categoriesData } = useCategories();

  const getMinPrice = (product: any) => {
    const prices = product.ProductTypes?.map((pt: any) => pt.Price || pt.price_item?.Price || 0) || [];
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = productsData?.data || [];

    if (searchTerm) {
      result = result.filter(p => 
        p.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(p => p.CategoryId === selectedCategory);
    }

    result = [...result].sort((a, b) => {
      if (sortOption === 'price-asc') return getMinPrice(a) - getMinPrice(b);
      if (sortOption === 'price-desc') return getMinPrice(b) - getMinPrice(a);
      if (sortOption === 'newest') return new Date(b.CreateAt).getTime() - new Date(a.CreateAt).getTime();
      return 0;
    });

    return result;
  }, [productsData, searchTerm, selectedCategory, sortOption]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSortOption('newest');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b sticky top-[64px] z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Tìm tên sản phẩm..." 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 ml-auto md:ml-0">
                    <ArrowUpDown className="h-4 w-4" />
                    {sortOption === 'newest' && 'Mới nhất'}
                    {sortOption === 'price-asc' && 'Giá thấp - cao'}
                    {sortOption === 'price-desc' && 'Giá cao - thấp'}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSortOption('newest')}>
                    Mới nhất {sortOption === 'newest' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('price-asc')}>
                    Giá thấp - cao {sortOption === 'price-asc' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('price-desc')}>
                    Giá cao - thấp {sortOption === 'price-desc' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {(searchTerm || selectedCategory) && (
                <Button variant="ghost" size="icon" onClick={resetFilters} title="Xóa bộ lọc">
                  <FilterX className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-t pt-4">
            <Button 
              variant={selectedCategory === null ? "default" : "secondary"}
              size="sm"
              className="rounded-full px-6"
              onClick={() => setSelectedCategory(null)}
            >
              Tất cả
            </Button>
            {categoriesData?.data?.map((cat: any) => (
              <Button 
                key={cat.Id}
                variant={selectedCategory === cat.Id ? "default" : "secondary"}
                size="sm"
                className="rounded-full px-6 whitespace-nowrap"
                onClick={() => setSelectedCategory(cat.Id)}
              >
                {cat.Name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Sản phẩm cho bạn</h2>
            <p className="text-slate-500 text-sm">Tìm thấy {filteredAndSortedProducts.length} sản phẩm</p>
          </div>
        </div>

        {!isLoading && filteredAndSortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
               <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Không tìm thấy sản phẩm</h3>
            <p className="text-slate-500 mt-2">Thử thay đổi từ khóa hoặc bộ lọc của bạn nhé.</p>
            <Button variant="link" onClick={resetFilters} className="mt-4 text-primary">
              Xóa tất cả bộ lọc
            </Button>
          </div>
        ) : (
          <ShopProductGrid 
            products={filteredAndSortedProducts} 
            isLoading={isLoading} 
          />
        )}

        <div className="mt-16 flex justify-center items-center gap-6">
            <Button 
              variant="outline" 
              onClick={() => {setPage(p => Math.max(1, p - 1)); window.scrollTo(0,0)}}
              disabled={page === 1 || isLoading}
            >
              Trang trước
            </Button>
            <span className="font-medium text-slate-700">Trang {page}</span>
            <Button 
              variant="outline" 
              onClick={() => {setPage(p => p + 1); window.scrollTo(0,0)}}
              disabled={filteredAndSortedProducts.length < pageSize || isLoading}
            >
              Trang sau
            </Button>
        </div>
      </div>
    </div>
  );
}