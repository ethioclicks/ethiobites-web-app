import { apiClient } from './client';
import type { PublicRestaurantMenu } from '@/types/publicMenu';

/**
 * Fetches a restaurant's public digital menu.
 *
 * Live-data only: no client-side caching. There is deliberately no
 * localStorage read/write here, and the request carries `Cache-Control:
 * no-store` so every visit reflects the latest backend data.
 *
 * Throws the axios error on failure so callers can distinguish a 404
 * (invalid menu link) from a network/5xx error (server unreachable).
 */
export async function fetchPublicMenu(
  publicId: string
): Promise<PublicRestaurantMenu> {
  const res = await apiClient.get<PublicRestaurantMenu>(
    `/public/restaurant-menu/${encodeURIComponent(publicId)}`,
    { headers: { 'Cache-Control': 'no-store' } }
  );
  return res.data;
}
