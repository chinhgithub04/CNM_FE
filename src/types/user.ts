// User/Account management types

export type UserRole = 'Admin' | 'User' | 'Manager';
export type UserStatus = 0 | 1; // 0: Inactive, 1: Active

// Request types
export interface CreateUserRequest {
    FullName: string;
    UserName: string;
    Email: string;
    Password: string;
    PhoneNumber?: string;
    Role?: string;
    Status?: UserStatus;
}

export interface UpdateUserRequest {
    FullName?: string;
    UserName?: string;
    Email?: string;
    PhoneNumber?: string;
    Role?: string;
    Status?: UserStatus;
}

export interface UpdateUserPasswordRequest {
    CurrentPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}

// Response types
export interface User {
    Id: string;
    FullName: string;
    UserName: string | null;
    Email: string | null;
    PhoneNumber: string | null;
    EmailConfirmed: boolean;
    PhoneNumberConfirmed: boolean;
    AccessFailedCount: number;
    LockoutEnd: string | null;
    Status: UserStatus;
    Roles: UserRoleInfo[];
    CreatedAt?: string;
    UpdatedAt?: string;
}

export interface UserRoleInfo {
    Id: string;
    Name: string;
    NormalizedName: string | null;
}

// Helper types for UI
export interface UserListItem extends User {
    displayRole: string;
    displayStatus: string;
    statusColor: 'green' | 'red';
}
