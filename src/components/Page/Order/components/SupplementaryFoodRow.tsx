'use client'

import React from 'react'
import { FormControl, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

interface SupplementaryFoodItem {
  id: string
  nguyenLieuId: string
  tenNguyenLieu: string
  donViTinh: string
  dinhMuc: number
  soSuat: number
  soLuong: number
  ghiChu?: string
}

interface SupplementaryFoodRowProps {
  item: SupplementaryFoodItem
  index: number
  onDinhMucChange: (id: string, dinhMuc: number) => void
  onSoSuatChange: (id: string, soSuat: number) => void
  onNoteChange: (id: string, note: string) => void
  onRemove: (id: string) => void
  formatNumber: (num: number) => string
}

export default function SupplementaryFoodRow({
  item,
  index,
  onDinhMucChange,
  onSoSuatChange,
  onNoteChange,
  onRemove,
  formatNumber,
}: SupplementaryFoodRowProps) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <strong>{item.tenNguyenLieu}</strong>
        <br />
        <small className="text-muted">{item.nguyenLieuId}</small>
      </td>
      <td>
        <FormControl
          type="number"
          min="0"
          step="0.01"
          value={item.dinhMuc}
          onChange={(e) => onDinhMucChange(item.id, parseFloat(e.target.value) || 0)}
          size="sm"
        />
        <small className="text-muted">{item.donViTinh}/suất</small>
      </td>
      <td>
        <FormControl
          type="number"
          min="1"
          value={item.soSuat}
          onChange={(e) => onSoSuatChange(item.id, parseInt(e.target.value) || 1)}
          size="sm"
        />
      </td>
      <td>
        <strong>{formatNumber(item.soLuong)}</strong> {item.donViTinh}
      </td>
      <td>
        <FormControl
          type="text"
          value={item.ghiChu || ''}
          onChange={(e) => onNoteChange(item.id, e.target.value)}
          size="sm"
          placeholder="Ghi chú..."
        />
      </td>
      <td>
        <Button variant="danger" size="sm" onClick={() => onRemove(item.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </td>
    </tr>
  )
}

