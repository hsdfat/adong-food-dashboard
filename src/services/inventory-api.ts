import { apiClient } from '@/utils/api_client'
import {
  InventoryStock,
  UpdateStockLevelsInput,
  StockSummary,
  StockValuationResponse,
  InventoryImport,
  CreateImportInput,
  UpdateImportInput,
  InventoryExport,
  CreateExportInput,
  UpdateExportInput,
  InventoryTransaction,
  InventoryListResponse,
  LowStockAlertsResponse,
  ResourceCollection,
  InventoryAdjustment,
  CreateAdjustmentInput,
  UpdateAdjustmentInput,
  CreateRequestInput,
  UpdateRequestInput,
  StockMovementReport,
  ExpiryAlert,
  StockValueTrend,
  TransactionSummary,
  TopConsumedIngredient,
} from '@/models'

// Stock Management API
export const inventoryStockApi = {
  // Get all stocks with pagination and filters
  getAll: (queryString: string = '') =>
    apiClient<InventoryListResponse<InventoryStock>>(
      `/api/inventory/stocks${queryString}`,
    ),

  // Get stock by ID
  getById: (id: number) =>
    apiClient<{ data: InventoryStock }>(`/api/inventory/stocks/${id}`),

  // Get stock by kitchen and ingredient
  getByKitchenAndIngredient: (kitchenId: string, ingredientId: string) =>
    apiClient<{ data: InventoryStock }>(
      `/api/inventory/stocks/query?kitchen_id=${kitchenId}&ingredient_id=${ingredientId}`,
    ),

  // Update stock levels
  updateLevels: (id: number, data: UpdateStockLevelsInput) =>
    apiClient<{ message: string; data: InventoryStock }>(
      `/api/inventory/stocks/${id}/levels`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    ),

  // Get low stock alerts
  getLowStockAlerts: (kitchenId?: string) => {
    const query = kitchenId ? `?kitchen_id=${kitchenId}` : ''
    return apiClient<LowStockAlertsResponse>(
      `/api/inventory/stocks/alerts/low${query}`,
    )
  },

  // Get stock transactions
  getTransactions: (queryString: string = '') =>
    apiClient<InventoryListResponse<InventoryTransaction>>(
      `/api/inventory/stocks/transactions${queryString}`,
    ),

  // Get stock summary
  getSummary: (kitchenId: string) =>
    apiClient<{ data: StockSummary }>(
      `/api/inventory/stocks/summary?kitchen_id=${kitchenId}`,
    ),

  // Get stock valuation
  getValuation: (kitchenId: string) =>
    apiClient<StockValuationResponse>(
      `/api/inventory/stocks/valuation?kitchen_id=${kitchenId}`,
    ),
}

// Import Management API
export const inventoryImportApi = {
  // Get all imports with pagination and filters
  getAll: (queryString: string = '') =>
    apiClient<InventoryListResponse<InventoryImport>>(
      `/api/inventory/imports${queryString}`,
    ),

  // Get import by ID
  getById: (id: string) =>
    apiClient<{ data: InventoryImport }>(`/api/inventory/imports/${id}`),

  // Create import
  create: (data: CreateImportInput) =>
    apiClient<{ message: string; data: InventoryImport }>(
      '/api/inventory/imports',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),

  // Update import
  update: (id: string, data: UpdateImportInput) =>
    apiClient<{ message: string; data: InventoryImport }>(
      `/api/inventory/imports/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    ),

  // Approve import
  approve: (id: string) =>
    apiClient<{ message: string; data: InventoryImport }>(
      `/api/inventory/imports/${id}/approve`,
      {
        method: 'POST',
      },
    ),

  // Delete import
  delete: (id: string) =>
    apiClient<{ message: string }>(`/api/inventory/imports/${id}`, {
      method: 'DELETE',
    }),
}

// Export Management API
export const inventoryExportApi = {
  // Get all exports with pagination and filters
  getAll: (queryString: string = '') =>
    apiClient<InventoryListResponse<InventoryExport>>(
      `/api/inventory/exports${queryString}`,
    ),

  // Get export by ID
  getById: (id: string) =>
    apiClient<{ data: InventoryExport }>(`/api/inventory/exports/${id}`),

  // Create export
  create: (data: CreateExportInput) =>
    apiClient<{ message: string; data: InventoryExport }>(
      '/api/inventory/exports',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),

  // Update export
  update: (id: string, data: UpdateExportInput) =>
    apiClient<{ message: string; data: InventoryExport }>(
      `/api/inventory/exports/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    ),

  // Approve export
  approve: (id: string) =>
    apiClient<{ message: string; data: InventoryExport }>(
      `/api/inventory/exports/${id}/approve`,
      {
        method: 'POST',
      },
    ),

  // Delete export
  delete: (id: string) =>
    apiClient<{ message: string }>(`/api/inventory/exports/${id}`, {
      method: 'DELETE',
    }),
}

