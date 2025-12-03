'use client'

import React from 'react'
import { FormControl, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useOrderDictionary from '../locales/use-order-dictionary'

interface SupplementaryFoodItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  standardPerPortion: number;
  portions: number;
  quantity: number;
  note?: string;
}

interface SupplementaryFoodRowProps {
  item: SupplementaryFoodItem;
  index: number;
  onStandardPerPortionChange: (id: string, standardPerPortion: number) => void;
  onPortionsChange: (id: string, portions: number) => void;
  onNoteChange: (id: string, note: string) => void;
  onRemove: (id: string) => void;
  formatNumber: (num: number) => string;
}

export default function SupplementaryFoodRow({
  item,
  index,
  onStandardPerPortionChange,
  onPortionsChange,
  onNoteChange,
  onRemove,
  formatNumber,
}: SupplementaryFoodRowProps) {
  const dict = useOrderDictionary()

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <strong>{item.ingredientName}</strong>
        <br />
        <small className="text-muted">{item.ingredientId}</small>
      </td>
      <td>
        <FormControl
          type="number"
          inputMode="decimal"
          value={item.standardPerPortion}
          onChange={(e) => onStandardPerPortionChange(item.id, parseFloat(e.target.value) || 0)}
          size="sm"
          min="0"
          step="0.0001"
        />
      </td>
      <td>
        <FormControl
          type="number"
          inputMode="decimal"
          value={item.portions}
          onChange={(e) => onPortionsChange(item.id, parseFloat(e.target.value) || 0)}
          size="sm"
          min="0"
          step="0.0001"
        />
      </td>
      <td>
        <strong>{formatNumber(item.quantity)}</strong> {item.unit}
      </td>
      <td>
        <FormControl
          type="text"
          value={item.note || ''}
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

