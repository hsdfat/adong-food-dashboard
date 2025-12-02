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
  Table,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEdit,
  faTrash,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { dishApi, recipeStandardApi } from '@/services'
import { Dish } from '@/models/dish'
import { RecipeVariants, RecipeStandard } from '@/models/recipe_standard'
import useDictionary from '@/locales/dictionary-hook'

interface DishRecipeVariantsViewProps {
  dishId: string;
}

export default function DishRecipeVariantsView({
  dishId,
}: DishRecipeVariantsViewProps) {
  const [dish, setDish] = useState<Dish | null>(null)
  const [variants, setVariants] = useState<RecipeVariants | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadData()
  }, [dishId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      // Load variants first
      const variantsResponse = await recipeStandardApi.getVariantsByDish(dishId)
      setVariants(variantsResponse)

      // Then load dish details
      const dishResponse = await dishApi.getById(dishId)
      setDish(dishResponse)
    } catch (err) {
      setError('Failed to load recipe variants')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
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
      // Reload variants
      await loadData()
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
      <div className="mb-4">
        <h5 className="mb-3">
          <Badge bg={kitchenName === 'Common' ? 'info' : 'primary'} className="fs-6">
            {kitchenName === 'Common' ? 'Common Recipe' : `Kitchen: ${kitchenName}`}
          </Badge>
        </h5>

        {/* Desktop View */}
        <div className="d-none d-md-block">
          <Table bordered hover>
            <thead className="table-light">
              <tr>
                <th style={{ width: '35%' }}>{dict.recipe_standards?.ingredient || 'Ingredient'}</th>
                <th style={{ width: '15%' }} className="text-end">
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
                    <strong>{recipe.ingredientName || recipe.ingredientId}</strong>
                    {recipe.note && (
                      <>
                        <br />
                        <small className="text-muted">{recipe.note}</small>
                      </>
                    )}
                  </td>
                  <td className="text-end">
                    <strong>{formatNumber(recipe.standardPer1)}</strong>
                  </td>
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
                    <strong className="d-block">
                      {recipe.ingredientName || recipe.ingredientId}
                    </strong>
                    {recipe.note && (
                      <small className="text-muted">{recipe.note}</small>
                    )}
                  </div>
                  <div className="ms-2 flex-shrink-0">
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
                    <strong className="d-block">
                      {formatNumber(recipe.standardPer1)} {recipe.unit}
                    </strong>
                  </Col>
                  <Col xs={6}>
                    <small className="text-muted d-block">Cost</small>
                    <strong className="d-block">
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

  if (!dish || !variants) {
    return <Alert variant="warning">Dish not found</Alert>
  }

  const kitchenIds = Object.keys(variants.kitchenRecipes || {})
  const hasCommon = (variants.commonRecipes?.length || 0) > 0
  const hasAnyRecipes = kitchenIds.length > 0 || hasCommon

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button
            variant="link"
            className="p-0 mb-2"
            onClick={() => router.push('/dishes')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Dishes
          </Button>
          <h4 className="mb-1">{dish.dishName}</h4>
          <div className="text-muted">
            <small>
              {dish.dishId}
              {dish.group && ` • ${dish.group}`}
              {dish.cookingMethod && ` • ${dish.cookingMethod}`}
            </small>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/recipe-standards/create')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Ingredient
        </Button>
      </div>

      {/* Recipe Variants */}
      {!hasAnyRecipes ? (
        <Alert variant="info">
          <p className="mb-2">No recipes defined for this dish yet.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/recipe-standards/create')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add First Recipe
          </Button>
        </Alert>
      ) : (
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

          {/* Summary */}
          <Card className="mt-4 bg-light">
            <CardBody>
              <Row>
                <Col md={4}>
                  <small className="text-muted d-block">Total Variants</small>
                  <strong className="fs-5">
                    {kitchenIds.length + (hasCommon ? 1 : 0)}
                  </strong>
                </Col>
                <Col md={4}>
                  <small className="text-muted d-block">Kitchen Recipes</small>
                  <strong className="fs-5">{kitchenIds.length}</strong>
                </Col>
                <Col md={4}>
                  <small className="text-muted d-block">Common Recipes</small>
                  <strong className="fs-5">{hasCommon ? 1 : 0}</strong>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