// Adjustment Management API
export const inventoryAdjustmentApi = {
  // Get all adjustments with pagination and filters
  getAll: (queryString: string = '') =>
    apiClient<InventoryListResponse<InventoryAdjustment>>(
      `/api/inventory/adjustments${queryString}`,
    ),

  // Get adjustment by ID
  getById: (id: string) =>
    apiClient<{ data: InventoryAdjustment }>(
      `/api/inventory/adjustments/${id}`,
    ),

  // Create adjustment
  create: (data: CreateAdjustmentInput) =>
    apiClient<{ message: string; data: InventoryAdjustment }>(
      '/api/inventory/adjustments',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),

  // Update adjustment
  update: (id: string, data: UpdateAdjustmentInput) =>
    apiClient<{ message: string; data: InventoryAdjustment }>(
      `/api/inventory/adjustments/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    ),

  // Approve adjustment
  approve: (id: string) =>
    apiClient<{ message: string; data: InventoryAdjustment }>(
      `/api/inventory/adjustments/${id}/approve`,
      {
        method: 'POST',
      },
    ),

  // Delete adjustment
  delete: (id: string) =>
    apiClient<{ message: string }>(`/api/inventory/adjustments/${id}`, {
      method: 'DELETE',
    }),
}

// Ingredient Request Management API
export const ingredientRequestApi = {
  // Get all requests with pagination and filters
  getAll: (queryString: string = '') =>
    apiClient<InventoryListResponse<IngredientRequest>>(
      `/api/inventory/requests${queryString}`,
    ),

  // Get request by ID
  getById: (id: string) =>
    apiClient<{ data: IngredientRequest }>(`/api/inventory/requests/${id}`),

  // Create request
  create: (data: CreateRequestInput) =>
    apiClient<{ message: string; data: IngredientRequest }>(
      '/api/inventory/requests',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),

  // Create request from order
  createFromOrder: (orderId: string) =>
    apiClient<{ message: string; data: IngredientRequest }>(
      `/api/inventory/requests/from-order/${orderId}`,
      {
        method: 'POST',
      },
    ),

  // Update request
  update: (id: string, data: UpdateRequestInput) =>
    apiClient<{ message: string; data: IngredientRequest }>(
      `/api/inventory/requests/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    ),

  // Approve request
  approve: (id: string) =>
    apiClient<{ message: string; data: IngredientRequest }>(
      `/api/inventory/requests/${id}/approve`,
      {
        method: 'POST',
      },
    ),

  // Delete request
  delete: (id: string) =>
    apiClient<{ message: string }>(`/api/inventory/requests/${id}`, {
      method: 'DELETE',
    }),

  // Create import from request
  createImportFromRequest: (requestId: string) =>
    apiClient<{ message: string; data: InventoryImport }>(
      `/api/inventory/imports/from-request/${requestId}`,
      {
        method: 'POST',
      },
    ),
}

// Inventory Reports API
export const inventoryReportsApi = {
  // Get stock movement report
  getStockMovement: (kitchenId: string, fromDate: string, toDate: string) =>
    apiClient<{
      data: StockMovementReport[]
      from_date: string
      to_date: string
      count: number
    }>(
      `/api/inventory/reports/stock-movement?kitchen_id=${kitchenId}&from_date=${fromDate}&to_date=${toDate}`,
    ),

  // Get expiry alerts
  getExpiryAlerts: (kitchenId: string, daysAhead: number = 30) =>
    apiClient<{ data: ExpiryAlert[]; days_ahead: string; count: number }>(
      `/api/inventory/reports/expiry-alerts?kitchen_id=${kitchenId}&days_ahead=${daysAhead}`,
    ),

  // Get stock value trend
  getStockValueTrend: (
    kitchenId: string,
    fromDate: string,
    toDate: string,
    interval: 'day' | 'week' | 'month' = 'day',
  ) =>
    apiClient<{
      data: StockValueTrend[]
      from_date: string
      to_date: string
      interval: string
      count: number
    }>(
      `/api/inventory/reports/stock-value-trend?kitchen_id=${kitchenId}&from_date=${fromDate}&to_date=${toDate}&interval=${interval}`,
    ),

  // Get transaction summary
  getTransactionSummary: (
    kitchenId: string,
    fromDate?: string,
    toDate?: string,
  ) => {
    let url = `/api/inventory/reports/transaction-summary?kitchen_id=${kitchenId}`
    if (fromDate) url += `&from_date=${fromDate}`
    if (toDate) url += `&to_date=${toDate}`
    return apiClient<{ data: TransactionSummary[]; count: number }>(url)
  },

  // Get top consumed ingredients
  getTopConsumed: (
    kitchenId: string,
    fromDate?: string,
    toDate?: string,
    limit: number = 10,
  ) => {
    let url = `/api/inventory/reports/top-consumed?kitchen_id=${kitchenId}&limit=${limit}`
    if (fromDate) url += `&from_date=${fromDate}`
    if (toDate) url += `&to_date=${toDate}`
    return apiClient<{
      data: TopConsumedIngredient[]
      count: number
      limit: string
    }>(url)
  },
}

