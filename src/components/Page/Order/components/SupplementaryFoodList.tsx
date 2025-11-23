'use client'

import React from 'react'
import { Card, CardBody, Button, Alert, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import SupplementaryFoodRow from './SupplementaryFoodRow'

interface SupplementaryFoodItem {
  id: string
  nguyenLieuId: string
  tenNguyenLieu: string
  donViTinh: string
  dinhMuc: number
  soSuat: number
  soLuong: number
  ghiChu?: string
}

interface SupplementaryFoodListProps {
  items: SupplementaryFoodItem[]
  onAdd: () => void
  onDinhMucChange: (id: string, dinhMuc: number) => void
  onSoSuatChange: (id: string, soSuat: number) => void
  onNoteChange: (id: string, note: string) => void
  onRemove: (id: string) => void
  formatNumber: (num: number) => string
}

export default function SupplementaryFoodList({
  items,
  onAdd,
  onDinhMucChange,
  onSoSuatChange,
  onNoteChange,
  onRemove,
  formatNumber,
}: SupplementaryFoodListProps) {
  return (
    <Card className="mb-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Thực phẩm bổ sung</h5>
          <Button variant="success" onClick={onAdd}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Thêm thực phẩm bổ sung
          </Button>
        </div>

        {items.length === 0 ? (
          <Alert variant="info">
            Chưa có thực phẩm bổ sung. Nhấn "Thêm thực phẩm bổ sung" để thêm mới.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>Nguyên liệu</th>
                  <th style={{ width: '15%' }}>Định mức</th>
                  <th style={{ width: '10%' }}>Số suất</th>
                  <th style={{ width: '15%' }}>Số lượng</th>
                  <th style={{ width: '20%' }}>Ghi chú</th>
                  <th style={{ width: '10%' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <SupplementaryFoodRow
                    key={item.id}
                    item={item}
                    index={index}
                    onDinhMucChange={onDinhMucChange}
                    onSoSuatChange={onSoSuatChange}
                    onNoteChange={onNoteChange}
                    onRemove={onRemove}
                    formatNumber={formatNumber}
                  />
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

