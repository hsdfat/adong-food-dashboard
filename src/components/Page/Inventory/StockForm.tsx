'use client'

import React, { useState, useEffect } from 'react'
import { Form, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { inventoryStockApi } from '@/services'
import { InventoryStock, UpdateStockLevelsInput } from '@/models'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataFormPage from '@/components/Common/MasterDataFormPage'

interface StockFormProps {
  stockId: number
}

export default function StockForm({ stockId }: StockFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [loadingStock, setLoadingStock] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stock, setStock] = useState<InventoryStock | null>(null)

  const [formData, setFormData] = useState({
    minStockLevel: '',
    maxStockLevel: '',
  })

  useEffect(() => {
    const loadStock = async () => {
      try {
        setLoadingStock(true)
        const response = await inventoryStockApi.getById(stockId)
        setStock(response.data)
        setFormData({
          minStockLevel: response.data.minStockLevel?.toString() || '',
          maxStockLevel: response.data.maxStockLevel?.toString() || '',
        })
      } catch (err) {
        setError('Failed to load stock')
        console.error(err)
      } finally {
        setLoadingStock(false)
      }
    }

    if (stockId) {
      loadStock()
    }
  }, [stockId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updateData: UpdateStockLevelsInput = {
        minStockLevel:
          formData.minStockLevel !== ''
            ? parseFloat(formData.minStockLevel)
            : undefined,
        maxStockLevel:
          formData.maxStockLevel !== ''
            ? parseFloat(formData.maxStockLevel)
            : undefined,
      }

      await inventoryStockApi.updateLevels(stockId, updateData)
      setSuccess('Stock levels updated successfully')

      setTimeout(() => {
        router.push('/inventory/stocks')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update stock levels')
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

  if (loadingStock) {
    return <div>Loading...</div>
  }

  if (!stock) {
    return <Alert variant="danger">Stock not found</Alert>
  }

  return (
    <MasterDataFormPage
      title={`${dict.inventory?.update_stock_levels || 'Update Stock Levels'} - ${stock.ingredient?.ingredientName || stock.ingredientId}`}
      onSubmit={handleSubmit}
      cancelPath="/inventory/stocks"
      loading={loading}
      error={error}
      success={success}
      submitLabel={dict.action?.save || 'Save'}
      cancelLabel={dict.action?.cancel || 'Cancel'}
    >
      <div className="mb-4">
        <h5>Stock Information</h5>
        <p>
          <strong>Kitchen:</strong> {stock.kitchen?.kitchenName || stock.kitchenId}
        </p>
        <p>
          <strong>Ingredient:</strong>{' '}
          {stock.ingredient?.ingredientName || stock.ingredientId}
        </p>
        <p>
          <strong>Current Quantity:</strong> {stock.quantity} {stock.unit}
        </p>
      </div>

      <FormGroup className="mb-3">
        <FormLabel>
          {dict.inventory?.min_stock || 'Minimum Stock Level'}
        </FormLabel>
        <FormControl
          type="number"
          name="minStockLevel"
          value={formData.minStockLevel}
          onChange={handleChange}
          step="0.01"
          min="0"
          placeholder="Enter minimum stock level"
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>
          {dict.inventory?.max_stock || 'Maximum Stock Level'}
        </FormLabel>
        <FormControl
          type="number"
          name="maxStockLevel"
          value={formData.maxStockLevel}
          onChange={handleChange}
          step="0.01"
          min="0"
          placeholder="Enter maximum stock level"
        />
      </FormGroup>
    </MasterDataFormPage>
  )
}

