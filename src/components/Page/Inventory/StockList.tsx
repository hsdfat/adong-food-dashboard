'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inventoryStockApi } from '@/services'
import { InventoryStock } from '@/models'
import { InventoryListResponse } from '@/models/inventory'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'
import { Badge } from 'react-bootstrap'

export default function StockList() {
  const [stocksData, setStocksData] =
    useState<InventoryListResponse<InventoryStock> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadStocks = async (
    page: number,
    perPage: number,
    search: string,
  ) => {
    try {
      setLoading(true)
      setError('')

      // Build query string
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('per_page', perPage.toString())
      if (search) {
        params.append('search', search)
      }

      // Call API with query parameters
      const data = await inventoryStockApi.getAll(`?${params.toString()}`)
      setStocksData(data)
    } catch (err) {
      setError(dict.inventory?.error_load || 'Failed to load stocks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'ingredient',
      label: dict.inventory?.ingredient || 'Ingredient',
      align: 'left',
      priority: true,
      render: (value, row) => {
        const stockRow = row as InventoryStock
        return stockRow.ingredient?.ingredientName || stockRow.ingredientId
      },
    },
    {
      key: 'kitchen',
      label: dict.inventory?.kitchen || 'Kitchen',
      align: 'left',
      priority: true,
      render: (value, row) => {
        const stockRow = row as InventoryStock
        return stockRow.kitchen?.kitchenName || stockRow.kitchenId
      },
    },
    {
      key: 'quantity',
      label: dict.inventory?.quantity || 'Quantity',
      align: 'right',
      priority: true,
      render: (value, row) => {
        const stockRow = row as InventoryStock
        return `${value} ${stockRow.unit}`
      },
    },
    {
      key: 'minStockLevel',
      label: dict.inventory?.min_stock || 'Min Stock',
      align: 'right',
      render: (value) => (value ? value.toString() : '-'),
    },
    {
      key: 'maxStockLevel',
      label: dict.inventory?.max_stock || 'Max Stock',
      align: 'right',
      render: (value) => (value ? value.toString() : '-'),
    },
    {
      key: 'status',
      label: dict.inventory?.status || 'Status',
      align: 'center',
      render: (value, row) => {
        const stockRow = row as InventoryStock
        if (!stockRow.minStockLevel) return <Badge bg="secondary">-</Badge>
        const isLow = stockRow.quantity < stockRow.minStockLevel
        const isOut = stockRow.quantity === 0
        if (isOut) return <Badge bg="danger">Out of Stock</Badge>
        if (isLow) return <Badge bg="warning">Low Stock</Badge>
        return <Badge bg="success">In Stock</Badge>
      },
    },
    {
      key: 'lastUpdated',
      label: dict.inventory?.last_updated || 'Last Updated',
      align: 'center',
      render: (value) =>
        value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.view || 'View',
      onClick: async (stock) => {
        const item = stock as InventoryStock
        router.push(`/inventory/stocks/${item.stockId}`)
      },
    },
    {
      label: dict.action?.edit || 'Edit Levels',
      onClick: async (stock) => {
        const item = stock as InventoryStock
        router.push(`/inventory/stocks/${item.stockId}/edit`)
      },
    },
  ]

  return (
    <MasterDataListPage<InventoryStock>
      title={dict.inventory?.stocks_title || 'Stock Management'}
      addNewLabel=""
      createPath=""
      searchPlaceholder={dict.inventory?.search_stocks || 'Search stocks...'}
      emptyMessage={dict.inventory?.no_stocks || 'No stocks found'}
      loadingMessage={dict.inventory?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={stocksData}
      loading={loading}
      error={error}
      onLoadData={loadStocks}
      onError={setError}
      getItemName={(stock) =>
        `${stock.ingredient?.ingredientName || stock.ingredientId} - ${stock.kitchen?.kitchenName || stock.kitchenId}`
      }
      getItemId={(stock) => stock.stockId.toString()}
      basePath="/inventory/stocks"
      dictKey="inventory"
      actionsColumnPosition="status"
    />
  )
}

