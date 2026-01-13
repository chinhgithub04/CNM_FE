import { useState } from 'react';
// KHÔNG import CustomerLayout nữa
// import CustomerLayout from '@/components/common/CustomerLayout'; 

import { ShopProductGrid } from '@/components/features/shop/ShopProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ShopPage() {
  const [page, setPage] = useState(1);
  const pageSize = 12; 

  const { data, isLoading } = useProducts(page, pageSize);

  const handleNextPage = () => setPage((p) => p + 1);
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
        {/* Banner tiêu đề */}
        <div className="bg-white border-b mb-8">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-900">Cửa hàng</h1>
                <p className="text-slate-500 mt-2">Khám phá các sản phẩm chất lượng tốt nhất</p>
            </div>
        </div>

        <div className="container mx-auto px-4">
            {/* Thanh tìm kiếm & Thông tin trang */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm sản phẩm..." className="pl-8 bg-white" />
                </div>
                <div className="text-sm text-slate-500">
                    Hiển thị trang <strong>{page}</strong>
                </div>
            </div>

            {/* Grid hiển thị sản phẩm */}
            <ShopProductGrid 
                products={data?.data || []} 
                isLoading={isLoading} 
            />

            {/* Phân trang */}
            <div className="mt-10 flex justify-center gap-2">
                <Button 
                    variant="outline" 
                    onClick={handlePrevPage} 
                    disabled={page === 1 || isLoading}
                >
                    Trang trước
                </Button>
                <Button 
                    variant="default" 
                    onClick={handleNextPage}
                    disabled={!data?.data || data.data.length < pageSize || isLoading}
                >
                    Trang sau
                </Button>
            </div>
        </div>
    </div>
  );
}