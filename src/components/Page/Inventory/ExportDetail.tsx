'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Table, Badge, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { inventoryExportApi } from '@/services'
import { InventoryExport } from '@/models'
import useDictionary from '@/locales/dictionary-hook'
import ActionButton from '@/components/Common/ActionButton/ActionButton'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

interface ExportDetailProps {
  exportId: string
}

export default function ExportDetail({ exportId }: ExportDetailProps) {
  const router = useRouter()
  const dict = useDictionary()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exportData, setExportData] = useState<InventoryExport | null>(null)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    const loadExport = async () => {
      try {
        setLoading(true)
        const response = await inventoryExportApi.getById(exportId)
        setExportData(response.data)
      } catch (err) {
        setError('Failed to load export')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadExport()
  }, [exportId])

  const handleApprove = async () => {
    if (!confirm(dict.inventory?.confirm_approve_export || 'Are you sure you want to approve this export?')) {
      return
    }

    try {
      setApproving(true)
      await inventoryExportApi.approve(exportId)
      addNotification({
        type: 'success',
        title: 'Success',
        message: dict.inventory?.approved_success || 'Export approved successfully',
      })
      // Reload data
      const response = await inventoryExportApi.getById(exportId)
      setExportData(response.data)
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || dict.inventory?.approve_error || 'Failed to approve export',
      })
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !exportData) {
    return <Alert variant="danger">{error || 'Export not found'}</Alert>
  }

  const typeLabels: Record<string, string> = {
    production: dict.inventory?.type_production || 'Production',
    transfer: dict.inventory?.type_transfer || 'Transfer',
    disposal: dict.inventory?.type_disposal || 'Disposal',
    return: dict.inventory?.type_return || 'Return',
    sample: dict.inventory?.type_sample || 'Sample',
  }

  return (
    <div>
      <Card className="mb-3">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {dict.inventory?.export_detail || 'Export Detail'} - {exportData.exportId}
          </h4>
          <div className="d-flex gap-2">
            {exportData.status === 'draft' && (
              <>
                <ActionButton
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/inventory/exports/${exportId}/edit`)}
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
              onClick={() => router.push('/inventory/exports')}
            >
              {dict.action?.back || 'Back'}
            </ActionButton>
          </div>
        </CardHeader>
        <CardBody>
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>{dict.inventory?.kitchen || 'Kitchen'}:</strong>{' '}
                {exportData.kitchen?.kitchenName || exportData.kitchenId}
              </p>
              <p>
                <strong>{dict.inventory?.export_date || 'Export Date'}:</strong>{' '}
                {new Date(exportData.exportDate).toLocaleDateString()}
              </p>
              <p>
                <strong>{dict.inventory?.export_type || 'Export Type'}:</strong>{' '}
                {typeLabels[exportData.exportType] || exportData.exportType}
              </p>
              <p>
                <strong>{dict.inventory?.status || 'Status'}:</strong>{' '}
                {exportData.status === 'approved' ? (
                  <Badge bg="success">Approved</Badge>
                ) : (
                  <Badge bg="secondary">Draft</Badge>
                )}
              </p>
            </div>
            <div className="col-md-6">
              {exportData.destinationKitchen && (
                <p>
                  <strong>
                    {dict.inventory?.destination_kitchen || 'Destination Kitchen'}:
                  </strong>{' '}
                  {exportData.destinationKitchen.kitchenName ||
                    exportData.destinationKitchenId}
                </p>
              )}
              {exportData.orderId && (
                <p>
                  <strong>{dict.inventory?.order_id || 'Order ID'}:</strong>{' '}
                  {exportData.orderId}
                </p>
              )}
              <p>
                <strong>{dict.inventory?.total_amount || 'Total Amount'}:</strong>{' '}
                {new Intl.NumberFormat('vi-VN').format(exportData.totalAmount)}
              </p>
            </div>
          </div>

          {exportData.notes && (
            <div className="mb-3">
              <strong>{dict.inventory?.notes || 'Notes'}:</strong>
              <p>{exportData.notes}</p>
            </div>
          )}

          {exportData.approvedBy && (
            <div className="mb-3">
              <p>
                <strong>{dict.inventory?.approved_by || 'Approved By'}:</strong>{' '}
                {exportData.approvedBy.username}
              </p>
              {exportData.approvedDate && (
                <p>
                  <strong>{dict.inventory?.approved_date || 'Approved Date'}:</strong>{' '}
                  {new Date(exportData.approvedDate).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h5 className="mb-0">{dict.inventory?.export_details || 'Export Details'}</h5>
        </CardHeader>
        <CardBody>
          {exportData.exportDetails && exportData.exportDetails.length > 0 ? (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>{dict.inventory?.ingredient || 'Ingredient'}</th>
                  <th>{dict.inventory?.quantity || 'Quantity'}</th>
                  <th>{dict.inventory?.unit || 'Unit'}</th>
                  <th>{dict.inventory?.unit_cost || 'Unit Cost'}</th>
                  <th>{dict.inventory?.total_cost || 'Total Cost'}</th>
                  {exportData.exportDetails.some((d) => d.batchNumber) && (
                    <th>{dict.inventory?.batch_number || 'Batch Number'}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {exportData.exportDetails.map((detail, index) => (
                  <tr key={detail.exportDetailId || index}>
                    <td>
                      {detail.ingredient?.ingredientName || detail.ingredientId}
                    </td>
                    <td>{detail.quantity}</td>
                    <td>{detail.unit}</td>
                    <td>
                      {detail.unitCost
                        ? new Intl.NumberFormat('vi-VN').format(detail.unitCost)
                        : '-'}
                    </td>
                    <td>
                      <strong>
                        {detail.totalCost
                          ? new Intl.NumberFormat('vi-VN').format(detail.totalCost)
                          : '-'}
                      </strong>
                    </td>
                    {exportData.exportDetails!.some((d) => d.batchNumber) && (
                      <td>{detail.batchNumber || '-'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end">
                    <strong>{dict.inventory?.total_amount || 'Total Amount'}:</strong>
                  </td>
                  <td>
                    <strong>
                      {new Intl.NumberFormat('vi-VN').format(exportData.totalAmount)}
                    </strong>
                  </td>
                  <td colSpan={1}></td>
                </tr>
              </tfoot>
            </Table>
          ) : (
            <Alert variant="info">
              {dict.inventory?.no_details || 'No export details found'}
            </Alert>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

