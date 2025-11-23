'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'

export default function DishesList() {
  const [dishesData, setDishesData] = useState<ResourceCollection<Dish> | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadDishes = async (page: number, perPage: number, search: string) => {
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

  const handleDelete = async (id: string, dish: Dish) => {
    await dishApi.delete(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'dishId',
      label: dict.dishes?.id || 'Dish ID',
      align: 'left',
      priority: true,
    },
    {
      key: 'dishName',
      label: dict.dishes?.name || 'Dish Name',
      align: 'left',
      priority: true,
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
      variant: 'danger',
      loadingLabel: 'Deleting...',
      onClick: async (dish) => {
        await handleDelete(dish.dishId, dish)
      },
    },
  ]

  return (
    <MasterDataListPage<Dish>
      title={dict.dishes?.title || 'Dish Management'}
      addNewLabel={dict.dishes?.add_new || 'Add New Dish'}
      createPath="/dishes/create"
      searchPlaceholder={dict.common?.search || 'Search dishes...'}
      emptyMessage={dict.dishes?.no_data || 'No dishes found'}
      loadingMessage={dict.dishes?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={dishesData}
      loading={loading}
      error={error}
      onLoadData={loadDishes}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(dish) => dish.dishName || 'dish'}
      getItemId={(dish) => dish.dishId}
      basePath="/dishes"
      dictKey="dishes"
      inlineActionsColumn="dishName"
    />
  )
}
