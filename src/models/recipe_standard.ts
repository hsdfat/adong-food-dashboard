export interface RecipeStandard {
  standardId: number
  dishId: string
  ingredientId: string
  unit: string
  standardPer1: number
  note: string
  amount: number
  updatedById: string
  createdDate: string
  modifiedDate: string
  dish?: {
    dishId: string
    dishName: string
  }
  ingredient?: {
    ingredientId: string
    ingredientName: string
  }
}

export interface CreateRecipeStandardInput {
  dishId: string
  ingredientId: string
  unit: string
  standardPer1: number
  note?: string
  amount: number
  updatedById: string
}

export interface UpdateRecipeStandardInput {
  standardPer1?: number
  note?: string
  amount?: number
  updatedById?: string
}