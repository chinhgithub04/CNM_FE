import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';
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
import type { RegisterRequest } from '@/types/auth';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const Password = watch('Password');

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-3xl'>Tạo tài khoản</CardTitle>
          <CardDescription className='text-center'>
            Nhập thông tin của bạn để bắt đầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='FullName'>Họ và tên</Label>
              <Input
                id='FullName'
                type='text'
                placeholder='Nguyễn Văn A'
                {...register('FullName', {
                  required: 'Họ và tên là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Họ và tên phải có ít nhất 2 ký tự',
                  },
                })}
              />
              {errors.FullName && (
                <p className='text-sm text-destructive'>
                  {errors.FullName.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='UserName'>Tên người dùng</Label>
              <Input
                id='UserName'
                type='text'
                placeholder='nguyenvana'
                {...register('UserName', {
                  required: 'Tên người dùng là bắt buộc',
                  minLength: {
                    value: 3,
                    message: 'Tên người dùng phải có ít nhất 3 ký tự',
                  },
                })}
              />
              {errors.UserName && (
                <p className='text-sm text-destructive'>
                  {errors.UserName.message}
                </p>
              )}
            </div>

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

            <div className='space-y-2'>
              <Label htmlFor='ConfirmPassword'>Xác nhận mật khẩu</Label>
              <PasswordInput
                id='ConfirmPassword'
                placeholder='••••••••'
                {...register('ConfirmPassword', {
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: (value) =>
                    value === Password || 'Mật khẩu không khớp',
                })}
              />
              {errors.ConfirmPassword && (
                <p className='text-sm text-destructive'>
                  {errors.ConfirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? 'Đang tạo tài khoản...'
                : 'Tạo tài khoản'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-sm text-muted-foreground'>
            Đã có tài khoản?{' '}
            <Link
              to='/login'
              className='font-medium text-primary hover:underline'
            >
              Đăng nhập
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
