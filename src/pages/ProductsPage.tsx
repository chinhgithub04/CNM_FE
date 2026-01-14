import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductList } from '@/components/features/products/ProductList';

export default function ProductsPage() {
  const navigate = useNavigate();
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  if (isLoadingProducts || isLoadingCategories) {
    const newLocal = 'flex items-center justify-center min-h-[400px]';
    return (
      <div className={newLocal}>
        <p className='text-gray-500'>Đang tải...</p>
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <p className='text-red-500'>Đã xảy ra lỗi khi tải dữ liệu.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Quản lý Sản phẩm</h1>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className='w-4 h-4 mr-2' />
          Thêm Sản phẩm
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList
            products={products?.data || []}
            categories={categories?.data || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
