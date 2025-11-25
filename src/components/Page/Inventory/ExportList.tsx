'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inventoryExportApi } from '@/services'
import { InventoryExport } from '@/models'
import { InventoryListResponse } from '@/models/inventory'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'
import { Badge } from 'react-bootstrap'

export default function ExportList() {
  const [exportsData, setExportsData] =
    useState<InventoryListResponse<InventoryExport> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadExports = async (
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
      const data = await inventoryExportApi.getAll(`?${params.toString()}`)
      setExportsData(data)
    } catch (err) {
      setError(dict.inventory?.error_load || 'Failed to load exports')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, exportItem: InventoryExport) => {
    await inventoryExportApi.delete(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'exportId',
      label: dict.inventory?.export_id || 'Export ID',
      align: 'left',
      priority: true,
    },
    {
      key: 'kitchen',
      label: dict.inventory?.kitchen || 'Kitchen',
      align: 'left',
      priority: true,
      render: (value, row) => (row as InventoryExport).kitchen?.kitchenName || (row as InventoryExport).kitchenId,
    },
    {
      key: 'exportDate',
      label: dict.inventory?.export_date || 'Export Date',
      align: 'center',
      priority: true,
      render: (value) => value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
    {
      key: 'exportType',
      label: dict.inventory?.export_type || 'Type',
      align: 'center',
      render: (value) => {
        const typeLabels: Record<string, string> = {
          production: dict.inventory?.type_production || 'Production',
          transfer: dict.inventory?.type_transfer || 'Transfer',
          disposal: dict.inventory?.type_disposal || 'Disposal',
          return: dict.inventory?.type_return || 'Return',
          sample: dict.inventory?.type_sample || 'Sample',
        }
        const valueStr = String(value)
        return typeLabels[valueStr] || valueStr
      },
    },
    {
      key: 'destinationKitchen',
      label: dict.inventory?.destination_kitchen || 'Destination',
      align: 'left',
      render: (value, row) => {
        const exportRow = row as InventoryExport
        return exportRow.destinationKitchen?.kitchenName || exportRow.destinationKitchenId || '-'
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
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.view || 'View',
      onClick: async (exportItem) => {
        const item = exportItem as InventoryExport
        router.push(`/inventory/exports/${item.exportId}`)
      },
    },
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (exportItem) => {
        const item = exportItem as InventoryExport
        if (item.status === 'draft') {
          router.push(`/inventory/exports/${item.exportId}/edit`)
        }
      },
    },
    {
      label: dict.inventory?.approve || 'Approve',
      onClick: async (exportItem) => {
        const item = exportItem as InventoryExport
        if (item.status === 'draft') {
          try {
            await inventoryExportApi.approve(item.exportId)
            loadExports(1, 10, '')
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
      onClick: async (exportItem) => {
        const item = exportItem as InventoryExport
        if (item.status === 'draft') {
          await handleDelete(item.exportId, item)
        }
      },
    },
  ]

  return (
    <MasterDataListPage<InventoryExport>
      title={dict.inventory?.exports_title || 'Export Management'}
      addNewLabel={dict.inventory?.add_export || 'Add New Export'}
      createPath="/inventory/exports/create"
      searchPlaceholder={dict.inventory?.search_exports || 'Search exports...'}
      emptyMessage={dict.inventory?.no_exports || 'No exports found'}
      loadingMessage={dict.inventory?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={
        exportsData && exportsData.pagination
          ? {
              data: exportsData.data,
              meta: (() => {
                const { page, limit, total, total_pages } = exportsData.pagination!
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
                  total,
                  last_page: total_pages,
                  from,
                  to,
                }
              })(),
            }
          : null
      }
      loading={loading}
      error={error}
      onLoadData={loadExports}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(exportItem) => exportItem.exportId}
      getItemId={(exportItem) => exportItem.exportId}
      basePath="/inventory/exports"
      dictKey="inventory"
      actionsColumnPosition="status"
    />
  )
}

