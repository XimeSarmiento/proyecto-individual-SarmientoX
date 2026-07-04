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

export type Product = {
  id: string;
  name: string;
  maker: string;
  categoryId: string;
  brandId: string;
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E' | '-';
  ecoScore: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'E' | '-';
  novaGroup: 1 | 2 | 3 | 4 | '?';
  imageUrl?: string;
  energy: string;
  fat: string;
  protein: string;
  ingredients: string;
  hasIngredients: boolean;
  allergens: string;
  hasNutritionInfo: boolean;
  nutrition: Array<{
    label: string;
    value: string;
    detail?: boolean;
  }>;
};

export const categories: Category[] = [
  { id: 'beverages', label: 'beverages', title: 'Beverages', color: '#1398de' },
  { id: 'dairies', label: 'dairies', title: 'Dairies', color: '#ffe160'},
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

type ProductSeed = {
  name: string;
  brandId: Brand['id'];
};

const categoryProducts: Record<string, ProductSeed[]> = {
  beverages: [
    { name: 'Agua mineral con gas', brandId: 'nestle' },
    { name: 'Gaseosa cola clasica', brandId: 'coca-cola' },
    { name: 'Refresco cola sin azucar', brandId: 'pepsi' },
    { name: 'Yogur bebible de frutilla', brandId: 'danone' },
    { name: 'Bebida de avena con cacao', brandId: 'kelloggs' },
  ],
  dairies: [
    { name: 'Yogur natural cremoso', brandId: 'danone' },
    { name: 'Leche entera familiar', brandId: 'lactalis' },
    { name: 'Postre lacteo de chocolate', brandId: 'nestle' },
    { name: 'Yogur griego con frutos rojos', brandId: 'danone' },
    { name: 'Queso crema clasico', brandId: 'lactalis' },
  ],
  snacks: [
    { name: 'Papas crocantes sabor queso', brandId: 'pepsi' },
    { name: 'Galletitas saladas con hierbas', brandId: 'mondelez' },
    { name: 'Mix de mani y chocolate', brandId: 'mars' },
    { name: 'Avellanas tostadas con cacao', brandId: 'ferrero' },
    { name: 'Cubitos de queso', brandId: 'lactalis' },
  ],
  breakfasts: [
    { name: 'Cereal de maiz con miel', brandId: 'kelloggs' },
    { name: 'Avena instantanea con banana', brandId: 'nestle' },
    { name: 'Copos de arroz chocolatados', brandId: 'kelloggs' },
    { name: 'Granola con almendras', brandId: 'kelloggs' },
    { name: 'Muesli integral con manzana', brandId: 'nestle' },
  ],
  desserts: [
    { name: 'Flan de vainilla con caramelo', brandId: 'nestle' },
    { name: 'Helado de crema americana', brandId: 'unilever' },
    { name: 'Mousse de chocolate aireado', brandId: 'mondelez' },
    { name: 'Postre de avellana y leche', brandId: 'ferrero' },
    { name: 'Arroz con leche cremoso', brandId: 'lactalis' },
  ],
  chocolates: [
    { name: 'Tableta de chocolate con leche', brandId: 'nestle' },
    { name: 'Barra de chocolate y mani', brandId: 'mars' },
    { name: 'Bocaditos de chocolate blanco', brandId: 'mondelez' },
    { name: 'Bombones de avellana', brandId: 'ferrero' },
    { name: 'Chocolate relleno de dulce de leche', brandId: 'mars' },
  ],
  'biscuits-and-cakes': [
    { name: 'Galletitas de avena y miel', brandId: 'mondelez' },
    { name: 'Alfajor de chocolate', brandId: 'mondelez' },
    { name: 'Budin marmolado individual', brandId: 'nestle' },
    { name: 'Cookies con chips de chocolate', brandId: 'mars' },
    { name: 'Bizcochos dulces de vainilla', brandId: 'mondelez' },
  ],
  'cereals-and-potatoes': [
    { name: 'Pure de papas instantaneo', brandId: 'unilever' },
    { name: 'Cereal de maiz dorado', brandId: 'kelloggs' },
    { name: 'Arroz integral con vegetales', brandId: 'unilever' },
    { name: 'Papas noisette congeladas', brandId: 'unilever' },
    { name: 'Cereal integral en espirales', brandId: 'kelloggs' },
  ],
  meals: [
    { name: 'Sopa crema de verduras', brandId: 'unilever' },
    { name: 'Arroz con lentejas especiado', brandId: 'unilever' },
    { name: 'Risotto de calabaza', brandId: 'nestle' },
    { name: 'Guiso de cebada y hongos', brandId: 'unilever' },
  ],
  'plant-based-foods': [
    { name: 'Hamburguesa vegetal de arvejas', brandId: 'unilever' },
    { name: 'Bebida vegetal para cafe', brandId: 'danone' },
    { name: 'Falafel de garbanzos', brandId: 'unilever' },
    { name: 'Salsa vegetal tipo alfredo', brandId: 'danone' },
    { name: 'Bocaditos de lentejas verdes', brandId: 'unilever' },
  ],
};

const scorePairs: Array<Pick<Product, 'nutriScore' | 'ecoScore'>> = [
  { nutriScore: 'A', ecoScore: 'A+' },
  { nutriScore: 'C', ecoScore: 'B' },
  { nutriScore: 'B', ecoScore: 'A' },
  { nutriScore: 'A', ecoScore: 'B+' },
  { nutriScore: 'A', ecoScore: 'A' },
];

const nutritionValues = [
  { label: 'Energy', value: '46 kcal / 193 kJ' },
  { label: 'Fat', value: '1.5g' },
  { label: '— of which saturates', value: '0.2g', detail: true },
  { label: 'Carbohydrate', value: '6.7g' },
  { label: '— of which sugars', value: '4.1g', detail: true },
  { label: 'Fibre', value: '0.8g' },
  { label: 'Protein', value: '1.0g' },
  { label: 'Salt', value: '0.10g' },
];

export const products: Product[] = categories.flatMap((category) =>
  categoryProducts[category.id].map((product, productIndex) => {
    const brand = brands.find((item) => item.id === product.brandId);

    if (!brand) {
      throw new Error(`Unknown brand "${product.brandId}" for product "${product.name}"`);
    }

    return {
      id: `${category.id}-${productIndex + 1}`,
      name: product.name,
      maker: brand.title,
      categoryId: category.id,
      brandId: brand.id,
      ...scorePairs[productIndex],
      novaGroup: productIndex === 0 ? 1 : productIndex === 1 ? 3 : 2,
      energy: productIndex === 0 ? '193 kJ' : `${210 + productIndex * 18} kJ`,
      fat: `${(1.1 + productIndex * 0.4).toFixed(1)}g`,
      protein: `${(1 + productIndex * 0.6).toFixed(1)}g`,
      ingredients:
        'Water, oats (10%), rapeseed oil, minerals (calcium carbonate, dibasic calcium phosphate, potassium iodide), salt, vitamins (D2, riboflavin, B12).',
      hasIngredients: true,
      allergens:
        productIndex % 2 === 0
          ? 'Contains gluten (oats). May contain traces of soy.'
          : 'May contain traces of milk, nuts and sesame.',
      hasNutritionInfo: true,
      nutrition: nutritionValues,
    };
  }),
);
