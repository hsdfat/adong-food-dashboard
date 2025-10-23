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
import { faPlus, faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { supplierApi } from '@/services'
import { Supplier } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

export default function SupplieresList() {
  const [suppliersData, setSupplieresData] = useState<ResourceCollection<Supplier> | null>(null)
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
    loadSupplieres()
  }, [page, perPage, search])

  const loadSupplieres = async () => {
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
      const data = await supplierApi.getAll(`?${params.toString()}`)
      setSupplieresData(data)
    } catch (err) {
      setError(dict.suppliers?.error_load || 'Failed to load suppliers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(dict.suppliers?.confirm_delete || 'Are you sure you want to delete this supplier?')) {
      return
    }

    try {
      await supplierApi.delete(id)
      loadSupplieres()
    } catch (err) {
      setError(dict.suppliers?.error_delete || 'Failed to delete supplier')
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
    
    router.push(`/suppliers?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(`/suppliers?${newSearchParams.toString()}`)
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            {dict.suppliers?.loading || 'Loading...'}
          </div>
        </CardBody>
      </Card>
    )
  }


  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span>{dict.suppliers?.title || 'Supplier Management'}</span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/suppliers/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.suppliers?.add_new || 'Add New Supplier'}
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
              placeholder={dict.common?.search || 'Search suppliers...'}
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
                  <th>{dict.suppliers?.id || 'ID'}</th>
                  <th>{dict.suppliers?.name || 'Supplier Name'}</th>
                  <th>{dict.suppliers?.address || 'Address'}</th>
                  <th>{dict.suppliers?.phone || 'Phone'}</th>
                  <th>{dict.suppliers?.zalo_link || 'Phone'}</th>
                  <th>{dict.common?.created_date || 'Created Date'}</th>
                  <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {suppliersData && suppliersData.data && suppliersData.data.length > 0 ? (
                suppliersData.data.map((supplier) => (
                  <tr key={supplier.supplierId}>
                      <td>{supplier.supplierId}</td>
                      <td>{supplier.supplierName}</td>
                      <td>{supplier.address || '-'}</td>
                      <td>{supplier.phone || '-'}</td>
                      <td>{supplier.zaloLink || '-'}</td>
                <td>{new Date(supplier.createdDate).toLocaleDateString()}</td>
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
                          <DropdownItem onClick={() => router.push(`/suppliers/${supplier.supplierId}/edit`)}>
                            {dict.action?.edit || 'Edit'}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleDelete(supplier.supplierId)} className="text-danger">
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
                    {dict.suppliers?.no_data || 'No suppliers found'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {suppliersData && suppliersData.meta && (
          <Pagination meta={suppliersData.meta} />
        )}
      </CardBody>
    </Card>
  )
}