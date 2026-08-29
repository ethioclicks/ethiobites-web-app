import type { MenuLang } from '@/lib/i18n/menuTranslations';
import { translations } from '@/lib/i18n/menuTranslations';

interface MenuControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  lang: MenuLang;
  onLangToggle: () => void;
}

/**
 * Search box and en/am language toggle (Req 7.6).
 */
export default function MenuControls({
  search,
  onSearchChange,
  lang,
  onLangToggle,
}: MenuControlsProps) {
  const t = translations[lang];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onLangToggle}
          className="rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          aria-label="Toggle language"
        >
          {t.langLabel}
        </button>
      </div>
    </div>
  );
}
