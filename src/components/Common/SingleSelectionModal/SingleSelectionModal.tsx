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
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export interface SingleSelectionModalItem {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
  [key: string]: unknown; // Allow additional properties
}

export interface SingleSelectionModalProps<T extends SingleSelectionModalItem> {
  show: boolean;
  onHide: () => void;
  title: string;
  items: T[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedId?: string;
  onSelect: (item: T) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  closeLabel?: string;
  getItemName?: (item: T) => string;
  getItemSubtitle?: (item: T) => string;
  getItemBadge?: (item: T) => string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

export default function SingleSelectionModal<
  T extends SingleSelectionModalItem,
>({
  show,
  onHide,
  title,
  items,
  searchValue,
  onSearchChange,
  selectedId,
  onSelect,
  searchPlaceholder = 'Tìm kiếm...',
  emptyMessage = 'Không tìm thấy kết quả',
  closeLabel = 'Đóng',
  getItemName = (item) => item.name,
  getItemSubtitle = (item) => item.subtitle || '',
  getItemBadge = (item) => item.badge || '',
  renderItem,
  size = 'lg',
}: SingleSelectionModalProps<T>) {
  const handleSelect = (item: T) => {
    onSelect(item)
    onHide()
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

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {items.length === 0 ? (
            <Alert variant="info">{emptyMessage}</Alert>
          ) : (
            <div className="list-group">
              {items.map((item) => {
                const isSelected = selectedId === item.id
                const itemName = getItemName(item)
                const itemSubtitle = getItemSubtitle(item)
                const itemBadge = getItemBadge(item)

                if (renderItem) {
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(item);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ cursor: 'pointer' }}
                    >
                      {renderItem(item, isSelected)}
                    </div>
                  )
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelect(item)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{itemName}</h6>
                        {itemSubtitle && (
                          <small
                            className={
                              isSelected ? 'text-white-50' : 'text-muted'
                            }
                          >
                            {itemSubtitle}
                          </small>
                        )}
                      </div>
                      {itemBadge && (
                        <Badge
                          bg={isSelected ? 'light' : 'primary'}
                          text={isSelected ? 'dark' : 'white'}
                        >
                          {itemBadge}
                        </Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {closeLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
