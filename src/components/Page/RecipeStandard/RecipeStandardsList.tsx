'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { recipeStandardApi } from '@/services/'
import { RecipeStandard } from '@/models/recipe_standard'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'

interface RecipeStandardsListProps {
  dishId?: string;
}

export default function RecipeStandardsList({
  dishId,
}: RecipeStandardsListProps) {
  const [standardsData, setStandardsData] =
    useState<ResourceCollection<RecipeStandard> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadStandards = async (
    page: number,
    perPage: number,
    search: string,
  ) => {
    try {
      setLoading(true)
      setError('')

      let response: ResourceCollection<RecipeStandard>
      if (dishId) {
        // When dishId is provided, get by dish (no pagination/search support in this endpoint)
        response = await recipeStandardApi.getByDish(dishId)
      } else {
        // When no dishId, use getAll with pagination
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('per_page', perPage.toString())
        if (search) {
          params.append('search', search)
        }
        response = await recipeStandardApi.getAll({
          page,
          per_page: perPage,
          search: search || undefined,
        })
      }
      setStandardsData(response)
    } catch (err) {
      setError('Failed to load recipe standards')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, standard: RecipeStandard) => {
    await recipeStandardApi.delete(standard.standardId)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'dishName',
      label: dict.recipe_standards?.dish ?? 'Dish',
      align: 'left',
      priority: true,
      render: (value, row) => {
        const standard = row as RecipeStandard
        return String(standard.dish?.dishName || value || standard.dishId || '')
      },
    },
    {
      key: 'kitchenName',
      label: dict.recipe_standards?.kitchen ?? 'Kitchen',
      align: 'left',
      render: (value, row) => {
        const standard = row as RecipeStandard
        return String(standard.kitchen?.kitchenName || value || standard.kitchenId || '-')
      },
    },
    {
      key: 'ingredientName',
      label: dict.recipe_standards?.ingredient ?? 'Ingredient',
      align: 'left',
      render: (value, row) => {
        const standard = row as RecipeStandard
        return String(standard.ingredient?.ingredientName || value || standard.ingredientId || '')
      },
    },
    {
      key: 'standardPer1',
      label:
        dict.recipe_standards?.standard_per_serving ?? 'Standard Per Serving',
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
      render: (value) => `${value?.toLocaleString('vi-VN')  } VNĐ`,
    },
    {
      key: 'note',
      label: dict.recipe_standards?.note ?? 'Note',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
      className: 'text-truncate',
    },
    {
      key: 'standardId',
      label: dict.recipe_standards?.dishId ?? 'ID',
      align: 'left',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (row) => {
        const standard = row as RecipeStandard
        router.push(`/recipe-standards/${standard.standardId}/edit`)
      },
    },
    {
      label: dict.action?.delete || 'Delete',
      variant: 'danger',
      loadingLabel: 'Deleting...',
      onClick: async (row) => {
        const standard = row as RecipeStandard
        await recipeStandardApi.delete(standard.standardId)
      },
    },
  ]

  return (
    <MasterDataListPage<RecipeStandard>
      title={dict.recipe_standards?.title || 'Recipe Standards Management'}
      addNewLabel={dict.recipe_standards?.add_new || 'Add New Recipe Standard'}
      createPath="/recipe-standards/create"
      searchPlaceholder={dict.common?.search || 'Search recipe standards...'}
      emptyMessage={dict.common?.no_data || 'No data available'}
      loadingMessage={dict.common?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={standardsData}
      loading={loading}
      error={error}
      onLoadData={loadStandards}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(standard) =>
        standard.dishName || standard.ingredientName || 'recipe standard'
      }
      getItemId={(standard) => standard.standardId.toString()}
      basePath="/recipe-standards"
      dictKey="recipe_standards"
      actionsColumnPosition="dishName"
    />
  )
}
