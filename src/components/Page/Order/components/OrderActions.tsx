'use client'

import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'

interface OrderActionsProps {
  orderId: string
  onView: (orderId: string) => void
  onViewIngredients: (orderId: string) => void
  onViewSupplierRequests: (orderId: string) => void
  onDelete: (orderId: string) => void
}

export default function OrderActions({
  orderId,
  onView,
  onViewIngredients,
  onViewSupplierRequests,
  onDelete,
}: OrderActionsProps) {
  return (
    <Dropdown>
      <DropdownToggle variant="link" className="text-decoration-none" title="Actions">
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => onView(orderId)}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          Xem chi tiết
        </DropdownItem>
        <DropdownItem onClick={() => onViewIngredients(orderId)}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          Tổng hợp nguyên liệu
        </DropdownItem>
        <DropdownItem onClick={() => onViewSupplierRequests(orderId)}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          Yêu cầu nhà cung cấp
        </DropdownItem>
        <DropdownItem disabled className="dropdown-divider" />
        <DropdownItem onClick={() => onDelete(orderId)} className="text-danger">
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          Xóa
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

