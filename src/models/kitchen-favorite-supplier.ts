export interface KitchenFavoriteSupplier {
  favoriteId: number
  kitchenId: string
  supplierId: string
  notes?: string
  displayOrder?: number
  createdByUserId?: string
  createdDate: string
  modifiedDate: string

  // Relationships
  kitchen?: {
    kitchenId: string
    kitchenName: string
    address: string
    phone: string
    active: boolean
    createdDate: string
    modifiedDate: string
  }
  supplier?: {
    supplierId: string
    supplierName: string
    zaloLink: string
    address: string
    phone: string
    email: string
    active: boolean
    createdDate: string
    modifiedDate: string
  }
  createdBy?: {
    userId: string
    userName: string
    fullName: string
    role: string
    kitchenId: string
    email: string
    phone: string
    active: boolean
    createdDate: string
    modifiedDate: string
  }
}

export interface CreateKitchenFavoriteSupplierInput {
  supplier_ids: string[] // Support multiple suppliers
  notes?: string
  displayOrder?: number
}

export interface UpdateKitchenFavoriteSupplierInput {
  notes?: string
  displayOrder?: number
}
