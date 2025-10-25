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
import { kitchenApi } from '@/services'
import { Kitchen } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

export default function KitchenesList() {
  const [kitchensData, setKitchenesData] =
    useState<ResourceCollection<Kitchen> | null>(null)
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
    loadKitchenes()
  }, [page, perPage, search])

  const loadKitchenes = async () => {
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
      const data = await kitchenApi.getAll(`?${params.toString()}`)
      setKitchenesData(data)
    } catch (err) {
      setError(dict.kitchens?.error_load || 'Failed to load kitchens')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        dict.kitchens?.confirm_delete ||
          'Are you sure you want to delete this kitchen?',
      )
    ) {
      return
    }

    try {
      await kitchenApi.delete(id)
      loadKitchenes()
    } catch (err) {
      setError(dict.kitchens?.error_delete || 'Failed to delete kitchen')
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

    router.push(`/kitchens?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(`/kitchens?${newSearchParams.toString()}`)
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            {dict.kitchens?.loading || 'Loading...'}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span>{dict.kitchens?.title || 'Kitchen Management'}</span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/kitchens/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.kitchens?.add_new || 'Add New Kitchen'}
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
              placeholder={dict.common?.search || 'Search kitchens...'}
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
                <th>{dict.kitchens?.id || 'ID'}</th>
                <th>{dict.kitchens?.name || 'Kitchen Name'}</th>
                <th>{dict.kitchens?.address || 'Address'}</th>
                <th>{dict.kitchens?.phone || 'Phone'}</th>
                <th>{dict.kitchens?.status || 'Status'}</th>
                <th>{dict.common?.created_date || 'Created Date'}</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {kitchensData &&
              kitchensData.data &&
              kitchensData.data.length > 0 ? (
                kitchensData.data.map((kitchen) => (
                  <tr key={kitchen.kitchenId}>
                    <td>{kitchen.kitchenId}</td>
                    <td>{kitchen.kitchenName}</td>
                    <td>{kitchen.address || '-'}</td>
                    <td>{kitchen.phone || '-'}</td>
                    <td>
                      <Badge bg={kitchen.active ? 'success' : 'secondary'}>
                        {kitchen.active
                          ? dict.common?.active || 'Active'
                          : dict.common?.inactive || 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      {new Date(kitchen.createdDate).toLocaleDateString()}
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
                              router.push(`/kitchens/${kitchen.kitchenId}/edit`)
                            }
                          >
                            {dict.action?.edit || 'Edit'}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete(kitchen.kitchenId)}
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
                    {dict.kitchens?.no_data || 'No kitchens found'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {kitchensData && kitchensData.meta && (
          <Pagination meta={kitchensData.meta} />
        )}
      </CardBody>
    </Card>
  )
}
