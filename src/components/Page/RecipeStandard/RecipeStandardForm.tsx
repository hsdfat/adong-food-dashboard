// components/Page/RecipeStandard/RecipeStandardForm.tsx
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
  InputGroup,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { recipeStandardApi, dishApi, ingredientApi } from '@/services'
import { RecipeStandard } from '@/models/recipe_standard'
import { Dish } from '@/models/dish'
import { Ingredient } from '@/models/ingredient'
import useDictionary from '@/locales/dictionary-hook'
import { ResourceCollection } from '@/models/resource'
import Select from 'react-select'

interface RecipeStandardFormProps {
  recipeStandard?: RecipeStandard
  isEdit?: boolean
}

export default function RecipeStandardForm({
  recipeStandard,
  isEdit = false,
}: RecipeStandardFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Dropdown options
  const [dishes, setDishes] = useState<ResourceCollection<Dish> | null>(null)
  const [ingredients, setIngredients] =
    useState<ResourceCollection<Ingredient> | null>(null)
  const [loadingOptions, setLoadingOptions] = useState(true)

  const [formData, setFormData] = useState({
    dishId: recipeStandard?.dishId || '',
    ingredientId: recipeStandard?.ingredientId || '',
    unit: recipeStandard?.unit || '',
    standardPer1: recipeStandard?.standardPer1?.toString() || '',
    note: recipeStandard?.note || '',
    amount: recipeStandard?.amount?.toString() || '',
  })

  // Load dishes and ingredients for dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true)
        const [dishesData, ingredientsData] = await Promise.all([
          dishApi.getAll(),
          ingredientApi.getAll(),
        ])
        setDishes(dishesData)
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.dishId.trim()) {
      setError(dict.validation?.required_field || 'Dish is required')
      return false
    }
    if (!formData.ingredientId.trim()) {
      setError(dict.validation?.required_field || 'Ingredient is required')
      return false
    }
    if (!formData.unit.trim()) {
      setError(dict.validation?.required_field || 'Unit is required')
      return false
    }
    if (!formData.standardPer1 || parseFloat(formData.standardPer1) <= 0) {
      setError(
        dict.validation?.invalid_number ||
          'Standard per serving must be a positive number',
      )
      return false
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
      const submitData = {
        dishId: formData.dishId,
        ingredientId: formData.ingredientId,
        unit: formData.unit,
        standardPer1: parseFloat(formData.standardPer1),
        note: formData.note || undefined,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        updatedById: 'admin', // This should come from authenticated user
      }

      if (isEdit && recipeStandard) {
        await recipeStandardApi.update(recipeStandard.standardId, submitData)
        setSuccess(
          dict.common?.success_update || 'Recipe standard updated successfully',
        )
      } else {
        await recipeStandardApi.create(submitData)
        setSuccess(
          dict.common?.success_create || 'Recipe standard created successfully',
        )
      }

      // Redirect after success
      setTimeout(() => {
        router.push('/recipe-standards')
      }, 1500)
    } catch (err: any) {
      setError(
        err.message ||
          dict.common?.save_error ||
          'Failed to save recipe standard',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/recipe-standards')
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
        <Row>
          {dishes && (
            <Col md={6}>
              <FormGroup className="mb-3">
                <FormLabel>{dict.recipe_standards?.dish || 'Dish'} *</FormLabel>
                <Select<{ value: string; label: string }, false>
                  name="ingredientId"
                  value={
                    dishes.data
                      .map((dish) => ({
                        value: dish.dishId,
                        label: `${dish.dishId} - ${dish.dishName}`,
                      }))
                      .find((opt) => opt.value === formData.ingredientId) ||
                    null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      dishId: selected ? selected.value : '',
                    }))
                  }
                  options={dishes.data.map((dish) => ({
                    value: dish.dishId,
                    label: `${dish.dishId} - ${dish.dishName}`,
                  }))}
                  isDisabled={isEdit || loading}
                  isSearchable
                  placeholder={dict.common?.select || 'Select an dish'}
                />
              </FormGroup>
            </Col>
          )}
          {ingredients && (
            <Col md={6}>
              <FormGroup className="mb-3">
                <FormLabel>
                  {dict.recipe_standards?.ingredient || 'Ingredient'} *
                </FormLabel>
                <Select<{ value: string; label: string }, false>
                  name="ingredientId"
                  value={
                    ingredients.data
                      .map((ingredient) => ({
                        value: ingredient.ingredientId,
                        label: `${ingredient.ingredientId} - ${ingredient.ingredientName}`,
                      }))
                      .find((opt) => opt.value === formData.ingredientId) ||
                    null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      ingredientId: selected ? selected.value : '',
                    }))
                  }
                  options={ingredients.data.map((ingredient) => ({
                    value: ingredient.ingredientId,
                    label: `${ingredient.ingredientId} - ${ingredient.ingredientName}`,
                  }))}
                  isDisabled={isEdit || loading}
                  isSearchable
                  placeholder={dict.common?.select || 'Select an ingredient'}
                />
              </FormGroup>
            </Col>
          )}
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup className="mb-3">
              <FormLabel>
                {dict.recipe_standards?.standard_per_serving ||
                  'Standard Per Serving'}{' '}
                *
              </FormLabel>
              <FormControl
                type="number"
                step="0.0001"
                name="standardPer1"
                value={formData.standardPer1}
                onChange={handleChange}
                placeholder="0.5"
                disabled={loading}
                required
              />
              <Form.Text className="text-muted">
                {dict.recipe_standards?.standard_help ||
                  'Quantity needed for 1 serving'}
              </Form.Text>
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup className="mb-3">
              <FormLabel>{dict.recipe_standards?.unit || 'Unit'} *</FormLabel>
              <FormControl
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="kg, g, ml, l"
                disabled={loading}
                required
                maxLength={50}
              />
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup className="mb-3">
              <FormLabel>{dict.recipe_standards?.amount || 'Amount'}</FormLabel>
              <InputGroup>
                <FormControl
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="50000"
                  disabled={loading}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                {dict.recipe_standards?.amount_help ||
                  'Cost per serving (optional)'}
              </Form.Text>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup className="mb-3">
          <FormLabel>{dict.recipe_standards?.note || 'Note'}</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder={
              dict.recipe_standards?.note_placeholder ||
              'Additional notes about this ingredient...'
            }
            disabled={loading}
          />
        </FormGroup>

        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            {dict.action?.cancel || 'Cancel'}
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {dict.action?.saving || 'Saving...'}
              </>
            ) : (
              dict.action?.save || 'Save'
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}
