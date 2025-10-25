'use client'

import React, { useState } from 'react'
import {
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { ingredientApi } from '@/services'
import {
  Ingredient,
  CreateIngredientInput,
  UpdateIngredientInput,
} from '@/models/ingredient'
import useDictionary from '@/locales/dictionary-hook'

interface IngredientFormProps {
  ingredient?: Ingredient
  isEdit?: boolean
}

export default function IngredientForm({
  ingredient,
  isEdit = false,
}: IngredientFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    ingredientId: ingredient?.ingredientId || '',
    ingredientName: ingredient?.ingredientName || '',
    property: ingredient?.property || '',
    materialGroup: ingredient?.materialGroup || '',
    unit: ingredient?.unit || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && ingredient) {
        const updateData: UpdateIngredientInput = {
          ingredientName: formData.ingredientName,
          property: formData.property,
          materialGroup: formData.materialGroup,
          unit: formData.unit,
        }
        await ingredientApi.update(ingredient.ingredientId, updateData)
        setSuccess('Ingredient updated successfully')
      } else {
        const createData: CreateIngredientInput = {
          ingredientId: formData.ingredientId,
          ingredientName: formData.ingredientName,
          property: formData.property,
          materialGroup: formData.materialGroup,
          unit: formData.unit,
        }
        await ingredientApi.create(createData)
        setSuccess('Ingredient created successfully')
      }

      setTimeout(() => {
        router.push('/ingredients')
      }, 1500)
    } catch (err) {
      setError(
        isEdit ? 'Failed to update ingredient' : 'Failed to create ingredient',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.id || 'ID'}</FormLabel>
          <FormControl
            type="text"
            name="ingredientId"
            value={formData.ingredientId}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.name || 'Name'}</FormLabel>
          <FormControl
            type="text"
            name="ingredientName"
            value={formData.ingredientName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.property || 'Property'}</FormLabel>
          <FormControl
            type="text"
            name="property"
            value={formData.property}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>
            {dict.ingredients?.material_group || 'Material Group'}
          </FormLabel>
          <FormControl
            type="text"
            name="materialGroup"
            value={formData.materialGroup}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.unit || 'Unit'}</FormLabel>
          <FormControl
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button
          type="submit"
          variant="success"
          disabled={loading}
          className="me-3"
        >
          {loading ? dict.action.submitting : dict.action.submit}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/ingredients')}
        >
          Cancel
        </Button>
      </Form>
    </>
  )
}
