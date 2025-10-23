'use client'

import React, { useState } from 'react'
import { Form, Button, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { supplierApi } from '@/services'
import { Supplier, CreateSupplierInput, UpdateSupplierInput } from '@/models/supplier'
import useDictionary from '@/locales/dictionary-hook'

interface SupplierFormProps {
  supplier?: Supplier
  isEdit?: boolean
}

export default function SupplierForm({ supplier, isEdit = false }: SupplierFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    supplierId: supplier?.supplierId || '',
    supplierName: supplier?.supplierName || '',
    address: supplier?.address || '',
    phone: supplier?.phone || '',
    zaloLink: supplier?.zaloLink || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && supplier) {
        const updateData: UpdateSupplierInput = {
          supplierName: formData.supplierName,
          address: formData.address,
          phone: formData.phone,
          zaloLink: formData.zaloLink,
        }
        await supplierApi.update(supplier.supplierId, updateData)
        setSuccess(dict.common?.success_update || 'Supplier updated successfully')
      } else {
        const createData: CreateSupplierInput = {
          supplierId: formData.supplierId,
          supplierName: formData.supplierName,
          address: formData.address,
          phone: formData.phone,
          zaloLink: formData.zaloLink,
        }
        await supplierApi.create(createData)
        setSuccess(dict.common?.success_create || 'Supplier created successfully')
      }

      setTimeout(() => {
        router.push('/suppliers')
      }, 1500)
    } catch (err) {
      setError(isEdit ? 
        (dict.common?.error_update || 'Failed to update supplier') : 
        (dict.common?.error_create || 'Failed to create supplier')
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value
    }))
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
          <FormLabel>{dict.suppliers?.id || 'Supplier ID'}</FormLabel>
          <FormControl
            type="text"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.suppliers?.name || 'Supplier Name'}</FormLabel>
          <FormControl
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.suppliers?.address || 'Address'}</FormLabel>
          <FormControl
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.suppliers?.phone || 'Phone'}</FormLabel>
          <FormControl
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormGroup>

         <FormGroup className="mb-3">
          <FormLabel>{dict.suppliers?.zalo_link || 'Zalo link'}</FormLabel>
          <FormControl
            type="text"
            name="zaloLink"
            value={formData.zaloLink}
            onChange={handleChange}
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
          onClick={() => router.push('/suppliers')}
        >
          {dict.common?.cancel || 'Cancel'}
        </Button>
      </Form>
    </>
  )
}