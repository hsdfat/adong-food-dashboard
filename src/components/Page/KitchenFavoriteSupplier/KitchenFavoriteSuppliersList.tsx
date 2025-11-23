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
  Modal,
  Form,
  Row,
  Col,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsisVertical,
  faSearch,
  faEdit,
  faTrash,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { kitchenFavoriteSupplierApi, supplierApi } from '@/services'
import { KitchenFavoriteSupplier, Supplier } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

interface KitchenFavoriteSuppliersListProps {
  kitchenId: string
}

export default function KitchenFavoriteSuppliersList({
  kitchenId,
}: KitchenFavoriteSuppliersListProps) {
  const [favoritesData, setFavoritesData] =
    useState<ResourceCollection<KitchenFavoriteSupplier> | null>(null)
  const [suppliersData, setSuppliersData] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [notes, setNotes] = useState<string>('')
  const [isEditing, setIsEditing] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dict = useDictionary()

  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('page_size') || '10')
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setSearchQuery(search)
    loadSuppliers()
    loadFavorites()
    // Temporary: Set sample data for display
    setFavoritesData({
      data: [
        {
          favoriteId: 1,
          kitchenId: 'KIT001',
          supplierId: 'SUP001',
          notes: 'Thịt tươi chất lượng tốt',
          displayOrder: undefined,
          createdByUserId: 'USR002',
          createdDate: '2025-11-09T10:48:38.596525Z',
          modifiedDate: '2025-11-09T10:48:38.596525Z',
          supplier: {
            supplierId: 'SUP001',
            supplierName: 'Công ty Thực phẩm Sạch Việt',
            zaloLink: 'https://zalo.me/sachviet',
            address: '45 Đường Bến Vân Đồn, Quận 4, TP.HCM',
            phone: '0283567890',
            email: 'sachviet@gmail.com',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
          createdBy: {
            userId: 'USR002',
            userName: 'chef_k001',
            fullName: 'Trần Thị Bình',
            role: 'Chef',
            kitchenId: 'KIT001',
            email: 'binh@adongfood.vn',
            phone: '0901234568',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
        },
        {
          favoriteId: 2,
          kitchenId: 'KIT001',
          supplierId: 'SUP002',
          notes: 'Tôm luôn tươi sống',
          displayOrder: undefined,
          createdByUserId: 'USR002',
          createdDate: '2025-11-09T10:48:38.596525Z',
          modifiedDate: '2025-11-09T10:48:38.596525Z',
          supplier: {
            supplierId: 'SUP002',
            supplierName: 'Nhà cung cấp Hải sản Tươi Sống',
            zaloLink: 'https://zalo.me/haisantuoisong',
            address: '78 Đường Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM',
            phone: '0287890123',
            email: 'haisantuoi@gmail.com',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
          createdBy: {
            userId: 'USR002',
            userName: 'chef_k001',
            fullName: 'Trần Thị Bình',
            role: 'Chef',
            kitchenId: 'KIT001',
            email: 'binh@adongfood.vn',
            phone: '0901234568',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
        },
        {
          favoriteId: 3,
          kitchenId: 'KIT001',
          supplierId: 'SUP003',
          notes: 'Rau sạch Đà Lạt',
          displayOrder: undefined,
          createdByUserId: 'USR002',
          createdDate: '2025-11-09T10:48:38.596525Z',
          modifiedDate: '2025-11-09T10:48:38.596525Z',
          supplier: {
            supplierId: 'SUP003',
            supplierName: 'Cửa hàng Rau Củ Đà Lạt',
            zaloLink: 'https://zalo.me/raucudalat',
            address: '123 Đường Lý Thường Kiệt, Quận 10, TP.HCM',
            phone: '0289012345',
            email: 'raudalat@gmail.com',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
          createdBy: {
            userId: 'USR002',
            userName: 'chef_k001',
            fullName: 'Trần Thị Bình',
            role: 'Chef',
            kitchenId: 'KIT001',
            email: 'binh@adongfood.vn',
            phone: '0901234568',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
        },
        {
          favoriteId: 4,
          kitchenId: 'KIT001',
          supplierId: 'SUP004',
          notes: 'Nước mắm ngon',
          displayOrder: undefined,
          createdByUserId: 'USR002',
          createdDate: '2025-11-09T10:48:38.596525Z',
          modifiedDate: '2025-11-09T10:48:38.596525Z',
          supplier: {
            supplierId: 'SUP004',
            supplierName: 'Công ty Gia vị Việt Nam',
            zaloLink: 'https://zalo.me/giavivietnam',
            address: '567 Đường Nguyễn Tri Phương, Quận 5, TP.HCM',
            phone: '0281234567',
            email: 'giavi@gmail.com',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
          createdBy: {
            userId: 'USR002',
            userName: 'chef_k001',
            fullName: 'Trần Thị Bình',
            role: 'Chef',
            kitchenId: 'KIT001',
            email: 'binh@adongfood.vn',
            phone: '0901234568',
            active: true,
            createdDate: '2025-11-09T10:48:38.596525Z',
            modifiedDate: '2025-11-09T10:48:38.596525Z',
          },
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        from: 1,
        to: 4,
        per_page: 10,
        total: 4,
      },
    })
  }, [page, perPage, search])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('page_size', perPage.toString())
      if (search) {
        params.append('search', search)
      }

      console.log('Loading favorites for kitchen:', kitchenId)
      console.log(
        'API URL:',
        `/api/kitchens/${kitchenId}/favorite-suppliers?${params.toString()}`,
      )

      const data = await kitchenFavoriteSupplierApi.getAll(
        kitchenId,
        `?${params.toString()}`,
      )
      console.log('API Response:', data)

      setFavoritesData(data)
    } catch (err) {
      console.error('Error loading favorites:', err)
      setError(dict.kitchens?.error_load || 'Failed to load favorite suppliers')
    } finally {
      setLoading(false)
    }
  }

  const loadSuppliers = async () => {
    try {
      const data = await supplierApi.getAll('?per_page=100')
      setSuppliersData(data?.data || [])
    } catch (err) {
      console.error('Failed to load suppliers:', err)
    }
  }

  const handleCreateFavorites = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSuppliers.length === 0) {
      setError('Please select at least one supplier')
      return
    }

    try {
      // Create favorites for each selected supplier
      const promises = selectedSuppliers.map((supplierId) => {
        const createData = {
          supplier_ids: [supplierId],
          notes: notes || undefined,
        }
        return kitchenFavoriteSupplierApi.create(kitchenId, createData)
      })

      await Promise.all(promises)
      setShowCreateModal(false)
      setSelectedSuppliers([])
      setNotes('')
      loadFavorites()
    } catch (err: any) {
      setError(err.message || 'Failed to create favorite suppliers')
      console.error(err)
    }
  }

  const handleDelete = async (favoriteId: number) => {
    if (
      !confirm(
        dict.kitchens?.confirm_delete ||
          'Are you sure you want to remove this favorite supplier?',
      )
    ) {
      return
    }

    try {
      await kitchenFavoriteSupplierApi.delete(kitchenId, favoriteId.toString())
      loadFavorites()
    } catch (err) {
      setError(
        dict.kitchens?.error_delete || 'Failed to remove favorite supplier',
      )
      console.error(err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')

    if (searchQuery.trim()) {
      newSearchParams.set('search', searchQuery.trim())
    } else {
      newSearchParams.delete('search')
    }

    router.push(
      `/kitchens/${kitchenId}/favorite-suppliers?${newSearchParams.toString()}`,
    )
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(
      `/kitchens/${kitchenId}/favorite-suppliers?${newSearchParams.toString()}`,
    )
  }

  const handleSupplierSelection = (supplierId: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId],
    )
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
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <span>
            {dict.kitchens?.favorite_suppliers || 'Kitchen Favorite Suppliers'}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {dict.kitchens?.add_favorite || 'Add Favorite Supplier'}
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
                placeholder={
                  dict.common?.search || 'Search favorite suppliers...'
                }
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

          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>{dict.suppliers?.name || 'Supplier'}</th>
                  <th>{dict.suppliers?.address || 'Address'}</th>
                  <th>{(dict.suppliers as any)?.contact || 'Contact'}</th>
                  <th>{dict.kitchens?.notes || 'Notes'}</th>
                  <th>{dict.common?.created_date || 'Created Date'}</th>
                </tr>
              </thead>
              <tbody>
                {favoritesData?.data && favoritesData.data.length > 0 ? (
                  favoritesData.data.map((favorite) => (
                    <tr key={`${favorite.kitchenId}-${favorite.favoriteId}`}>
                      <td>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-bold">
                              {favorite.supplier?.supplierName ||
                                favorite.supplierId}
                            </div>
                            {favorite.supplier?.active !== undefined && (
                              <Badge
                                bg={
                                  favorite.supplier.active
                                    ? 'success'
                                    : 'secondary'
                                }
                                className="mt-1"
                              >
                                {favorite.supplier.active
                                  ? dict.common?.active || 'Active'
                                  : dict.common?.inactive || 'Inactive'}
                              </Badge>
                            )}
                          </div>
                          {isEditing && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(favorite.favoriteId)}
                              title="Delete"
                              className="ms-2"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td>
                        {favorite.supplier?.address && (
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="me-2 text-muted"
                            />
                            <span>{favorite.supplier.address}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="small">
                          {favorite.supplier?.phone && (
                            <div className="d-flex align-items-center mb-1">
                              <FontAwesomeIcon
                                icon={faPhone}
                                className="me-2 text-muted"
                              />
                              <span>{favorite.supplier.phone}</span>
                            </div>
                          )}
                          {favorite.supplier?.email && (
                            <div className="d-flex align-items-center mb-1">
                              <FontAwesomeIcon
                                icon={faEnvelope}
                                className="me-2 text-muted"
                              />
                              <span>{favorite.supplier.email}</span>
                            </div>
                          )}
                          {favorite.supplier?.zaloLink && (
                            <div className="d-flex align-items-center">
                              <span className="me-2 text-muted">Zalo:</span>
                              <a
                                href={favorite.supplier.zaloLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary"
                              >
                                {favorite.supplier.zaloLink.replace(
                                  'https://zalo.me/',
                                  '',
                                )}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {favorite.notes || '-'}
                          {favorite.createdBy && (
                            <div className="text-muted small mt-1">
                              {dict.common?.created_by || 'Created by'}:{' '}
                              {favorite.createdBy.fullName}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {new Date(favorite.createdDate).toLocaleDateString()}
                          <div className="text-muted">
                            {new Date(
                              favorite.createdDate,
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      {dict.kitchens?.no_favorites ||
                        'No favorite suppliers found'}
                      <div className="text-muted small mt-2">
                        Debug: favoritesData exists ={' '}
                        {favoritesData ? 'true' : 'false'}
                        <br />
                        favoritesData.data exists ={' '}
                        {favoritesData?.data ? 'true' : 'false'}
                        <br />
                        favoritesData.data.length ={' '}
                        {favoritesData?.data?.length || 0}
                        <br />
                        <details>
                          <summary>Full favoritesData</summary>
                          <pre className="text-start">
                            {JSON.stringify(favoritesData, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {favoritesData && favoritesData.meta && (
            <Pagination meta={favoritesData.meta} />
          )}
        </CardBody>
      </Card>

      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {dict.kitchens?.add_favorite || 'Add Favorite Suppliers'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateFavorites}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                {dict.suppliers?.name || 'Suppliers'} (
                {selectedSuppliers.length} selected)
              </Form.Label>
              <div
                className="border rounded p-3"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {suppliersData.length > 0 ? (
                  suppliersData.map((supplier) => (
                    <Form.Check
                      key={supplier.supplierId}
                      type="checkbox"
                      id={`supplier-${supplier.supplierId}`}
                      label={
                        <div>
                          <div className="fw-bold">{supplier.supplierName}</div>
                          <div className="text-muted small">
                            {supplier.address} • {supplier.phone}
                          </div>
                        </div>
                      }
                      checked={selectedSuppliers.includes(supplier.supplierId)}
                      onChange={() =>
                        handleSupplierSelection(supplier.supplierId)
                      }
                      className="mb-2"
                    />
                  ))
                ) : (
                  <div className="text-muted">
                    {dict.suppliers?.no_data || 'No suppliers available'}
                  </div>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{dict.kitchens?.notes || 'Notes'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  dict.kitchens?.notes_placeholder ||
                  'Add notes about these suppliers...'
                }
              />
              <Form.Text className="text-muted">
                {dict.common?.optional || 'Optional'} - These notes will be
                applied to all selected suppliers
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false)
                setSelectedSuppliers([])
                setNotes('')
              }}
            >
              {dict.common?.cancel || 'Cancel'}
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={selectedSuppliers.length === 0}
            >
              {dict.common?.create || 'Create'} ({selectedSuppliers.length})
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
