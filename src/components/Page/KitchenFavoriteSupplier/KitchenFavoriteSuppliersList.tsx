'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Alert,
  Badge,
  FormControl,
  InputGroup,
  Modal,
  Form,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faSearch,
  faTrash,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faEdit,
  faHeart,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { kitchenFavoriteSupplierApi, supplierApi } from '@/services'
import { KitchenFavoriteSupplier, Supplier } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import MultiSelectionModal, {
  MultiSelectionModalItem,
} from '@/components/Common/MultiSelectionModal/MultiSelectionModal'

interface KitchenFavoriteSuppliersListProps {
  kitchenId: string;
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
  const [supplierSearchQuery, setSupplierSearchQuery] = useState<string>('')
  const [editingFavorite, setEditingFavorite] = useState<KitchenFavoriteSupplier | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editNotes, setEditNotes] = useState<string>('')
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

  const handleEditClick = (favorite: KitchenFavoriteSupplier) => {
    setEditingFavorite(favorite)
    setEditNotes(favorite.notes || '')
    setShowEditModal(true)
  }

  const handleUpdateFavorite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFavorite) return

    try {
      await kitchenFavoriteSupplierApi.update(
        kitchenId,
        editingFavorite.favoriteId.toString(),
        { notes: editNotes },
      )
      setShowEditModal(false)
      setEditingFavorite(null)
      setEditNotes('')
      loadFavorites()
    } catch (err: any) {
      setError(err.message || 'Failed to update favorite supplier')
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

  const handleSupplierSelection = (supplierId: string, checked: boolean) => {
    if (checked) {
      setSelectedSuppliers((prev) => [...prev, supplierId])
    } else {
      setSelectedSuppliers((prev) => prev.filter((id) => id !== supplierId))
    }
  }

  const handleConfirmSuppliers = async () => {
    if (selectedSuppliers.length === 0) {
      setError('Please select at least one supplier')
      return
    }

    try {
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
      setSupplierSearchQuery('')
      loadFavorites()
    } catch (err: any) {
      setError(err.message || 'Failed to create favorite suppliers')
      console.error(err)
    }
  }

  // Filter suppliers based on search query and exclude already favorited ones
  const filteredSuppliers = suppliersData.filter((supplier) => {
    const matchesSearch =
      supplier.supplierName.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      supplier.supplierId.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      supplier.address?.toLowerCase().includes(supplierSearchQuery.toLowerCase())

    // Exclude suppliers already in favorites
    const isAlreadyFavorite = favoritesData?.data?.some(
      (fav) => fav.supplierId === supplier.supplierId,
    )

    return matchesSearch && !isAlreadyFavorite
  })

  // Convert suppliers to MultiSelectionModalItem format
  const supplierModalItems: MultiSelectionModalItem[] = filteredSuppliers.map((supplier) => ({
    id: supplier.supplierId,
    name: supplier.supplierName,
    subtitle: `${supplier.address || ''} • ${supplier.phone || ''}`,
    badge: supplier.active ? 'Active' : 'Inactive',
  }))

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
              <thead className="table-light">
                <tr>
                  <th style={{ width: '20%' }}>{dict.suppliers?.name || 'Supplier'}</th>
                  <th style={{ width: '20%' }}>{dict.suppliers?.address || 'Address'}</th>
                  <th style={{ width: '20%' }}>{(dict.suppliers as any)?.contact || 'Contact'}</th>
                  <th style={{ width: '20%' }}>{dict.kitchens?.notes || 'Notes'}</th>
                  <th style={{ width: '12%' }}>{dict.common?.created_date || 'Created'}</th>
                  <th style={{ width: '8%' }} className="text-center">{dict.common?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {favoritesData?.data && favoritesData.data.length > 0 ? (
                  favoritesData.data.map((favorite) => (
                    <tr key={`${favorite.kitchenId}-${favorite.favoriteId}`}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faHeart} className="text-danger me-2" />
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
                                pill
                              >
                                {favorite.supplier.active
                                  ? dict.common?.active || 'Active'
                                  : dict.common?.inactive || 'Inactive'}
                              </Badge>
                            )}
                          </div>
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
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditClick(favorite)}
                            title={dict.common?.edit || 'Edit'}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(favorite.favoriteId)}
                            title={dict.common?.delete || 'Delete'}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      <div className="mb-2">
                        {dict.kitchens?.no_favorites ||
                          'No favorite suppliers found'}
                      </div>
                      <small>
                        Click &quot;Add Favorite Supplier&quot; to get started
                      </small>
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

      <MultiSelectionModal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false)
          setSelectedSuppliers([])
          setNotes('')
          setSupplierSearchQuery('')
        }}
        title={dict.kitchens?.add_favorite || 'Add Favorite Suppliers'}
        items={supplierModalItems}
        searchValue={supplierSearchQuery}
        onSearchChange={setSupplierSearchQuery}
        selectedIds={selectedSuppliers}
        onSelect={handleSupplierSelection}
        onConfirm={handleConfirmSuppliers}
        searchPlaceholder={dict.common?.search || 'Search suppliers...'}
        emptyMessage={dict.suppliers?.no_data || 'No suppliers available'}
        closeLabel={dict.common?.cancel || 'Cancel'}
        confirmLabel={`${dict.common?.create || 'Add'} ${selectedSuppliers.length > 0 ? `(${selectedSuppliers.length})` : ''}`}
        selectedCountLabel={`${selectedSuppliers.length} ${dict.suppliers?.name?.toLowerCase() || 'suppliers'} selected`}
        size="lg"
        confirmVariant="primary"
        additionalFields={
          <Form.Group className="mt-2">
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
              {dict.common?.optional || 'Optional'} - These notes will be applied
              to all selected suppliers
            </Form.Text>
          </Form.Group>
        }
      />

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false)
          setEditingFavorite(null)
          setEditNotes('')
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {dict.common?.edit || 'Edit'} {dict.kitchens?.add_favorite || 'Favorite Supplier'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateFavorite}>
          <Modal.Body>
            {editingFavorite && (
              <>
                <div className="mb-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faHeart} className="text-danger me-2" size="lg" />
                    <div>
                      <div className="fw-bold fs-5">
                        {editingFavorite.supplier?.supplierName || editingFavorite.supplierId}
                      </div>
                      {editingFavorite.supplier?.address && (
                        <div className="text-muted small">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                          {editingFavorite.supplier.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>{dict.kitchens?.notes || 'Notes'}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder={
                      dict.kitchens?.notes_placeholder ||
                      'Add notes about this supplier...'
                    }
                  />
                  <Form.Text className="text-muted">
                    {dict.common?.optional || 'Optional'}
                  </Form.Text>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false)
                setEditingFavorite(null)
                setEditNotes('')
              }}
            >
              {dict.common?.cancel || 'Cancel'}
            </Button>
            <Button variant="primary" type="submit">
              {dict.common?.save || 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
