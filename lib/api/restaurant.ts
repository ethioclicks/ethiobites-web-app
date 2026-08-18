import { apiClient } from './client';
import { Restaurant, RestaurantResponse } from '@/types/restaurant';

export interface RestaurantSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  name?: string;
}

/**
 * Get all restaurants owned by the current user
 */
export async function getUserRestaurants(params: RestaurantSearchParams = {}): Promise<RestaurantResponse> {
  try {
    // Use the confirmed working endpoint
    const response = await apiClient.get<RestaurantResponse>('/user/restaurants/by-user', {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        ...(params.name && { name: params.name })
      }
    });
    return response.data;
    
  } catch (error: any) {
    console.error('Failed to fetch user restaurants:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch restaurants');
  }
}

/**
 * Get a specific restaurant by ID
 */
export async function getRestaurant(id: number): Promise<Restaurant> {
  try {
    const response = await apiClient.get<Restaurant>(`/restaurant/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch restaurant:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch restaurant');
  }
}

/**
 * Update restaurant status (activate/deactivate)
 */
export async function updateRestaurantStatus(id: number, isActive: boolean): Promise<Restaurant> {
  try {
    const response = await apiClient.put<Restaurant>(`/restaurant/${id}/status`, {
      isActive
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to update restaurant status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update restaurant status');
  }
}

/**
 * Delete a restaurant
 */
export async function deleteRestaurant(id: number): Promise<void> {
  try {
    await apiClient.delete(`/restaurant/${id}`);
  } catch (error: any) {
    console.error('Failed to delete restaurant:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete restaurant');
  }
}

/**
 * Create or update restaurant subscription
 */
export async function subscribeRestaurant(restaurantId: number, planId: string): Promise<any> {
  try {
    const response = await apiClient.post(`/restaurant/${restaurantId}/subscription`, {
      planId,
      action: 'subscribe'
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to subscribe restaurant:', error);
    throw new Error(error.response?.data?.message || 'Failed to subscribe restaurant');
  }
}

/**
 * Get restaurant subscription details
 */
export async function getRestaurantSubscription(restaurantId: number): Promise<any> {
  try {
    const response = await apiClient.get(`/restaurant/${restaurantId}/subscription`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch subscription:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch subscription');
  }
}

/**
 * Cancel restaurant subscription
 */
export async function cancelRestaurantSubscription(restaurantId: number): Promise<any> {
  try {
    const response = await apiClient.post(`/restaurant/${restaurantId}/subscription`, {
      action: 'cancel'
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to cancel subscription:', error);
    throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
  }
}

/**
 * Get available subscription plans
 */
export async function getSubscriptionPlans(): Promise<any[]> {
  try {
    const response = await apiClient.get('/subscription/plans');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch subscription plans:', error);
    // Return default plans if API call fails
    return [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 500,
        duration: 30,
        features: [
          'Up to 50 orders per month',
          'Basic analytics',
          'Email support',
          'Standard visibility'
        ]
      },
      {
        id: 'standard',
        name: 'Standard Plan',
        price: 1200,
        duration: 30,
        features: [
          'Up to 200 orders per month',
          'Advanced analytics',
          'Priority support',
          'Enhanced visibility',
          'Social media promotion'
        ],
        isPopular: true
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 2500,
        duration: 30,
        features: [
          'Unlimited orders',
          'Complete analytics suite',
          'Dedicated support',
          'Maximum visibility',
          'Featured placement',
          'Marketing tools'
        ]
      }
    ];
  }
}