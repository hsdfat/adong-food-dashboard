'use client'

import React from 'react'
import { Card, CardBody, Button, Alert, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import useOrderDictionary from '../locales/use-order-dictionary'
import DishRow from './DishRow'

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
  recipeSource?: string;
  recipeKitchenId?: string | null;
  availableRecipes?: {
    kitchen: boolean;
    common: boolean;
  };
  ingredients: DishIngredient[];
}

interface DishListProps {
  dishes: OrderDishItem[];
  onAddDish: () => void;
  onPortionsChange: (dishId: string, portions: number) => void;
  onStandardPerPortionChange: (dishId: string, ingredientId: string, standardPerPortion: number) => void;
  onRemoveIngredient: (dishId: string, ingredientId: string) => void;
  onAddIngredient: (index: number) => void;
  onRemoveDish: (dishId: string) => void;
  onSwitchRecipe: (dishId: string, useCommon: boolean) => void;
  formatNumber: (num: number) => string;
}

export default function DishList({
  dishes,
  onAddDish,
  onPortionsChange,
  onStandardPerPortionChange,
  onRemoveIngredient,
  onAddIngredient,
  onRemoveDish,
  onSwitchRecipe,
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
                  <th style={{ width: '18%' }}>{dict.dish_list?.table_headers?.dish || 'Dish'}</th>
                  <th style={{ width: '12%', minWidth: '120px' }}>{dict.dish_list?.table_headers?.portions || 'Portions'}</th>
                  <th style={{ width: '55%' }}>{dict.dish_list?.table_headers?.ingredients || 'Ingredients'}</th>
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
                    onStandardPerPortionChange={onStandardPerPortionChange}
                    onRemoveIngredient={onRemoveIngredient}
                    onAddIngredient={onAddIngredient}
                    onRemoveDish={onRemoveDish}
                    onSwitchRecipe={onSwitchRecipe}
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

