import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  FolderTree,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-gray-600'>
          {title}
        </CardTitle>
        <Icon className='h-5 w-5 text-gray-400' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-gray-900'>{value}</div>
        {description && (
          <p className='text-xs text-gray-500 mt-1'>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Thống kê</h1>
          <p className='text-gray-600 mt-2'>
            Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => navigate('/admin/categories')}>
            <FolderTree className='mr-2 h-4 w-4' />
            Danh mục
          </Button>
          <Button onClick={() => navigate('/admin/products')} variant='outline'>
            <Package className='mr-2 h-4 w-4' />
            Sản phẩm
          </Button>
          <Button onClick={() => navigate('/admin/accounts')} variant='outline'>
            <Users className='mr-2 h-4 w-4' />
            Tài khoản
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Tổng Doanh Thu'
          value='45.231.890 VNĐ'
          icon={DollarSign}
          description='+20.1% so với tháng trước'
        />
        <StatCard
          title='Tổng Đơn Hàng'
          value='2,350'
          icon={ShoppingCart}
          description='+15.3% so với tháng trước'
        />
        <StatCard
          title='Sản Phẩm'
          value='345'
          icon={Package}
          description='12 hết hàng'
        />
        <StatCard
          title='Khách Hàng'
          value='1,234'
          icon={Users}
          description='+8.2% so với tháng trước'
        />
      </div>

      {/* Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Đơn Hàng Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Đơn hàng #1234
                  </p>
                  <p className='text-xs text-gray-500'>2 phút trước</p>
                </div>
                <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                  Hoàn thành
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Đơn hàng #1233
                  </p>
                  <p className='text-xs text-gray-500'>15 phút trước</p>
                </div>
                <span className='rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800'>
                  Đang xử lý
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Đơn hàng #1232
                  </p>
                  <p className='text-xs text-gray-500'>1 giờ trước</p>
                </div>
                <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                  Đã giao
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cảnh Báo Tồn Kho Thấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Sản phẩm 1
                  </p>
                  <p className='text-xs text-gray-500'>Chỉ còn 5</p>
                </div>
                <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'>
                  Tồn kho thấp
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Sản phẩm 2
                  </p>
                  <p className='text-xs text-gray-500'>Chỉ còn 3</p>
                </div>
                <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'>
                  Tồn kho thấp
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Sản phẩm 3
                  </p>
                  <p className='text-xs text-gray-500'>Hết hàng</p>
                </div>
                <span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800'>
                  Hết hàng
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
