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
import { kitchenApi } from '@/services'
import {
  Kitchen,
  CreateKitchenInput,
  UpdateKitchenInput,
} from '@/models/kitchen'
import useDictionary from '@/locales/dictionary-hook'

interface KitchenFormProps {
  kitchen?: Kitchen
  isEdit?: boolean
}

export default function KitchenForm({
  kitchen,
  isEdit = false,
}: KitchenFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    kitchenId: kitchen?.kitchenId || '',
    kitchenName: kitchen?.kitchenName || '',
    address: kitchen?.address || '',
    phone: kitchen?.phone || '',
    active: kitchen?.active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && kitchen) {
        const updateData: UpdateKitchenInput = {
          kitchenName: formData.kitchenName,
          address: formData.address,
          phone: formData.phone,
          active: formData.active,
        }
        await kitchenApi.update(kitchen.kitchenId, updateData)
        setSuccess(
          dict.kitchens?.success_update || 'Kitchen updated successfully',
        )
      } else {
        const createData: CreateKitchenInput = {
          kitchenId: formData.kitchenId,
          kitchenName: formData.kitchenName,
          address: formData.address,
          phone: formData.phone,
          active: formData.active,
        }
        await kitchenApi.create(createData)
        setSuccess(
          dict.kitchens?.success_create || 'Kitchen created successfully',
        )
      }

      setTimeout(() => {
        router.push('/kitchens')
      }, 1500)
    } catch (err) {
      setError(
        isEdit
          ? dict.kitchens?.error_update || 'Failed to update kitchen'
          : dict.kitchens?.error_create || 'Failed to create kitchen',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeActive = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value,
    }))
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
          <FormLabel>{dict.kitchens?.id || 'Kitchen ID'}</FormLabel>
          <FormControl
            type="text"
            name="kitchenId"
            value={formData.kitchenId}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.name || 'Kitchen Name'}</FormLabel>
          <FormControl
            type="text"
            name="kitchenName"
            value={formData.kitchenName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.address || 'Address'}</FormLabel>
          <FormControl
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.phone || 'Phone'}</FormLabel>
          <FormControl
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
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
          onClick={() => router.push('/kitchens')}
        >
          {dict.common?.cancel || 'Cancel'}
        </Button>
      </Form>
    </>
  )
}
