'use client'

import React from 'react'
import { FormControl, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useOrderDictionary from '../locales/use-order-dictionary'

interface SupplementaryFoodItem {
  id: string;
  nguyenLieuId: string;
  tenNguyenLieu: string;
  donViTinh: string;
  dinhMuc: number;
  soSuat: number;
  soLuong: number;
  ghiChu?: string;
}

interface SupplementaryFoodRowProps {
  item: SupplementaryFoodItem;
  index: number;
  onDinhMucChange: (id: string, dinhMuc: number) => void;
  onSoSuatChange: (id: string, soSuat: number) => void;
  onNoteChange: (id: string, note: string) => void;
  onRemove: (id: string) => void;
  formatNumber: (num: number) => string;
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
  const dict = useOrderDictionary()

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <strong>{item.tenNguyenLieu}</strong>
        <br />
        <small className="text-muted">{item.nguyenLieuId}</small>
      </td>
      <td>{item.dinhMuc}</td>
      <td>{item.soSuat}</td>
      <td>
        <FormControl
          type="number"
          value={item.soLuong}
          onChange={(e) => onSoSuatChange(item.id, parseFloat(e.target.value) || 0)}
          size="sm"
          min="0"
          step="0.01"
        />
      </td>
      <td>
        <FormControl
          type="text"
          value={item.ghiChu || ''}
          onChange={(e) => onNoteChange(item.id, e.target.value)}
          size="sm"
          placeholder={dict.order_form.notes || 'Note...'}
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

