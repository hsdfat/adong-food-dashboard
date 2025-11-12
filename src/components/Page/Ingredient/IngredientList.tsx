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
import { ingredientApi } from '@/services'
import { Ingredient } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import MasterDataTable, { TableColumn, TableAction } from '@/components/Common/MasterDataTable/MasterDataTable'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

export default function IngredientesList() {
  const [ingredientsData, setIngredientesData] =
    useState<ResourceCollection<Ingredient> | null>(null)
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
    loadIngredientes()
  }, [page, perPage, search])

  const loadIngredientes = async () => {
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
      const data = await ingredientApi.getAll(`?${params.toString()}`)
      setIngredientesData(data)
    } catch (err) {
      setError(dict.ingredients?.error_load || 'Failed to load ingredients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const ingredient = ingredientsData?.data?.find(item => item.ingredientId === id)
    const ingredientName = ingredient?.ingredientName || 'this ingredient'
    
    if (
      !confirm(
        dict.ingredients?.confirm_delete ||
          `Are you sure you want to delete ${ingredientName}?`,
      )
    ) {
      return
    }

    try {
      await ingredientApi.delete(id)
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${ingredientName} has been deleted successfully.`,
      })
      loadIngredientes()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to delete ${ingredientName}. Please try again.`,
      })
      setError(dict.ingredients?.error_delete || 'Failed to delete ingredient')
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

    router.push(`/ingredients?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(`/ingredients?${newSearchParams.toString()}`)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'ingredientId',
      label: dict.ingredients?.id || 'ID',
      align: 'left',
    },
    {
      key: 'ingredientName',
      label: dict.ingredients?.name || 'Name',
      align: 'left',
    },
    {
      key: 'property',
      label: dict.ingredients?.property || 'Property',
      align: 'left',
      render: (value) => value || '-',
    },
    {
      key: 'materialGroup',
      label: dict.ingredients?.material_group || 'Material Group',
      align: 'left',
      render: (value) => value || '-',
    },
    {
      key: 'unit',
      label: dict.ingredients?.unit || 'Unit',
      align: 'center',
    },
    {
      key: 'createdDate',
      label: dict.ingredients?.created_date || 'Created Date',
      align: 'center',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (ingredient) => {
        router.push(`/ingredients/${ingredient.ingredientId}/edit`)
      },
    },
    {
      label: dict.action?.delete || 'Delete',
      onClick: async (ingredient) => {
        await handleDelete(ingredient.ingredientId)
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
        message: `Redirecting to edit ${row.ingredientName || 'ingredient'}...`,
      })
    }
  }

  const handleActionError = (action: string, row: any, error: any) => {
    addNotification({
      type: 'error',
      title: 'Action Failed',
      message: `Failed to ${action.toLowerCase()} ${row.ingredientName || 'item'}. Please try again.`,
    })
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        {dict.ingredients?.loading || 'Loading...'}
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{dict.ingredients?.title || 'Ingredient Management'}</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/ingredients/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.ingredients?.add_new || 'Add New Ingredient'}
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
            placeholder={dict.common?.search || 'Search ingredients...'}
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
        data={ingredientsData?.data || []}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={dict.ingredients?.no_data || 'No ingredients found'}
        onActionSuccess={handleActionSuccess}
        onActionError={handleActionError}
      />

      {/* Pagination */}
      {ingredientsData && ingredientsData.meta && (
        <Pagination meta={ingredientsData.meta} />
      )}
    </>
  )
}
