'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Alert,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { supplierApi } from '@/services'
import { Supplier } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import MasterDataTable, { TableColumn, TableAction } from '@/components/Common/MasterDataTable/MasterDataTable'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

export default function SupplieresList() {
  const [suppliersData, setSupplieresData] =
    useState<ResourceCollection<Supplier> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const dict = useDictionary()
  const { addNotification } = useNotification()

  // Get query params
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('per_page') || '10')
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setSearchQuery(search)
    loadSupplieres()
  }, [page, perPage, search])

  const loadSupplieres = async () => {
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

  const handleDelete = async (id: string) => {
    const supplier = suppliersData?.data?.find(item => item.supplierId === id)
    const supplierName = supplier?.supplierName || 'this supplier'
    
    if (
      !confirm(
        dict.suppliers?.confirm_delete ||
          `Are you sure you want to delete ${supplierName}?`,
      )
    ) {
      return
    }

    try {
      await supplierApi.delete(id)
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${supplierName} has been deleted successfully.`,
      })
      loadSupplieres()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to delete ${supplierName}. Please try again.`,
      })
      setError(dict.suppliers?.error_delete || 'Failed to delete supplier')
      console.error(err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1') // Reset to first page

    if (searchQuery.trim()) {
      newSearchParams.set('search', searchQuery.trim())
    } else {
      newSearchParams.delete('search')
    }

    router.push(`/suppliers?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(`/suppliers?${newSearchParams.toString()}`)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'supplierId',
      label: dict.suppliers?.id || 'ID',
      align: 'left',
    },
    {
      key: 'supplierName',
      label: dict.suppliers?.name || 'Supplier Name',
      align: 'left',
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
      onClick: async (supplier) => {
        await handleDelete(supplier.supplierId)
      },
      variant: 'danger',
      loadingLabel: 'Deleting...',
    },
  ]

  const handleActionSuccess = (action: string, row: any) => {
    if (action === 'Edit') {
      addNotification({
        type: 'info',
        title: 'Navigation',
        message: `Redirecting to edit ${row.supplierName || 'supplier'}...`,
      })
    }
  }

  const handleActionError = (action: string, row: any, error: any) => {
    addNotification({
      type: 'error',
      title: 'Action Failed',
      message: `Failed to ${action.toLowerCase()} ${row.supplierName || 'item'}. Please try again.`,
    })
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        {dict.suppliers?.loading || 'Loading...'}
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{dict.suppliers?.title || 'Supplier Management'}</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/suppliers/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.suppliers?.add_new || 'Add New Supplier'}
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-3">
        <InputGroup>
          <FormControl
            type="text"
            placeholder={dict.common?.search || 'Search suppliers...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            {dict.common?.search || 'Search'}
          </Button>
          {search && (
            <Button variant="secondary" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </InputGroup>
      </form>

      {/* Table */}
      <MasterDataTable
        data={suppliersData?.data || []}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={dict.suppliers?.no_data || 'No suppliers found'}
        onActionSuccess={handleActionSuccess}
        onActionError={handleActionError}
      />

      {/* Pagination */}
      {suppliersData && suppliersData.meta && (
        <Pagination meta={suppliersData.meta} />
      )}
    </>
  )
}
