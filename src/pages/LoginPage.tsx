import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
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
import type { LoginRequest, LoginResponse } from '@/types/auth';
import type { Response } from '@/types/common';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const loginMutation = useMutation<
    Response<LoginResponse>,
    Error,
    LoginRequest
  >({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        login(response.data);
        toast.success('Login successful!', {
          description: `Welcome back, ${response.data.firstName}!`,
        });
        navigate('/');
      } else {
        toast.error('Login failed', {
          description: response.message || 'Please check your credentials.',
        });
      }
    },
    onError: (error) => {
      toast.error('Login failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-3xl'>Welcome back</CardTitle>
          <CardDescription className='text-center'>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='your@email.com'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className='text-sm text-destructive'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <PasswordInput
                id='password'
                placeholder='••••••••'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className='text-sm text-destructive'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-sm text-muted-foreground'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='font-medium text-primary hover:underline'
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
