'use client'

import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'
import { useLoadingOverlay } from '@/components/Common/LoadingOverlay'

interface OrderActionsProps {
  orderId: string;
  onView: (orderId: string) => void;
  onViewIngredients: (orderId: string) => void;
  onViewSupplierRequests: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

export default function OrderActions({
  orderId,
  onView,
  onViewIngredients,
  onViewSupplierRequests,
  onDelete,
}: OrderActionsProps) {
  const dict = useDictionary()
  const { showLoading } = useLoadingOverlay()

  const handleView = () => {
    showLoading()
    onView(orderId)
  }

  const handleViewIngredients = () => {
    showLoading()
    onViewIngredients(orderId)
  }

  const handleViewSupplierRequests = () => {
    showLoading()
    onViewSupplierRequests(orderId)
  }

  const handleDelete = () => {
    // Don't show loading for delete as it might need confirmation
    onDelete(orderId)
  }

  return (
    <Dropdown>
      <DropdownToggle variant="link" className="text-decoration-none" title={dict.common?.actions || 'Actions'}>
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={handleView}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          {(dict.orders as any)?.action_labels?.view_details || 'View Details'}
        </DropdownItem>
        <DropdownItem onClick={handleViewIngredients}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          {dict.orders?.labels?.ingredient_summary || 'Ingredient Summary'}
        </DropdownItem>
        <DropdownItem onClick={handleViewSupplierRequests}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          {dict.orders?.labels?.view_supplier_requests || 'View Supplier Requests'}
        </DropdownItem>
        <DropdownItem disabled className="dropdown-divider" />
        <DropdownItem onClick={handleDelete} className="text-danger">
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          {(dict.orders as any)?.action_labels?.delete_order || 'Delete Order'}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

