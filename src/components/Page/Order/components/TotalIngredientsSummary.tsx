'use client'

import React from 'react'
import { Card, CardBody, Button, Table, Alert, FormSelect, Badge, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'
import { SupplierPrice } from '@/models/supplier-price'

interface TotalIngredient {
  ingredientId: string
  ingredientName: string
  totalQuantity: number
  unit: string
}

interface BestSupplier {
  productId: number
  productName: string
  supplierId: string
  supplierName: string
  unitPrice: number
  unit: string
  specification: string
  isFavorite: boolean
  isLowestPrice: boolean
  totalCost: number
}

interface TotalIngredientsSummaryProps {
  ingredients: TotalIngredient[]
  loading: boolean
  availableSuppliers: Record<string, SupplierPrice[]>
  supplierSelections: Record<string, number | ''>
  bestSuppliers?: Record<string, BestSupplier | null>
  onRefresh: () => void
  onSupplierChange: (ingredientId: string, productIdStr: string) => void
  formatNumber: (num: number) => string
}

export default function TotalIngredientsSummary({
  ingredients,
  loading,
  availableSuppliers,
  supplierSelections,
  bestSuppliers = {},
  onRefresh,
  onSupplierChange,
  formatNumber,
}: TotalIngredientsSummaryProps) {
  const dict = useDictionary()
  
  if (ingredients.length === 0) return null

  return (
    <Card className="mb-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{dict.orders?.labels?.ingredient_summary || 'Ingredient Summary & Supplier Selection'}</h5>
          <Button variant="outline-primary" onClick={onRefresh} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {dict.orders?.loading || 'Loading...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSync} className="me-2" />
                {dict.orders?.labels?.refresh_suggestions || 'Refresh Suggestions'}
              </>
            )}
          </Button>
        </div>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '30%' }}>{dict.orders?.table_headers?.ingredient || 'Ingredient'}</th>
                <th style={{ width: '15%' }}>{dict.orders?.table_headers?.quantity || 'Quantity'}</th>
                <th style={{ width: '50%' }}>{dict.orders?.table_headers?.supplier || 'Supplier'}</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, index) => {
                const suppliers = availableSuppliers[ing.ingredientId] || []
                const selectedProductId = supplierSelections[ing.ingredientId]
                const selectedSupplier = suppliers.find(
                  (s) => s.productId === selectedProductId,
                )
                const bestSupplier = bestSuppliers[ing.ingredientId]
                const isBestSupplierSelected =
                  bestSupplier &&
                  selectedProductId &&
                  bestSupplier.productId === selectedProductId

                return (
                  <tr
                    key={ing.ingredientId}
                    className={isBestSupplierSelected ? 'table-success' : ''}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <strong>{ing.ingredientName}</strong>
                      <br />
                      <small className="text-muted">{ing.ingredientId}</small>
                    </td>
                    <td>
                      <strong>{formatNumber(ing.totalQuantity)}</strong> {ing.unit}
                    </td>
                    <td>
                      {loading ? (
                        <div className="text-center">
                          <Spinner animation="border" size="sm" />
                        </div>
                      ) : suppliers.length === 0 ? (
                        <Alert variant="warning" className="mb-0 py-2">
                          {dict.orders?.labels?.no_supplier || 'No supplier'}
                        </Alert>
                      ) : (
                        <div>
                          {bestSupplier && !selectedProductId && (
                            <Alert variant="info" className="mb-2 py-2">
                              <strong>💡 {dict.orders?.labels?.suggestion || 'Suggestion'}:</strong> {bestSupplier.supplierName}
                              {bestSupplier.isFavorite && (
                                <Badge bg="primary" className="ms-2">
                                  {dict.orders?.labels?.favorite || 'Favorite'}
                                </Badge>
                              )}
                              {bestSupplier.isLowestPrice && (
                                <Badge bg="success" className="ms-2">
                                  {dict.orders?.labels?.best_price || 'Best Price'}
                                </Badge>
                              )}
                              {' - '}
                              {formatNumber(bestSupplier.totalCost)} đ
                            </Alert>
                          )}
                          <FormSelect
                            value={selectedProductId || ''}
                            onChange={(e) => onSupplierChange(ing.ingredientId, e.target.value)}
                            size="sm"
                            className={
                              isBestSupplierSelected ? 'border-success bg-success-subtle' : ''
                            }
                          >
                            <option value="">-- {dict.orders?.labels?.select_supplier || 'Select Supplier'} --</option>
                            {suppliers.map((supplier) => {
                              const isBest =
                                bestSupplier && bestSupplier.productId === supplier.productId
                              const tags: string[] = []
                              if (supplier.isFavorite) tags.push(`❤️ ${dict.orders?.labels?.favorite || 'Favorite'}`)
                              if (supplier.isLowestPrice) tags.push(`💰 ${dict.orders?.labels?.best_price || 'Best Price'}`)
                              if (supplier.promotion && !supplier.isFavorite && !supplier.isLowestPrice) {
                                tags.push(supplier.promotion)
                              }
                              return (
                                <option
                                  key={supplier.productId}
                                  value={supplier.productId}
                                  style={isBest ? { fontWeight: 'bold' } : {}}
                                >
                                  {isBest && '⭐ '}
                                  {supplier.supplierName} - {supplier.productName} (
                                  {formatNumber(supplier.unitPrice)} đ/{supplier.unit})
                                  {tags.length > 0 && ` - ${tags.join(', ')}`}
                                </option>
                              )
                            })}
                          </FormSelect>
                          {selectedSupplier && (
                            <div className="mt-2">
                              <small className="text-muted">
                                {isBestSupplierSelected && (
                                  <>
                                    <Badge bg="success" className="mb-1">
                                      ⭐ {dict.orders?.labels?.best_suggestion || 'Best Suggestion'}
                                    </Badge>
                                    <br />
                                  </>
                                )}
                                <div className="mb-1">
                                  {selectedSupplier.isFavorite && (
                                    <Badge bg="danger" className="me-1">
                                      ❤️ {dict.orders?.labels?.favorite || 'Favorite'}
                                    </Badge>
                                  )}
                                  {selectedSupplier.isLowestPrice && (
                                    <Badge bg="success" className="me-1">
                                      💰 {dict.orders?.labels?.best_price || 'Best Price'}
                                    </Badge>
                                  )}
                                  {selectedSupplier.promotion &&
                                    !selectedSupplier.isFavorite &&
                                    !selectedSupplier.isLowestPrice && (
                                      <Badge bg="info" className="me-1">
                                        {selectedSupplier.promotion}
                                      </Badge>
                                    )}
                                </div>
                                <strong>{dict.orders?.labels?.details || 'Details'}:</strong> {selectedSupplier.supplierName} (
                                {selectedSupplier.supplierId})
                                <br />
                                <strong>{dict.orders?.labels?.product || 'Product'}:</strong> {selectedSupplier.productName}
                                <br />
                                <strong>{dict.orders?.table_headers?.unit_price_label || 'Unit Price'}:</strong> {formatNumber(selectedSupplier.unitPrice)}{' '}
                                đ/{selectedSupplier.unit}
                                <br />
                                <strong>{dict.orders?.table_headers?.total_cost || 'Total Cost'}:</strong>{' '}
                                {selectedSupplier.totalCost !== undefined
                                  ? formatNumber(selectedSupplier.totalCost)
                                  : formatNumber(selectedSupplier.unitPrice * ing.totalQuantity)}{' '}
                                đ
                                {selectedSupplier.specification && (
                                  <>
                                    <br />
                                    <strong>{dict.orders?.labels?.specification || 'Specification'}:</strong> {selectedSupplier.specification}
                                  </>
                                )}
                              </small>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

