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
import { useRouter } from 'next/navigation'
import { recipeStandardApi } from '@/services/'
import { RecipeStandard } from '@/models/recipe_standard'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataTable, { TableColumn, TableAction } from '@/components/Common/MasterDataTable/MasterDataTable'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

interface RecipeStandardsListProps {
  dishId?: string
}

export default function RecipeStandardsList({
  dishId,
}: RecipeStandardsListProps) {
  const [standards, setStandards] = useState<RecipeStandard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()
  const { addNotification } = useNotification()

  useEffect(() => {
    loadStandards()
    console.log('Loading recipe standards for dishId:', dishId, standards)
  }, [dishId])

  const loadStandards = async () => {
    try {
      setLoading(true)
      setError('')
      const response = dishId
        ? await recipeStandardApi.getByDish(dishId)
        : await recipeStandardApi.getAll()
      setStandards(response.data)
    } catch (err) {
      setError('Failed to load recipe standards')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const standard = standards.find(item => item.standardId === id)
    const standardName = standard?.dishName || standard?.ingredientName || `recipe standard ${id}`
    
    if (!confirm(`Are you sure you want to delete ${standardName}?`)) {
      return
    }

    try {
      await recipeStandardApi.delete(id)
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${standardName} has been deleted successfully.`,
      })
      await loadStandards()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to delete ${standardName}. Please try again.`,
      })
      setError('Failed to delete recipe standard')
      console.error(err)
    }
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'standardId',
      label: dict.recipe_standards?.dishId ?? 'ID',
      align: 'left',
    },
    {
      key: 'dishName',
      label: dict.recipe_standards?.dish ?? 'Dish',
      align: 'left',
      render: (value, row) => 
        row.dish?.dishName || value || row.dishId,
    },
    {
      key: 'ingredientName',
      label: dict.recipe_standards?.ingredient ?? 'Ingredient',
      align: 'left',
      render: (value, row) => 
        row.ingredient?.ingredientName || value || row.ingredientId,
    },
    {
      key: 'standardPer1',
      label: dict.recipe_standards?.standard_per_serving ?? 'Standard Per Serving',
      align: 'right',
    },
    {
      key: 'unit',
      label: dict.recipe_standards?.unit ?? 'Unit',
      align: 'center',
    },
    {
      key: 'amount',
      label: dict.recipe_standards?.amount ?? 'Amount',
      align: 'right',
      render: (value) => value?.toLocaleString('vi-VN') + ' VNĐ',
    },
    {
      key: 'note',
      label: dict.recipe_standards?.note ?? 'Note',
      align: 'left',
      render: (value) => value || '-',
      className: 'text-truncate',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action.edit,
      onClick: async (standard) => {
        router.push(`/recipe-standards/${standard.standardId}/edit`)
      },
    },
    {
      label: dict.action.delete,
      onClick: async (standard) => {
        await handleDelete(standard.standardId)
      },
      variant: 'danger',
      loadingLabel: 'Deleting...',
    },
  ]

  const handleActionSuccess = (action: string, row: any) => {
    if (action === 'Edit') {
      const standardName = row.dishName || row.ingredientName || 'recipe standard'
      addNotification({
        type: 'info',
        title: 'Navigation',
        message: `Redirecting to edit ${standardName}...`,
      })
    }
  }

  const handleActionError = (action: string, row: any, error: any) => {
    const standardName = row.dishName || row.ingredientName || 'item'
    addNotification({
      type: 'error',
      title: 'Action Failed',
      message: `Failed to ${action.toLowerCase()} ${standardName}. Please try again.`,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just reload - search functionality can be added later
    loadStandards()
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    loadStandards()
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        {dict.common?.loading || 'Loading...'}
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{dict.recipe_standards?.title || 'Recipe Standards Management'}</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/recipe-standards/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.recipe_standards.add || 'Add New'}
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
            placeholder={dict.common?.search || 'Search recipe standards...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            {dict.common?.search || 'Search'}
          </Button>
          {searchQuery && (
            <Button variant="secondary" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </InputGroup>
      </form>

      <MasterDataTable
        data={standards || []}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={dict.common?.no_data || 'No data available'}
        onActionSuccess={handleActionSuccess}
        onActionError={handleActionError}
      />
    </>
  )
}
