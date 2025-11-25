'use client'

import React from 'react'
import { Form, Row, Col, FormGroup, FormLabel, FormControl, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter, faCalendar } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'

interface FilterState {
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
  showFilters: boolean;
}

interface OrderFiltersProps {
  filters: FilterState;
  hasActiveFilters: boolean;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onSearch: (e: React.FormEvent) => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
}

export default function OrderFilters({
  filters,
  hasActiveFilters,
  onFilterChange,
  onSearch,
  onClearFilters,
  onToggleFilters,
}: OrderFiltersProps) {
  const dict = useDictionary()
  
  return (
    <Form onSubmit={onSearch} className="mb-4">
      <Row className="g-2 mb-2">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small mb-1">{(dict.orders as any)?.filter_labels?.search || 'Search'}</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder={(dict.orders as any)?.filter_labels?.search_placeholder || 'Search orders...'}
                value={filters.searchQuery}
                onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end gap-2">
          <Button variant="outline-secondary" onClick={onToggleFilters} className="mb-0">
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            {filters.showFilters ? ((dict.orders as any)?.filter_labels?.hide_filters || 'Hide Filters') : ((dict.orders as any)?.filter_labels?.show_filters || 'Show Filters')}
          </Button>
          {hasActiveFilters && (
            <Button variant="outline-secondary" onClick={onClearFilters} className="mb-0">
              {(dict.orders as any)?.filter_labels?.clear_filters || 'Clear Filters'}
            </Button>
          )}
          <Button variant="primary" type="submit" className="mb-0">
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            {(dict.orders as any)?.filter_labels?.search || 'Search'}
          </Button>
        </Col>
      </Row>

      {filters.showFilters && (
        <Row className="g-2">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small mb-1">
                <FontAwesomeIcon icon={faCalendar} className="me-1" />
                {(dict.orders as any)?.filter_labels?.date_from || 'Date From'}
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
                {(dict.orders as any)?.filter_labels?.date_to || 'Date To'}
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

