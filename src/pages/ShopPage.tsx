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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSortOption('newest');
    handlePageChange(1); 
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="bg-slate-50 min-h-screen pb-12 md:pb-20">
      <div className="bg-white border-b sticky top-[64px] z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4 space-y-3 md:space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
            
            <div className="relative w-full md:w-80 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Tìm sản phẩm..." 
                className="pl-9 bg-slate-50 border-none h-9 md:h-10 text-sm focus-visible:ring-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-9 flex-1 md:flex-none">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span className="text-xs md:text-sm">
                        {sortOption === 'newest' && 'Mới nhất'}
                        {sortOption === 'price-asc' && 'Giá: Thấp - Cao'}
                        {sortOption === 'price-desc' && 'Giá: Cao - Thấp'}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters} 
                  className="text-red-500 h-9 px-2 hover:bg-red-50"
                >
                  <FilterX className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline text-xs">Xóa lọc</span>
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar md:flex-wrap items-center">
            <Button 
              variant={selectedCategory === null ? "default" : "secondary"}
              size="sm"
              className="rounded-full px-5 text-[11px] md:text-xs h-7 md:h-8 whitespace-nowrap"
              onClick={() => {setSelectedCategory(null); handlePageChange(1);}}
            >
              Tất cả
            </Button>
            {categoriesData?.data?.map((cat: any) => (
              <Button 
                key={cat.Id}
                variant={selectedCategory === cat.Id ? "default" : "secondary"}
                size="sm"
                className="rounded-full px-5 text-[11px] md:text-xs h-7 md:h-8 whitespace-nowrap"
                onClick={() => {setSelectedCategory(cat.Id); handlePageChange(1);}}
              >
                {cat.Name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 md:mt-8">
        <div className="flex justify-between items-baseline mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-none">Sản phẩm</h2>
            <p className="text-slate-500 text-[11px] md:text-sm mt-1">Tìm thấy {filteredAndSortedProducts.length} kết quả</p>
          </div>
        </div>

        {!isLoading && filteredAndSortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
               <Search className="h-6 w-6 md:h-8 md:w-8 text-slate-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-900">Không tìm thấy sản phẩm</h3>
            <p className="text-slate-500 text-xs md:text-sm mt-2 text-center px-4">Thử thay đổi từ khóa hoặc xóa bộ lọc.</p>
            <Button variant="link" onClick={resetFilters} className="mt-4 text-primary text-sm">
              Quay lại mặc định
            </Button>
          </div>
        ) : (
          <ShopProductGrid 
            products={filteredAndSortedProducts} 
            isLoading={isLoading} 
          />
        )}

        <div className="mt-12 md:mt-16 flex justify-center items-center gap-4 md:gap-8">
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 md:h-10 px-4"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
            >
              Trước
            </Button>
            <span className="text-sm font-bold text-slate-700">Trang {page}</span>
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 md:h-10 px-4"
              onClick={() => handlePageChange(page + 1)}
              disabled={filteredAndSortedProducts.length < pageSize || isLoading}
            >
              Sau
            </Button>
        </div>
      </div>
    </div>
  );
}