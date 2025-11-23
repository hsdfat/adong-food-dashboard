'use client'

import React from 'react'
import { Card, CardBody, Button, Table, Alert, FormSelect, Badge, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
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
  if (ingredients.length === 0) return null

  return (
    <Card className="mb-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Tổng hợp nguyên liệu & Chọn nhà cung cấp</h5>
          <Button variant="outline-primary" onClick={onRefresh} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang tải...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSync} className="me-2" />
                Làm mới đề xuất
              </>
            )}
          </Button>
        </div>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '30%' }}>Nguyên liệu</th>
                <th style={{ width: '15%' }}>Số lượng</th>
                <th style={{ width: '50%' }}>Nhà cung cấp</th>
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
                          Không có nhà cung cấp
                        </Alert>
                      ) : (
                        <div>
                          {bestSupplier && !selectedProductId && (
                            <Alert variant="info" className="mb-2 py-2">
                              <strong>💡 Đề xuất:</strong> {bestSupplier.supplierName}
                              {bestSupplier.isFavorite && (
                                <Badge bg="primary" className="ms-2">
                                  Yêu thích
                                </Badge>
                              )}
                              {bestSupplier.isLowestPrice && (
                                <Badge bg="success" className="ms-2">
                                  Giá tốt nhất
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
                            <option value="">-- Chọn nhà cung cấp --</option>
                            {suppliers.map((supplier) => {
                              const isBest =
                                bestSupplier && bestSupplier.productId === supplier.productId
                              const tags: string[] = []
                              if (supplier.isFavorite) tags.push('❤️ Yêu thích')
                              if (supplier.isLowestPrice) tags.push('💰 Giá tốt nhất')
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
                                      ⭐ Đề xuất tốt nhất
                                    </Badge>
                                    <br />
                                  </>
                                )}
                                <div className="mb-1">
                                  {selectedSupplier.isFavorite && (
                                    <Badge bg="danger" className="me-1">
                                      ❤️ Yêu thích
                                    </Badge>
                                  )}
                                  {selectedSupplier.isLowestPrice && (
                                    <Badge bg="success" className="me-1">
                                      💰 Giá tốt nhất
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
                                <strong>Chi tiết:</strong> {selectedSupplier.supplierName} (
                                {selectedSupplier.supplierId})
                                <br />
                                <strong>Sản phẩm:</strong> {selectedSupplier.productName}
                                <br />
                                <strong>Đơn giá:</strong> {formatNumber(selectedSupplier.unitPrice)}{' '}
                                đ/{selectedSupplier.unit}
                                <br />
                                <strong>Tổng tiền:</strong>{' '}
                                {selectedSupplier.totalCost !== undefined
                                  ? formatNumber(selectedSupplier.totalCost)
                                  : formatNumber(selectedSupplier.unitPrice * ing.totalQuantity)}{' '}
                                đ
                                {selectedSupplier.specification && (
                                  <>
                                    <br />
                                    <strong>Quy cách:</strong> {selectedSupplier.specification}
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

