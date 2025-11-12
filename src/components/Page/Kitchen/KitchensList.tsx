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
  faHeart,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { kitchenApi } from '@/services'
import { Kitchen } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import MasterDataTable, { TableColumn, TableAction } from '@/components/Common/MasterDataTable/MasterDataTable'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

export default function KitchenesList() {
  const [kitchensData, setKitchenesData] =
    useState<ResourceCollection<Kitchen> | null>(null)
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
    loadKitchenes()
  }, [page, perPage, search])

  const loadKitchenes = async () => {
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
      const data = await kitchenApi.getAll(`?${params.toString()}`)
      setKitchenesData(data)
    } catch (err) {
      setError(dict.kitchens?.error_load || 'Failed to load kitchens')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const kitchen = kitchensData?.data?.find(item => item.kitchenId === id)
    const kitchenName = kitchen?.kitchenName || 'this kitchen'
    
    if (
      !confirm(
        dict.kitchens?.confirm_delete ||
          `Are you sure you want to delete ${kitchenName}?`,
      )
    ) {
      return
    }

    try {
      await kitchenApi.delete(id)
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${kitchenName} has been deleted successfully.`,
      })
      loadKitchenes()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to delete ${kitchenName}. Please try again.`,
      })
      setError(dict.kitchens?.error_delete || 'Failed to delete kitchen')
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

    router.push(`/kitchens?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(`/kitchens?${newSearchParams.toString()}`)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'kitchenId',
      label: dict.kitchens?.id || 'ID',
      align: 'left',
    },
    {
      key: 'kitchenName',
      label: dict.kitchens?.name || 'Kitchen Name',
      align: 'left',
    },
    {
      key: 'address',
      label: dict.kitchens?.address || 'Address',
      align: 'left',
      render: (value) => value || '-',
    },
    {
      key: 'phone',
      label: dict.kitchens?.phone || 'Phone',
      align: 'left',
      render: (value) => value || '-',
    },
    {
      key: 'active',
      label: dict.kitchens?.status || 'Status',
      align: 'center',
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
      onClick: async (kitchen) => {
        router.push(`/kitchens/${kitchen.kitchenId}/edit`)
      },
    },
    {
      label: (dict.kitchens as any)?.view_favorite_suppliers || 'Favorite Suppliers',
      onClick: async (kitchen) => {
        router.push(`/kitchens/${kitchen.kitchenId}/favorite-suppliers`)
      },
      icon: <FontAwesomeIcon icon={faHeart} className="me-2" />,
    },
    {
      label: dict.action?.delete || 'Delete',
      onClick: async (kitchen) => {
        await handleDelete(kitchen.kitchenId)
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
        message: `Redirecting to edit ${row.kitchenName || 'kitchen'}...`,
      })
    } else if (action === 'Favorite Suppliers') {
      addNotification({
        type: 'info',
        title: 'Navigation',
        message: `Redirecting to favorite suppliers for ${row.kitchenName || 'kitchen'}...`,
      })
    }
  }

  const handleActionError = (action: string, row: any, error: any) => {
    addNotification({
      type: 'error',
      title: 'Action Failed',
      message: `Failed to ${action.toLowerCase()} ${row.kitchenName || 'item'}. Please try again.`,
    })
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        {dict.kitchens?.loading || 'Loading...'}
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{dict.kitchens?.title || 'Kitchen Management'}</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/kitchens/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.kitchens?.add_new || 'Add New Kitchen'}
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
            placeholder={dict.common?.search || 'Search kitchens...'}
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
        data={kitchensData?.data || []}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={dict.kitchens?.no_data || 'No kitchens found'}
        onActionSuccess={handleActionSuccess}
        onActionError={handleActionError}
      />

      {/* Pagination */}
      {kitchensData && kitchensData.meta && (
        <Pagination meta={kitchensData.meta} />
      )}
    </>
  )
}
