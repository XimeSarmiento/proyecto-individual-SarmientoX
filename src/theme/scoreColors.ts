import type { Product } from '@/src/types/product';

export const NUTRI_SCORE_COLORS: Record<Product['nutriScore'], string> = {
  A: '#038141',
  B: '#85bb2f',
  C: '#fecb02',
  D: '#ee8100',
  E: '#e63e11',
  '-': '#9b9b9b',
};

export const ECO_SCORE_COLORS: Record<Product['ecoScore'], string> = {
  'A+': '#047d3f',
  A: '#1e9b50',
  'B+': '#69ad45',
  B: '#85bb2f',
  C: '#f5b921',
  D: '#ef7d20',
  E: '#df292f',
  '-': '#9b9b9b',
};

export const NOVA_COLORS: Record<Product['novaGroup'], string> = {
  1: '#a9ca45',
  2: '#f5a33a',
  3: '#ff7133',
  4: '#08b9dd',
  '?': '#9b9b9b',
};
