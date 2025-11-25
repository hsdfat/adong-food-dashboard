'use client'

import React from 'react'
import { Card, CardBody, Row, Col, FormGroup, FormLabel, FormControl, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'

interface OrderHeaderFormProps {
  orderId: string;
  ngayLen: string;
  tenBep: string;
  ghiChu: string;
  onOrderIdChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onKitchenSelect: () => void;
  onNoteChange: (value: string) => void;
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
  const dict = useDictionary()
  
  return (
    <Card className="mb-4">
      <CardBody>
        <h5 className="mb-3">{dict.orders?.labels?.order_information || 'Order Information'}</h5>
        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <FormLabel>{(dict.orders as any)?.form_labels?.order_id || 'Order ID'} *</FormLabel>
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
              <FormLabel>{(dict.orders as any)?.form_labels?.order_date || 'Order Date'} *</FormLabel>
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
              <FormLabel>{(dict.orders as any)?.form_labels?.kitchen_required || 'Kitchen *'}</FormLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  value={tenBep}
                  placeholder={dict.orders?.select_kitchen || 'Select Kitchen'}
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
              <FormLabel>{(dict.orders as any)?.form_labels?.notes || 'Notes'}</FormLabel>
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

