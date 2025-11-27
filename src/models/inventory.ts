// Inventory Stock Models
export interface InventoryStock {
  stockId: number;
  kitchenId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  lastUpdated: string; // ISO 8601 datetime
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  kitchen?: {
    kitchenId: string;
    kitchenName: string;
  };
  ingredient?: {
    ingredientId: string;
    ingredientName: string;
  };
}

export interface UpdateStockLevelsInput {
  minStockLevel?: number;
  maxStockLevel?: number;
}

export interface StockSummary {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}

export interface StockValuation {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  averagePrice: number;
  totalValue: number;
}

export interface StockValuationResponse {
  data: StockValuation[];
  totalValue: number;
  count: number;
}

// Inventory Import Models
export interface InventoryImport {
  importId: string; // Format: IMYYYYMMDD-XXXXX
  kitchenId: string;
  importDate: string; // ISO 8601 date
  orderId?: string;
  supplierId?: string;
  totalAmount: number;
  status: 'draft' | 'approved';
  notes?: string;
  receivedByUserId?: string;
  approvedByUserId?: string;
  approvedDate?: string; // ISO 8601 datetime
  createdByUserId?: string;
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  kitchen?: {
    kitchenId: string;
    kitchenName: string;
  };
  supplier?: {
    supplierId: string;
    supplierName: string;
  };
  order?: {
    orderId: string;
    orderName: string;
  };
  receivedBy?: {
    userId: string;
    username: string;
  };
  approvedBy?: {
    userId: string;
    username: string;
  };
  createdBy?: {
    userId: string;
    username: string;
  };
  importDetails?: InventoryImportDetail[];
}

export interface InventoryImportDetail {
  importDetailId: number;
  importId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  expiryDate?: string; // ISO 8601 date
  batchNumber?: string;
  notes?: string;
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  ingredient?: {
    ingredientId: string;
    ingredientName: string;
  };
}

export interface CreateImportDetailInput {
  ingredientId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  expiryDate?: string; // YYYY-MM-DD
  batchNumber?: string;
  notes?: string;
}

export interface CreateImportInput {
  kitchenId: string;
  importDate: string; // YYYY-MM-DD
  orderId?: string;
  supplierId?: string;
  status?: 'draft' | 'approved';
  notes?: string;
  importDetails: CreateImportDetailInput[];
}

export interface UpdateImportInput extends CreateImportInput {}

// Inventory Export Models
export interface InventoryExport {
  exportId: string; // Format: EX/TR/DS + YYYYMMDD-XXXXX
  kitchenId: string;
  exportDate: string; // ISO 8601 date
  exportType: 'production' | 'transfer' | 'disposal' | 'return' | 'sample';
  destinationKitchenId?: string; // Required for "transfer" type
  orderId?: string;
  totalAmount: number;
  status: 'draft' | 'approved';
  notes?: string;
  issuedByUserId?: string;
  approvedByUserId?: string;
  approvedDate?: string; // ISO 8601 datetime
  createdByUserId?: string;
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  kitchen?: {
    kitchenId: string;
    kitchenName: string;
  };
  destinationKitchen?: {
    kitchenId: string;
    kitchenName: string;
  };
  order?: {
    orderId: string;
    orderName: string;
  };
  issuedBy?: {
    userId: string;
    username: string;
  };
  approvedBy?: {
    userId: string;
    username: string;
  };
  createdBy?: {
    userId: string;
    username: string;
  };
  exportDetails?: InventoryExportDetail[];
}

export interface InventoryExportDetail {
  exportDetailId: number;
  exportId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  totalCost?: number;
  batchNumber?: string;
  notes?: string;
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  ingredient?: {
    ingredientId: string;
    ingredientName: string;
  };
}

export interface CreateExportDetailInput {
  ingredientId: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  batchNumber?: string;
  notes?: string;
}

export interface CreateExportInput {
  kitchenId: string;
  exportDate: string; // YYYY-MM-DD
  exportType: 'production' | 'transfer' | 'disposal' | 'return' | 'sample';
  destinationKitchenId?: string; // Required for "transfer" type
  orderId?: string;
  status?: 'draft' | 'approved';
  notes?: string;
  exportDetails: CreateExportDetailInput[];
}

export interface UpdateExportInput extends CreateExportInput {}

// Inventory Transaction Models
export interface InventoryTransaction {
  transactionId: number;
  kitchenId: string;
  ingredientId: string;
  transactionType: 'IMPORT' | 'EXPORT' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  transactionDate: string; // ISO 8601 datetime
  quantity: number; // Negative for exports
  unit: string;
  quantityBefore: number;
  quantityAfter: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  createdByUserId?: string;
  createdDate: string; // ISO 8601 datetime
  kitchen?: {
    kitchenId: string;
    kitchenName: string;
  };
  ingredient?: {
    ingredientId: string;
    ingredientName: string;
  };
  createdBy?: {
    userId: string;
    username: string;
  };
}

