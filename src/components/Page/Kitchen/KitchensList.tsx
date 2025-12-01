'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { kitchenApi } from '@/services'
import { Kitchen } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'

export default function KitchenesList() {
  const [kitchensData, setKitchenesData] =
    useState<ResourceCollection<Kitchen> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadKitchenes = async (
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
      const data = await kitchenApi.getAll(`?${params.toString()}`)
      setKitchenesData(data)
    } catch (err) {
      setError(dict.kitchens?.error_load || 'Failed to load kitchens')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, kitchen: Kitchen) => {
    await kitchenApi.delete(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'kitchenName',
      label: dict.kitchens?.name || 'Kitchen Name',
      align: 'left',
      priority: true,
    },
    {
      key: 'address',
      label: dict.kitchens?.address || 'Address',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'phone',
      label: dict.kitchens?.phone || 'Phone',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
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
      render: (value) => value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
    {
      key: 'kitchenId',
      label: dict.kitchens?.id || 'ID',
      align: 'left',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (kitchen) => {
        const item = kitchen as Kitchen
        router.push(`/kitchens/${item.kitchenId}/edit`)
      },
    },
    {
      label:
        (dict.kitchens as any)?.view_favorite_suppliers || 'Favorite Suppliers',
      onClick: async (kitchen) => {
        const item = kitchen as Kitchen
        router.push(`/kitchens/${item.kitchenId}/favorite-suppliers`)
      },
      icon: <FontAwesomeIcon icon={faHeart} />,
    },
  ]

  return (
    <MasterDataListPage<Kitchen>
      title={dict.kitchens?.title || 'Kitchen Management'}
      addNewLabel={dict.kitchens?.add_new || 'Add New Kitchen'}
      createPath="/kitchens/create"
      searchPlaceholder={dict.common?.search || 'Search kitchens...'}
      emptyMessage={dict.kitchens?.no_data || 'No kitchens found'}
      loadingMessage={dict.kitchens?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={kitchensData}
      loading={loading}
      error={error}
      onLoadData={loadKitchenes}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(kitchen) => kitchen.kitchenName || 'kitchen'}
      getItemId={(kitchen) => kitchen.kitchenId}
      basePath="/kitchens"
      dictKey="kitchens"
      actionsColumnPosition="kitchenName"
    />
  )
}
