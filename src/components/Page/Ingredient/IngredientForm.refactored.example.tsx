'use client'

/**
 * EXAMPLE: Refactored IngredientForm using common components
 * This demonstrates how to use MasterDataFormPage, SaveButton, and LoadingState
 * 
 * To use this pattern:
 * 1. Replace the existing IngredientForm.tsx with this code
 * 2. Adjust the form fields and handlers as needed
 */

import React, { useState } from 'react'
import {
  FormGroup,
  FormLabel,
  FormControl,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { ingredientApi } from '@/services'
import {
  Ingredient,
  CreateIngredientInput,
  UpdateIngredientInput,
} from '@/models/ingredient'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataFormPage from '@/components/Common/MasterDataFormPage'

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
    <MasterDataFormPage
      title={
        isEdit
          ? dict.ingredients?.edit || 'Edit Ingredient'
          : dict.ingredients?.add_new || 'Add New Ingredient'
      }
      onSubmit={handleSubmit}
      cancelPath="/ingredients"
      loading={loading}
      error={error}
      success={success}
    >
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
    </MasterDataFormPage>
  )
}