// API Response Types
export interface InventoryApiResponse<T> {
  data: T;
  message?: string;
}

export interface InventoryListResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    per_page: number;
    total: number;
  };
}

export interface LowStockAlertsResponse {
  data: InventoryStock[];
  count: number;
}

// Inventory Adjustment Models
export interface InventoryAdjustment {
  adjustmentId: string; // Format: ADJ + YYYYMMDD-XXXXX
  kitchenId: string;
  adjustmentDate: string; // ISO 8601 date
  adjustmentType: 'count' | 'damage' | 'loss' | 'found' | 'expired' | 'other';
  reason?: string;
  status: 'draft' | 'approved';
  totalValue?: number;
  approvedByUserId?: string;
  approvedDate?: string; // ISO 8601 datetime
  createdByUserId?: string;
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  kitchen?: {
    kitchenId: string;
    kitchenName: string;
  };
  approvedBy?: {
    userId: string;
    username: string;
  };
  createdBy?: {
    userId: string;
    username: string;
  };
  adjustmentDetails?: InventoryAdjustmentDetail[];
}

export interface InventoryAdjustmentDetail {
  adjustmentDetailId: number;
  adjustmentId: string;
  ingredientId: string;
  quantityBefore: number;
  quantityAfter: number;
  quantityDifference: number;
  unit: string;
  unitCost?: number;
  totalValue?: number;
  reason?: string;
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  ingredient?: {
    ingredientId: string;
    ingredientName: string;
  };
}

export interface CreateAdjustmentDetailInput {
  ingredientId: string;
  quantityBefore: number;
  quantityAfter: number;
  unit: string;
  unitCost?: number;
  reason?: string;
}

export interface CreateAdjustmentInput {
  kitchenId: string;
  adjustmentDate: string; // YYYY-MM-DD
  adjustmentType: 'count' | 'damage' | 'loss' | 'found' | 'expired' | 'other';
  reason?: string;
  status?: 'draft' | 'approved';
  adjustmentDetails: CreateAdjustmentDetailInput[];
}

export interface UpdateAdjustmentInput extends CreateAdjustmentInput {}

// Ingredient Request Models
export interface IngredientRequest {
  requestId: string; // Format: RQ + YYYYMMDD-XXXXX
  orderId: string;
  kitchenId: string;
  requestDate: string; // ISO 8601 date
  requiredDate: string; // ISO 8601 date
  status: 'pending' | 'approved' | 'received';
  totalAmount: number;
  notes?: string;
  createdByUserId?: string;
  approvedByUserId?: string;
  approvedDate?: string; // ISO 8601 datetime
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  order?: {
    orderId: string;
    orderName: string;
  };
  kitchen?: {
    kitchenId: string;
    kitchenName: string;
  };
  createdBy?: {
    userId: string;
    username: string;
  };
  approvedBy?: {
    userId: string;
    username: string;
  };
  requestDetails?: IngredientRequestDetail[];
}

export interface IngredientRequestDetail {
  requestDetailId: number;
  requestId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  supplierId?: string;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  createdDate: string; // ISO 8601 datetime
  modifiedDate: string; // ISO 8601 datetime
  ingredient?: {
    ingredientId: string;
    ingredientName: string;
  };
  supplier?: {
    supplierId: string;
    supplierName: string;
  };
}

export interface CreateRequestDetailInput {
  ingredientId: string;
  quantity: number;
  unit: string;
  supplierId?: string;
  unitPrice?: number;
  notes?: string;
}

export interface CreateRequestInput {
  orderId: string;
  kitchenId: string;
  requestDate: string; // YYYY-MM-DD
  requiredDate: string; // YYYY-MM-DD
  status?: 'pending' | 'approved';
  notes?: string;
  requestDetails: CreateRequestDetailInput[];
}

export interface UpdateRequestInput extends CreateRequestInput {}

// Report Models
export interface StockMovementReport {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  openingStock: number;
  stockIn: number;
  stockOut: number;
  adjustment: number;
  closingStock: number;
}

export interface ExpiryAlert {
  importDetailId: number;
  importId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  daysToExpiry: number;
  batchNumber?: string;
}

export interface StockValueTrend {
  date: string;
  totalValue: number;
  totalItems: number;
}

export interface TransactionSummary {
  transactionType: string;
  totalQuantity: number;
  transactionCount: number;
}

export interface TopConsumedIngredient {
  ingredientId: string;
  ingredientName: string;
  totalConsumed: number;
  unit: string;
  exportCount: number;
}

