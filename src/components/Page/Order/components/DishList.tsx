'use client'

import React from 'react'
import { Card, CardBody, Button, Alert, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
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
  return (
    <Card className="mb-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Danh sách món ăn</h5>
          <Button variant="primary" onClick={onAddDish}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Thêm món ăn
          </Button>
        </div>

        {dishes.length === 0 ? (
          <Alert variant="info">
            Chưa có món ăn nào. Nhấn "Thêm món ăn" để bắt đầu.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>Món ăn</th>
                  <th style={{ width: '10%' }}>Số suất</th>
                  <th style={{ width: '50%' }}>Nguyên liệu</th>
                  <th style={{ width: '10%' }}>Thao tác</th>
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

