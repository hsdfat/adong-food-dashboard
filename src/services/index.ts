import { apiClient } from '@/utils/api_client'
import { 
  Ingredient, CreateIngredientInput, UpdateIngredientInput,
  Kitchen, CreateKitchenInput, UpdateKitchenInput,
  Dish, CreateDishInput, UpdateDishInput,
  Supplier, CreateSupplierInput, UpdateSupplierInput,
  RecipeStandard, CreateRecipeStandardInput, UpdateRecipeStandardInput
} from '@/models'
import { ResourceCollection } from '@/models/resource'

// Ingredients API
export const ingredientApi = {
  getAll: (queryString: string = '') => 
    apiClient<ResourceCollection<Ingredient>>(`/api/ingredients${queryString}`),
  getById: (id: string) => 
    apiClient<Ingredient>(`/api/ingredients/${id}`),
  create: (data: CreateIngredientInput) => 
    apiClient<Ingredient>('/api/ingredients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateIngredientInput) => 
    apiClient<Ingredient>(`/api/ingredients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/ingredients/${id}`, { method: 'DELETE' }),
}

// Kitchens API
export const kitchenApi = {
  getAll: (queryString: string = '') => 
    apiClient<ResourceCollection<Kitchen>>(`/api/kitchens${queryString}`),
  getById: (id: string) => 
    apiClient<Kitchen>(`/api/kitchens/${id}`),
  create: (data: CreateKitchenInput) => 
    apiClient<Kitchen>('/api/kitchens', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateKitchenInput) => 
    apiClient<Kitchen>(`/api/kitchens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/kitchens/${id}`, { method: 'DELETE' }),
}

// Dishes API with pagination support
export const dishApi = {
  getAll: (queryString: string = '') => 
    apiClient<ResourceCollection<Dish>>(`/api/dishes${queryString}`),
  getById: (id: string) => 
    apiClient<Dish>(`/api/dishes/${id}`),
  create: (data: CreateDishInput) => 
    apiClient<Dish>('/api/dishes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateDishInput) => 
    apiClient<Dish>(`/api/dishes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/dishes/${id}`, { method: 'DELETE' }),
}

// Suppliers API
export const supplierApi = {
  getAll: (queryString: string = '') => 
    apiClient<ResourceCollection<Supplier>>(`/api/suppliers${queryString}`),
  getById: (id: string) => 
    apiClient<Supplier>(`/api/suppliers/${id}`),
  create: (data: CreateSupplierInput) => 
    apiClient<Supplier>('/api/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateSupplierInput) => 
    apiClient<Supplier>(`/api/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/suppliers/${id}`, { method: 'DELETE' }),
}

// Recipe Standards API
export const recipeStandardApi = {
  getAll: (queryString: string = '') => 
    apiClient<ResourceCollection<RecipeStandard>>(`/api/recipe-standards${queryString}`),
  getById: (id: string) => 
    apiClient<RecipeStandard>(`/api/recipe-standards/${id}`),
  create: (data: CreateRecipeStandardInput) => 
    apiClient<RecipeStandard>('/api/recipe-standards', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateRecipeStandardInput) => 
    apiClient<RecipeStandard>(`/api/recipe-standards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/recipe-standards/${id}`, { method: 'DELETE' }),
}