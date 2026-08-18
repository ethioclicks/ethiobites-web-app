import { useState } from 'react';
import Link from 'next/link';
import { Restaurant } from '@/types/restaurant';
import Card from '@/components/ui/Card';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onManageSubscription: (restaurant: Restaurant) => void;
  onDelete?: (restaurantId: number) => void;
  showActions?: boolean;
}

export default function RestaurantCard({ 
  restaurant, 
  onManageSubscription, 
  onDelete,
  showActions = true 
}: RestaurantCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getSubscriptionStatus = () => {
    if (restaurant.isActive && restaurant.isApproved) {
      return { text: 'Active Subscription', color: 'bg-green-100 text-green-700' };
    } else if (restaurant.isApproved && !restaurant.isActive) {
      return { text: 'Subscription Expired', color: 'bg-yellow-100 text-yellow-700' };
    } else if (!restaurant.isApproved) {
      return { text: 'Pending Approval', color: 'bg-gray-100 text-gray-700' };
    }
    return { text: 'Inactive', color: 'bg-red-100 text-red-700' };
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError && restaurant.restaurantImageEntities?.[0]?.url ? (
          <img
            src={restaurant.restaurantImageEntities[0].url}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${subscriptionStatus.color}`}>
            {subscriptionStatus.text}
          </span>
          {restaurant.isFeature && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Featured
            </span>
          )}
        </div>

        {/* Delete Button (if onDelete is provided) */}
        {onDelete && (
          <button
            onClick={() => onDelete(restaurant.id!)}
            className="absolute top-3 left-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
            title="Delete restaurant"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={restaurant.name}>
            {restaurant.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{restaurant.address?.[0]?.street || 'No address set'}</span>
          </div>

          {restaurant.phoneNumber && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{restaurant.phoneNumber}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {restaurant.rate > 0 ? restaurant.rate.toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {restaurant.clicks || 0}
            </div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {restaurant.menus?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Menus</div>
          </div>
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="space-y-2">
            <Link
              href={`/restaurant/${restaurant.id}`}
              className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center block"
            >
              Manage Restaurant
            </Link>
            
            <button
              onClick={() => onManageSubscription(restaurant)}
              className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              {restaurant.isActive ? 'Manage Subscription' : 'Subscribe Now'}
            </button>

            {/* Quick stats for owners */}
            <div className="flex justify-between items-center pt-2 text-xs text-gray-500 border-t">
              <span>Owner: {restaurant.owner?.firstName} {restaurant.owner?.lastName}</span>
              <span>ID: {restaurant.id}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}