import { useState } from 'react';
import type { PublicDrink } from '@/types/publicMenu';

interface DrinkCardProps {
  drink: PublicDrink;
  onOpen: (drink: PublicDrink) => void;
}

function FallbackIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white/5 text-gray-500">
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12l-1 7a5 5 0 01-10 0L6 3zM12 15v6m-4 0h8" />
      </svg>
    </div>
  );
}

/**
 * Dark-theme drink card: image with fallback, white name, orange price
 * (Req 6.3, 6.4).
 */
export default function DrinkCard({ drink, onOpen }: DrinkCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(drink)}
      className="flex flex-col overflow-hidden rounded-2xl bg-[#111a2b] text-left shadow-md ring-1 ring-white/5 transition hover:ring-accent-orange/40 focus:outline-none focus:ring-2 focus:ring-accent-orange/60"
    >
      <div className="relative h-36 w-full">
        {drink.imageUrl && !imageError ? (
          <img
            src={drink.imageUrl}
            alt={drink.name}
            loading="lazy"
            crossOrigin="anonymous"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <FallbackIcon />
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="truncate text-sm font-bold text-white">{drink.name}</h3>
        <div className="mt-auto pt-3 text-sm">
          <span className="font-bold text-accent-orange">
            {drink.price.toFixed(2)} ETB
          </span>
        </div>
      </div>
    </button>
  );
}
