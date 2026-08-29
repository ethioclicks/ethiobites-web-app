import type {
  PublicDrink,
  PublicFood,
  PublicMenu,
} from '@/types/publicMenu';

/**
 * A category id is either a menu id (number) or the special 'drinks' bucket.
 */
export type CategoryId = number | 'drinks';

/**
 * Menus that have at least one food, preserving original order (Req 4.1, 4.2).
 */
export function visibleCategories(menus: PublicMenu[]): PublicMenu[] {
  if (!menus) return [];
  return menus.filter((m) => Array.isArray(m.foods) && m.foods.length > 0);
}

/**
 * Initial active category: the first menu that has foods; otherwise 'drinks'
 * when drinks exist; otherwise null (Req 4.3).
 */
export function firstActiveCategoryId(
  menus: PublicMenu[],
  hasDrinks: boolean
): CategoryId | null {
  const withFoods = visibleCategories(menus);
  if (withFoods.length > 0) {
    return withFoods[0].id;
  }
  if (hasDrinks) {
    return 'drinks';
  }
  return null;
}

/**
 * Case-insensitive food filter over name/description/tag, plus an optional
 * vegetarian-only constraint (Req 7.1, 7.2, 7.4).
 */
export function filterFoods(
  foods: PublicFood[],
  query: string,
  vegOnly: boolean
): PublicFood[] {
  if (!foods) return [];
  const q = (query ?? '').toLowerCase().trim();
  return foods.filter((food) => {
    const haystack = [food.name, food.description, food.tag]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = haystack.includes(q);
    const matchesVeg = !vegOnly || food.isVegetarian === true;
    return matchesSearch && matchesVeg;
  });
}

/**
 * Case-insensitive drink filter over name (Req 7.3).
 */
export function filterDrinks(
  drinks: PublicDrink[],
  query: string
): PublicDrink[] {
  if (!drinks) return [];
  const q = (query ?? '').toLowerCase().trim();
  return drinks.filter((drink) => drink.name.toLowerCase().includes(q));
}

/**
 * Compose a header address from the present parts only (Req 3.5). Returns an
 * empty string when both parts are absent, with no stray separator.
 */
export function composeAddress(street?: string, city?: string): string {
  return [street, city].filter((part) => Boolean(part && part.trim())).join(', ');
}

/**
 * Build the public menu URL encoded into the QR image (Req 10.2).
 *
 * Base URL resolution order:
 *   1. An explicit `baseUrl` argument (used by tests).
 *   2. `NEXT_PUBLIC_MENU_BASE_URL` (e.g. https://ethiobite.com in production).
 *   3. `window.location.origin` as a fallback for local development.
 */
export function buildMenuUrl(publicId: string, baseUrl?: string): string {
  const resolved =
    baseUrl ??
    process.env.NEXT_PUBLIC_MENU_BASE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : '');
  const base = resolved.replace(/\/+$/, '');
  return `${base}/restaurant-menu/${publicId}`;
}
