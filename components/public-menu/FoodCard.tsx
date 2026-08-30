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
    <div className="flex h-full w-full items-center justify-center bg-white/5 text-gray-500">
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 11h18M5 11a7 7 0 0114 0M4 15h16a1 1 0 011 1 3 3 0 01-3 3H6a3 3 0 01-3-3 1 1 0 011-1z" />
      </svg>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

/**
 * Dark-theme food card: image with fallback, white title, muted description,
 * orange price, prep time with a clock icon, plus vegetarian/unavailable
 * badges (Req 4.5–4.9).
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
      className="flex flex-col overflow-hidden rounded-2xl bg-[#111a2b] text-left shadow-md ring-1 ring-white/5 transition hover:ring-accent-orange/40 focus:outline-none focus:ring-2 focus:ring-accent-orange/60"
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
            <span className="rounded-full bg-accent-green/90 px-2 py-0.5 text-xs font-medium text-white">
              {t.vegetarian}
            </span>
          )}
          {!food.available && (
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-gray-200">
              {t.unavailable}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="truncate text-sm font-bold text-white">{food.name}</h3>
        {food.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-400">
            {food.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span className="font-bold text-accent-orange">
            {food.price.toFixed(2)} ETB
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <ClockIcon />
            {prepStr}
          </span>
        </div>
      </div>
    </button>
  );
}
