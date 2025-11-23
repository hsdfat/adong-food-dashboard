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

