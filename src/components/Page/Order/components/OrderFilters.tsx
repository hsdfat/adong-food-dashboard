'use client'

import React from 'react'
import { Form, Row, Col, FormGroup, FormLabel, FormControl, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter, faCalendar } from '@fortawesome/free-solid-svg-icons'

interface FilterState {
  searchQuery: string
  dateFrom: string
  dateTo: string
  showFilters: boolean
}

interface OrderFiltersProps {
  filters: FilterState
  hasActiveFilters: boolean
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  onSearch: (e: React.FormEvent) => void
  onClearFilters: () => void
  onToggleFilters: () => void
}

export default function OrderFilters({
  filters,
  hasActiveFilters,
  onFilterChange,
  onSearch,
  onClearFilters,
  onToggleFilters,
}: OrderFiltersProps) {
  return (
    <Form onSubmit={onSearch} className="mb-4">
      <Row className="g-2 mb-2">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small mb-1">Tìm kiếm</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Tìm theo mã đơn, bếp, người tạo..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end gap-2">
          <Button variant="outline-secondary" onClick={onToggleFilters} className="mb-0">
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            {filters.showFilters ? 'Ẩn' : 'Hiện'} bộ lọc
          </Button>
          {hasActiveFilters && (
            <Button variant="outline-secondary" onClick={onClearFilters} className="mb-0">
              Xóa bộ lọc
            </Button>
          )}
          <Button variant="primary" type="submit" className="mb-0">
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Tìm kiếm
          </Button>
        </Col>
      </Row>

      {filters.showFilters && (
        <Row className="g-2">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small mb-1">
                <FontAwesomeIcon icon={faCalendar} className="me-1" />
                Từ ngày
              </Form.Label>
              <FormControl
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small mb-1">
                <FontAwesomeIcon icon={faCalendar} className="me-1" />
                Đến ngày
              </Form.Label>
              <FormControl
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
    </Form>
  )
}

