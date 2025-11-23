'use client'

import React from 'react'
import { Card, CardBody, Button, Alert, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import useOrderDictionary from '../locales/use-order-dictionary'
import DishRow from './DishRow'

interface DishIngredient {
  nguyenLieuId: string
  tenNguyenLieu: string
  donViTinh: string
  dinhMuc: number
  soLuong: number
}

interface OrderDishItem {
  id: string
  monanId: string
  tenMonAn: string
  soSuat: number
  ingredients: DishIngredient[]
}

interface DishListProps {
  dishes: OrderDishItem[]
  onAddDish: () => void
  onPortionsChange: (dishId: string, portions: number) => void
  onDinhMucChange: (dishId: string, ingredientId: string, dinhMuc: number) => void
  onRemoveIngredient: (dishId: string, ingredientId: string) => void
  onAddIngredient: (index: number) => void
  onRemoveDish: (dishId: string) => void
  formatNumber: (num: number) => string
}

export default function DishList({
  dishes,
  onAddDish,
  onPortionsChange,
  onDinhMucChange,
  onRemoveIngredient,
  onAddIngredient,
  onRemoveDish,
  formatNumber,
}: DishListProps) {
  const dict = useOrderDictionary()
  
  return (
    <Card className="mb-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{dict.dish_list?.title || 'Dishes'}</h5>
          <Button variant="primary" onClick={onAddDish}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {dict.dish_list?.add_dish || 'Add Dish'}
          </Button>
        </div>

        {dishes.length === 0 ? (
          <Alert variant="info">
            {dict.dish_list?.no_dishes || 'No dishes added'}. {dict.dish_list?.add_dish || 'Add Dish'} {dict.common?.select || 'to'} {dict.common?.search || 'start'}.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>{dict.dish_list?.table_headers?.dish || 'Dish'}</th>
                  <th style={{ width: '10%' }}>{dict.dish_list?.table_headers?.portions || 'Portions'}</th>
                  <th style={{ width: '50%' }}>{dict.dish_list?.table_headers?.ingredients || 'Ingredients'}</th>
                  <th style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish, index) => (
                  <DishRow
                    key={dish.id}
                    dish={dish}
                    index={index}
                    onPortionsChange={onPortionsChange}
                    onDinhMucChange={onDinhMucChange}
                    onRemoveIngredient={onRemoveIngredient}
                    onAddIngredient={onAddIngredient}
                    onRemoveDish={onRemoveDish}
                    formatNumber={formatNumber}
                  />
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

