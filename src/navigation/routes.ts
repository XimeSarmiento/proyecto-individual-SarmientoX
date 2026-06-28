import type { Href } from 'expo-router';

export const ROUTES = {
  HOME: '/',
  TABS_SEARCH: '/search',
  TABS_FAVORITES: '/favorites',
  CATEGORIA: '/categorias/[nombre]',
  MARCA: '/marcas/[nombre]',
  TASTE: '/tastes/[nombre]',
  FICHA: '/ficha/[id]',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
type RouteParams = Record<string, string | number | boolean | undefined>;

export const buildRoute = (route: AppRoute, params?: RouteParams): Href => {
  if (!params) {
    return route as Href;
  }

  return {
    pathname: route,
    params,
  } as Href;
};

export function fichaShowRoute(id: string, originType?: 'categoria' | 'marca' | 'taste', originId?: string) {
  return buildRoute(ROUTES.FICHA, { id, originType, originId });
}
