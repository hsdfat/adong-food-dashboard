'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Alert,
  Badge,
  Spinner,
} from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import useDictionary from '@/locales/dictionary-hook'
import { orderApi } from '@/services'

interface IngredientSummaryItem {
  ingredientId: string
  ingredientName: string
  quantity: number
  unit: string
  standardPerPortion?: number
}

interface IngredientSummaryResponse {
  orderId: number | string
  ingredients: IngredientSummaryItem[]
}

export default function IngredientSummary() {
  const params = useParams()
  const router = useRouter()
  const dict = useDictionary()
  const orderId = params?.id ? (params.id as string) : null

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [summary, setSummary] = useState<IngredientSummaryResponse | null>(null)

  useEffect(() => {
    if (orderId) {
      loadSummary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const loadSummary = async () => {
    if (!orderId) return

    try {
      setLoading(true)
      setError('')

      const data = await orderApi.getIngredientsSummary(orderId)

      // Normalize various possible response shapes
      let normalized: IngredientSummaryResponse = {
        orderId: orderId,
        ingredients: [],
      }

      const unwrap = (val: any) => (val?.data !== undefined ? val.data : val)
      const raw = unwrap(data)

      if (Array.isArray(raw)) {
        // API returns an array of ingredients directly
        normalized.ingredients = raw.map((ing: any) => ({
          ingredientId: ing.ingredientId,
          ingredientName: ing.ingredientName,
          quantity: ing.totalQuantity ?? ing.quantity ?? 0,
          unit: ing.unit,
          standardPerPortion: ing.standardPerPortion,
        }))
      } else if (raw && Array.isArray(raw.ingredients)) {
        // API returns { orderId?, ingredients: [...] }
        normalized.orderId = raw.orderId ?? orderId
        normalized.ingredients = raw.ingredients.map((ing: any) => ({
          ingredientId: ing.ingredientId,
          ingredientName: ing.ingredientName,
          quantity: ing.totalQuantity ?? ing.quantity ?? 0,
          unit: ing.unit,
          standardPerPortion: ing.standardPerPortion,
        }))
      } else {
        // Unknown shape
        normalized.ingredients = []
      }

      setSummary(normalized)
    } catch (err: any) {
      console.error('Error loading ingredients summary:', err)
      setError(
        err.message ||
        dict.orders?.error_load_summary ||
        'Failed to load ingredient summary',
      )
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * 100) / 100
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            <Spinner animation="border" className="me-2" />
            {dict.orders?.loading || 'Loading...'}
          </div>
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <Alert variant="danger">{error}</Alert>
          <button
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            {dict.orders?.labels?.back_to_orders || 'Go Back'}
          </button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4>
              {dict.orders?.ingredient_summary || 'Ingredient Summary'} - Order
              #{summary?.orderId || orderId}
            </h4>
            <div className="text-muted">
              {dict.orders?.ingredient_summary_desc ||
                'Total ingredients required for this order'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {summary && summary.ingredients && summary.ingredients.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>{dict.orders?.columns?.ingredient_id || 'Ingredient ID'}</th>
                <th>{dict.orders?.columns?.ingredient_name || 'Ingredient Name'}</th>
                <th className="text-end">{dict.orders?.columns?.quantity || 'Quantity'}</th>
                <th>{dict.orders?.columns?.unit || 'Unit'}</th>
                {summary.ingredients.some(
                  (ing) => ing.standardPerPortion !== undefined,
                ) && <th className="text-end">{dict.orders?.columns?.standard_per_portion || 'Standard/Portion'}</th>}
              </tr>
            </thead>
            <tbody>
              {summary.ingredients.map((ingredient, index) => (
                <tr key={ingredient.ingredientId || index}>
                  <td>
                    <Badge bg="secondary">{ingredient.ingredientId}</Badge>
                  </td>
                  <td>
                    <strong>{ingredient.ingredientName}</strong>
                  </td>
                  <td className="text-end">
                    <strong>{formatNumber(ingredient.quantity)}</strong>
                  </td>
                  <td>{ingredient.unit}</td>
                  {summary.ingredients.some(
                    (ing) => ing.standardPerPortion !== undefined,
                  ) && (
                      <td className="text-end">
                        {ingredient.standardPerPortion !== undefined
                          ? formatNumber(ingredient.standardPerPortion)
                          : '-'}
                      </td>
                    )}
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan={2}>
                  <strong>{dict.orders?.columns?.total_ingredients || 'Total Ingredients'}</strong>
                </td>
                <td className="text-end">
                  <strong>{summary.ingredients.length}</strong>
                </td>
                <td colSpan={summary.ingredients.some(
                  (ing) => ing.standardPerPortion !== undefined,
                ) ? 2 : 1}></td>
              </tr>
            </tfoot>
          </Table>
        ) : (
          <Alert variant="info">
            {dict.orders?.no_ingredients ||
              'No ingredients found for this order'}
          </Alert>
        )}

        <div className="mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            {dict.orders?.labels?.back_to_orders || 'Go Back'}
          </button>
        </div>
      </CardBody>
    </Card>
  )
}

