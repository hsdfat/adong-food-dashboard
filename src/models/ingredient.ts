export interface Ingredient {
  ingredientId: string
  ingredientName: string
  property: string
  materialGroup: string
  unit: string
  createdDate: string
  modifiedDate: string
}

export interface CreateIngredientInput {
  ingredientId: string
  ingredientName: string
  property?: string
  materialGroup?: string
  unit: string
}

export interface UpdateIngredientInput {
  ingredientName?: string
  property?: string
  materialGroup?: string
  unit?: string
}