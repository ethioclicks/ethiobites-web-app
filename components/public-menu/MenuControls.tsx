import type { MenuLang } from '@/lib/i18n/menuTranslations';
import { translations } from '@/lib/i18n/menuTranslations';

interface MenuControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  lang: MenuLang;
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  );
}

/**
 * Dark-theme search box (Req 7.1–7.4). The language toggle lives in the header.
 */
export default function MenuControls({
  search,
  onSearchChange,
  lang,
}: MenuControlsProps) {
  const t = translations[lang];

  return (
    <div className="mx-auto max-w-5xl px-4 pt-5">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-400 focus:border-accent-orange/60 focus:outline-none focus:ring-1 focus:ring-accent-orange/40"
        />
      </div>
    </div>
  );
}
