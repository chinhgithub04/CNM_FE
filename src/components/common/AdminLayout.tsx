import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  FolderTree,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: 'Thống kê',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Danh Mục',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Sản Phẩm',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Tài khoản',
    href: '/admin/accounts',
    icon: Users,
  },
  {
    title: 'Hoá đơn',
    href: '/admin/invoices',
    icon: FileText,
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0'
          } flex flex-col border-r bg-white transition-all duration-300 ease-in-out lg:w-64`}
      >
        <div className='flex h-16 items-center justify-between border-b px-6'>
          <h1 className='text-xl font-bold text-gray-900'>Admin Panel</h1>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={() => setSidebarOpen(false)}
          >
            <X className='h-5 w-5' />
          </Button>
        </div>

        <nav className='flex-1 space-y-1 overflow-y-auto p-4'>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className='flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900'
              >
                <Icon className='h-5 w-5' />
                <span className='font-medium'>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className='border-t p-4'>
          <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={user?.AvatarUrl || undefined} />
              <AvatarFallback className='bg-blue-600 text-white'>
                {user?.FullName ? getInitials(user.FullName) : 'AD'}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 overflow-hidden'>
              <p className='truncate text-sm font-medium text-gray-900'>
                {user?.FullName || 'Admin'}
              </p>
              <p className='truncate text-xs text-gray-500'>
                {user?.Email || ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <header className='flex h-16 items-center justify-between border-b bg-white px-6'>
          <Button
            variant='ghost'
            size='icon'
            className={sidebarOpen ? 'hidden' : 'lg:hidden'}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className='h-5 w-5' />
          </Button>

          <div className='flex items-center gap-4 ml-auto'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='gap-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={user?.AvatarUrl || undefined} />
                    <AvatarFallback className='bg-blue-600 text-white text-xs'>
                      {user?.FullName ? getInitials(user.FullName) : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <span className='hidden md:inline-block'>
                    {user?.FullName || 'Admin'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className='mr-2 h-4 w-4' />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
