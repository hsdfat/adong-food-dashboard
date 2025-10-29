'use client'

// components/Page/SupplierPrice/SupplierPricesList.tsx

import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Badge,
  FormControl,
  InputGroup,
  Row,
  Col,
  Form,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsisVertical,
  faSearch,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { SupplierPrice } from '@/models/supplier-price'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

import { format, formatDate, parse } from 'date-fns'

// Helper functions
const formatDateInput = (dateString: string) => {
  if (!dateString) return ''
  try {
    console.log('Parsing date string:', dateString)
    const date = new Date(dateString)
    const fomartDate = format(date, 'dd/MM/yyyy')
    console.log('Formatted date:', fomartDate)
    return formatDate.toString() // Vietnamese format
  } catch {
    return dateString
  }
}

const parseDateInput = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = parse(dateString, 'dd/MM/yyyy', new Date())
    return format(date, 'yyyy-MM-dd') // Convert to ISO format for backend
  } catch {
    return dateString
  }
}

interface SupplierPricesListProps {
  ingredientId?: string
  supplierId?: string
}

export default function SupplierPricesList({
  ingredientId,
  supplierId,
}: SupplierPricesListProps) {
  const [prices, setPrices] = useState<SupplierPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [meta, setMeta] = useState<any>(null)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Search states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [showFilters, setShowFilters] = useState(true)

  const router = useRouter()
  const dict = useDictionary()
  const searchParams = useSearchParams()

  // Get query params
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('per_page') || '20')
  const search = searchParams.get('search') || ''
  const effectiveFrom = searchParams.get('effective_from') || ''
  const effectiveTo = searchParams.get('effective_to') || ''

  useEffect(() => {
    // Initialize date inputs from URL params
    setSearchQuery(search)
    setDateFrom(effectiveFrom)
    setDateTo(effectiveTo)

    loadPrices()
  }, [page, pageSize, search, effectiveFrom, effectiveTo])

  const loadPrices = async () => {
    try {
      setLoading(true)
      setError('')

      let data
      if (ingredientId) {
        data = await supplierPriceApi.getByIngredient(ingredientId)
        setPrices(data)
      } else if (supplierId) {
        data = await supplierPriceApi.getBySupplier(supplierId)
        setPrices(data)
      } else {
        const param = {
          page,
          pageSize,
          search,
          sortBy,
          sortDir,
          effectiveFrom,
          effectiveTo,
        }
        const response = await supplierPriceApi.getAll(param)
        setPrices(response.data)
        setMeta(response.meta)
      }
    } catch (err) {
      setError('Failed to load supplier prices')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this supplier price?')) {
      return
    }

    try {
      await supplierPriceApi.delete(id)
      await loadPrices()
    } catch (err) {
      setError('Failed to delete supplier price')
      console.error(err)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString('vi-VN') + ' đ'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const newSearchParams = new URLSearchParams()
    newSearchParams.set('page', '1') // Reset to first page
    newSearchParams.set('per_page', pageSize.toString())

    if (searchQuery.trim()) {
      newSearchParams.set('search', searchQuery.trim())
    }

    if (dateFrom) {
      newSearchParams.set('effective_from', dateFrom)
    }

    if (dateTo) {
      newSearchParams.set('effective_to', dateTo)
    }

    router.push(`/supplier-prices?${newSearchParams.toString()}`)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDateFrom('')
    setDateTo('')
    router.push('/supplier-prices?page=1')
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={12}>
          <form onSubmit={handleSearch}>
            {/* Main Search Bar */}
            <Row className="mb-2">
              <Col md={8}>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder={
                      dict.supplierPrice?.search_placeholder ||
                      'Search by name, supplier, ingredient...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowFilters(!showFilters)}
                    title="Toggle filters"
                  >
                    <FontAwesomeIcon icon={faFilter} fixedWidth />
                  </Button>
                  <Button variant="primary" type="submit">
                    <FontAwesomeIcon icon={faSearch} fixedWidth />
                    {dict.common?.search || 'Search'}
                  </Button>
                  {(searchQuery || dateFrom || dateTo) && (
                    <Button
                      variant="outline-danger"
                      onClick={handleClearFilters}
                    >
                      {dict.common?.clear || 'Clear'}
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col md={4} className="text-end">
                <Button
                  variant="success"
                  onClick={() => router.push('/supplier-prices/create')}
                >
                  <FontAwesomeIcon icon={faPlus} fixedWidth />
                  {dict.action?.add || 'Add New'}
                </Button>
              </Col>
            </Row>

            {/* Date Range Filters - Collapsible */}
            {showFilters && (
              <Row className="mb-2">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small mb-1">
                      {dict.supplierPrice?.effectiveFrom || 'Effective From'}
                    </Form.Label>
                    <FormControl
                      type="date"
                      value={
                        dateFrom
                          ? format(new Date(dateFrom), 'yyyy-MM-dd')
                          : dateFrom
                      }
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small mb-1">
                      {dict.supplierPrice?.effectiveTo || 'Effective To'}
                    </Form.Label>
                    <FormControl
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </form>
        </Col>
      </Row>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>{dict.supplierPrice?.productID || 'ID'}</th>
            <th>{dict.supplierPrice?.productName || 'Product Name'}</th>
            <th>{dict.supplierPrice?.ingredient || 'Ingredient'}</th>
            <th>{dict.supplierPrice?.category || 'Category'}</th>
            <th>{dict.supplierPrice?.supplier || 'Supplier'}</th>
            <th>{dict.supplierPrice?.manufacturer || 'Manufacturer'}</th>
            <th>{dict.supplierPrice?.unit || 'Unit'}</th>
            <th>{dict.supplierPrice?.specification || 'Specification'}</th>
            <th className="text-end">
              {dict.supplierPrice?.unitPrice || 'Unit Price'}
            </th>
            <th className="text-end">
              {dict.supplierPrice?.pricePer1 || 'Price Per 1'}
            </th>
            <th>{dict.supplierPrice?.effectiveFrom || 'Effective From'}</th>
            <th>{dict.supplierPrice?.effectiveTo || 'Effective To'}</th>
            <th>{dict.supplierPrice?.status || 'Status'}</th>
            <th className="text-end">
              {dict.supplierPrice?.newPrice || 'New Price'}
            </th>
            <th>{dict.supplierPrice?.promotion || 'Promotion'}</th>
            <th aria-label={dict.common?.actions || 'Actions'} />
          </tr>
        </thead>
        <tbody>
          {prices && prices.length === 0 ? (
            <tr>
              <td colSpan={16} className="text-center">
                {dict.common?.no_data || 'No data available'}
              </td>
            </tr>
          ) : (
            prices.map((price) => (
              <tr key={price.productId}>
                <td>{price.productId}</td>
                <td>{price.productName}</td>
                <td>{price.ingredientName || price.ingredientId}</td>
                <td>{price.category}</td>
                <td>{price.supplierName || price.supplierId}</td>
                <td>{price.manufacturer}</td>
                <td>{price.unit}</td>
                <td>{price.specification}</td>
                <td className="text-end">{formatCurrency(price.unitPrice)}</td>
                <td className="text-end">{formatCurrency(price.pricePer1)}</td>
                <td>{formatDate(price.effectiveFrom)}</td>
                <td>{formatDate(price.effectiveTo)}</td>
                <td>
                  <Badge bg={price.active ? 'success' : 'secondary'}>
                    {price.active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="text-end">
                  {price.newPrice ? formatCurrency(price.newPrice) : '-'}
                </td>
                <td>{price.promotion || '-'}</td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${price.productId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          router.push(
                            `/supplier-prices/${price.productId}/edit`,
                          )
                        }
                      >
                        {dict.action?.edit || 'Edit'}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(price.productId)}
                      >
                        {dict.action?.delete || 'Delete'}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {meta && <Pagination meta={meta} />}
    </>
  )
}
