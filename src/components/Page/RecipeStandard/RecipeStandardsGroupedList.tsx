'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Table,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEdit,
  faTrash,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import { dishApi, recipeStandardApi } from '@/services'
import { Dish } from '@/models/dish'
import { RecipeVariants, RecipeStandard } from '@/models/recipe_standard'
import useDictionary from '@/locales/dictionary-hook'

export default function RecipeStandardsGroupedList() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [dishVariants, setDishVariants] = useState<
    Map<string, RecipeVariants>
  >(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeKey, setActiveKey] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await dishApi.getAll('?per_page=1000')
      setDishes(response.data || [])
    } catch (err) {
      setError('Failed to load dishes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadVariantsForDish = async (dishId: string) => {
    if (dishVariants.has(dishId)) return

    try {
      const variants = await recipeStandardApi.getVariantsByDish(dishId)
      setDishVariants((prev) => new Map(prev).set(dishId, variants))
    } catch (err) {
      console.error(`Failed to load variants for dish ${dishId}:`, err)
    }
  }

  const handleAccordionToggle = (dishId: string) => {
    if (activeKey === dishId) {
      setActiveKey('')
    } else {
      setActiveKey(dishId)
      loadVariantsForDish(dishId)
    }
  }

  const handleDeleteRecipe = async (standardId: number) => {
    if (
      !window.confirm(
        dict.common?.confirm_delete || 'Are you sure you want to delete this recipe?'
      )
    ) {
      return
    }

    try {
      await recipeStandardApi.delete(standardId)
      // Reload the dish variants
      const dishId = activeKey
      if (dishId) {
        const variants = await recipeStandardApi.getVariantsByDish(dishId)
        setDishVariants((prev) => new Map(prev).set(dishId, variants))
      }
    } catch (err) {
      console.error('Failed to delete recipe:', err)
      alert('Failed to delete recipe')
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(num)
  }

  const renderRecipeTable = (recipes: RecipeStandard[], kitchenName: string) => {
    if (!recipes || recipes.length === 0) return null

    return (
      <div className="mb-3">
        <h6 className="mb-2">
          <Badge bg={kitchenName === 'Common' ? 'info' : 'primary'}>
            {kitchenName === 'Common' ? 'Common Recipe' : `Kitchen: ${kitchenName}`}
          </Badge>
        </h6>

        {/* Desktop View */}
        <div className="d-none d-md-block">
          <Table bordered hover size="sm">
            <thead className="table-light">
              <tr>
                <th style={{ width: '30%' }}>{dict.recipe_standards?.ingredient || 'Ingredient'}</th>
                <th style={{ width: '20%' }} className="text-end">
                  {dict.recipe_standards?.standard_per_serving || 'Qty/Serving'}
                </th>
                <th style={{ width: '10%' }} className="text-center">
                  {dict.recipe_standards?.unit || 'Unit'}
                </th>
                <th style={{ width: '20%' }} className="text-end">
                  {dict.recipe_standards?.amount || 'Cost'}
                </th>
                <th style={{ width: '20%' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.standardId}>
                  <td>
                    {recipe.ingredientName || recipe.ingredientId}
                    {recipe.note && (
                      <>
                        <br />
                        <small className="text-muted">{recipe.note}</small>
                      </>
                    )}
                  </td>
                  <td className="text-end">{formatNumber(recipe.standardPer1)}</td>
                  <td className="text-center">{recipe.unit}</td>
                  <td className="text-end">
                    {recipe.amount
                      ? `${formatNumber(recipe.amount)} VNĐ`
                      : '-'}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() =>
                        router.push(`/recipe-standards/${recipe.standardId}/edit`)
                      }
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteRecipe(recipe.standardId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="d-md-none">
          {recipes.map((recipe) => (
            <Card key={recipe.standardId} className="mb-2">
              <CardBody className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <strong>{recipe.ingredientName || recipe.ingredientId}</strong>
                    {recipe.note && (
                      <>
                        <br />
                        <small className="text-muted">{recipe.note}</small>
                      </>
                    )}
                  </div>
                  <div className="ms-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() =>
                        router.push(`/recipe-standards/${recipe.standardId}/edit`)
                      }
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteRecipe(recipe.standardId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
                <Row className="g-2">
                  <Col xs={6}>
                    <small className="text-muted d-block">Qty/Serving</small>
                    <strong>{formatNumber(recipe.standardPer1)} {recipe.unit}</strong>
                  </Col>
                  <Col xs={6}>
                    <small className="text-muted d-block">Cost</small>
                    <strong>
                      {recipe.amount
                        ? `${formatNumber(recipe.amount)} VNĐ`
                        : '-'}
                    </strong>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderDishVariants = (dish: Dish) => {
    const variants = dishVariants.get(dish.dishId)

    if (!variants) {
      return (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" />
          <p className="mt-2 mb-0 text-muted">Loading recipes...</p>
        </div>
      )
    }

    const kitchenIds = Object.keys(variants.kitchenRecipes || {})
    const hasCommon = (variants.commonRecipes?.length || 0) > 0
    const hasAnyRecipes = kitchenIds.length > 0 || hasCommon

    if (!hasAnyRecipes) {
      return (
        <Alert variant="info" className="mb-0">
          No recipes defined for this dish yet.
          <br />
          <Button
            variant="primary"
            size="sm"
            className="mt-2"
            onClick={() => router.push('/recipe-standards/create')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add Recipe
          </Button>
        </Alert>
      )
    }

    return (
      <div>
        {/* Kitchen-specific recipes */}
        {kitchenIds.map((kitchenId) => {
          const recipes = variants.kitchenRecipes[kitchenId]
          const kitchenName = recipes[0]?.kitchenName || kitchenId
          return (
            <div key={kitchenId}>
              {renderRecipeTable(recipes, kitchenName)}
            </div>
          )
        })}

        {/* Common recipes */}
        {hasCommon && renderRecipeTable(variants.commonRecipes, 'Common')}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">{dict.common?.loading || 'Loading...'}</p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{dict.recipe_standards?.title || 'Recipe Standards by Dish'}</h4>
        <Button
          variant="primary"
          onClick={() => router.push('/recipe-standards/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {dict.recipe_standards?.add_new || 'Add Recipe'}
        </Button>
      </div>

      {dishes.length === 0 ? (
        <Alert variant="info">
          {dict.common?.no_data || 'No dishes available'}
        </Alert>
      ) : (
        <Accordion activeKey={activeKey}>
          {dishes.map((dish) => (
            <AccordionItem key={dish.dishId} eventKey={dish.dishId}>
              <AccordionHeader
                onClick={() => handleAccordionToggle(dish.dishId)}
              >
                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                  <div>
                    <strong>{dish.dishName}</strong>
                    <br />
                    <small className="text-muted">
                      {dish.dishId}
                      {dish.group && ` • ${dish.group}`}
                    </small>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={activeKey === dish.dishId ? 'rotate-180' : ''}
                    style={{
                      transition: 'transform 0.2s',
                      transform:
                        activeKey === dish.dishId ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </div>
              </AccordionHeader>
              <AccordionBody>{renderDishVariants(dish)}</AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
