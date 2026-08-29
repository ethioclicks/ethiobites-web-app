// Types for the public digital menu feature.
// These mirror the backend PublicRestaurantMenuDTO projection served by
// GET /public/restaurant-menu/{publicId}.

export interface PublicFood {
  id: number;
  name: string;
  description?: string;
  price: number;
  tag?: string;
  ingredients?: string;
  allergens?: string;
  isVegetarian?: boolean;
  servingSize?: string;
  spicinessLevel?: number;
  estimatedPrepTime?: number;
  imageUrl?: string | null;
  available: boolean;
}

export interface PublicDrink {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string | null;
}

export interface PublicMenu {
  id: number;
  name: string;
  description?: string;
  foods: PublicFood[];
}

export interface PublicRestaurantMenu {
  id: number;
  name: string;
  description?: string;
  tag?: string;
  street?: string;
  city?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  bannerImageUrl?: string;
  restaurantPublicId: string;
  menus: PublicMenu[];
  drinks: PublicDrink[];
}
