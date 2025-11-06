// models/recipe_standard.ts
import { Dish } from './dish'
import { Ingredient } from './ingredient'

export interface RecipeStandard {
  standardId: number
  dishId: string
  ingredientId: string
  dishName?: string
  ingredientName?: string
  unit: string
  standardPer1: number
  note?: string
  amount?: number
  updatedById?: string
  updatedByName?: string
  createdDate: string
  modifiedDate: string
  // Relations
  dish?: Dish
  ingredient?: Ingredient
}

export interface CreateRecipeStandardInput {
  dishId: string
  ingredientId: string
  unit: string
  standardPer1: number
  note?: string
  amount?: number
  updatedById?: string
}

export interface UpdateRecipeStandardInput {
  standardPer1?: number
  unit?: string
  note?: string
  amount?: number
  updatedById?: string
}

// RecipeStandardsResponse is now ResourceCollection<RecipeStandard>