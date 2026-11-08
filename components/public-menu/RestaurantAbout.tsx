'use client';

import { useState } from 'react';
import type { PublicRestaurantMenu } from '@/types/publicMenu';
import { composeAddress } from '@/lib/menu/menuLogic';
import type { MenuLang } from '@/lib/i18n/menuTranslations';

interface RestaurantAboutProps {
  restaurant: PublicRestaurantMenu;
  lang: MenuLang;
}

function WebIcon() {
  return (
    <svg className="h-4 w-4 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-4 w-4 text-accent-orange" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4 text-accent-orange" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.56a1 1 0 01-.24 1.02l-2.21 2.21z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const labels: Record<string, { en: string; am: string }> = {
  about: { en: 'About', am: 'ስለ' },
  address: { en: 'Address', am: 'አድራሻ' },
  phone: { en: 'Phone', am: 'ስልክ' },
  website: { en: 'Website', am: 'ድር ጣቢያ' },
  poweredBy: { en: 'Powered by EthioBite', am: 'በ EthioBite የተሰራ' },
};

function t(key: string, lang: MenuLang): string {
  return labels[key]?.[lang] ?? labels[key]?.['en'] ?? key;
}

/**
 * Collapsible "About this restaurant" section on the dark public menu page.
 * Shows the restaurant's full description, address, phone, and website.
 * Includes a "Powered by EthioBite" footer (Req 3.1–3.7).
 */
export default function RestaurantAbout({ restaurant, lang }: RestaurantAboutProps) {
  const [open, setOpen] = useState(false);
  const address = composeAddress(restaurant.street, restaurant.city);

  const hasContent =
    restaurant.description || address || restaurant.phone || restaurant.website;

  if (!hasContent) return null;

  return (
    <div className="mx-auto mt-10 max-w-5xl px-4">
      <div className="overflow-hidden rounded-2xl bg-[#111a2b] ring-1 ring-white/5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-white">
            {t('about', lang)} {restaurant.name}
          </span>
          <ChevronIcon open={open} />
        </button>

        {open && (
          <div className="border-t border-white/5 px-5 pb-5 pt-4 space-y-4">
            {restaurant.description && (
              <p className="text-sm leading-relaxed text-gray-300">
                {restaurant.description}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {address && (
                <div className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3">
                  <LocationIcon />
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      {t('address', lang)}
                    </div>
                    <div className="mt-0.5 text-sm text-gray-200">{address}</div>
                  </div>
                </div>
              )}

              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <PhoneIcon />
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      {t('phone', lang)}
                    </div>
                    <div className="mt-0.5 text-sm text-gray-200">{restaurant.phone}</div>
                  </div>
                </a>
              )}

              {restaurant.website && (
                <a
                  href={
                    restaurant.website.startsWith('http')
                      ? restaurant.website
                      : `https://${restaurant.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/10 sm:col-span-2"
                >
                  <WebIcon />
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      {t('website', lang)}
                    </div>
                    <div className="mt-0.5 text-sm text-accent-orange underline underline-offset-2">
                      {restaurant.website}
                    </div>
                  </div>
                </a>
              )}
            </div>

            <div className="pt-1 text-center text-xs text-gray-500">
              {t('poweredBy', lang)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
