'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supplierApi } from '@/services'
import { Supplier } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'

export default function SupplieresList() {
  const [suppliersData, setSupplieresData] =
    useState<ResourceCollection<Supplier> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadSupplieres = async (
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
      const data = await supplierApi.getAll(`?${params.toString()}`)
      setSupplieresData(data)
    } catch (err) {
      setError(dict.suppliers?.error_load || 'Failed to load suppliers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, supplier: Supplier) => {
    await supplierApi.delete(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'supplierId',
      label: dict.suppliers?.id || 'ID',
      align: 'left',
      priority: true,
    },
    {
      key: 'supplierName',
      label: dict.suppliers?.name || 'Supplier Name',
      align: 'left',
      priority: true,
    },
    {
      key: 'address',
      label: dict.suppliers?.address || 'Address',
      align: 'left',
      render: (value) => value || '-',
    },
    {
      key: 'phone',
      label: dict.suppliers?.phone || 'Phone',
      align: 'left',
      render: (value) => value || '-',
    },
    {
      key: 'zaloLink',
      label: dict.suppliers?.zalo_link || 'Zalo Link',
      align: 'left',
      render: (value) => value || '-',
    },
    {
      key: 'createdDate',
      label: dict.common?.created_date || 'Created Date',
      align: 'center',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (supplier) => {
        router.push(`/suppliers/${supplier.supplierId}/edit`)
      },
    },
    {
      label: dict.action?.delete || 'Delete',
      variant: 'danger',
      loadingLabel: 'Deleting...',
    },
  ]

  return (
    <MasterDataListPage<Supplier>
      title={dict.suppliers?.title || 'Supplier Management'}
      addNewLabel={dict.suppliers?.add_new || 'Add New Supplier'}
      createPath="/suppliers/create"
      searchPlaceholder={dict.common?.search || 'Search suppliers...'}
      emptyMessage={dict.suppliers?.no_data || 'No suppliers found'}
      loadingMessage={dict.suppliers?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={suppliersData}
      loading={loading}
      error={error}
      onLoadData={loadSupplieres}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(supplier) => supplier.supplierName || 'supplier'}
      getItemId={(supplier) => supplier.supplierId}
      basePath="/suppliers"
      dictKey="suppliers"
      actionsColumnPosition="supplierName"
    />
  )
}
