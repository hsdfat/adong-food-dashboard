'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Table, Badge, Button, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { inventoryImportApi } from '@/services'
import { InventoryImport } from '@/models'
import useDictionary from '@/locales/dictionary-hook'
import ActionButton from '@/components/Common/ActionButton/ActionButton'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'
import { approveImport, getImportById } from '@/app/actions/inventory'

interface ImportDetailProps {
  importId: string;
}

export default function ImportDetail({ importId }: ImportDetailProps) {
  const router = useRouter()
  const dict = useDictionary()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [importData, setImportData] = useState<InventoryImport | null>(null)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    const loadImport = async () => {
      try {
        setLoading(true)
        const response = await inventoryImportApi.getById(importId)
        setImportData(response.data)
      } catch (err) {
        setError('Failed to load import')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadImport()
  }, [importId])

  const handleApprove = async () => {
    if (!confirm(dict.inventory?.confirm_approve || 'Are you sure you want to approve this import?')) {
      return
    }

    try {
      setApproving(true)
      await approveImport(importId)
      addNotification({
        type: 'success',
        title: 'Success',
        message: dict.inventory?.approved_success || 'Import approved successfully',
      })
      // Reload data
      const response = await getImportById(importId)
      setImportData(response.data)
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || dict.inventory?.approve_error || 'Failed to approve import',
      })
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !importData) {
    return <Alert variant="danger">{error || 'Import not found'}</Alert>
  }

  return (
    <div>
      <Card className="mb-3">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {dict.inventory?.import_detail || 'Import Detail'} - {importData.importId}
          </h4>
          <div className="d-flex gap-2">
            {importData.status === 'draft' && (
              <>
                <ActionButton
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/inventory/imports/${importId}/edit`)}
                >
                  {dict.action?.edit || 'Edit'}
                </ActionButton>
                <ActionButton
                  variant="success"
                  size="sm"
                  onClick={handleApprove}
                  disabled={approving}
                >
                  {approving
                    ? dict.inventory?.approving || 'Approving...'
                    : dict.inventory?.approve || 'Approve'}
                </ActionButton>
              </>
            )}
            <ActionButton
              variant="secondary"
              size="sm"
              onClick={() => router.push('/inventory/imports')}
            >
              {(dict.action as any)?.back || 'Back'}
            </ActionButton>
          </div>
        </CardHeader>
        <CardBody>
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>{dict.inventory?.kitchen || 'Kitchen'}:</strong>{' '}
                {importData.kitchen?.kitchenName || importData.kitchenId}
              </p>
              <p>
                <strong>{dict.inventory?.import_date || 'Import Date'}:</strong>{' '}
                {new Date(importData.importDate).toLocaleDateString()}
              </p>
              <p>
                <strong>{dict.inventory?.status || 'Status'}:</strong>{' '}
                {importData.status === 'approved' ? (
                  <Badge bg="success">Approved</Badge>
                ) : (
                  <Badge bg="secondary">Draft</Badge>
                )}
              </p>
            </div>
            <div className="col-md-6">
              {importData.supplier && (
                <p>
                  <strong>{dict.inventory?.supplier || 'Supplier'}:</strong>{' '}
                  {importData.supplier.supplierName || importData.supplierId}
                  {importData.supplier.zaloLink && (
                    <Button
                      variant="link"
                      size="sm"
                      className="ms-2 p-0"
                      onClick={() => window.open(importData.supplier!.zaloLink!, '_blank')}
                      title="Contact on Zalo"
                    >
                      <i className="bi bi-chat-dots-fill text-primary" /> Zalo
                    </Button>
                  )}
                </p>
              )}
              {importData.orderId && (
                <p>
                  <strong>{dict.inventory?.order_id || 'Order ID'}:</strong>{' '}
                  {importData.orderId}
                </p>
              )}
              <p>
                <strong>{dict.inventory?.total_amount || 'Total Amount'}:</strong>{' '}
                {new Intl.NumberFormat('vi-VN').format(importData.totalAmount)}
              </p>
            </div>
          </div>

          {importData.notes && (
            <div className="mb-3">
              <strong>{dict.inventory?.notes || 'Notes'}:</strong>
              <p>{importData.notes}</p>
            </div>
          )}

          {importData.approvedBy && (
            <div className="mb-3">
              <p>
                <strong>{dict.inventory?.approved_by || 'Approved By'}:</strong>{' '}
                {importData.approvedBy.username}
              </p>
              {importData.approvedDate && (
                <p>
                  <strong>{dict.inventory?.approved_date || 'Approved Date'}:</strong>{' '}
                  {new Date(importData.approvedDate).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <div>
        <h5 className="mb-3">{dict.inventory?.import_details || 'Import Details'}</h5>
        {importData.importDetails && importData.importDetails.length > 0 ? (
          (() => {
            // Group by supplier
            const grouped = new Map<string, typeof importData.importDetails>()
            importData.importDetails.forEach((detail) => {
              const suppId = detail.supplierId || 'no-supplier'
              if (!grouped.has(suppId)) {
                grouped.set(suppId, [])
              }
              grouped.get(suppId)!.push(detail)
            })

            const blocks = Array.from(grouped.entries()).map(([suppId, details]) => {
              const supplier = suppId === 'no-supplier'
                ? null
                : details[0]?.supplier
              const blockTotal = details.reduce((sum, d) => sum + d.totalPrice, 0)

              return {
                supplierId: suppId,
                supplierName: supplier?.supplierName || 'No Supplier',
                supplier,
                details,
                total: blockTotal
              }
            })

            return (
              <>
                {blocks.map((block, blockIndex) => (
                  <Card key={block.supplierId} className="mb-3">
                    <CardHeader className="bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">
                            <Badge bg="primary" className="me-2">Supplier {blockIndex + 1}</Badge>
                            {block.supplierName}
                            {block.supplier?.zaloLink && (
                              <Button
                                variant="link"
                                size="sm"
                                className="ms-2 p-0"
                                onClick={() => window.open(block.supplier!.zaloLink!, '_blank')}
                                title="Contact on Zalo"
                              >
                                <i className="bi bi-chat-dots-fill text-primary" /> Zalo
                              </Button>
                            )}
                          </h6>
                          <small className="text-muted">
                            {block.details.length} ingredient(s)
                          </small>
                        </div>
                        <h6 className="mb-0 text-primary">
                          {new Intl.NumberFormat('vi-VN').format(block.total)}
                        </h6>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Table responsive bordered size="sm">
                        <thead>
                          <tr>
                            <th>{dict.inventory?.ingredient || 'Ingredient'}</th>
                            <th>{dict.inventory?.quantity || 'Quantity'}</th>
                            <th>{dict.inventory?.unit || 'Unit'}</th>
                            <th>{dict.inventory?.unit_price || 'Unit Price'}</th>
                            <th>{dict.inventory?.total_price || 'Total Price'}</th>
                            {block.details.some((d) => d.expiryDate) && (
                              <th>{dict.inventory?.expiry_date || 'Expiry Date'}</th>
                            )}
                            {block.details.some((d) => d.batchNumber) && (
                              <th>{dict.inventory?.batch_number || 'Batch Number'}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {block.details.map((detail, index) => (
                            <tr key={detail.importDetailId || index}>
                              <td>
                                {detail.ingredient?.ingredientName || detail.ingredientId}
                              </td>
                              <td>{detail.quantity}</td>
                              <td>{detail.unit}</td>
                              <td>{new Intl.NumberFormat('vi-VN').format(detail.unitPrice)}</td>
                              <td>
                                <strong>
                                  {new Intl.NumberFormat('vi-VN').format(detail.totalPrice)}
                                </strong>
                              </td>
                              {block.details.some((d) => d.expiryDate) && (
                                <td>
                                  {detail.expiryDate
                                    ? new Date(detail.expiryDate).toLocaleDateString()
                                    : '-'}
                                </td>
                              )}
                              {block.details.some((d) => d.batchNumber) && (
                                <td>{detail.batchNumber || '-'}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                ))}

                <Card className="bg-light">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{dict.inventory?.total_amount || 'Total Amount'}</h5>
                      <h4 className="mb-0 text-primary">
                        {new Intl.NumberFormat('vi-VN').format(importData.totalAmount)}
                      </h4>
                    </div>
                  </CardBody>
                </Card>
              </>
            )
          })()
        ) : (
          <Alert variant="info">
            {dict.inventory?.no_details || 'No import details found'}
          </Alert>
        )}
      </div>
    </div>
  )
}

