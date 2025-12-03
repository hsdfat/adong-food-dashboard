'use client'

import React from 'react'
import {
  Modal,
  Button,
  FormGroup,
  FormControl,
  InputGroup,
  Alert,
  Badge,
  FormCheck,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export interface MultiSelectionModalItem {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
  [key: string]: unknown; // Allow additional properties
}

export interface MultiSelectionModalProps<T extends MultiSelectionModalItem> {
  show: boolean;
  onHide: () => void;
  title: string;
  items: T[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedIds: string[];
  onSelect: (itemId: string, checked: boolean) => void;
  onConfirm: () => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  closeLabel?: string;
  confirmLabel?: string;
  selectedCountLabel?: string;
  getItemName?: (item: T) => string;
  getItemSubtitle?: (item: T) => string;
  getItemBadge?: (item: T) => string;
  renderItem?: (
    item: T,
    isSelected: boolean,
    onToggle: (checked: boolean) => void,
  ) => React.ReactNode;
  additionalFields?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
  confirmVariant?: string;
  selectedHighlightClass?: string;
}

export default function MultiSelectionModal<T extends MultiSelectionModalItem>({
  show,
  onHide,
  title,
  items,
  searchValue,
  onSearchChange,
  selectedIds,
  onSelect,
  onConfirm,
  searchPlaceholder = 'Tìm kiếm...',
  emptyMessage = 'Không tìm thấy kết quả',
  closeLabel = 'Đóng',
  confirmLabel,
  selectedCountLabel,
  getItemName = (item) => item.name,
  getItemSubtitle = (item) => item.subtitle || '',
  getItemBadge = (item) => item.badge || '',
  renderItem,
  additionalFields,
  size = 'lg',
  confirmVariant = 'primary',
  selectedHighlightClass = 'bg-primary text-white',
}: MultiSelectionModalProps<T>) {
  const selectedCount = selectedIds.length

  const handleToggle = (itemId: string, checked: boolean) => {
    onSelect(itemId, checked)
  }

  return (
    <Modal show={show} onHide={onHide} size={size}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <FormControl
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
        </FormGroup>

        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {items.length === 0 ? (
            <Alert variant="info">{emptyMessage}</Alert>
          ) : (
            <div>
              {items.map((item) => {
                const isSelected = selectedIds.includes(item.id)
                const itemName = getItemName(item)
                const itemSubtitle = getItemSubtitle(item)
                const itemBadge = getItemBadge(item)

                if (renderItem) {
                  return (
                    <div key={item.id}>
                      {renderItem(item, isSelected, (checked) =>
                        handleToggle(item.id, checked),
                      )}
                    </div>
                  )
                }

                return (
                  <div
                    key={item.id}
                    className={`border rounded p-2 mb-2 ${isSelected ? selectedHighlightClass : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <FormCheck
                      type="checkbox"
                      id={`item-${item.id}`}
                      label={
                        <div className="w-100">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div style={{ flex: '0 1 65%', minWidth: 0 }}>
                              <strong className="d-block text-truncate" title={itemName}>{itemName}</strong>
                              <div>
                                <small className={isSelected ? 'text-white-50' : 'text-muted'}>
                                  {item.id}
                                </small>
                              </div>
                              {itemSubtitle && (
                                <div>
                                  <small className={isSelected ? 'text-white-50' : 'text-muted'}>
                                    {itemSubtitle}
                                  </small>
                                </div>
                              )}
                            </div>
                            {itemBadge && (
                              <Badge
                                bg={isSelected ? 'light' : 'secondary'}
                                text={isSelected ? 'dark' : 'white'}
                                className="flex-shrink-0"
                              >
                                {itemBadge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      }
                      checked={isSelected}
                      onChange={(e) => handleToggle(item.id, e.target.checked)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {selectedCount > 0 && (
          <div className="mt-3">
            <Alert variant="success">
              {selectedCountLabel || `Đã chọn ${selectedCount} mục`}
            </Alert>
            {additionalFields}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {closeLabel}
        </Button>
        <Button
          variant={confirmVariant as 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info'}
          onClick={onConfirm}
          disabled={selectedCount === 0}
        >
          {confirmLabel || `Xác nhận ${selectedCount} mục`}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
