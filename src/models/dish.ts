export interface Dish {
  dishId: string
  dishName: string
  cookingMethod: string
  group: string
  description: string
  active: boolean
  createdDate: string
  modifiedDate: string
}

export interface CreateDishInput {
  dishId: string
  dishName: string
  cookingMethod?: string
  group?: string
  description?: string
  active?: boolean
}

export interface UpdateDishInput {
  dishName?: string
  cookingMethod?: string
  group?: string
  description?: string
  active?: boolean
}