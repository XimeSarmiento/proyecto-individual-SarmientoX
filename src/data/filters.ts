import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof FontAwesome>['name'];

export type Category = {
  id: string;
  label: string;
  title: string;
  color: string;
  icon?: IconName;
};

export type Brand = {
  id: string;
  name: string;
  title: string;
  mark?: string;
  color?: string;
  text?: string;
};

export type Taste = {
  id: string;
  title: string;
};

export const categories: Category[] = [
  { id: 'beverages', label: 'beverages', title: 'Beverages', color: '#1398de' },
  { id: 'dairies', label: 'dairies', title: 'Dairies', color: '#ffe160' },
  { id: 'snacks', label: 'snacks', title: 'Snacks', color: '#e83375' },
  { id: 'breakfasts', label: 'breakfasts', title: 'Breakfasts', color: '#ff7918' },
  { id: 'desserts', label: 'desserts', title: 'Desserts', color: '#7448e8' },
  { id: 'chocolates', label: 'chocolates', title: 'Chocolates', color: '#201d1a' },
  {
    id: 'biscuits-and-cakes',
    label: 'biscuits-and-cakes',
    title: 'Biscuits & Cakes',
    color: '#bb6d00',
  },
  {
    id: 'cereals-and-potatoes',
    label: 'cereals-and-potatoes',
    title: 'Cereals & Potatoes',
    color: '#11aa85',
  },
  { id: 'meals', label: 'meals', title: 'Meals', color: '#df301e' },
  {
    id: 'plant-based-foods',
    label: 'plant-based-foods',
    title: 'Plant-Based Foods',
    color: '#15953e',
  },
];

export const brands: Brand[] = [
  { id: 'nestle', name: 'nestle', title: 'Nestle', mark: 'NESTLE', color: '#cfe0ff', text: '#3563c6' },
  { id: 'coca-cola', name: 'coca-cola', title: 'Coca-Cola', mark: 'COKE', color: '#ffdede', text: '#e22228' },
  { id: 'pepsi', name: 'pepsi', title: 'Pepsi', mark: 'PEPSI', color: '#321c9b', text: '#ffffff' },
  { id: 'danone', name: 'danone', title: 'Danone', mark: 'DANONE', color: '#1097da', text: '#ffffff' },
  { id: 'kelloggs', name: 'kelloggs', title: 'Kelloggs', mark: 'KELLOGGS', color: '#ffe0de', text: '#d13f41' },
  { id: 'unilever', name: 'unilever', title: 'Unilever' },
  { id: 'mondelez', name: 'mondelez', title: 'Mondelez' },
  { id: 'mars', name: 'mars', title: 'Mars' },
  { id: 'ferrero', name: 'ferrero', title: 'Ferrero' },
  { id: 'lactalis', name: 'lactalis', title: 'Lactalis' },
];

export const tastes: Taste[] = [
  { id: 'organic', title: 'Organic' },
  { id: 'vegan', title: 'Vegan' },
  { id: 'vegetarian', title: 'Vegetarian' },
  { id: 'gluten-free', title: 'Gluten Free' },
  { id: 'no-added-sugar', title: 'No Added Sugar' },
  { id: 'fair-trade', title: 'Fair Trade' },
  { id: 'lactose-free', title: 'Lactose Free' },
  { id: 'palm-oil-free', title: 'Palm Oil Free' },
  { id: 'high-fiber', title: 'High Fiber' },
  { id: 'low-fat', title: 'Low Fat' },
];
