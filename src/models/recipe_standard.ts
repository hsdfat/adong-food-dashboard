// models/recipe_standard.ts
import { Dish } from './dish'
import { Ingredient } from './ingredient'

export interface RecipeStandard {
  standardId: number
  dishId: string
  ingredientId: string
  dishName: string
  ingredientName: string
  unit: string
  standardPer1: number
  note?: string
  amount?: number
  updatedById?: string
  createdDate?: Date
  modifiedDate?: Date
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

export interface RecipeStandardsResponse {
  data: RecipeStandard[]
  total: number
  page: number
  pageSize: number
}