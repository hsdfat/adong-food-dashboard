// models/order.ts
import { Kitchen } from './kitchen'
import { Dish } from './dish'
import { Ingredient } from './ingredient'

// Order - Main order entity
export interface Order {
  orderId: number;
  kitchenId: string;
  orderDate: string;
  note: string;
  status: string;
  createdByUserId: string;
  createdDate: string;
  modifiedDate: string;
  // Relationships
  kitchen?: Kitchen;
  createdBy?: {
    userId: string;
    fullName: string;
  };
  details?: OrderDetail[];
  supplementaryFoods?: OrderSupplementaryFood[];
}

// OrderDetail - Order details
export interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  dishId: string;
  portions: number;
  note: string;
  createdDate: string;
  modifiedDate: string;
  // Relationships
  order?: Order;
  dish?: Dish;
  ingredients?: OrderIngredient[];
}

// OrderIngredient - Ingredients calculated for an order detail
export interface OrderIngredient {
  orderIngredientId: number;
  orderDetailId: number;
  ingredientId: string;
  quantity: number;
  unit: string;
  standardPerPortion: number;
  createdDate: string;
  modifiedDate: string;
  // Relationships
  orderDetail?: OrderDetail;
  ingredient?: Ingredient;
}

// OrderSupplementaryFood - Extra items for an order
export interface OrderSupplementaryFood {
  supplementaryId: number;
  orderId: number;
  ingredientId: string;
  quantity: number;
  unit: string;
  standardPerPortion: number;
  portions: number;
  note: string;
  createdDate: string;
  modifiedDate: string;
  // Relationships
  order?: Order;
  ingredient?: Ingredient;
}

// OrderDTO - Aggregated response for an order
export interface OrderDTO {
  orderId: number;
  kitchenId: string;
  kitchenName: string;
  orderDate: string;
  note: string;
  status: string;
  createdByUserId: string;
  createdByName: string;
  createdDate: string;
  modifiedDate: string;
  details: OrderDetailDTO[];
  supplementaries: OrderSupplementaryDTO[];
}

// OrderDetailDTO - Detail lines with dish name and ingredients
export interface OrderDetailDTO {
  orderDetailId: number;
  dishId: string;
  dishName: string;
  portions: number;
  note: string;
  ingredients: OrderIngredientDTO[];
}

// OrderIngredientDTO - Ingredient usage per detail
export interface OrderIngredientDTO {
  orderIngredientId: number;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  standardPerPortion: number;
}

// OrderSupplementaryDTO - Supplementary items for an order
export interface OrderSupplementaryDTO {
  supplementaryId: number;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  standardPerPortion: number;
  portions: number;
  note: string;
}

// Create Order Input
export interface CreateOrderInput {
  orderId: string;
  kitchenId: string;
  orderDate: string;
  note?: string;
  status?: string;
  createdByUserId?: string;
  details: CreateOrderDetailInput[];
  supplementaryFoods?: CreateOrderSupplementaryFoodInput[];
}

// Create Order Detail Input
export interface CreateOrderDetailInput {
  dishId: string;
  portions: number;
  note?: string;
  ingredients: CreateOrderIngredientInput[];
}

// Create Order Ingredient Input
export interface CreateOrderIngredientInput {
  ingredientId: string;
  quantity: number;
  unit: string;
  standardPerPortion: number;
}

// Create Order Supplementary Food Input
export interface CreateOrderSupplementaryFoodInput {
  ingredientId: string;
  quantity: number;
  unit: string;
  standardPerPortion: number;
  portions?: number;
  note?: string;
}

// Update Order Input
export interface UpdateOrderInput {
  kitchenId?: string;
  orderDate?: string;
  note?: string;
  status?: string;
  details?: UpdateOrderDetailInput[];
  supplementaryFoods?: UpdateOrderSupplementaryFoodInput[];
}

// Update Order Detail Input
export interface UpdateOrderDetailInput {
  orderDetailId?: number;
  dishId?: string;
  portions?: number;
  note?: string;
  ingredients?: UpdateOrderIngredientInput[];
}

// Update Order Ingredient Input
export interface UpdateOrderIngredientInput {
  orderIngredientId?: number;
  ingredientId?: string;
  quantity?: number;
  unit?: string;
  standardPerPortion?: number;
}

// Update Order Supplementary Food Input
export interface UpdateOrderSupplementaryFoodInput {
  supplementaryId?: number;
  ingredientId?: string;
  quantity?: number;
  unit?: string;
  standardPerPortion?: number;
  portions?: number;
  note?: string;
}

// Get Orders Query Parameters
export interface GetOrdersParams {
  page?: number;
  per_page?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  kitchen_id?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  dish_id?: string;
  ingredient_id?: string;
}

// Order ingredient with supplier for inventory operations
export interface OrderIngredientWithSupplier {
  orderId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  supplierId?: string;
  supplierName?: string;
  unitPrice?: number;
  totalCost?: number;
}

// Get order suppliers response for inventory operations
export interface GetOrderSuppliersResponse {
  orderId: string;
  orderDate: string;
  status: string;
  suppliers: OrderIngredientWithSupplier[];
}

// Supplier with order flag for highlighting
export interface SupplierWithOrderFlag {
  supplierId: string;
  supplierName: string;
  phone: string;
  email: string;
  address: string;
  active?: boolean;
  isUsedInOrder: boolean;     // Flag indicating if supplier is used in the order
  ingredientCount: number;    // Number of ingredients from this supplier
}

// Get suppliers with order highlight response
export interface GetSuppliersForOrderResponse {
  orderId: string;
  suppliers: SupplierWithOrderFlag[];
}
