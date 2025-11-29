// models/recipe_standard.ts
import { Dish } from './dish'
import { Ingredient } from './ingredient'
import { Kitchen } from './kitchen'

export interface RecipeStandard {
  standardId: number;
  dishId: string;
  kitchenId: string;
  ingredientId: string;
  dishName?: string;
  kitchenName?: string;
  ingredientName?: string;
  unit: string;
  standardPer1: number;
  note?: string;
  amount?: number;
  updatedById?: string;
  updatedByName?: string;
  createdDate: string;
  modifiedDate: string;
  // Relations
  dish?: Dish;
  kitchen?: Kitchen;
  ingredient?: Ingredient;
}

export interface CreateRecipeStandardInput {
  dishId: string;
  kitchenId: string;
  ingredientId: string;
  unit: string;
  standardPer1: number;
  note?: string;
  amount?: number;
  updatedById?: string;
}

export interface UpdateRecipeStandardInput {
  kitchenId?: string;
  standardPer1?: number;
  unit?: string;
  note?: string;
  amount?: number;
  updatedById?: string;
}

// RecipeStandardsResponse is now ResourceCollection<RecipeStandard>
