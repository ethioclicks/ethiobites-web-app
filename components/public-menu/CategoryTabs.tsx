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

function tabClass(active: boolean): string {
  return active
    ? 'rounded-full bg-accent-orange px-5 py-2 text-sm font-bold uppercase tracking-wide text-white shadow'
    : 'rounded-full px-3 py-2 text-sm font-semibold text-gray-400 transition hover:text-gray-200';
}

/**
 * Dark-theme category tabs: active tab is an orange filled uppercase pill,
 * inactive tabs are muted text. One tab per menu with foods, plus an appended
 * Drinks tab when drinks exist (Req 4.1, 4.2, 4.4, 6.1, 6.2).
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
    <nav className="mt-4 border-b border-white/5">
      <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3">
        {menus.map((menu) => (
          <button
            key={menu.id}
            type="button"
            onClick={() => onSelect(menu.id)}
            className={`${tabClass(menu.id === activeCategoryId)} whitespace-nowrap`}
          >
            {menu.name}
          </button>
        ))}
        {hasDrinks && (
          <button
            type="button"
            onClick={() => onSelect('drinks')}
            className={`${tabClass(activeCategoryId === 'drinks')} whitespace-nowrap`}
          >
            {t.drinksTab}
          </button>
        )}
      </div>
    </nav>
  );
}
