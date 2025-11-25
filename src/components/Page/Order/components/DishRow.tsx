'use client'

import React from 'react'
import { Table, FormControl, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'

interface DishIngredient {
  nguyenLieuId: string;
  tenNguyenLieu: string;
  donViTinh: string;
  dinhMuc: number;
  soLuong: number;
}

interface OrderDishItem {
  id: string;
  monanId: string;
  tenMonAn: string;
  soSuat: number;
  ingredients: DishIngredient[];
}

interface DishRowProps {
  dish: OrderDishItem;
  index: number;
  onPortionsChange: (dishId: string, portions: number) => void;
  onDinhMucChange: (dishId: string, ingredientId: string, dinhMuc: number) => void;
  onRemoveIngredient: (dishId: string, ingredientId: string) => void;
  onAddIngredient: (index: number) => void;
  onRemoveDish: (dishId: string) => void;
  formatNumber: (num: number) => string;
}

export default function DishRow({
  dish,
  index,
  onPortionsChange,
  onDinhMucChange,
  onRemoveIngredient,
  onAddIngredient,
  onRemoveDish,
  formatNumber,
}: DishRowProps) {
  const dict = useDictionary()
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <strong>{dish.tenMonAn}</strong>
        <br />
        <small className="text-muted">{dish.monanId}</small>
      </td>
      <td>
        <FormControl
          type="number"
          min="1"
          value={dish.soSuat}
          onChange={(e) => onPortionsChange(dish.id, parseInt(e.target.value) || 1)}
          size="sm"
        />
      </td>
      <td>
        {dish.ingredients.length === 0 ? (
          <small className="text-muted">Chưa có nguyên liệu</small>
        ) : (
          <Table size="sm" className="mb-0">
            <tbody>
              {dish.ingredients.map((ing) => (
                <tr key={ing.nguyenLieuId}>
                  <td style={{ width: '40%' }}>
                    {ing.tenNguyenLieu}
                    <br />
                    <small className="text-muted">{ing.nguyenLieuId}</small>
                  </td>
                  <td style={{ width: '20%' }}>
                    <FormControl
                      type="number"
                      min="0"
                      step="0.01"
                      value={ing.dinhMuc}
                      onChange={(e) =>
                        onDinhMucChange(dish.id, ing.nguyenLieuId, parseFloat(e.target.value) || 0)
                      }
                      size="sm"
                    />
                    <small className="text-muted">{ing.donViTinh}/suất</small>
                  </td>
                  <td style={{ width: '30%' }}>
                    <strong>{formatNumber(ing.soLuong)}</strong> {ing.donViTinh}
                  </td>
                  <td style={{ width: '10%' }}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRemoveIngredient(dish.id, ing.nguyenLieuId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button
          variant="outline-primary"
          size="sm"
          className="mt-2"
          onClick={() => onAddIngredient(index)}
        >
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          {dict.orders?.add || 'Add'} {dict.orders?.columns?.ingredient || 'Ingredient'}
        </Button>
      </td>
      <td>
        <Button variant="danger" size="sm" onClick={() => onRemoveDish(dish.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </td>
    </tr>
  )
}

