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
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsisVertical,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { SupplierPrice } from '@/models/supplier-price'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

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
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadPrices()
  }, [ingredientId, supplierId, currentPage, pageSize, search, sortBy, sortDir])

  const loadPrices = async () => {
    try {
      setLoading(true)
      setError('')

      let data
      if (ingredientId) {
        data = await supplierPriceApi.getByIngredient(ingredientId)
        setPrices(data)
        setTotalPages(1)
      } else if (supplierId) {
        data = await supplierPriceApi.getBySupplier(supplierId)
        setPrices(data)
        setTotalPages(1)
      } else {
        const response = await supplierPriceApi.getAll({
          page: currentPage,
          pageSize,
          search,
          sortBy,
          sortDir,
        })
        setPrices(response.data)
        setTotalPages(response.totalPages)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadPrices()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString('vi-VN') + ' đ'
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
        <Col md={8}>
          <form onSubmit={handleSearch}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Search by product name, ingredient ID, supplier ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} fixedWidth />
                Search
              </Button>
            </InputGroup>
          </form>
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

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>ID</th>
            <th>Product Name</th>
            <th>Ingredient</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Manufacturer</th>
            <th>Unit</th>
            <th>Specification</th>
            <th className="text-end">Unit Price</th>
            <th className="text-end">Price Per 1</th>
            <th>Effective From</th>
            <th>Effective To</th>
            <th>Status</th>
            <th className="text-end">New Price</th>
            <th>Promotion</th>
            <th aria-label="Actions" />
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
              <tr key={price.id}>
                <td>{price.id}</td>
                <td>{price.productName}</td>
                <td>
                  {price.ingredientName || price.ingredientId}
                </td>
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
                      id={`action-${price.id}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          router.push(`/supplier-prices/${price.id}/edit`)
                        }
                      >
                        {dict.action?.edit || 'Edit'}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(price.id)}
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

      {!ingredientId && !supplierId && totalPages > 1 && (
        <Pagination
          meta={{
            from: (currentPage - 1) * pageSize + 1,
            to: Math.min(currentPage * pageSize, prices.length),
            total: prices.length,
            current_page: currentPage,
            last_page: totalPages,
            per_page: pageSize,
          }}
        />
      )}
    </>
  )
}
