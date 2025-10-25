'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { recipeStandardApi } from '@/services/'
import { RecipeStandard } from '@/models/recipe_standard'
import useDictionary from '@/locales/dictionary-hook'

interface RecipeStandardsListProps {
  dishId?: string
}

export default function RecipeStandardsList({
  dishId,
}: RecipeStandardsListProps) {
  const [standards, setStandards] = useState<RecipeStandard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadStandards()
  }, [dishId])

  const loadStandards = async () => {
    try {
      setLoading(true)
      setError('')
      const data = dishId
        ? await recipeStandardApi.getByDish(dishId)
        : await recipeStandardApi.getAll()
      setStandards(data)
    } catch (err) {
      setError('Failed to load recipe standards')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe standard?')) {
      return
    }

    try {
      await recipeStandardApi.delete(id)
      await loadStandards()
    } catch (err) {
      setError('Failed to delete recipe standard')
      console.error(err)
    }
  }

  if (loading) {
    return <div>"Loading..."</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button
          variant="success"
          onClick={() => router.push('/recipe-standards/create')}
        >
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' Add Recipe Standard'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>{dict.recipe_standards?.dishId ?? 'ID'}</th>
            <th>{dict.recipe_standards?.dish ?? 'Dish'}</th>
            <th>{dict.recipe_standards?.ingredient ?? 'Ingredient'}</th>
            <th>
              {dict.recipe_standards?.standard_per_serving ??
                'Standard Per Serving'}
            </th>
            <th>{dict.recipe_standards?.unit ?? 'Unit'}</th>
            <th>{dict.recipe_standards?.amount ?? 'Amount'}</th>
            <th>{dict.recipe_standards?.note ?? 'Note'}</th>
            <th aria-label={''} />
          </tr>
        </thead>
        <tbody>
          {standards.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">
                No recipe standards found
              </td>
            </tr>
          ) : (
            standards.map((standard) => (
              <tr key={standard.standardId}>
                <td>{standard.standardId}</td>
                <td>{standard.dish?.dishName || standard.dishId}</td>
                <td>
                  {standard.ingredient?.ingredientName || standard.ingredientId}
                </td>
                <td className="text-end">{standard.standardPer1}</td>
                <td>{standard.unit}</td>
                <td className="text-end">
                  {standard.amount?.toLocaleString('vi-VN')} VNĐ
                </td>
                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                  {standard.note || '-'}
                </td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${standard.standardId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          router.push(
                            `/recipe-standards/${standard.standardId}/edit`,
                          )
                        }
                      >
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(standard.standardId)}
                      >
                        {dict.action.delete}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}
