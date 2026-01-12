import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          <span className='text-2xl font-bold text-primary'>Merxly</span>
        </Link>

        {/* Navigation */}
        <nav className='hidden md:flex items-center space-x-6'>
          <Link
            to='/'
            className='text-sm font-medium text-foreground/60 transition-colors hover:text-foreground'
          >
            Trang chủ
          </Link>
          <Link
            to='/products'
            className='text-sm font-medium text-foreground/60 transition-colors hover:text-foreground'
          >
            Sản phẩm
          </Link>
          <Link
            to='/about'
            className='text-sm font-medium text-foreground/60 transition-colors hover:text-foreground'
          >
            Về chúng tôi
          </Link>
        </nav>

        {/* Right side actions */}
        <div className='flex items-center space-x-4'>
          {/* Cart */}
          <Button variant='ghost' size='icon' asChild>
            <Link to='/cart'>
              <ShoppingCart className='h-5 w-5' />
            </Link>
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-9 w-9 rounded-full'
                >
                  <Avatar className='h-9 w-9'>
                    <AvatarImage
                      src={user?.AvatarUrl || ''}
                      alt={user?.FullName || 'User'}
                    />
                    <AvatarFallback>
                      {getInitials(user?.FullName || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {user?.FullName || 'User'}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {user?.Email || ''}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to='/profile' className='cursor-pointer'>
                    <User className='mr-2 h-4 w-4' />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/orders' className='cursor-pointer'>
                    <Package className='mr-2 h-4 w-4' />
                    <span>Đơn hàng của tôi</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings' className='cursor-pointer'>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex items-center space-x-2'>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/login'>Đăng nhập</Link>
              </Button>
              <Button size='sm' asChild>
                <Link to='/register'>Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
