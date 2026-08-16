export interface UserAddress {
  street: string;
  city: string;
}

export interface User {
  userPublicId: string;
  firstName: string;
  lastName: string;
  userName: string; // Phone number
  email: string;
  address: UserAddress;
  isEmailVerified: boolean;
  userStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  thumbnail?: string; // Profile image URL
  verifiedEmail?: string;
}

export interface NewUserDetail {
  userPublicId?: string;
  firstName: string;
  lastName: string;
  userName: string; // Phone number
  userPassword: string;
  email: string;
  address: UserAddress;
  thumbnail?: string;
  verifiedEmail?: string;
  isEmailVerified?: boolean;
  roles?: Role[];
}

export interface UserProfileModel {
  userPublicId: string;
  firstName: string;
  lastName: string;
  userName?: string; // Phone number (legacy field name)
  phoneNumber?: string; // Phone number (from backend)
  userPassword?: string;
  email: string;
  address: UserAddress;
  thumbnail?: string; // Profile image URL
  verifiedEmail?: string;
  isEmailVerified?: boolean;
  roles?: Role[];
  userDeviceId?: string;
  createdAt?: string;
}

export interface AuthenticationRequest {
  userName: string; // Phone number
  password: string;
}

export interface TokenPayload {
  token: string;
  pid: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  verifiedEmail?: string;
  isEmailVerified?: boolean;
  roles: string[];
}

export interface UserResetModel {
  phoneNumber: string;
  userName?: string;
  userPassword?: string;
  attempt: number;
}

export interface Role {
  id?: number;
  name: string;
}

export interface UserAlerts {
  id: number;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isViewed: boolean;
  createdAt: string;
}
// Type guards for runtime type checking
export function isTokenPayload(obj: any): obj is TokenPayload {
  return (
    obj &&
    typeof obj.token === 'string' &&
    typeof obj.pid === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.email === 'string' &&
    Array.isArray(obj.roles)
  );
}

export function isUserProfileModel(obj: any): obj is UserProfileModel {
  return (
    obj &&
    typeof obj.userPublicId === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.userName === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.isEmailVerified === 'boolean' &&
    obj.address &&
    typeof obj.address.street === 'string' &&
    typeof obj.address.city === 'string'
  );
}