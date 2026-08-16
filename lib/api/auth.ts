import { apiClient } from './client';
import { NewUserDetail, UserAddress, AuthenticationRequest, TokenPayload } from '@/types/user';

export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  userName: string; // Phone number
  userPassword: string;
  email: string;
  address: UserAddress;
}

export interface ValidationResult {
  [key: string]: string;
}

/**
 * Authenticate user login
 */
export async function authenticateUser(credentials: AuthenticationRequest): Promise<TokenPayload> {
  try {
    // Clean phone number (remove spaces and keep last 9 digits for AMS backend)
    const cleanUserName = credentials.userName.replace(/\s+/g, '');
    const last9Digits = cleanUserName.length >= 9 ? cleanUserName.slice(-9) : cleanUserName;
    
    const authRequest = {
      userName: last9Digits,
      password: credentials.password,
    };

    const response = await apiClient.post<TokenPayload>(
      '/public/authenticate', 
      authRequest
    );

    const tokenPayload = response.data;
    
    // Store token and pid in localStorage for subsequent requests
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', tokenPayload.token);
      localStorage.setItem('pid', tokenPayload.pid);
    }
    
    return tokenPayload;
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    if (error.response?.status === 401 || error.response?.status === 400) {
      throw new Error('Invalid phone number or password');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please try again later');
    } else {
      throw new Error(error.message || 'Authentication failed');
    }
  }
}

/**
 * Check user data for validation before registration
 */
export async function checkUserData(userData: Partial<NewUserDetail>): Promise<ValidationResult> {
  try {
    const response = await apiClient.post<ValidationResult>('/public/checkUserData', userData);
    return response.data;
  } catch (error: any) {
    console.error('User data validation error:', error);
    
    if (error.response?.status === 406) {
      // NOT_ACCEPTABLE - validation errors
      return error.response.data || {};
    }
    
    throw new Error('Unable to validate user data. Please try again.');
  }
}

/**
 * Register a new user
 */
export async function registerUser(userData: NewUserDetail): Promise<NewUserDetail> {
  try {
    const response = await apiClient.post<NewUserDetail>('/public/createUser', userData);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.response?.status === 406) {
      // NOT_ACCEPTABLE - validation errors
      const validationErrors = error.response.data || {};
      const errorMessage = Object.values(validationErrors).join('. ');
      throw new Error(errorMessage || 'Registration failed due to validation errors');
    } else if (error.response?.status === 409) {
      throw new Error('An account with this phone number or email already exists');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred during registration. Please try again later');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please check your connection and try again');
    } else {
      throw new Error(error.message || 'Registration failed. Please try again');
    }
  }
}

/**
 * Validate user registration data locally before API calls
 */
export function validateRegistrationData(data: Partial<RegisterUserPayload>): ValidationResult {
  const errors: ValidationResult = {};

  // First name validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Last name validation
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Phone number validation
  if (!data.userName?.trim()) {
    errors.userName = 'Phone number is required';
  } else {
    const phoneDigits = data.userName.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 12) {
      errors.userName = 'Please enter a valid Ethiopian phone number';
    }
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Password validation
  if (!data.userPassword?.trim()) {
    errors.userPassword = 'Password is required';
  } else if (data.userPassword.length < 6) {
    errors.userPassword = 'Password must be at least 6 characters';
  } else if (data.userPassword.length > 50) {
    errors.userPassword = 'Password must not exceed 50 characters';
  }

  // Address validation
  if (!data.address?.street?.trim()) {
    errors.addressStreet = 'Street address is required';
  }

  if (!data.address?.city?.trim()) {
    errors.addressCity = 'City is required';
  }

  return errors;
}