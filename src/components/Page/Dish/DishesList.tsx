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
import { dishApi } from '@/services'
import { Dish } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import MasterDataTable, { TableColumn, TableAction } from '@/components/Common/MasterDataTable/MasterDataTable'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

export default function DishesList() {
  const [dishesData, setDishesData] = useState<ResourceCollection<Dish> | null>(
    null,
  )
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
    loadDishes()
  }, [page, perPage, search])

  const loadDishes = async () => {
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
      const data = await dishApi.getAll(`?${params.toString()}`)
      setDishesData(data)
    } catch (err) {
      setError(dict.dishes?.error_load || 'Failed to load dishes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const dish = dishesData?.data?.find(item => item.dishId === id)
    const dishName = dish?.dishName || 'this dish'
    
    if (
      !confirm(
        dict.dishes?.confirm_delete ||
          `Are you sure you want to delete ${dishName}?`,
      )
    ) {
      return
    }

    try {
      await dishApi.delete(id)
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${dishName} has been deleted successfully.`,
      })
      loadDishes()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to delete ${dishName}. Please try again.`,
      })
      setError(dict.dishes?.error_delete || 'Failed to delete dish')
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

    router.push(`/dishes?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(`/dishes?${newSearchParams.toString()}`)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'dishId',
      label: dict.dishes?.id || 'Dish ID',
      align: 'left',
    },
    {
      key: 'dishName',
      label: dict.dishes?.name || 'Dish Name',
      align: 'left',
    },
    {
      key: 'cookingMethod',
      label: dict.dishes?.cooking_method || 'Cooking Method',
      align: 'left',
    },
    {
      key: 'active',
      label: dict.dishes?.status || 'Status',
      align: 'center',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.dishes?.recipe_standards || 'Recipe Standards',
      onClick: async (dish) => {
        router.push(`/dishes/${dish.dishId}/recipe-standard`)
      },
    },
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (dish) => {
        router.push(`/dishes/${dish.dishId}/edit`)
      },
    },
    {
      label: dict.action?.delete || 'Delete',
      onClick: async (dish) => {
        await handleDelete(dish.dishId)
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
        message: `Redirecting to edit ${row.dishName || 'dish'}...`,
      })
    } else if (action === 'Recipe Standards') {
      addNotification({
        type: 'info',
        title: 'Navigation',
        message: `Redirecting to recipe standards for ${row.dishName || 'dish'}...`,
      })
    }
  }

  const handleActionError = (action: string, row: any, error: any) => {
    addNotification({
      type: 'error',
      title: 'Action Failed',
      message: `Failed to ${action.toLowerCase()} ${row.dishName || 'item'}. Please try again.`,
    })
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        {dict.dishes?.loading || 'Loading...'}
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{dict.dishes?.title || 'Dish Management'}</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/dishes/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.dishes?.add_new || 'Add New Dish'}
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
            placeholder={dict.common?.search || 'Search dishes...'}
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
        data={dishesData?.data || []}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={dict.dishes?.no_data || 'No dishes found'}
        onActionSuccess={handleActionSuccess}
        onActionError={handleActionError}
      />

      {/* Pagination */}
      {dishesData && dishesData.meta && <Pagination meta={dishesData.meta} />}
    </>
  )
}
