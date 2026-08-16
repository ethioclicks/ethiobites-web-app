import { apiClient } from './client';
import { UserProfileModel, UserAddress } from '@/types/user';

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  address: UserAddress;
  thumbnail?: string; // Changed from profilePicture to thumbnail
}

export interface ChangePasswordPayload {
  userName: string; // Phone number
  password: string; // New password
}

/**
 * Get current user profile
 */
export async function getUserProfile(): Promise<UserProfileModel> {
  try {
    // The pid header is automatically added by the API client interceptor
    const response = await apiClient.get<UserProfileModel>('/user');
    return response.data;
  } catch (error: any) {
    console.error('Get profile error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please sign in again.');
    } else if (error.response?.status === 404) {
      throw new Error('User profile not found');
    } else {
      throw new Error('Unable to load profile. Please try again.');
    }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileData: UpdateProfilePayload): Promise<UserProfileModel> {
  try {
    // The pid header is automatically added by the API client interceptor
    const response = await apiClient.post<UserProfileModel>('/user', profileData);
    return response.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please sign in again.');
    } else if (error.response?.status === 406) {
      // NOT_ACCEPTABLE - validation errors
      const validationErrors = error.response.data || {};
      const errorMessage = Object.values(validationErrors).join('. ');
      throw new Error(errorMessage || 'Profile update failed due to validation errors');
    } else if (error.response?.status === 409) {
      throw new Error('Email address is already in use by another account');
    } else {
      throw new Error('Unable to update profile. Please try again.');
    }
  }
}

/**
 * Update profile picture
 */
export async function updateProfilePicture(imageUrl: string): Promise<UserProfileModel> {
  try {
    // Update profile with new thumbnail URL
    const currentProfile = await getUserProfile();
    const updatedProfile = {
      ...currentProfile,
      thumbnail: imageUrl
    };
    
    const response = await apiClient.post<UserProfileModel>('/user', updatedProfile);
    return response.data;
  } catch (error: any) {
    console.error('Update profile picture error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please sign in again.');
    } else {
      throw new Error('Unable to update profile picture. Please try again.');
    }
  }
}

/**
 * Change user password
 */
export async function changePassword(passwordData: ChangePasswordPayload): Promise<string> {
  try {
    // Ensure token is available for this request
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('Change password - token available:', !!token);
    console.log('Change password - sending:', { userName: passwordData.userName, password: '***' });
    
    const response = await apiClient.post<string>('/user/change-password', {
      userName: passwordData.userName,
      password: passwordData.password,
    });
    return response.data;
  } catch (error: any) {
    console.error('Change password error:', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Authentication required. Please sign in again.');
    } else if (error.response?.status === 404) {
      throw new Error('User not found');
    } else if (error.response?.status === 406) {
      throw new Error('Password does not meet requirements');
    } else {
      throw new Error('Unable to change password. Please try again.');
    }
  }
}

/**
 * Validate profile update data locally
 */
export function validateProfileData(data: Partial<UpdateProfilePayload>): Record<string, string> {
  const errors: Record<string, string> = {};

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

  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
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

/**
 * Get unviewed alerts count for user
 */
export async function getUnviewedAlertsCount(): Promise<number> {
  try {
    const response = await apiClient.get<number>('/profile/unviewed-alerts/count');
    return response.data;
  } catch (error: any) {
    console.error('Get alerts count error:', error);
    return 0; // Return 0 if unable to fetch alerts
  }
}

/**
 * Mark alert as viewed
 */
export async function markAlertAsViewed(alertId: number): Promise<void> {
  try {
    await apiClient.get(`/profile/alert/${alertId}/viewed`);
  } catch (error: any) {
    console.error('Mark alert as viewed error:', error);
    throw new Error('Unable to update alert status');
  }
}