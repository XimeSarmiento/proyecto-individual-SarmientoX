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

export type Product = {
  id: string;
  name: string;
  maker: string;
  categoryId: string;
  brandId: string;
  nutriScore: 'A' | 'B' | 'C';
  ecoScore: 'A+' | 'A' | 'B+' | 'B';
  novaGroup: 1 | 2 | 3;
  energy: string;
  fat: string;
  protein: string;
  ingredients: string;
  allergens: string;
  nutrition: Array<{
    label: string;
    value: string;
    detail?: boolean;
  }>;
};

export const categories: Category[] = [
  { id: 'beverages', label: 'beverages', title: 'Beverages', color: '#1398de', icon: 'glass' },
  { id: 'dairies', label: 'dairies', title: 'Dairies', color: '#ffe160', icon: 'tint' },
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

const categoryProducts: Record<string, string[]> = {
  beverages: [
    'Organic Cold Pressed Kale & Ginger',
    'Artisan Sparkling Botanical Mist',
    'Wild Berry Raw Kombucha',
    'Pure Philippine Coconut Water',
    'High-Mineral Volcanic Seltzer',
  ],
  dairies: [
    'Creamy Meadow Greek Yogurt',
    'Alpine Vanilla Kefir',
    'Soft Farmhouse Ricotta',
    'Golden Butter Cultured Spread',
    'Fresh Milk Morning Blend',
  ],
  snacks: [
    'Sea Salt Lentil Crisps',
    'Smoked Paprika Corn Bites',
    'Roasted Chickpea Trail Mix',
    'Herbed Rice Snack Squares',
    'Crunchy Tomato Seed Clusters',
  ],
  breakfasts: [
    'Maple Sunrise Oat Cups',
    'Toasted Honey Granola',
    'Berry Chia Breakfast Bowl',
    'Cinnamon Ancient Grain Puffs',
    'Apple Almond Morning Muesli',
  ],
  desserts: [
    'Velvet Vanilla Pudding',
    'Lemon Cloud Custard',
    'Dark Cherry Frozen Cream',
    'Salted Caramel Rice Dessert',
    'Coconut Mango Sweet Pot',
  ],
  chocolates: [
    'Single Origin Dark Square',
    'Hazelnut Cocoa Tablet',
    'Sea Salt Milk Chocolate',
    'Crunchy Almond Cocoa Bar',
    'Velvet Truffle Mini Bites',
  ],
  'biscuits-and-cakes': [
    'Oat Honey Breakfast Biscuit',
    'Lemon Tea Cake Slice',
    'Cocoa Marble Mini Cake',
    'Vanilla Shortbread Rounds',
    'Spiced Apple Soft Cookie',
  ],
  'cereals-and-potatoes': [
    'Rustic Potato Gnocchi',
    'Golden Corn Flake Bowl',
    'Quinoa Garden Grain Mix',
    'Sweet Potato Crunch Cubes',
    'Whole Wheat Spiral Cereal',
  ],
  meals: [
    'Garden Tomato Pasta Bowl',
    'Mediterranean Chickpea Plate',
    'Herbed Rice & Lentil Tray',
    'Pumpkin Sage Risotto Cup',
    'Mushroom Barley Comfort Pot',
  ],
  'plant-based-foods': [
    'Smoky Pea Protein Burger',
    'Silky Oat Barista Drink',
    'Chickpea Herb Falafel',
    'Cashew Cream Alfredo',
    'Green Lentil Protein Bites',
  ],
};

const makers = [
  'Green Garden Co.',
  'Mist & Flora',
  'The Fermentary',
  'Isla Vida',
  'Summit Springs',
];

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

export const products: Product[] = categories.flatMap((category, categoryIndex) =>
  categoryProducts[category.id].map((name, productIndex) => {
    const brand = brands[(categoryIndex * 5 + productIndex) % brands.length];

    return {
      id: `${category.id}-${productIndex + 1}`,
      name,
      maker: makers[productIndex],
      categoryId: category.id,
      brandId: brand.id,
      ...scorePairs[productIndex],
      novaGroup: productIndex === 0 ? 1 : productIndex === 1 ? 3 : 2,
      energy: productIndex === 0 ? '193 kJ' : `${210 + productIndex * 18} kJ`,
      fat: `${(1.1 + productIndex * 0.4).toFixed(1)}g`,
      protein: `${(1 + productIndex * 0.6).toFixed(1)}g`,
      ingredients:
        'Water, oats (10%), rapeseed oil, minerals (calcium carbonate, dibasic calcium phosphate, potassium iodide), salt, vitamins (D2, riboflavin, B12).',
      allergens:
        productIndex % 2 === 0
          ? 'Contains gluten (oats). May contain traces of soy.'
          : 'May contain traces of milk, nuts and sesame.',
      nutrition: nutritionValues,
    };
  }),
);
