import type { MenuLang } from '@/lib/i18n/menuTranslations';
import { translations } from '@/lib/i18n/menuTranslations';

interface StateProps {
  lang?: MenuLang;
}

/**
 * Full-screen loading state (Req 1.4).
 */
export function LoadingState({ lang = 'en' }: StateProps) {
  const t = translations[lang];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0B1220] text-gray-300">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-accent-orange" />
      <p>{t.loadingText}</p>
    </div>
  );
}

/**
 * Invalid-link error state, for 404 and empty publicId (Req 8.1, 8.3, 8.5).
 */
export function InvalidState({ lang = 'en' }: StateProps) {
  const t = translations[lang];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0B1220] px-6 text-center">
      <h1 className="text-lg font-semibold text-white">{t.invalidTitle}</h1>
      <p className="text-sm text-gray-400">{t.invalidMessage}</p>
    </div>
  );
}

/**
 * Server-unreachable error state, for network/5xx failures (Req 8.2).
 */
export function UnreachableState({ lang = 'en' }: StateProps) {
  const t = translations[lang];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0B1220] px-6 text-center">
      <h1 className="text-lg font-semibold text-white">{t.errorTitle}</h1>
      <p className="text-sm text-gray-400">{t.errorMessage}</p>
    </div>
  );
}

/**
 * Empty-results state shown when filtering yields nothing (Req 7.5).
 */
export function EmptyResults({ lang = 'en' }: StateProps) {
  const t = translations[lang];
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-20 text-center">
      <p className="font-medium text-white">{t.emptyTitle}</p>
      <p className="text-sm text-gray-400">{t.emptyDesc}</p>
    </div>
  );
}
