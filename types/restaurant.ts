// @/types/restaurant.ts

export interface RestaurantImageEntity {
    id: number | null;
    url: string;
}

export interface Address {
    id: number;
    street: string;
    city: string;
    email?: string;
}

export interface OpenHour {
    id: number | null;
    openDays: string;
    startTime: string;
    endTime: string;
}

export interface RestaurantOwner {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    userPublicId: string;
    orderCount: number;
    address: Address;
    roles: { id: number; name: string }[];
    enabled: boolean;
}

export interface FoodImageEntity {
    id: number;
    url: string;
}

export interface Food {
    id: number;
    name: string;
    description: string;
    price: number;
    foodImageEntities: FoodImageEntity[];
    tag: string;
    recipe: string;
    estimatedPrepTime: number;
}

export interface Drink {
    id: number;
    name: string;
    restaurantId: number;
    price: number;
    imageUrl: string;
}

export interface Menu {
    id: number;
    name: string;
    description: string;
    foods: Food[];
}

export interface Restaurant {
    id: number | null;
    name: string;
    restaurantPublicId?: string; // UUID for external use
    tag: string;
    description: string;
    registerDate: string;
    subscriptionEndDate?: string;
    menus: Menu[];
    drinks: Drink[];
    street: string;
    city: string;
    email?: string;
    phone: string;
    website?: string;
    logoUrl?: string;
    bannerImageUrl?: string;
    restaurantStatus: string;
    createdBy: RestaurantOwner;
    attendants: any[];
    chefs: any[];
    configuration: any;
    pinNumber?: string;
    
    // Legacy fields for backward compatibility
    address?: Address[];
    restaurantImageEntities?: RestaurantImageEntity[];
    phoneNumber?: string;
    openHours?: OpenHour[];
    rate?: number;
    latitude?: number;
    longitude?: number;
    owner?: RestaurantOwner;
    isActive?: boolean;
    clicks?: number;
    usersRated?: number;
    isApproved?: boolean;
    isFeature?: boolean;
    featuredDate?: string | null;
}

export interface RestaurantResponse {
    content: Restaurant[]; // This is the actual array
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    // ... other pagination fields
}

////////

/**
 * Main Order structure based on backend response
 */
export interface OrderResponse {
    id: number;
    user: User;
    restaurant: Restaurant | null;
    orderItems: OrderItem[];
    orderTime: string; // ISO date string
    subTotal: number;
    agent: Agent | null;
    orderStatus: OrderStatus;
    deliveryAddress: string;
    deliveryLatitude: number;
    deliveryLongitude: number;
    deliveryContactName: string;
    deliveryContactPhone: string;
    timeAtACCEPTED: string | null;
    timePrepEnd: string | null;
    timeDelivery: string | null;
    orderRemark: string;
    drinkOrderItems: Drink[];
    deliveryPrice: number;
    redeemedPrice: number;
    promotionRedeemed: boolean;
    orderPhone: string | null;
    orderReferrerPhone: string;
    isRestaurantOrder: boolean;
    orderName: string | null;
}

export interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    userPublicId: string;
    orderCount: number;
    agentId: number | null;
    isAgent: boolean;
    userDeviceId: string;
    promotionOrdersCount: number;
    promotionBalance: number;
    address: Address;
    roles: Role[];
    enabled: boolean;
    locked: boolean;
}

export interface OrderItem {
    id: number;
    food: Food;
    quantity: number;
}

export interface Agent {
    id: number;
    user: User;
    agentBio: string | null;
    profileImageUrl: string | null;
}

export interface Role {
    id: number;
    name: string;
}

export interface OrderStatus {
    id: number;
    status: string;
}