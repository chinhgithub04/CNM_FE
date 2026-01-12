import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthContext();

  return useMutation<Response<Token>, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.code === '200' && response.data) {
        setToken(response.data.access_token);
        setUser(response.data);
        toast.success('Đăng nhập thành công!', {
          description: 'Chào mừng trở lại!',
        });
        navigate('/');
      } else {
        toast.error('Đăng nhập thất bại', {
          description:
            response.message || 'Vui lòng kiểm tra thông tin đăng nhập.',
        });
      }
    },
    onError: (error) => {
      toast.error('Đăng nhập thất bại', {
        description: error.message || 'Đã xảy ra lỗi không mong muốn.',
      });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
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
        toast.success('Tạo tài khoản thành công!', {
          description: 'Chào mừng!',
        });
        navigate('/');
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
        toast.error('Đăng ký thất bại', {
          description: response.message || 'Vui lòng thử lại.',
        });
      }
    },
    onError: (error) => {
      toast.error('Đăng ký thất bại', {
        description: error.message || 'Đã xảy ra lỗi không mong muốn.',
      });
    },
  });
};
