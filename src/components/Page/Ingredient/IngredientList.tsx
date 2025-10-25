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
import { ingredientApi } from '@/services'
import { Ingredient } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

export default function IngredientesList() {
  const [ingredientsData, setIngredientesData] =
    useState<ResourceCollection<Ingredient> | null>(null)
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
    if (
      !confirm(
        dict.ingredients?.confirm_delete ||
          'Are you sure you want to delete this ingredient?',
      )
    ) {
      return
    }

    try {
      await ingredientApi.delete(id)
      loadIngredientes()
    } catch (err) {
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

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            {dict.ingredients?.loading || 'Loading...'}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span>{dict.ingredients?.title || 'Ingredient Management'}</span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/ingredients/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.ingredients?.add_new || 'Add New Ingredient'}
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
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>{dict.ingredients?.id || 'ID'}</th>
                <th>{dict.ingredients?.name || 'Name'}</th>
                <th>{dict.ingredients?.property || 'Property'}</th>
                <th>{dict.ingredients?.material_group || 'Material Group'}</th>
                <th>{dict.ingredients?.unit || 'Unit'}</th>
                <th>{dict.ingredients?.created_date || 'Created Date'}</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {ingredientsData &&
              ingredientsData.data &&
              ingredientsData.data.length > 0 ? (
                ingredientsData.data.map((ingredient) => (
                  <tr key={ingredient.ingredientId}>
                    <td>{ingredient.ingredientId}</td>
                    <td>{ingredient.ingredientName}</td>
                    <td>{ingredient.property || '-'}</td>
                    <td>{ingredient.materialGroup || '-'}</td>
                    <td>{ingredient.unit}</td>
                    <td>
                      {new Date(ingredient.createdDate).toLocaleDateString()}
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
                              router.push(
                                `/ingredients/${ingredient.ingredientId}/edit`,
                              )
                            }
                          >
                            {dict.action?.edit || 'Edit'}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleDelete(ingredient.ingredientId)
                            }
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
                    {dict.ingredients?.no_data || 'No ingredients found'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {ingredientsData && ingredientsData.meta && (
          <Pagination meta={ingredientsData.meta} />
        )}
      </CardBody>
    </Card>
  )
}
