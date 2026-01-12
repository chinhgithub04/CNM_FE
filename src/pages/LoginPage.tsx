import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { LoginRequest } from '@/types/auth';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const loginMutation = useLogin();

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-3xl'>
            Chào mừng trở lại
          </CardTitle>
          <CardDescription className='text-center'>
            Nhập thông tin đăng nhập để truy cập tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='Email'>Email</Label>
              <Input
                id='Email'
                type='email'
                placeholder='your@email.com'
                {...register('Email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Địa chỉ email không hợp lệ',
                  },
                })}
              />
              {errors.Email && (
                <p className='text-sm text-destructive'>
                  {errors.Email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='Password'>Mật khẩu</Label>
              <PasswordInput
                id='Password'
                placeholder='••••••••'
                {...register('Password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                })}
              />
              {errors.Password && (
                <p className='text-sm text-destructive'>
                  {errors.Password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-sm text-muted-foreground'>
            Chưa có tài khoản?{' '}
            <Link
              to='/register'
              className='font-medium text-primary hover:underline'
            >
              Đăng ký
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
