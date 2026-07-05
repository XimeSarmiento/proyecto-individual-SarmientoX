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
