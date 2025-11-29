'use client'

import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
  Row,
  Col,
  Card,
  InputGroup,
  Table,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import {
  dishApi,
  recipeStandardApi,
  ingredientApi,
  kitchenApi,
} from '@/services'
import { Dish, CreateDishInput, UpdateDishInput } from '@/models/dish'
import { CreateRecipeStandardInput } from '@/models/recipe_standard'
import { Ingredient } from '@/models/ingredient'
import { Kitchen } from '@/models/kitchen'
import useDictionary from '@/locales/dictionary-hook'
import { ResourceCollection } from '@/models/resource'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { generateId } from '@/utils/id-generator'

interface DishWithRecipeFormProps {
  dish?: Dish;
  isEdit?: boolean;
}

interface RecipeIngredient {
  id: string; // temporary ID for UI
  kitchenId: string;
  ingredientId: string;
  unit: string;
  standardPer1: string;
  note: string;
  amount: string;
}

export default function DishWithRecipeForm({
  dish,
  isEdit = false,
}: DishWithRecipeFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Dropdown options
  const [kitchens, setKitchens] = useState<ResourceCollection<Kitchen> | null>(
    null,
  )
  const [ingredients, setIngredients] =
    useState<ResourceCollection<Ingredient> | null>(null)
  const [loadingOptions, setLoadingOptions] = useState(true)

  // Dish form data
  const [dishFormData, setDishFormData] = useState({
    dishId: dish?.dishId || '',
    dishName: dish?.dishName || '',
    cookingMethod: dish?.cookingMethod || '',
    group: dish?.group || '',
    description: dish?.description || '',
    active: dish?.active || true,
  })

  // Auto-generate ID for new dishes
  useEffect(() => {
    if (!isEdit && !dish && !dishFormData.dishId) {
      setDishFormData((prev) => ({
        ...prev,
        dishId: generateId('DISH'),
      }))
    }
  }, [isEdit, dish, dishFormData.dishId])

  // Recipe ingredients list
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([])

  // Load existing recipe standards when editing
  useEffect(() => {
    if (isEdit && dish?.dishId) {
      const loadRecipeStandards = async () => {
        try {
          const response = await recipeStandardApi.getByDish(dish.dishId)
          const existingRecipes: RecipeIngredient[] = response.data.map(
            (recipe, index) => ({
              id: `existing-${index}`,
              kitchenId: recipe.kitchenId,
              ingredientId: recipe.ingredientId,
              unit: recipe.unit,
              standardPer1: recipe.standardPer1.toString(),
              note: recipe.note || '',
              amount: recipe.amount?.toString() || '',
            }),
          )
          setRecipeIngredients(existingRecipes)
        } catch (err) {
          console.error('Failed to load recipe standards:', err)
        }
      }
      loadRecipeStandards()
    }
  }, [isEdit, dish?.dishId])

  // Load kitchens and ingredients for dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true)
        const [kitchensData, ingredientsData] = await Promise.all([
          kitchenApi.getAll(),
          ingredientApi.getAll(),
        ])
        setKitchens(kitchensData)
        setIngredients(ingredientsData)
      } catch (err) {
        console.error('Failed to load options:', err)
        setError(dict.common?.load_error || 'Failed to load form options')
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOptions()
  }, [])

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDishFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDishActiveChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setDishFormData((prev) => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value,
    }))
  }

  const addRecipeIngredient = () => {
    const newIngredient: RecipeIngredient = {
      id: `new-${Date.now()}`,
      kitchenId: '',
      ingredientId: '',
      unit: '',
      standardPer1: '',
      note: '',
      amount: '',
    }
    setRecipeIngredients((prev) => [...prev, newIngredient])
  }

  const removeRecipeIngredient = (id: string) => {
    setRecipeIngredients((prev) => prev.filter((item) => item.id !== id))
  }

  const updateRecipeIngredient = (
    id: string,
    field: keyof RecipeIngredient,
    value: string,
  ) => {
    setRecipeIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  const validateForm = (): boolean => {
    // Validate dish data
    if (!dishFormData.dishId.trim()) {
      setError('Dish ID is required')
      return false
    }
    if (!dishFormData.dishName.trim()) {
      setError('Dish Name is required')
      return false
    }
    if (!dishFormData.description.trim()) {
      setError('Unit is required')
      return false
    }

    // Validate recipe ingredients
    for (let i = 0; i < recipeIngredients.length; i++) {
      const recipe = recipeIngredients[i]
      if (!recipe.kitchenId) {
        setError(`Recipe ingredient ${i + 1}: Kitchen is required`)
        return false
      }
      if (!recipe.ingredientId) {
        setError(`Recipe ingredient ${i + 1}: Ingredient is required`)
        return false
      }
      if (!recipe.unit.trim()) {
        setError(`Recipe ingredient ${i + 1}: Unit is required`)
        return false
      }
      if (!recipe.standardPer1 || parseFloat(recipe.standardPer1) <= 0) {
        setError(
          `Recipe ingredient ${i + 1}: Standard per serving must be a positive number`,
        )
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let dishId = dishFormData.dishId

      // Step 1: Create or update dish
      if (isEdit && dish) {
        const updateData: UpdateDishInput = {
          dishName: dishFormData.dishName,
          cookingMethod: dishFormData.cookingMethod,
          group: dishFormData.group,
          description: dishFormData.description,
          active: dishFormData.active,
        }
        await dishApi.update(dish.dishId, updateData)
      } else {
        const createData: CreateDishInput = {
          dishId: dishFormData.dishId,
          dishName: dishFormData.dishName,
          cookingMethod: dishFormData.cookingMethod,
          group: dishFormData.group,
          description: dishFormData.description,
          active: dishFormData.active,
        }
        await dishApi.create(createData)
      }

      // Step 2: Create recipe standards if any
      if (recipeIngredients.length > 0) {
        const recipeData: CreateRecipeStandardInput[] = recipeIngredients.map(
          (recipe) => ({
            dishId: dishId,
            kitchenId: recipe.kitchenId,
            ingredientId: recipe.ingredientId,
            unit: recipe.unit,
            standardPer1: parseFloat(recipe.standardPer1),
            note: recipe.note || undefined,
            amount: recipe.amount ? parseFloat(recipe.amount) : undefined,
            updatedById: 'admin', // This should come from authenticated user
          }),
        )

        await recipeStandardApi.createBulk(recipeData)
      }

      setSuccess(
        isEdit
          ? 'Dish and recipe standards updated successfully'
          : 'Dish and recipe standards created successfully',
      )

      // Redirect after success
      setTimeout(() => {
        router.push('/dishs')
      }, 1500)
    } catch (err: any) {
      setError(
        err.message ||
          (isEdit
            ? 'Failed to update dish and recipe standards'
            : 'Failed to create dish and recipe standards'),
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingOptions) {
    return <div className="text-center py-4">Loading form...</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Dish Information Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Dish Information</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Dish ID *</FormLabel>
                  <FormControl
                    type="text"
                    name="dishId"
                    value={dishFormData.dishId}
                    onChange={handleDishChange}
                    disabled={isEdit}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Dish Name *</FormLabel>
                  <FormControl
                    type="text"
                    name="dishName"
                    value={dishFormData.dishName}
                    onChange={handleDishChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Property</FormLabel>
                  <FormControl
                    type="text"
                    name="cookingMethod"
                    value={dishFormData.cookingMethod}
                    onChange={handleDishChange}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Material Group</FormLabel>
                  <FormControl
                    type="text"
                    name="group"
                    value={dishFormData.group}
                    onChange={handleDishChange}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Unit *</FormLabel>
                  <FormControl
                    type="text"
                    name="description"
                    value={dishFormData.description}
                    onChange={handleDishChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup className="mb-3">
              <FormLabel>{dict.kitchens?.status || 'Status'}</FormLabel>
              <Form.Select
                name="active"
                value={dishFormData.active ? 'true' : 'false'}
                onChange={handleDishActiveChange}
              >
                <option value="true">{dict.common?.active || 'Active'}</option>
                <option value="false">
                  {dict.common?.inactive || 'Inactive'}
                </option>
              </Form.Select>
            </FormGroup>
          </Card.Body>
        </Card>

        {/* Recipe Standards Section */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recipe Standards</h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addRecipeIngredient}
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Ingredient
            </Button>
          </Card.Header>
          <Card.Body>
            {recipeIngredients.length === 0 ? (
              <p className="text-muted text-center py-3">
                No ingredients added yet. Click &quot;Add Ingredient&quot; to
                start adding recipe standards.
              </p>
            ) : (
              <div className="table-responsive">
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Kitchen *</th>
                      <th style={{ width: '25%' }}>Ingredient *</th>
                      <th style={{ width: '12%' }}>Quantity *</th>
                      <th style={{ width: '10%' }}>Unit *</th>
                      <th style={{ width: '12%' }}>Amount</th>
                      <th style={{ width: '18%' }}>Note</th>
                      <th style={{ width: '3%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipeIngredients.map((recipe) => (
                      <tr key={recipe.id}>
                        <td>
                          {kitchens && (
                            <Select<{ value: string; label: string }, false>
                              value={
                                kitchens.data
                                  .map((kitchen) => ({
                                    value: kitchen.kitchenId,
                                    label: `${kitchen.kitchenId} - ${kitchen.kitchenName}`,
                                  }))
                                  .find(
                                    (opt) => opt.value === recipe.kitchenId,
                                  ) || null
                              }
                              onChange={(selected) =>
                                updateRecipeIngredient(
                                  recipe.id,
                                  'kitchenId',
                                  selected ? selected.value : '',
                                )
                              }
                              options={kitchens.data.map((kitchen) => ({
                                value: kitchen.kitchenId,
                                label: `${kitchen.kitchenId} - ${kitchen.kitchenName}`,
                              }))}
                              isSearchable
                              placeholder="Select kitchen"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: '38px',
                                }),
                              }}
                            />
                          )}
                        </td>
                        <td>
                          {ingredients && (
                            <Select<{ value: string; label: string }, false>
                              value={
                                ingredients.data
                                  .map((ingredient) => ({
                                    value: ingredient.ingredientId,
                                    label: `${ingredient.ingredientId} - ${ingredient.ingredientName}`,
                                  }))
                                  .find(
                                    (opt) =>
                                      opt.value === recipe.ingredientId,
                                  ) || null
                              }
                              onChange={(selected) =>
                                updateRecipeIngredient(
                                  recipe.id,
                                  'ingredientId',
                                  selected ? selected.value : '',
                                )
                              }
                              options={ingredients.data.map((ingredient) => ({
                                value: ingredient.ingredientId,
                                label: `${ingredient.ingredientId} - ${ingredient.ingredientName}`,
                              }))}
                              isSearchable
                              placeholder="Select ingredient"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: '38px',
                                }),
                              }}
                            />
                          )}
                        </td>
                        <td>
                          <FormControl
                            type="number"
                            step="0.0001"
                            value={recipe.standardPer1}
                            onChange={(e) =>
                              updateRecipeIngredient(
                                recipe.id,
                                'standardPer1',
                                e.target.value,
                              )
                            }
                            placeholder="0.5"
                            size="sm"
                          />
                        </td>
                        <td>
                          <FormControl
                            type="text"
                            value={recipe.unit}
                            onChange={(e) =>
                              updateRecipeIngredient(
                                recipe.id,
                                'unit',
                                e.target.value,
                              )
                            }
                            placeholder="kg"
                            size="sm"
                            maxLength={50}
                          />
                        </td>
                        <td>
                          <FormControl
                            type="number"
                            step="0.01"
                            value={recipe.amount}
                            onChange={(e) =>
                              updateRecipeIngredient(
                                recipe.id,
                                'amount',
                                e.target.value,
                              )
                            }
                            placeholder="50000"
                            size="sm"
                          />
                        </td>
                        <td>
                          <FormControl
                            type="text"
                            value={recipe.note}
                            onChange={(e) =>
                              updateRecipeIngredient(
                                recipe.id,
                                'note',
                                e.target.value,
                              )
                            }
                            placeholder="Note..."
                            size="sm"
                          />
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeRecipeIngredient(recipe.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Form Actions */}
        <div className="d-flex gap-2 justify-content-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dishs')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                {dict.action?.submitting || 'Submitting...'}
              </>
            ) : (
              dict.action?.submit || 'Submit'
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}
