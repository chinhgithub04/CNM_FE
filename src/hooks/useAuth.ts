import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loginUser, registerUser } from '@/services/authService';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import type {
  LoginRequest,
  RegisterRequest,
  Token,
  UserResponse,
} from '@/types/auth';
import type { Response } from '@/types/common';

export const useLogin = () => {
  const { setToken, setUser } = useAuthContext();

  return useMutation<Response<Token>, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.code === '200' && response.data) {
        setToken(response.data.access_token);
        setUser(response.data);
        toast.success('Login successful!', {
          description: 'Welcome back!',
        });
        // Navigation will be handled by PublicOnlyRoute based on role
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
};

export const useRegister = () => {
  const { setToken, setUser } = useAuthContext();

  const loginMutation = useMutation<
    Response<Token>,
    Error,
    { Email: string; Password: string }
  >({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.code === '200' && response.data) {
        setToken(response.data.access_token);
        setUser(response.data);
        toast.success('Account created successfully!', {
          description: 'Welcome!',
        });
        // Navigation will be handled by PublicOnlyRoute based on role
      }
    },
  });

  return useMutation<Response<UserResponse>, Error, RegisterRequest>({
    mutationFn: registerUser,
    onSuccess: (response, variables) => {
      if (response.code === '201' && response.data) {
        // Auto-login after successful registration
        loginMutation.mutate({
          Email: variables.Email,
          Password: variables.Password,
        });
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
};
