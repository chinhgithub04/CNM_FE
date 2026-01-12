import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

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
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-600 mt-2'>
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Revenue'
          value='$45,231.89'
          icon={DollarSign}
          description='+20.1% from last month'
        />
        <StatCard
          title='Total Orders'
          value='2,350'
          icon={ShoppingCart}
          description='+15.3% from last month'
        />
        <StatCard
          title='Products'
          value='345'
          icon={Package}
          description='12 out of stock'
        />
        <StatCard
          title='Customers'
          value='1,234'
          icon={Users}
          description='+8.2% from last month'
        />
      </div>

      {/* Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Order #1234
                  </p>
                  <p className='text-xs text-gray-500'>2 minutes ago</p>
                </div>
                <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                  Completed
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Order #1233
                  </p>
                  <p className='text-xs text-gray-500'>15 minutes ago</p>
                </div>
                <span className='rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800'>
                  Processing
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Order #1232
                  </p>
                  <p className='text-xs text-gray-500'>1 hour ago</p>
                </div>
                <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                  Shipped
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Product Name 1
                  </p>
                  <p className='text-xs text-gray-500'>Only 5 left</p>
                </div>
                <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'>
                  Low Stock
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Product Name 2
                  </p>
                  <p className='text-xs text-gray-500'>Only 3 left</p>
                </div>
                <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'>
                  Low Stock
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Product Name 3
                  </p>
                  <p className='text-xs text-gray-500'>Out of stock</p>
                </div>
                <span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800'>
                  Out of Stock
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
