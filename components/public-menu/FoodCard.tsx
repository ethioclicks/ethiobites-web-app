import { useState } from 'react';
import type { PublicFood } from '@/types/publicMenu';
import type { MenuLang } from '@/lib/i18n/menuTranslations';
import { translations } from '@/lib/i18n/menuTranslations';

interface FoodCardProps {
  food: PublicFood;
  lang: MenuLang;
  onOpen: (food: PublicFood) => void;
}

function FallbackIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 11h18M5 11a7 7 0 0114 0M4 15h16a1 1 0 011 1 3 3 0 01-3 3H6a3 3 0 01-3-3 1 1 0 011-1z" />
      </svg>
    </div>
  );
}

/**
 * Food card: name, price to two decimals + ETB, prep time, image with fallback,
 * vegetarian badge, and an unavailable badge when available === false
 * (Req 4.5–4.9).
 */
export default function FoodCard({ food, lang, onOpen }: FoodCardProps) {
  const [imageError, setImageError] = useState(false);
  const t = translations[lang];
  const prepStr = food.estimatedPrepTime
    ? `${food.estimatedPrepTime} ${t.mins}`
    : '--';

  return (
    <button
      type="button"
      onClick={() => onOpen(food)}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <div className="relative h-36 w-full">
        {food.imageUrl && !imageError ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            loading="lazy"
            crossOrigin="anonymous"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <FallbackIcon />
        )}

        <div className="absolute left-2 top-2 flex gap-1">
          {food.isVegetarian && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {t.vegetarian}
            </span>
          )}
          {!food.available && (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
              {t.unavailable}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {food.name}
        </h3>
        {food.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {food.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="font-bold text-primary-700">
            {food.price.toFixed(2)} ETB
          </span>
          <span className="text-xs text-gray-500">{prepStr}</span>
        </div>
      </div>
    </button>
  );
}
