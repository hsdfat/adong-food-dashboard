// models/supplier_price.ts

export interface SupplierPrice {
  id: number
  productName: string
  ingredientId: string
  ingredientName: string
  category: string
  supplierId: string
  supplierName: string
  manufacturer: string
  unit: string
  specification: string
  unitPrice: number
  pricePer1: number
  effectiveFrom: string
  effectiveTo: string
  active: boolean
  newPrice: number
  promotion: string

  // Optional populated fields
  ingredient?: {
    ingredientId: string
    ingredientName: string
  }
  supplier?: {
    supplierId: string
    supplierName: string
  }
}

export interface CreateSupplierPriceInput {
  productName: string
  ingredientId: string
  category: string
  supplierId: string
  manufacturer: string
  unit: string
  specification: string
  unitPrice: number
  pricePer1: number
  effectiveFrom: string
  effectiveTo: string
  active: boolean
  newPrice?: number
  promotion?: string
}

export interface UpdateSupplierPriceInput {
  productName?: string
  category?: string
  manufacturer?: string
  unit?: string
  specification?: string
  unitPrice?: number
  pricePer1?: number
  effectiveFrom?: string
  effectiveTo?: string
  active?: boolean
  newPrice?: number
  promotion?: string
}

export interface SupplierPriceListResponse {
  data: SupplierPrice[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
