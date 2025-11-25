'use client'

// components/Page/SupplierPrice/SupplierPricesList.tsx

import React, { useEffect, useState } from 'react'
import {
  Button,
  Alert,
  FormControl,
  InputGroup,
  Row,
  Col,
  Form,
  Card,
  CardBody,
  CardHeader,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { SupplierPrice } from '@/models/supplier-price'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import MasterDataTable, {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

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
  ingredientId?: string;
  supplierId?: string;
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
  const { addNotification } = useNotification()

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
    const price = prices.find((item) => item.productId === id)
    const productName = price?.productName || `product ${id}`

    if (!confirm(`Are you sure you want to delete ${productName}?`)) {
      return
    }

    try {
      await supplierPriceApi.delete(id)
      addNotification({
        type: 'success',
        title: 'Success',
        message: `${productName} has been deleted successfully.`,
      })
      await loadPrices()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to delete ${productName}. Please try again.`,
      })
      setError('Failed to delete supplier price')
      console.error(err)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount: number) => `${amount?.toLocaleString('vi-VN')  } đ`

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

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'productId',
      label: dict.supplierPrice?.productID || 'ID',
      align: 'left',
      priority: true,
    },
    {
      key: 'productName',
      label: dict.supplierPrice?.productName || 'Product Name',
      align: 'left',
      priority: true,
    },
    {
      key: 'ingredientName',
      label: dict.supplierPrice?.ingredient || 'Ingredient',
      align: 'left',
      render: (value, row) => value || row.ingredientId || '-',
    },
    {
      key: 'category',
      label: dict.supplierPrice?.category || 'Category',
      align: 'left',
    },
    {
      key: 'supplierName',
      label: dict.supplierPrice?.supplier || 'Supplier',
      align: 'left',
      render: (value, row) => value || row.supplierId || '-',
    },
    {
      key: 'manufacturer',
      label: dict.supplierPrice?.manufacturer || 'Manufacturer',
      align: 'left',
    },
    {
      key: 'unit',
      label: dict.supplierPrice?.unit || 'Unit',
      align: 'center',
    },
    {
      key: 'specification',
      label: dict.supplierPrice?.specification || 'Specification',
      align: 'left',
    },
    {
      key: 'unitPrice',
      label: dict.supplierPrice?.unitPrice || 'Unit Price',
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'pricePer1',
      label: dict.supplierPrice?.pricePer1 || 'Price Per 1',
      align: 'right',
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: 'effectiveFrom',
      label: dict.supplierPrice?.effectiveFrom || 'Effective From',
      align: 'center',
      render: (value) => formatDate(value || ''),
    },
    {
      key: 'effectiveTo',
      label: dict.supplierPrice?.effectiveTo || 'Effective To',
      align: 'center',
      render: (value) => formatDate(value || ''),
    },
    {
      key: 'active',
      label: dict.supplierPrice?.status || 'Status',
      align: 'center',
    },
    {
      key: 'newPrice',
      label: dict.supplierPrice?.newPrice || 'New Price',
      align: 'right',
      render: (value) => (value ? formatCurrency(value) : '-'),
    },
    {
      key: 'promotion',
      label: dict.supplierPrice?.promotion || 'Promotion',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (price) => {
        const item = price as SupplierPrice
        router.push(`/supplier-prices/${item.productId}/edit`)
      },
    },
    {
      label: dict.action?.delete || 'Delete',
      onClick: async (price) => {
        const item = price as SupplierPrice
        await handleDelete(item.productId)
      },
      variant: 'danger',
      loadingLabel: 'Deleting...',
    },
  ]

  const handleActionSuccess = (action: string, row: any) => {
    if (action === 'Edit') {
      addNotification({
        type: 'info',
        title: 'Navigation',
        message: `Redirecting to edit ${row.productName || 'product'}...`,
      })
    }
  }

  const handleActionError = (action: string, row: any, error: any) => {
    addNotification({
      type: 'error',
      title: 'Action Failed',
      message: `Failed to ${action.toLowerCase()} ${row.productName || 'item'}. Please try again.`,
    })
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Supplier Price Management</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/supplier-prices/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add New
        </Button>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search and Filter Bar */}
        <form onSubmit={handleSearch} className="mb-3">
          <Row>
            <Col md={8}>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder={
                    dict.common?.search || 'Search supplier prices...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  {dict.common?.search || 'Search'}
                </Button>
                {(searchQuery || dateFrom || dateTo) && (
                  <Button variant="outline-danger" onClick={handleClearFilters}>
                    {dict.common?.clear || 'Clear'}
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={4} className="text-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                {dict.common?.filter || 'Filter'}
              </Button>
            </Col>
          </Row>

          {/* Date Filters */}
          {showFilters && (
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    {dict.supplierPrice?.effectiveFrom || 'Effective From'}
                  </Form.Label>
                  <FormControl
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
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

        <MasterDataTable
          data={prices || []}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage={dict.common?.no_data || 'No data available'}
          onActionSuccess={handleActionSuccess}
          onActionError={handleActionError}
          actionsColumnPosition="productName"
          actionsColumnLabel={dict.common?.actions || 'Actions'}
        />

        {meta && <Pagination meta={meta} />}
      </CardBody>
    </Card>
  )
}
