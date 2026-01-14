// Component for creating and editing user accounts
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';
import type { CreateUserRequest, UpdateUserRequest, User } from '@/types/user';

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

interface FormData {
  FullName: string;
  UserName: string;
  Email: string;
  PhoneNumber?: string;
  Password?: string;
  Role: string;
  Status: string;
}

export function AccountFormDialog({
  open,
  onOpenChange,
  user,
}: AccountFormDialogProps) {
  const isEditMode = !!user;
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      FullName: '',
      UserName: '',
      Email: '',
      PhoneNumber: '',
      Password: '',
      Role: 'User',
      Status: '1',
    },
  });

  const selectedRole = watch('Role');
  const selectedStatus = watch('Status');

  useEffect(() => {
    if (user) {
      // Map backend role names to form values
      let roleValue = 'User'; // default
      if (user.Roles && user.Roles.length > 0) {
        const roleName = user.Roles[0].Name;
        if (roleName === 'Admin') roleValue = 'Admin';
        else if (roleName === 'Manager') roleValue = 'Manager';
        else if (roleName === 'Customer') roleValue = 'User';
        else roleValue = 'User';
      }

      reset({
        FullName: user.FullName,
        UserName: user.UserName || '',
        Email: user.Email || '',
        PhoneNumber: user.PhoneNumber || '',
        Password: '',
        Role: roleValue,
        Status: user.Status.toString(),
      });
    } else {
      reset({
        FullName: '',
        UserName: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        Role: 'User',
        Status: '1',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode) {
        const updateData: UpdateUserRequest = {
          FullName: data.FullName,
          UserName: data.UserName,
          Email: data.Email,
          PhoneNumber: data.PhoneNumber,
          Role: data.Role,
          Status: parseInt(data.Status) as 0 | 1,
        };
        await updateUserMutation.mutateAsync({
          id: user.Id,
          data: updateData,
        });
      } else {
        if (!data.Password) {
          alert('Mật khẩu là bắt buộc khi tạo tài khoản mới');
          return;
        }
        const createData: CreateUserRequest = {
          FullName: data.FullName,
          UserName: data.UserName,
          Email: data.Email,
          PhoneNumber: data.PhoneNumber,
          Password: data.Password,
          Role: data.Role,
          Status: parseInt(data.Status) as 0 | 1,
        };
        await createUserMutation.mutateAsync(createData);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Chỉnh sửa Tài khoản' : 'Thêm Tài khoản Mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin tài khoản người dùng.'
              : 'Tạo tài khoản người dùng mới cho hệ thống.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='FullName'>
              Họ tên <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='FullName'
              {...register('FullName', {
                required: 'Họ tên là bắt buộc',
              })}
              placeholder='Nhập họ tên đầy đủ'
            />
            {errors.FullName && (
              <p className='text-sm text-red-600'>{errors.FullName.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='UserName'>
              Tên đăng nhập <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='UserName'
              {...register('UserName', {
                required: 'Tên đăng nhập là bắt buộc',
              })}
              placeholder='Nhập tên đăng nhập'
            />
            {errors.UserName && (
              <p className='text-sm text-red-600'>{errors.UserName.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='Email'>
              Email <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='Email'
              type='email'
              {...register('Email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
              placeholder='Nhập địa chỉ email'
            />
            {errors.Email && (
              <p className='text-sm text-red-600'>{errors.Email.message}</p>
            )}
          </div>

          {!isEditMode && (
            <div className='space-y-2'>
              <Label htmlFor='Password'>
                Mật khẩu <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='Password'
                type='password'
                {...register('Password', {
                  required: isEditMode ? false : 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                })}
                placeholder='Nhập mật khẩu'
              />
              {errors.Password && (
                <p className='text-sm text-red-600'>
                  {errors.Password.message}
                </p>
              )}
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='Role'>Vai trò</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setValue('Role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn vai trò' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Admin'>Quản trị viên</SelectItem>
                <SelectItem value='User'>Người dùng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='Status'>Trạng thái</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setValue('Status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>Hoạt động</SelectItem>
                <SelectItem value='0'>Vô hiệu hóa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={
                createUserMutation.isPending || updateUserMutation.isPending
              }
            >
              {createUserMutation.isPending || updateUserMutation.isPending
                ? 'Đang lưu...'
                : isEditMode
                ? 'Cập nhật'
                : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
