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
          <CardTitle className='text-center text-3xl'>
            Create an account
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='FullName'>Full Name</Label>
              <Input
                id='FullName'
                type='text'
                placeholder='John Doe'
                {...register('FullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters',
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
              <Label htmlFor='UserName'>Username</Label>
              <Input
                id='UserName'
                type='text'
                placeholder='johndoe'
                {...register('UserName', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
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
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
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
              <Label htmlFor='Password'>Password</Label>
              <PasswordInput
                id='Password'
                placeholder='••••••••'
                {...register('Password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
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
              <Label htmlFor='ConfirmPassword'>Confirm password</Label>
              <PasswordInput
                id='ConfirmPassword'
                placeholder='••••••••'
                {...register('ConfirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === Password || 'Passwords do not match',
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
                ? 'Creating account...'
                : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-primary hover:underline'
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
