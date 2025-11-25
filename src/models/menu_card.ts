// File: src/types/menu-card.ts

export interface MenuCard {
  menuCardId: string;
  menuCardName: string;
  createdDate?: string;
  kitchenId: string;
  kitchenName?: string;
  createdById: string;
  createdByName?: string;
  status: 'DRAFT' | 'APPROVED' | 'CANCELLED';
  note?: string;
  createdAt: string;
  modifiedDate: string;
  details: MenuCardDetail[];
}

export interface MenuCardDetail {
  detailId: string;
  dishId: string;
  dishName: string;
  servings: number;
  note?: string;
  ingredients: MenuCardDetailIngredient[];
}

export interface MenuCardDetailIngredient {
  id: string;
  ingredientId: string;
  ingredientName: string;
  standard: number;
  unit: string;
  note?: string;
}

export interface MenuCardCreateRequest {
  menuCardName: string;
  createdDate?: string;
  kitchenId: string;
  note?: string;
  details: MenuCardDetailRequest[];
}

export interface MenuCardDetailRequest {
  dishId: string;
  servings: number;
  note?: string;
  ingredients?: MenuCardDetailIngredientRequest[];
}

export interface MenuCardDetailIngredientRequest {
  ingredientId: string;
  standard: number;
  unit: string;
  note?: string;
}
