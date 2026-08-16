'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import AddressInput from '@/components/forms/AddressInput';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture,
  changePassword,
  validateProfileData,
  UpdateProfilePayload
} from '@/lib/api/profile';
import { UserProfileModel, UserAddress } from '@/types/user';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [editData, setEditData] = useState<UpdateProfilePayload>({
    firstName: '',
    lastName: '',
    email: '',
    address: { street: '', city: '' },
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/profile');
    }
  }, [status, router]);

  // Load profile data
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Ensure token is synced to localStorage before making API calls
      if (session.accessToken) {
        localStorage.setItem('token', session.accessToken);
      }
      if (session.user?.pid) {
        localStorage.setItem('pid', session.user.pid);
      }
      loadProfile();
    }
  }, [status, session]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await getUserProfile();
      console.log('Profile data from API:', JSON.stringify(profileData, null, 2));
      setProfile(profileData);
      
      // Initialize edit form with current data
      setEditData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        address: profileData.address || { street: '', city: '' },
        thumbnail: profileData.thumbnail,
      });
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      setErrors({ load: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      if (profile) {
        setEditData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          address: profile.address || { street: '', city: '' },
          thumbnail: profile.thumbnail,
        });
      }
      setErrors({});
    }
    setIsEditing(!isEditing);
    setSuccessMessage('');
  };

  const handleInputChange = (field: keyof UpdateProfilePayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (address: UserAddress) => {
    setEditData(prev => ({ ...prev, address }));
    
    // Clear address errors
    setErrors(prev => ({
      ...prev,
      addressStreet: '',
      addressCity: '',
    }));
  };

  const handleProfilePictureUpload = async (imageUrl: string) => {
    try {
      const updatedProfile = await updateProfilePicture(imageUrl);
      setProfile(updatedProfile);
      setEditData(prev => ({ ...prev, thumbnail: imageUrl }));
      setSuccessMessage('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile picture:', error);
      setErrors({ profilePicture: error.message });
    }
  };

  const handleSaveProfile = async () => {
    // Validate form data
    const validationErrors = validateProfileData(editData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const updatedProfile = await updateUserProfile(editData);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setErrors({ save: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate password fields
    const passwordErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      passwordErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      passwordErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      passwordErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      passwordErrors.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== passwordData.newPassword) {
      passwordErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    try {
      const phoneNumber = profile?.phoneNumber || profile?.userName || session?.user?.username || '';
      if (!phoneNumber) {
        setErrors({ password: 'Phone number not available. Please reload the page.' });
        return;
      }
      await changePassword({
        userName: phoneNumber,
        password: passwordData.newPassword,
      });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setConfirmPassword('');
      setErrors({});
      setSuccessMessage('Password changed successfully!');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      setErrors({ password: error.message });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Header />
        <Container>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading size="lg" />
          </div>
        </Container>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <Container>
          <div className="text-center py-8">
            <p className="text-text-secondary">Unable to load profile data.</p>
            <Button onClick={loadProfile} className="mt-4">
              Try Again
            </Button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
            <p className="text-text-secondary">Manage your account information</p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
              disabled={isEditing}
            >
              Change Password
            </Button>
            
            <Button
              variant={isEditing ? 'ghost' : 'primary'}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm mb-6">
            {successMessage}
          </div>
        )}

        {/* Error Messages */}
        {(errors.load || errors.save) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">
            {errors.load || errors.save}
          </div>
        )}

        {/* Profile Card */}
        <Card className="p-6">
          {/* Profile Picture Section */}
          <div className="text-center mb-8">
            <ProfilePictureUpload
              currentImage={profile.thumbnail}
              onImageUploaded={handleProfilePictureUpload}
              disabled={!isEditing}
            />
            {errors.profilePicture && (
              <p className="text-sm text-red-500 mt-2">{errors.profilePicture}</p>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={isEditing ? editData.firstName : profile.firstName}
                onChange={handleInputChange('firstName')}
                error={errors.firstName}
                disabled={!isEditing}
                required
              />
              
              <Input
                label="Last Name"
                value={isEditing ? editData.lastName : profile.lastName}
                onChange={handleInputChange('lastName')}
                error={errors.lastName}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              value={isEditing ? editData.email : profile.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              disabled={!isEditing}
              required
            />

            {/* Phone Number (Read-only) */}
            <Input
              label="Phone Number"
              value={profile.phoneNumber || profile.userName || 'Not set'}
              disabled={true}
              helperText="Contact support to change your phone number"
            />

            {/* Address */}
            {isEditing ? (
              <AddressInput
                value={editData.address}
                onChange={handleAddressChange}
                errors={{
                  street: errors.addressStreet,
                  city: errors.addressCity,
                }}
              />
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Address
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-text-primary">{profile.address?.street || 'Not set'}</p>
                  <p className="text-text-secondary text-sm">{profile.address?.city || 'Not set'}</p>
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Member Since
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-text-secondary">
                    {profile.createdAt 
                      ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Unknown'
                    }
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Account Status
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Edit Mode */}
            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  loading={isSaving}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Password Change Modal */}
        <Modal 
          isOpen={showPasswordModal} 
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '' });
            setConfirmPassword('');
            setErrors({});
          }}
          title="Change Password"
        >
          <div className="space-y-4">
            {errors.password && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {errors.password}
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => {
                setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }));
                if (errors.currentPassword) {
                  setErrors(prev => ({ ...prev, currentPassword: '' }));
                }
              }}
              error={errors.currentPassword}
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => {
                setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                if (errors.newPassword) {
                  setErrors(prev => ({ ...prev, newPassword: '' }));
                }
              }}
              error={errors.newPassword}
              helperText="At least 6 characters"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }
              }}
              error={errors.confirmPassword}
              required
            />

            <div className="flex space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleChangePassword}
                className="flex-1"
              >
                Change Password
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Container>
    </>
  );
}