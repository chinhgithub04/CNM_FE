import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { registerUser } from '@/services/authService';
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
import type { RegisterRequest, LoginResponse } from '@/types/auth';
import type { Response } from '@/types/common';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const password = watch('password');

  const registerMutation = useMutation<
    Response<LoginResponse>,
    Error,
    RegisterRequest
  >({
    mutationFn: registerUser,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        login(response.data);
        toast.success('Account created successfully!', {
          description: `Welcome, ${response.data.firstName}!`,
        });
        navigate('/');
      } else {
        toast.error('Registration failed', {
          description: response.message || 'Please try again.',
        });
      }
    },
    onError: (error) => {
      toast.error('Registration failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

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
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First name</Label>
                <Input
                  id='firstName'
                  type='text'
                  placeholder='John'
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                />
                {errors.firstName && (
                  <p className='text-sm text-destructive'>
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last name</Label>
                <Input
                  id='lastName'
                  type='text'
                  placeholder='Doe'
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                />
                {errors.lastName && (
                  <p className='text-sm text-destructive'>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm password</Label>
              <PasswordInput
                id='confirmPassword'
                placeholder='••••••••'
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className='text-sm text-destructive'>
                  {errors.confirmPassword.message}
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
