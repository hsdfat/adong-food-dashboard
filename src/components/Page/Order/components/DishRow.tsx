'use client'

import React from 'react'
import { Table, FormControl, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'

interface DishIngredient {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  standardPerPortion: number;
  quantity: number;
}

interface OrderDishItem {
  id: string;
  dishId: string;
  dishName: string;
  portions: number;
  ingredients: DishIngredient[];
}

interface DishRowProps {
  dish: OrderDishItem;
  index: number;
  onPortionsChange: (dishId: string, portions: number) => void;
  onStandardPerPortionChange: (dishId: string, ingredientId: string, standardPerPortion: number) => void;
  onRemoveIngredient: (dishId: string, ingredientId: string) => void;
  onAddIngredient: (index: number) => void;
  onRemoveDish: (dishId: string) => void;
  formatNumber: (num: number) => string;
}

export default function DishRow({
  dish,
  index,
  onPortionsChange,
  onStandardPerPortionChange,
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
        <strong>{dish.dishName}</strong>
        <br />
        <small className="text-muted">{dish.dishId}</small>
      </td>
      <td>
        <FormControl
          type="number"
          min="1"
          value={dish.portions}
          onChange={(e) => onPortionsChange(dish.id, parseInt(e.target.value) || 1)}
          size="sm"
        />
      </td>
      <td>
        {dish.ingredients.length === 0 ? (
          <small className="text-muted">No ingredients yet</small>
        ) : (
          <Table size="sm" className="mb-0">
            <tbody>
              {dish.ingredients.map((ing) => (
                <tr key={ing.ingredientId}>
                  <td style={{ width: '40%' }}>
                    {ing.ingredientName}
                    <br />
                    <small className="text-muted">{ing.ingredientId}</small>
                  </td>
                  <td style={{ width: '20%' }}>
                    <FormControl
                      type="number"
                      min="0"
                      step="0.0001"
                      value={ing.standardPerPortion}
                      onChange={(e) =>
                        onStandardPerPortionChange(dish.id, ing.ingredientId, parseFloat(e.target.value) || 0)
                      }
                      size="sm"
                    />
                    <small className="text-muted">{ing.unit}/portion</small>
                  </td>
                  <td style={{ width: '30%' }}>
                    <strong>{formatNumber(ing.quantity)}</strong> {ing.unit}
                  </td>
                  <td style={{ width: '10%' }}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRemoveIngredient(dish.id, ing.ingredientId)}
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

