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
 * Get a specific restaurant by public ID (UUID)
 */
export async function getRestaurantByPublicId(publicId: string): Promise<Restaurant> {
  try {
    const response = await apiClient.get<Restaurant>(`/user/restaurants/by-public-id/${publicId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch restaurant by public ID:', error);
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

