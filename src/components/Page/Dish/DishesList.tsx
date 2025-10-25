'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Badge,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsisVertical,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

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
    if (
      !confirm(
        dict.dishes?.confirm_delete ||
          'Are you sure you want to delete this dish?',
      )
    ) {
      return
    }

    try {
      await dishApi.delete(id)
      loadDishes()
    } catch (err) {
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

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            {dict.dishes?.loading || 'Loading...'}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span>{dict.dishes?.title || 'Dish Management'}</span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/dishes/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.dishes?.add_new || 'Add New Dish'}
        </Button>
      </CardHeader>
      <CardBody>
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
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>{dict.dishes?.id || 'Dish ID'}</th>
                <th>{dict.dishes?.name || 'Dish Name'}</th>
                <th>{dict.dishes?.cooking_method || 'Cooking Method'}</th>
                <th>{dict.dishes?.status || 'Status'}</th>
                <th className="text-end">
                  {dict.common?.actions || 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {dishesData && dishesData.data && dishesData.data.length > 0 ? (
                dishesData.data.map((dish) => (
                  <tr key={dish.dishId}>
                    <td>{dish.dishId}</td>
                    <td>{dish.dishName}</td>
                    <td>{dish.cookingMethod}</td>
                    <td>
                      <Badge bg={dish.active ? 'success' : 'secondary'}>
                        {dish.active
                          ? dict.common?.active || 'Active'
                          : dict.common?.inactive || 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Dropdown align="end">
                        <DropdownToggle
                          as="button"
                          className="btn btn-transparent btn-sm p-0"
                          bsPrefix="none"
                        >
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              router.push(`/dishes/${dish.dishId}/edit`)
                            }
                          >
                            {dict.action?.edit || 'Edit'}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete(dish.dishId)}
                            className="text-danger"
                          >
                            {dict.action?.delete || 'Delete'}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    {dict.dishes?.no_data || 'No dishes found'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {dishesData && dishesData.meta && <Pagination meta={dishesData.meta} />}
      </CardBody>
    </Card>
  )
}
