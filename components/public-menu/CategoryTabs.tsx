import type { PublicMenu } from '@/types/publicMenu';
import type { MenuLang } from '@/lib/i18n/menuTranslations';
import { translations } from '@/lib/i18n/menuTranslations';
import type { CategoryId } from '@/lib/menu/menuLogic';

interface CategoryTabsProps {
  menus: PublicMenu[]; // already filtered to menus with >= 1 food
  hasDrinks: boolean;
  activeCategoryId: CategoryId | null;
  lang: MenuLang;
  onSelect: (id: CategoryId) => void;
}

/**
 * One tab per menu with foods, plus an appended Drinks tab when drinks exist
 * (Req 4.1, 4.2, 4.4, 6.1, 6.2).
 */
export default function CategoryTabs({
  menus,
  hasDrinks,
  activeCategoryId,
  lang,
  onSelect,
}: CategoryTabsProps) {
  const t = translations[lang];

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-2">
        {menus.map((menu) => {
          const active = menu.id === activeCategoryId;
          return (
            <button
              key={menu.id}
              type="button"
              onClick={() => onSelect(menu.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {menu.name}
            </button>
          );
        })}
        {hasDrinks && (
          <button
            type="button"
            onClick={() => onSelect('drinks')}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategoryId === 'drinks'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.drinksTab}
          </button>
        )}
      </div>
    </nav>
  );
}
