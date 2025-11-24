'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ingredientApi } from '@/services'
import { Ingredient } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'

export default function IngredientesList() {
  const [ingredientsData, setIngredientesData] =
    useState<ResourceCollection<Ingredient> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadIngredientes = async (
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
      const data = await ingredientApi.getAll(`?${params.toString()}`)
      setIngredientesData(data)
    } catch (err) {
      setError(dict.ingredients?.error_load || 'Failed to load ingredients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, ingredient: Ingredient) => {
    await ingredientApi.delete(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'ingredientId',
      label: dict.ingredients?.id || 'ID',
      align: 'left',
      priority: true,
    },
    {
      key: 'ingredientName',
      label: dict.ingredients?.name || 'Name',
      align: 'left',
      priority: true,
    },
    {
      key: 'property',
      label: dict.ingredients?.property || 'Property',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'materialGroup',
      label: dict.ingredients?.material_group || 'Material Group',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
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
      render: (value) => value ? new Date(value as string | number).toLocaleDateString() : '-',
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
      variant: 'danger',
      loadingLabel: 'Deleting...',
      onClick: async (ingredient) => {
        // TODO: Implement delete functionality
        console.log('Delete ingredient:', ingredient)
      },
    },
  ]

  return (
    <MasterDataListPage<Ingredient>
      title={dict.ingredients?.title || 'Ingredient Management'}
      addNewLabel={dict.ingredients?.add_new || 'Add New Ingredient'}
      createPath="/ingredients/create"
      searchPlaceholder={dict.common?.search || 'Search ingredients...'}
      emptyMessage={dict.ingredients?.no_data || 'No ingredients found'}
      loadingMessage={dict.ingredients?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={ingredientsData}
      loading={loading}
      error={error}
      onLoadData={loadIngredientes}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(ingredient) => ingredient.ingredientName || 'ingredient'}
      getItemId={(ingredient) => ingredient.ingredientId}
      basePath="/ingredients"
      dictKey="ingredients"
      actionsColumnPosition="ingredientName"
    />
  )
}
