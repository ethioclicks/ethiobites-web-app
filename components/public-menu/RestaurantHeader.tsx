import type { PublicRestaurantMenu } from '@/types/publicMenu';
import { composeAddress } from '@/lib/menu/menuLogic';

interface RestaurantHeaderProps {
  restaurant: PublicRestaurantMenu;
}

/**
 * Renders the restaurant name always; banner, logo, description, address, and
 * phone are shown only when present (Req 3.1–3.7).
 */
export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const address = composeAddress(restaurant.street, restaurant.city);

  return (
    <header className="w-full">
      {restaurant.bannerImageUrl && (
        <div className="relative h-40 w-full sm:h-56 md:h-64">
          <img
            src={restaurant.bannerImageUrl}
            alt=""
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-start gap-4">
          {restaurant.logoUrl && (
            <img
              src={restaurant.logoUrl}
              alt={`${restaurant.name} logo`}
              className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-white shadow"
              crossOrigin="anonymous"
            />
          )}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-gray-900">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="mt-1 text-sm text-gray-600">
                {restaurant.description}
              </p>
            )}
            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
              {address && <span>{address}</span>}
              {restaurant.phone && <span>{restaurant.phone}</span>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
