export interface Supplier {
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

export interface CreateSupplierInput {
  supplierId: string
  supplierName: string
  zaloLink?: string
  address?: string
  phone?: string
  email?: string
  active?: boolean
}

export interface UpdateSupplierInput {
  supplierName?: string
  zaloLink?: string
  address?: string
  phone?: string
  email?: string
  active?: boolean
}