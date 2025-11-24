'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inventoryImportApi } from '@/services'
import { InventoryImport } from '@/models'
import { InventoryListResponse } from '@/models/inventory'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'
import { Badge } from 'react-bootstrap'

export default function ImportList() {
  const [importsData, setImportsData] =
    useState<InventoryListResponse<InventoryImport> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadImports = async (
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
      params.append('limit', perPage.toString())
      if (search) {
        params.append('search', search)
      }

      // Call API with query parameters
      const data = await inventoryImportApi.getAll(`?${params.toString()}`)
      setImportsData(data)
    } catch (err) {
      setError(dict.inventory?.error_load || 'Failed to load imports')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, importItem: InventoryImport) => {
    await inventoryImportApi.delete(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'importId',
      label: dict.inventory?.import_id || 'Import ID',
      align: 'left',
      priority: true,
    },
    {
      key: 'kitchen',
      label: dict.inventory?.kitchen || 'Kitchen',
      align: 'left',
      priority: true,
      render: (value, row) => row.kitchen?.kitchenName || row.kitchenId,
    },
    {
      key: 'importDate',
      label: dict.inventory?.import_date || 'Import Date',
      align: 'center',
      priority: true,
      render: (value) => value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
    {
      key: 'supplier',
      label: dict.inventory?.supplier || 'Supplier',
      align: 'left',
      render: (value, row) => row.supplier?.supplierName || row.supplierId || '-',
    },
    {
      key: 'totalAmount',
      label: dict.inventory?.total_amount || 'Total Amount',
      align: 'right',
      render: (value) => value ? new Intl.NumberFormat('vi-VN').format(value as number) : '-',
    },
    {
      key: 'status',
      label: dict.inventory?.status || 'Status',
      align: 'center',
      render: (value) => {
        if (value === 'approved')
          return <Badge bg="success">Approved</Badge>
        return <Badge bg="secondary">Draft</Badge>
      },
    },
    {
      key: 'createdDate',
      label: dict.inventory?.created_date || 'Created Date',
      align: 'center',
      render: (value) =>
        value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.view || 'View',
      onClick: async (importItem) => {
        router.push(`/inventory/imports/${importItem.importId}`)
      },
    },
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (importItem) => {
        if (importItem.status === 'draft') {
          router.push(`/inventory/imports/${importItem.importId}/edit`)
        }
      },
    },
    {
      label: dict.inventory?.approve || 'Approve',
      onClick: async (importItem) => {
        if (importItem.status === 'draft') {
          try {
            await inventoryImportApi.approve(importItem.importId)
            loadImports(1, 10, '')
          } catch (err) {
            console.error(err)
          }
        }
      },
      variant: 'success',
    },
    {
      label: dict.action?.delete || 'Delete',
      variant: 'danger',
      onClick: async (importItem) => {
        if (importItem.status === 'draft') {
          await handleDelete(importItem.importId, importItem)
        }
      },
    },
  ]

  return (
    <MasterDataListPage<InventoryImport>
      title={dict.inventory?.imports_title || 'Import Management'}
      addNewLabel={dict.inventory?.add_import || 'Add New Import'}
      createPath="/inventory/imports/create"
      searchPlaceholder={dict.inventory?.search_imports || 'Search imports...'}
      emptyMessage={dict.inventory?.no_imports || 'No imports found'}
      loadingMessage={dict.inventory?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={
        importsData
          ? {
              data: importsData.data,
              meta: importsData.pagination
                ? (() => {
                    const { page, limit, total, total_pages } = importsData.pagination!
                    // Calculate from: page 1 starts at 1, otherwise (page - 1) * limit + 1
                    const from = total > 0 ? (page === 1 ? 1 : (page - 1) * limit + 1) : 0
                    // Calculate to: for page 1, use min(total, limit), otherwise page * limit (capped at total)
                    const to = total > 0 
                      ? (page === 1 
                          ? Math.min(total, limit)
                          : Math.min((page - 1) * limit + limit, total))
                      : 0
                    return {
                      current_page: page,
                      per_page: limit,
                      total: total,
                      last_page: total_pages,
                      from: from,
                      to: to,
                    }
                  })()
                : undefined,
            }
          : null
      }
      loading={loading}
      error={error}
      onLoadData={loadImports}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(importItem) => importItem.importId}
      getItemId={(importItem) => importItem.importId}
      basePath="/inventory/imports"
      dictKey="inventory"
      actionsColumnPosition="status"
    />
  )
}

