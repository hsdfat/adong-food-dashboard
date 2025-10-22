'use client'

import React, { useState } from 'react'
import { Form, Button, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish, CreateDishInput, UpdateDishInput } from '@/models/dish'
import useDictionary from '@/locales/dictionary-hook'
import { boolean } from 'zod'

interface DishFormProps {
  dish?: Dish
  isEdit?: boolean
}

export default function DishForm({ dish, isEdit = false }: DishFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    dishId: dish?.dishId || '',
    dishName: dish?.dishName || '',
    cookingMethod: dish?.cookingMethod || '',
    group: dish?.group || '',
    description: dish?.description || '',
    active: dish?.active || true,
  })

  const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: name === 'active' ? value === 'true' : value
      }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && dish) {
        const updateData: UpdateDishInput = {
          dishName: formData.dishName,
          cookingMethod: formData.cookingMethod,
          group: formData.group,
          description: formData.description,
          active: formData.active,
        }
        await dishApi.update(dish.dishId, updateData)
        setSuccess('Dish updated successfully')
      } else {
        const createData: CreateDishInput = {
          dishId: formData.dishId,
          dishName: formData.dishName,
          cookingMethod: formData.cookingMethod,
          group: formData.group,
          description: formData.description,
          active: formData.active,
        }
        await dishApi.create(createData)
        setSuccess('Dish created successfully')
      }

      setTimeout(() => {
        router.push('/dishs')
      }, 1500)
    } catch (err) {
      setError(isEdit ? 'Failed to update dish' : 'Failed to create dish')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          <FormLabel>Dish ID</FormLabel>
          <FormControl
            type="text"
            name="dishId"
            value={formData.dishId}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Dish Name</FormLabel>
          <FormControl
            type="text"
            name="dishName"
            value={formData.dishName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Property</FormLabel>
          <FormControl
            type="text"
            name="cookingMethod"
            value={formData.cookingMethod}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Material Group</FormLabel>
          <FormControl
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Unit</FormLabel>
          <FormControl
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.status || 'Status'}</FormLabel>
          <Form.Select
            name="active"
            value={formData.active ? 'true' : 'false'}
            onChange={handleChangeActive}
          >
            <option value="true">{dict.common?.active || 'Active'}</option>
            <option value="false">{dict.common?.inactive || 'Inactive'}</option>
          </Form.Select>
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
          onClick={() => router.push('/dishs')}
        >
          Cancel
        </Button>
      </Form>
    </>
  )
}