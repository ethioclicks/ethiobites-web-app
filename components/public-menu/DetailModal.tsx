import { Dialog, DialogPanel } from '@headlessui/react';
import type { PublicDrink, PublicFood } from '@/types/publicMenu';
import type { MenuLang } from '@/lib/i18n/menuTranslations';
import { translations } from '@/lib/i18n/menuTranslations';

export type DetailItem = PublicFood | PublicDrink;

interface DetailModalProps {
  item: DetailItem | null;
  lang: MenuLang;
  onClose: () => void;
}

function isFood(item: DetailItem): item is PublicFood {
  return (item as PublicFood).available !== undefined;
}

function PepperIcons({ level }: { level: number }) {
  if (!level || level <= 0) return null;
  return (
    <span className="inline-flex gap-0.5" aria-label={`spiciness ${level}`}>
      {Array.from({ length: level }).map((_, i) => (
        <svg
          key={i}
          data-testid="pepper-icon"
          className="h-4 w-4 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17 3c-1 2-3 3-5 3-3 0-6 2-7 6-1 4 1 8 5 8 5 0 9-5 9-11 0-2 0-4-2-6z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Detail modal supporting both food and drink items. Shows name and ETB price
 * always; description, prep time, serving size, ingredients, allergens,
 * vegetarian badge, and spiciness (as pepper icons) are conditional
 * (Req 5.1–5.10, 6.5). Closes via the close control, outside click, and Escape
 * (handled by Headless UI Dialog).
 */
export default function DetailModal({ item, lang, onClose }: DetailModalProps) {
  const t = translations[lang];
  const open = item !== null;
  const food = item && isFood(item) ? item : null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <DialogPanel className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl">
          {item && (
            <div>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  crossOrigin="anonymous"
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-1 text-lg font-semibold text-primary-700">
                  {item.price.toFixed(2)} ETB
                </div>

                {food?.isVegetarian && (
                  <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {t.vegetarian}
                  </span>
                )}

                <p className="mt-3 text-sm text-gray-600">
                  {item.description || t.notSpecified}
                </p>

                {food && (
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500">{t.labelPrep}</dt>
                      <dd className="font-medium text-gray-900">
                        {food.estimatedPrepTime
                          ? `${food.estimatedPrepTime} ${t.mins}`
                          : '--'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">{t.labelServing}</dt>
                      <dd className="font-medium text-gray-900">
                        {food.servingSize || '--'}
                      </dd>
                    </div>
                    {food.spicinessLevel !== undefined &&
                      food.spicinessLevel !== null &&
                      food.spicinessLevel > 0 && (
                        <div>
                          <dt className="text-gray-500">{t.labelSpicy}</dt>
                          <dd>
                            <PepperIcons level={food.spicinessLevel} />
                          </dd>
                        </div>
                      )}
                  </dl>
                )}

                {food?.ingredients && (
                  <div className="mt-4 text-sm">
                    <div className="text-gray-500">{t.labelIngredients}</div>
                    <div className="font-medium text-gray-900">
                      {food.ingredients}
                    </div>
                  </div>
                )}

                {food?.allergens && (
                  <div className="mt-3 text-sm">
                    <div className="text-gray-500">{t.labelAllergens}</div>
                    <div className="font-medium text-gray-900">
                      {food.allergens}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
