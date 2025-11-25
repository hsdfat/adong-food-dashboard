'use client'

import React from 'react'
import { Card, CardBody, Button, Alert, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'
import SupplementaryFoodRow from './SupplementaryFoodRow'

interface SupplementaryFoodItem {
  id: string;
  nguyenLieuId: string;
  tenNguyenLieu: string;
  donViTinh: string;
  dinhMuc: number;
  soSuat: number;
  soLuong: number;
  ghiChu?: string;
}

interface SupplementaryFoodListProps {
  items: SupplementaryFoodItem[];
  onAdd: () => void;
  onDinhMucChange: (id: string, dinhMuc: number) => void;
  onSoSuatChange: (id: string, soSuat: number) => void;
  onNoteChange: (id: string, note: string) => void;
  onRemove: (id: string) => void;
  formatNumber: (num: number) => string;
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
  const dict = useDictionary()
  
  return (
    <Card className="mb-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{dict.orders?.labels?.supplementary_foods || 'Supplementary Foods'}</h5>
          <Button variant="success" onClick={onAdd}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {dict.action?.add || 'Add'} {dict.orders?.labels?.supplementary || 'Supplementary'}
          </Button>
        </div>

        {items.length === 0 ? (
          <Alert variant="info">
            {dict.orders?.labels?.no_ingredients_text || 'No ingredients'}. {dict.action?.add || 'Add'} {dict.orders?.labels?.supplementary || 'supplementary'} {dict.common?.to || 'to'} {dict.common?.add || 'add'} {dict.common?.new || 'new'}.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>{dict.orders?.table_headers?.ingredient || 'Ingredient'}</th>
                  <th style={{ width: '15%' }}>{dict.orders?.columns?.standard_per_portion || 'Standard/Portion'}</th>
                  <th style={{ width: '10%' }}>{dict.orders?.table_headers?.portions || 'Portions'}</th>
                  <th style={{ width: '15%' }}>{dict.orders?.table_headers?.quantity || 'Quantity'}</th>
                  <th style={{ width: '20%' }}>{dict.orders?.table_headers?.note || 'Note'}</th>
                  <th style={{ width: '10%' }}>{dict.common?.actions || 'Actions'}</th>
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

