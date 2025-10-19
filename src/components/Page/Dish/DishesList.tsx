'use client'

import React, { useEffect, useState } from 'react'
import { Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish } from '@/models'
import useDictionary from '@/locales/dictionary-hook'

export default function DishesList() {
     console.log('DishesList')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    try {
        console.log('Loading dishes from API')
      setLoading(true)
      setError('')
      const data = await dishApi.getAll()
      setDishes(data)
    } catch (err) {
      setError('Failed to load dishes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) {
      return
    }

    try {
      await dishApi.delete(id)
      await loadDishes()
    } catch (err) {
      setError('Failed to delete dish')
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
        <Button variant="success" onClick={() => router.push('/dishes/create')}>
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' Add New Dish'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>ID</th>
            <th>Dish Name</th>
            <th>Cooking Method</th>
            <th>Group</th>
            <th>Description</th>
            <th>Status</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {dishes.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                No dishes found
              </td>
            </tr>
          ) : (
            dishes.map((dish) => (
              <tr key={dish.dishId}>
                <td>{dish.dishId}</td>
                <td>{dish.dishName}</td>
                <td>{dish.cookingMethod || '-'}</td>
                <td>{dish.group || '-'}</td>
                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                  {dish.description || '-'}
                </td>
                <td>
                  <Badge bg={dish.active ? 'success' : 'secondary'}>
                    {dish.active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${dish.dishId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem onClick={() => router.push(`/dishes/${dish.dishId}/edit`)}>
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push(`/recipe-standards/dish/${dish.dishId}`)}>
                        View Recipe
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(dish.dishId)}
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