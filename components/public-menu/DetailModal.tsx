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

function StatBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-white">{children}</div>
    </div>
  );
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
 * Dark-theme bottom-sheet detail modal supporting both food and drink items.
 * Shows name and ETB price always; description, prep time, serving size,
 * ingredients, allergens, vegetarian badge, and spiciness are conditional
 * (Req 5.1–5.10, 6.5). Closes via the close control, outside click, and Escape
 * (handled by Headless UI Dialog).
 */
export default function DetailModal({ item, lang, onClose }: DetailModalProps) {
  const t = translations[lang];
  const open = item !== null;
  const food = item && isFood(item) ? item : null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4">
        <DialogPanel className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[#0F1729] sm:rounded-3xl">
          {item && (
            <div>
              <div className="relative">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    crossOrigin="anonymous"
                    className="h-56 w-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                  <span className="whitespace-nowrap pt-1 text-lg font-bold text-accent-orange">
                    {item.price.toFixed(2)} ETB
                  </span>
                </div>

                {food?.isVegetarian && (
                  <span className="mt-2 inline-block rounded-full bg-accent-green/90 px-2 py-0.5 text-xs font-medium text-white">
                    {t.vegetarian}
                  </span>
                )}

                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  {item.description || t.notSpecified}
                </p>

                {food && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <StatBox label={t.labelPrep}>
                      {food.estimatedPrepTime
                        ? `${food.estimatedPrepTime} ${t.mins}`
                        : '--'}
                    </StatBox>
                    <StatBox label={t.labelServing}>
                      {food.servingSize || '--'}
                    </StatBox>
                    {food.spicinessLevel !== undefined &&
                      food.spicinessLevel !== null &&
                      food.spicinessLevel > 0 && (
                        <StatBox label={t.labelSpicy}>
                          <PepperIcons level={food.spicinessLevel} />
                        </StatBox>
                      )}
                  </div>
                )}

                {food?.ingredients && (
                  <div className="mt-4 text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t.labelIngredients}
                    </div>
                    <div className="mt-1 text-gray-200">{food.ingredients}</div>
                  </div>
                )}

                {food?.allergens && (
                  <div className="mt-3 text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t.labelAllergens}
                    </div>
                    <div className="mt-1 text-gray-200">{food.allergens}</div>
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
