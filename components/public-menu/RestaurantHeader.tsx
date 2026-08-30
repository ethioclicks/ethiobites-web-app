import type { PublicRestaurantMenu } from '@/types/publicMenu';
import { composeAddress } from '@/lib/menu/menuLogic';
import type { MenuLang } from '@/lib/i18n/menuTranslations';
import { translations } from '@/lib/i18n/menuTranslations';

interface RestaurantHeaderProps {
  restaurant: PublicRestaurantMenu;
  lang: MenuLang;
  onLangToggle: () => void;
}

function LocationIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-accent-orange" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-accent-orange" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.56a1 1 0 01-.24 1.02l-2.21 2.21z" />
    </svg>
  );
}

/**
 * Dark-theme restaurant header: brand bar with logo mark + language toggle,
 * a darkened banner, an overlapping rounded logo, the restaurant name, a
 * truncated description, and location/phone chips (Req 3.1–3.7, 7.6).
 */
export default function RestaurantHeader({
  restaurant,
  lang,
  onLangToggle,
}: RestaurantHeaderProps) {
  const address = composeAddress(restaurant.street, restaurant.city);
  const t = translations[lang];

  return (
    <header className="relative">
      {/* Banner background */}
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        {restaurant.bannerImageUrl ? (
          <img
            src={restaurant.bannerImageUrl}
            alt=""
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1b2436] to-[#0B1220]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/80 via-[#0B1220]/40 to-[#0B1220]" />

        {/* Brand bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent-orange to-primary-500 text-xs font-bold text-white">
              EB
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-white">
              Ethio Bites
            </span>
          </div>
          <button
            type="button"
            onClick={onLangToggle}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Toggle language"
          >
            {t.langLabel}
          </button>
        </div>
      </div>

      {/* Details overlapping the banner */}
      <div className="relative z-10 mx-auto -mt-16 max-w-5xl px-4">
        <div className="flex items-end gap-3">
          {restaurant.logoUrl && (
            <img
              src={restaurant.logoUrl}
              alt={`${restaurant.name} logo`}
              className="h-20 w-20 flex-shrink-0 rounded-2xl border-2 border-accent-orange object-cover shadow-lg"
              crossOrigin="anonymous"
            />
          )}
          <div className="min-w-0 pb-1">
            <h1 className="truncate text-2xl font-bold text-white">
              {restaurant.name}
            </h1>
          </div>
        </div>

        {restaurant.description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-300">
            {restaurant.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {address && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-200">
              <LocationIcon />
              {address}
            </span>
          )}
          {restaurant.phone && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-200">
              <PhoneIcon />
              {restaurant.phone}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
