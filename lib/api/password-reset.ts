import { apiClient } from './client';

export interface PhoneCheckPayload {
  phoneNumber: string;
  attempt: number;
}

export interface PasswordResetPayload {
  phoneNumber: string;
  userPassword: string; // New password
  attempt: number;
}

export interface DeactivateAccountPayload {
  password: string;
  reason?: string;
}

export interface ReactivateAccountPayload {
  email: string;
}

/**
 * Check if phone number exists in the system
 */
export async function checkPhoneNumber(phoneNumber: string, attempt: number = 1): Promise<boolean> {
  try {
    const response = await apiClient.post('/public/phone-number-check', {
      phoneNumber,
      attempt
    });
    // If response is 200 (OK), user exists
    return true;
  } catch (error: any) {
    console.error('Phone number check error:', error);
    
    if (error.response?.status === 404) {
      // User not found
      return false;
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred. Please try again later');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please check your connection and try again');
    } else {
      throw new Error('Unable to check phone number. Please try again');
    }
  }
}

/**
 * Reset user password using phone number
 */
export async function resetUserPassword(phoneNumber: string, newPassword: string, attempt: number = 1): Promise<void> {
  try {
    await apiClient.post('/public/user-password-reset', {
      phoneNumber,
      userPassword: newPassword,
      attempt
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Phone number not found in the system');
    } else if (error.response?.status === 406) {
      throw new Error('New password does not meet security requirements');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred. Please try again later');
    } else {
      throw new Error('Unable to reset password. Please try again');
    }
  }
}

/**
 * Deactivate user account
 */
export async function deactivateAccount(password: string, reason?: string): Promise<void> {
  try {
    await apiClient.post('/user/deactivate', {
      password,
      reason
    });
  } catch (error: any) {
    console.error('Deactivate account error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please sign in again');
    } else if (error.response?.status === 400) {
      throw new Error('Incorrect password');
    } else {
      throw new Error('Unable to deactivate account. Please try again');
    }
  }
}

/**
 * Request account reactivation - sends email with reactivation link
 */
export async function requestAccountReactivation(email: string): Promise<void> {
  try {
    await apiClient.post('/public/reactivate-account', { email });
  } catch (error: any) {
    console.error('Request reactivation error:', error);
    
    if (error.response?.status === 404) {
      throw new Error('No deactivated account found with this email address');
    } else if (error.response?.status === 400) {
      throw new Error('Account is already active');
    } else {
      throw new Error('Unable to process reactivation request. Please try again later');
    }
  }
}

/**
 * Validate password locally
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (password.length > 50) {
      errors.push('Password must not exceed 50 characters');
    }
    
    // Optional: Add more security requirements
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least one letter');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
/**
 * Validate phone number format (Ethiopian phone numbers)
 */
export function validatePhoneNumber(phoneNumber: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!phoneNumber) {
    errors.push('Phone number is required');
  } else {
    // Remove spaces and special characters for validation
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Check if it's a valid Ethiopian phone number
    if (!/^(\+251|0)?[79]\d{8}$/.test(cleanPhone)) {
      errors.push('Please enter a valid Ethiopian phone number');
    }
    
    if (cleanPhone.length < 9 || cleanPhone.length > 13) {
      errors.push('Phone number must be between 9 and 13 digits');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
/**
 * Request password reset - sends email with reset link (legacy function for compatibility)
 */
export async function forgotPassword(phoneNumber: string): Promise<void> {
  try {
    const userExists = await checkPhoneNumber(phoneNumber, 1);
    if (!userExists) {
      throw new Error('No account found with this phone number');
    }
    // For now, just check if user exists. In future, this could trigger SMS/email
    return Promise.resolve();
  } catch (error: any) {
    throw error;
  }
}

/**
 * Reset password with token (legacy function for compatibility)
 */
export async function resetPassword(phoneNumber: string, newPassword: string): Promise<void> {
  return resetUserPassword(phoneNumber, newPassword, 1);
}

/**
 * Verify reset token validity (legacy function for compatibility)
 */
export async function verifyResetToken(phoneNumber: string): Promise<{ phoneNumber: string; valid: boolean }> {
  try {
    const userExists = await checkPhoneNumber(phoneNumber, 1);
    return { phoneNumber, valid: userExists };
  } catch (error: any) {
    return { phoneNumber, valid: false };
  }
}