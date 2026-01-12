export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface Token {
  FullName: string;
  UserName: string;
  Email: string;
  AvatarUrl: string | null;
  Role: string;
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  FullName: string;
  UserName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

export interface UserResponse {
  Id: string;
  FullName: string;
  UserName: string | null;
  Email: string | null;
  EmailConfirmed: boolean;
  PhoneNumberConfirmed: boolean;
  AccessFailedCount: number;
  LockoutEnd: string | null;
  Status: number;
  Roles: Role[];
}

export interface Role {
  Id: string;
  Name: string;
  NormalizedName: string | null;
}

export interface UserMeResponse {
  FullName: string;
  UserName: string | null;
  Email: string | null;
  PhoneNumber: string | null;
}
