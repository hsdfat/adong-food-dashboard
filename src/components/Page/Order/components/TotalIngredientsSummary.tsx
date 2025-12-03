'use client'

import React from 'react'
import { Card, CardBody, Button, Table, Alert, FormSelect, FormCheck, Badge, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'
import { SupplierPrice } from '@/models/supplier-price'

interface TotalIngredient {
  ingredientId: string;
  ingredientName: string;
  totalQuantity: number;
  unit: string;
  stockQuantity?: number;
  hasSufficientStock?: boolean;
}

interface BestSupplier {
  productId: number;
  productName: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  unit: string;
  specification: string;
  isFavorite: boolean;
  isLowestPrice: boolean;
  totalCost: number;
}

interface TotalIngredientsSummaryProps {
  ingredients: TotalIngredient[];
  loading: boolean;
  availableSuppliers: Record<string, SupplierPrice[]>;
  supplierSelections: Record<string, number | ''>;
  fulfillmentSources?: Record<string, 'supplier' | 'inventory'>;
  bestSuppliers?: Record<string, BestSupplier | null>;
  onRefresh: () => void;
  onSupplierChange: (ingredientId: string, productIdStr: string) => void;
  onFulfillmentSourceChange?: (ingredientId: string, source: 'supplier' | 'inventory') => void;
  formatNumber: (num: number) => string;
}

export default function TotalIngredientsSummary({
  ingredients,
  loading,
  availableSuppliers,
  supplierSelections,
  fulfillmentSources = {},
  bestSuppliers = {},
  onRefresh,
  onSupplierChange,
  onFulfillmentSourceChange,
  formatNumber,
}: TotalIngredientsSummaryProps) {
  const dict = useDictionary()

  if (ingredients.length === 0) return null

  return (
    <Card className="mb-4 ingredient-summary-card">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">{dict.orders?.ingredient_summary?.labels?.ingredient_summary || 'Tổng hợp nguyên liệu & Chọn nhà cung cấp'}</h5>
          <Button variant="outline-primary" onClick={onRefresh} disabled={loading} size="sm">
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {dict.orders?.loading || 'Đang tải...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSync} className="me-2" />
                {dict.orders?.ingredient_summary?.labels?.refresh_suggestions || 'Làm mới đề xuất'}
              </>
            )}
          </Button>
        </div>

        <div className="table-responsive">
          <Table striped bordered hover className="ingredient-summary-table">
            <thead>
              <tr>
                <th className="mobile-hide" style={{ width: '5%' }}>#</th>
                <th style={{ width: '20%' }}>{dict.orders?.ingredient_summary?.table_headers?.ingredient || 'Nguyên liệu'}</th>
                <th style={{ width: '15%' }}>{dict.orders?.ingredient_summary?.table_headers?.quantity || 'Số lượng'}</th>
                <th style={{ width: '60%' }}>{dict.orders?.ingredient_summary?.table_headers?.supplier || 'Nhà cung cấp'}</th>
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
                    <td className="mobile-hide">{index + 1}</td>
                    <td>
                      <div className="mobile-number d-md-none">
                        <Badge bg="secondary" className="me-2">#{index + 1}</Badge>
                      </div>
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
                      ) : (
                        <div>
                          {/* Inventory Option */}
                          {onFulfillmentSourceChange && (
                            <div className="mb-3 p-2 border rounded bg-light">
                              <FormCheck
                                type="radio"
                                id={`inventory-${ing.ingredientId}`}
                                name={`fulfillment-${ing.ingredientId}`}
                                label={
                                  <span>
                                    <Badge bg={ing.hasSufficientStock ? "success" : "warning"} className="me-2">
                                      📦 {dict.orders?.ingredient_summary?.labels?.use_from_inventory || 'Lấy từ kho'}
                                    </Badge>
                                    <small className="text-muted d-block d-sm-inline">
                                      {dict.orders?.ingredient_summary?.labels?.available || 'Khả dụng'}: {formatNumber(ing.stockQuantity || 0)} {ing.unit}
                                    </small>
                                  </span>
                                }
                                checked={fulfillmentSources[ing.ingredientId] === 'inventory'}
                                onChange={() => onFulfillmentSourceChange(ing.ingredientId, 'inventory')}
                              />
                            </div>
                          )}

                          {/* Supplier Option */}
                          {suppliers.length > 0 && (
                            <div>
                              {onFulfillmentSourceChange && (
                                <FormCheck
                                  type="radio"
                                  id={`supplier-${ing.ingredientId}`}
                                  name={`fulfillment-${ing.ingredientId}`}
                                  label={dict.orders?.ingredient_summary?.labels?.order_from_supplier || 'Đặt từ nhà cung cấp'}
                                  checked={fulfillmentSources[ing.ingredientId] !== 'inventory'}
                                  onChange={() => onFulfillmentSourceChange(ing.ingredientId, 'supplier')}
                                  className="mb-2"
                                />
                              )}

                              {(!onFulfillmentSourceChange || fulfillmentSources[ing.ingredientId] !== 'inventory') && (
                                <>
                                  {bestSupplier && !selectedProductId && (
                                    <Alert variant="info" className="mb-2 py-2 suggestion-alert">
                                      <strong>💡 {dict.orders?.ingredient_summary?.labels?.suggestion || 'Đề xuất'}:</strong> {bestSupplier.supplierName}
                                      {bestSupplier.isFavorite && (
                                        <Badge bg="primary" className="ms-2">
                                          {dict.orders?.ingredient_summary?.labels?.favorite || 'Yêu thích'}
                                        </Badge>
                                      )}
                                      {bestSupplier.isLowestPrice && (
                                        <Badge bg="success" className="ms-2">
                                          {dict.orders?.ingredient_summary?.labels?.best_price || 'Giá tốt nhất'}
                                        </Badge>
                                      )}
                                      <div className="d-block d-sm-inline">
                                        {' - '}
                                        {formatNumber(bestSupplier.totalCost)} đ
                                      </div>
                                    </Alert>
                                  )}
                                  <FormSelect
                                    value={selectedProductId || ''}
                                    onChange={(e) => onSupplierChange(ing.ingredientId, e.target.value)}
                                    size="sm"
                                    className={
                                      isBestSupplierSelected ? 'border-success bg-success-subtle supplier-select' : 'supplier-select'
                                    }
                                  >
                                    <option value="">-- {dict.orders?.ingredient_summary?.labels?.select_supplier || 'Chọn nhà cung cấp'} --</option>
                                    {suppliers.map((supplier) => {
                                      const isBest =
                                        bestSupplier && bestSupplier.productId === supplier.productId
                                      const tags: string[] = []
                                      if (supplier.isFavorite) tags.push(`❤️ ${dict.orders?.ingredient_summary?.labels?.favorite || 'Yêu thích'}`)
                                      if (supplier.isLowestPrice) tags.push(`💰 ${dict.orders?.ingredient_summary?.labels?.best_price || 'Giá tốt nhất'}`)
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
                                    <div className="mt-2 supplier-details">
                                      <small className="text-muted">
                                        {isBestSupplierSelected && (
                                          <>
                                            <Badge bg="success" className="mb-1">
                                              ⭐ {dict.orders?.ingredient_summary?.labels?.best_suggestion || 'Đề xuất tốt nhất'}
                                            </Badge>
                                            <br />
                                          </>
                                        )}
                                        <div className="mb-1">
                                          {selectedSupplier.isFavorite && (
                                            <Badge bg="danger" className="me-1 mb-1">
                                              ❤️ {dict.orders?.ingredient_summary?.labels?.favorite || 'Yêu thích'}
                                            </Badge>
                                          )}
                                          {selectedSupplier.isLowestPrice && (
                                            <Badge bg="success" className="me-1 mb-1">
                                              💰 {dict.orders?.ingredient_summary?.labels?.best_price || 'Giá tốt nhất'}
                                            </Badge>
                                          )}
                                          {selectedSupplier.promotion &&
                                            !selectedSupplier.isFavorite &&
                                            !selectedSupplier.isLowestPrice && (
                                              <Badge bg="info" className="me-1 mb-1">
                                                {selectedSupplier.promotion}
                                              </Badge>
                                            )}
                                        </div>
                                        <strong>{dict.orders?.ingredient_summary?.labels?.details || 'Chi tiết'}:</strong> {selectedSupplier.supplierName} (
                                        {selectedSupplier.supplierId})
                                        <br />
                                        <strong>{dict.orders?.ingredient_summary?.labels?.product || 'Sản phẩm'}:</strong> {selectedSupplier.productName}
                                        <br />
                                        <strong>{dict.orders?.ingredient_summary?.table_headers?.unit_price_label || 'Đơn giá'}:</strong> {formatNumber(selectedSupplier.unitPrice)}{' '}
                                        đ/{selectedSupplier.unit}
                                        <br />
                                        <strong>{dict.orders?.ingredient_summary?.table_headers?.total_cost || 'Thành tiền'}:</strong>{' '}
                                        {selectedSupplier.totalCost !== undefined
                                          ? formatNumber(selectedSupplier.totalCost)
                                          : formatNumber(selectedSupplier.unitPrice * ing.totalQuantity)}{' '}
                                        đ
                                        {selectedSupplier.specification && (
                                          <>
                                            <br />
                                            <strong>{dict.orders?.ingredient_summary?.labels?.specification || 'Quy cách'}:</strong> {selectedSupplier.specification}
                                          </>
                                        )}
                                      </small>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          {/* No suppliers available */}
                          {suppliers.length === 0 && !onFulfillmentSourceChange && (
                            <Alert variant="warning" className="mb-0 py-2">
                              {dict.orders?.ingredient_summary?.labels?.no_supplier || 'Không có nhà cung cấp'}
                            </Alert>
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

