import { useState } from 'react';
import type { PublicDrink } from '@/types/publicMenu';

interface DrinkCardProps {
  drink: PublicDrink;
  onOpen: (drink: PublicDrink) => void;
}

function FallbackIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12l-1 7a5 5 0 01-10 0L6 3zM12 15v6m-4 0h8" />
      </svg>
    </div>
  );
}

/**
 * Drink card: name, price in ETB, image with fallback (Req 6.3, 6.4).
 */
export default function DrinkCard({ drink, onOpen }: DrinkCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(drink)}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {drink.name}
        </h3>
        <div className="mt-auto pt-2 text-sm">
          <span className="font-bold text-primary-700">
            {drink.price.toFixed(2)} ETB
          </span>
        </div>
      </div>
    </button>
  );
}
