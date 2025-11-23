'use client'

import React from 'react'
import { Card, CardBody, Row, Col, FormGroup, FormLabel, FormControl, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

interface OrderHeaderFormProps {
  orderId: string
  ngayLen: string
  tenBep: string
  ghiChu: string
  onOrderIdChange: (value: string) => void
  onDateChange: (value: string) => void
  onKitchenSelect: () => void
  onNoteChange: (value: string) => void
}

export default function OrderHeaderForm({
  orderId,
  ngayLen,
  tenBep,
  ghiChu,
  onOrderIdChange,
  onDateChange,
  onKitchenSelect,
  onNoteChange,
}: OrderHeaderFormProps) {
  return (
    <Card className="mb-4">
      <CardBody>
        <h5 className="mb-3">Thông tin phiếu lên đơn</h5>
        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Mã phiếu lên đơn *</FormLabel>
              <FormControl
                type="text"
                value={orderId}
                onChange={(e) => onOrderIdChange(e.target.value)}
                required
                disabled
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Ngày lên đơn *</FormLabel>
              <FormControl
                type="date"
                value={ngayLen}
                onChange={(e) => onDateChange(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Bếp *</FormLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  value={tenBep}
                  placeholder="Chọn bếp..."
                  readOnly
                  required
                />
                <Button variant="outline-primary" onClick={onKitchenSelect}>
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>Ghi chú</FormLabel>
              <FormControl
                as="textarea"
                rows={1}
                value={ghiChu}
                onChange={(e) => onNoteChange(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

