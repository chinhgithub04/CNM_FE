import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryList } from '@/components/features/categories/CategoryList';
import { CategoryFormDialog } from '@/components/features/categories/CategoryFormDialog';

export default function CategoriesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
          <p className='mt-4 text-gray-600'>Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-red-600 font-medium'>Lỗi khi tải danh mục</p>
              <p className='text-sm text-gray-500 mt-2'>
                {error.message || 'Đã xảy ra lỗi không mong muốn'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = data?.data || [];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Danh Mục</h1>
          <p className='text-gray-600 mt-2'>
            Quản lý danh mục sản phẩm cho cửa hàng của bạn
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Thêm Danh mục
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả Danh mục ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryList categories={categories} />
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
