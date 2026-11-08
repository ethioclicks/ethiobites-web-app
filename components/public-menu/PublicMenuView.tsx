'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type {
  PublicDrink,
  PublicFood,
  PublicRestaurantMenu,
} from '@/types/publicMenu';
import { fetchPublicMenu } from '@/lib/api/publicMenu';
import {
  DEFAULT_LANG,
  type MenuLang,
} from '@/lib/i18n/menuTranslations';
import {
  filterDrinks,
  filterFoods,
  firstActiveCategoryId,
  visibleCategories,
  type CategoryId,
} from '@/lib/menu/menuLogic';
import RestaurantHeader from './RestaurantHeader';
import CategoryTabs from './CategoryTabs';
import MenuControls from './MenuControls';
import FoodCard from './FoodCard';
import DrinkCard from './DrinkCard';
import DetailModal, { type DetailItem } from './DetailModal';
import RestaurantAbout from './RestaurantAbout';
import {
  EmptyResults,
  InvalidState,
  LoadingState,
  UnreachableState,
} from './MenuStates';

type MenuState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: PublicRestaurantMenu }
  | { kind: 'invalid' }
  | { kind: 'unreachable' };

interface PublicMenuViewProps {
  publicId: string;
}

export default function PublicMenuView({ publicId }: PublicMenuViewProps) {
  const [state, setState] = useState<MenuState>({ kind: 'loading' });
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId | null>(
    null
  );
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<MenuLang>(DEFAULT_LANG);
  const [selected, setSelected] = useState<DetailItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!publicId) {
      setState({ kind: 'invalid' });
      return;
    }

    setState({ kind: 'loading' });
    fetchPublicMenu(publicId)
      .then((data) => {
        if (cancelled) return;
        setState({ kind: 'ready', data });
        const hasDrinks = (data.drinks?.length ?? 0) > 0;
        setActiveCategoryId(firstActiveCategoryId(data.menus ?? [], hasDrinks));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setState({ kind: 'invalid' });
        } else {
          setState({ kind: 'unreachable' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [publicId]);

  const data = state.kind === 'ready' ? state.data : null;
  const categories = useMemo(
    () => visibleCategories(data?.menus ?? []),
    [data]
  );
  const hasDrinks = (data?.drinks?.length ?? 0) > 0;
  const isDrinksActive = activeCategoryId === 'drinks';

  const activeFoods: PublicFood[] = useMemo(() => {
    if (!data || isDrinksActive) return [];
    const menu = data.menus?.find((m) => m.id === activeCategoryId);
    return filterFoods(menu?.foods ?? [], search, false);
  }, [data, activeCategoryId, isDrinksActive, search]);

  const activeDrinks: PublicDrink[] = useMemo(() => {
    if (!data || !isDrinksActive) return [];
    return filterDrinks(data.drinks ?? [], search);
  }, [data, isDrinksActive, search]);

  if (state.kind === 'loading') return <LoadingState lang={lang} />;
  if (state.kind === 'invalid') return <InvalidState lang={lang} />;
  if (state.kind === 'unreachable') return <UnreachableState lang={lang} />;

  const showEmpty = isDrinksActive
    ? activeDrinks.length === 0
    : activeFoods.length === 0;

  return (
    <div className="min-h-screen bg-[#0B1220] pb-16">
      <RestaurantHeader
        restaurant={state.data}
        lang={lang}
        onLangToggle={() => setLang((l) => (l === 'en' ? 'am' : 'en'))}
      />

      <MenuControls search={search} onSearchChange={setSearch} lang={lang} />

      <CategoryTabs
        menus={categories}
        hasDrinks={hasDrinks}
        activeCategoryId={activeCategoryId}
        lang={lang}
        onSelect={(id) => {
          setActiveCategoryId(id);
          setSearch('');
        }}
      />

      <main className="mx-auto max-w-5xl px-4 pt-5">
        {showEmpty ? (
          <EmptyResults lang={lang} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {isDrinksActive
              ? activeDrinks.map((drink) => (
                  <DrinkCard
                    key={drink.id}
                    drink={drink}
                    onOpen={setSelected}
                  />
                ))
              : activeFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    lang={lang}
                    onOpen={setSelected}
                  />
                ))}
          </div>
        )}
      </main>

      <DetailModal
        item={selected}
        lang={lang}
        onClose={() => setSelected(null)}
      />

      <RestaurantAbout restaurant={state.data} lang={lang} />
    </div>
  );
}
