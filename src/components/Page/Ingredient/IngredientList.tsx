'use client'

import React, { useEffect, useState } from 'react'
import { Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { ingredientApi } from '@/services/ingredient-api'
import { Ingredient } from '@/models/ingredient'
import useDictionary from '@/locales/dictionary-hook'

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadIngredients()
  }, [])

  const loadIngredients = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ingredientApi.getAll()
      setIngredients(data)
    } catch (err) {
      setError('Failed to load ingredients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) {
      return
    }

    try {
      await ingredientApi.delete(id)
      await loadIngredients()
    } catch (err) {
      setError('Failed to delete ingredient')
      console.error(err)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button variant="success" onClick={() => router.push('/ingredients/create')}>
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' Add New'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>ID</th>
            <th>Name</th>
            <th>Property</th>
            <th>Material Group</th>
            <th>Unit</th>
            <th>Created Date</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                No ingredients found
              </td>
            </tr>
          ) : (
            ingredients.map((ingredient) => (
              <tr key={ingredient.ingredientId}>
                <td>{ingredient.ingredientId}</td>
                <td>{ingredient.ingredientName}</td>
                <td>{ingredient.property || '-'}</td>
                <td>{ingredient.materialGroup || '-'}</td>
                <td>{ingredient.unit}</td>
                <td>{new Date(ingredient.createdDate).toLocaleDateString()}</td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${ingredient.ingredientId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem onClick={() => router.push(`/ingredients/${ingredient.ingredientId}/edit`)}>
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(ingredient.ingredientId)}
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