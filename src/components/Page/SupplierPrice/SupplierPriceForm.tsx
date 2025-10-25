'use client'

// components/Page/SupplierPrice/SupplierPriceForm.tsx

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
  FormCheck,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import Select from 'react-select'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { ingredientApi } from '@/services'
import { supplierApi } from '@/services'
import {
  SupplierPrice,
  CreateSupplierPriceInput,
  UpdateSupplierPriceInput,
} from '@/models/supplier-price'
import { Ingredient } from '@/models/ingredient'
import { Supplier } from '@/models/supplier'
import useDictionary from '@/locales/dictionary-hook'

interface SupplierPriceFormProps {
  supplierPrice?: SupplierPrice
  isEdit?: boolean
}

export default function SupplierPriceForm({
  supplierPrice,
  isEdit = false,
}: SupplierPriceFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [ingredients, setIngredients] = useState<{ data: Ingredient[] } | null>(
    null,
  )
  const [suppliers, setSuppliers] = useState<{ data: Supplier[] } | null>(null)

  const [formData, setFormData] = useState({
    productName: supplierPrice?.productName || '',
    ingredientId: supplierPrice?.ingredientId || '',
    category: supplierPrice?.category || '',
    supplierId: supplierPrice?.supplierId || '',
    manufacturer: supplierPrice?.manufacturer || '',
    unit: supplierPrice?.unit || '',
    specification: supplierPrice?.specification || '',
    unitPrice: supplierPrice?.unitPrice?.toString() || '',
    pricePer1: supplierPrice?.pricePer1?.toString() || '',
    effectiveFrom:
      supplierPrice?.effectiveFrom?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
    effectiveTo:
      supplierPrice?.effectiveTo?.split('T')[0] ||
      new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
    active: supplierPrice?.active ?? true,
    newPrice: supplierPrice?.newPrice?.toString() || '0',
    promotion: supplierPrice?.promotion || '',
  })

  useEffect(() => {
    loadFormOptions()
  }, [])

  const loadFormOptions = async () => {
    try {
      setLoadingOptions(true)
      const [ingredientsData, suppliersData] = await Promise.all([
        ingredientApi.getAll(),
        supplierApi.getAll(),
      ])
      setIngredients(ingredientsData)
      setSuppliers(suppliersData)
    } catch (err) {
      console.error('Failed to load form options:', err)
      setError('Failed to load form options')
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.productName.trim()) {
      setError('Product name is required')
      return false
    }
    if (!formData.ingredientId) {
      setError('Ingredient is required')
      return false
    }
    if (!formData.supplierId) {
      setError('Supplier is required')
      return false
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setError('Valid unit price is required')
      return false
    }
    if (!formData.pricePer1 || parseFloat(formData.pricePer1) <= 0) {
      setError('Valid price per 1 is required')
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
        productName: formData.productName,
        ingredientId: formData.ingredientId,
        category: formData.category,
        supplierId: formData.supplierId,
        manufacturer: formData.manufacturer,
        unit: formData.unit,
        specification: formData.specification,
        unitPrice: parseFloat(formData.unitPrice),
        pricePer1: parseFloat(formData.pricePer1),
        effectiveFrom: new Date(formData.effectiveFrom).toISOString(),
        effectiveTo: new Date(formData.effectiveTo).toISOString(),
        active: formData.active,
        newPrice: formData.newPrice ? parseFloat(formData.newPrice) : 0,
        promotion: formData.promotion || '',
      }

      if (isEdit && supplierPrice) {
        const updateData: UpdateSupplierPriceInput = {
          productName: submitData.productName,
          category: submitData.category,
          manufacturer: submitData.manufacturer,
          unit: submitData.unit,
          specification: submitData.specification,
          unitPrice: submitData.unitPrice,
          pricePer1: submitData.pricePer1,
          effectiveFrom: submitData.effectiveFrom,
          effectiveTo: submitData.effectiveTo,
          active: submitData.active,
          newPrice: submitData.newPrice,
          promotion: submitData.promotion,
        }
        await supplierPriceApi.update(supplierPrice.id, updateData)
        setSuccess(
          dict.common?.success_update || 'Supplier price updated successfully',
        )
      } else {
        const createData: CreateSupplierPriceInput = submitData
        await supplierPriceApi.create(createData)
        setSuccess(
          dict.common?.success_create || 'Supplier price created successfully',
        )
      }

      // Redirect after success
      setTimeout(() => {
        router.push('/supplier-prices')
      }, 1500)
    } catch (err: any) {
      setError(
        err.message ||
          dict.common?.save_error ||
          'Failed to save supplier price',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/supplier-prices')
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
          <Col md={12}>
            <FormGroup className="mb-3">
              <FormLabel>Product Name *</FormLabel>
              <FormControl
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                disabled={loading}
                required
                maxLength={255}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          {ingredients && (
            <Col md={6}>
              <FormGroup className="mb-3">
                <FormLabel>Ingredient *</FormLabel>
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
                  placeholder="Select an ingredient"
                />
              </FormGroup>
            </Col>
          )}

          {suppliers && (
            <Col md={6}>
              <FormGroup className="mb-3">
                <FormLabel>Supplier *</FormLabel>
                <Select<{ value: string; label: string }, false>
                  name="supplierId"
                  value={
                    suppliers.data
                      .map((supplier) => ({
                        value: supplier.supplierId,
                        label: `${supplier.supplierId} - ${supplier.supplierName}`,
                      }))
                      .find((opt) => opt.value === formData.supplierId) || null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplierId: selected ? selected.value : '',
                    }))
                  }
                  options={suppliers.data.map((supplier) => ({
                    value: supplier.supplierId,
                    label: `${supplier.supplierId} - ${supplier.supplierName}`,
                  }))}
                  isDisabled={isEdit || loading}
                  isSearchable
                  placeholder="Select a supplier"
                />
              </FormGroup>
            </Col>
          )}
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Category</FormLabel>
              <FormControl
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                disabled={loading}
                maxLength={100}
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Manufacturer</FormLabel>
              <FormControl
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="Enter manufacturer"
                disabled={loading}
                maxLength={255}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Unit *</FormLabel>
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

          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Specification</FormLabel>
              <FormControl
                type="text"
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                placeholder="Enter specification"
                disabled={loading}
                maxLength={100}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup className="mb-3">
              <FormLabel>Unit Price *</FormLabel>
              <FormControl
                type="number"
                step="0.01"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="120000"
                disabled={loading}
                required
              />
              <Form.Text className="text-muted">Price per unit (VNĐ)</Form.Text>
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup className="mb-3">
              <FormLabel>Price Per 1 *</FormLabel>
              <FormControl
                type="number"
                step="0.01"
                name="pricePer1"
                value={formData.pricePer1}
                onChange={handleChange}
                placeholder="120000"
                disabled={loading}
                required
              />
              <Form.Text className="text-muted">
                Price per single item (VNĐ)
              </Form.Text>
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup className="mb-3">
              <FormLabel>New Price</FormLabel>
              <FormControl
                type="number"
                step="0.01"
                name="newPrice"
                value={formData.newPrice}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Promotional price (VNĐ)
              </Form.Text>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Effective From *</FormLabel>
              <FormControl
                type="date"
                name="effectiveFrom"
                value={formData.effectiveFrom}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Effective To *</FormLabel>
              <FormControl
                type="date"
                name="effectiveTo"
                value={formData.effectiveTo}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Promotion</FormLabel>
              <FormControl
                type="text"
                name="promotion"
                value={formData.promotion}
                onChange={handleChange}
                placeholder="Enter promotion details"
                disabled={loading}
                maxLength={1}
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup className="mb-3">
              <FormCheck
                type="checkbox"
                name="active"
                label="Active"
                checked={formData.active}
                onChange={handleChange}
                disabled={loading}
              />
            </FormGroup>
          </Col>
        </Row>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            {dict.action?.cancel || 'Cancel'}
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading
              ? dict.action?.saving || 'Saving...'
              : dict.action?.save || 'Save'}
          </Button>
        </div>
      </Form>
    </>
  )
}
