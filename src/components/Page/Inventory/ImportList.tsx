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
import { Badge, Button } from 'react-bootstrap'
import { approveImport, deleteImport } from '@/app/actions/inventory'

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
      params.append('per_page', perPage.toString())
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
    await deleteImport(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'kitchen',
      label: dict.inventory?.kitchen || 'Kitchen',
      align: 'left',
      priority: true,
      render: (value, row) => {
        const importRow = row as InventoryImport
        return importRow.kitchen?.kitchenName || importRow.kitchenId
      },
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
      render: (value, row) => {
        const importRow = row as InventoryImport
        const supplierName = importRow.supplier?.supplierName || importRow.supplierId || '-'
        const zaloLink = importRow.supplier?.zaloLink

        if (zaloLink) {
          return (
            <div className="d-flex align-items-center gap-2">
              <span>{supplierName}</span>
              <Button
                variant="link"
                size="sm"
                className="p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(zaloLink, '_blank')
                }}
                title="Contact on Zalo"
              >
                <i className="bi bi-chat-dots-fill text-primary" />
              </Button>
            </div>
          )
        }

        return supplierName
      },
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
    {
      key: 'importId',
      label: dict.inventory?.import_id || 'Import ID',
      align: 'left',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.view || 'View',
      onClick: async (importItem) => {
        const item = importItem as InventoryImport
        router.push(`/inventory/imports/${item.importId}`)
      },
    },
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (importItem) => {
        const item = importItem as InventoryImport
        if (item.status === 'draft') {
          router.push(`/inventory/imports/${item.importId}/edit`)
        }
      },
    },
    {
      label: dict.inventory?.approve || 'Approve',
      onClick: async (importItem) => {
        const item = importItem as InventoryImport
        if (item.status === 'draft') {
          try {
            await approveImport(item.importId)
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
        const item = importItem as InventoryImport
        if (item.status === 'draft') {
          await handleDelete(item.importId, item)
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
      data={importsData}
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

