'use client'

import React, { useState } from 'react'
import {
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Spinner,
  ButtonGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any, index: number) => React.ReactNode
  className?: string
  priority?: boolean // Mark column as priority (shown on mobile with full width)
}

export interface TableAction {
  label: string
  onClick: (row: any, index: number) => Promise<void> | void
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info'
  icon?: React.ReactNode
  loadingLabel?: string
}

export interface MasterDataTableProps {
  data: any[]
  columns: TableColumn[]
  actions?: TableAction[]
  loading?: boolean
  emptyMessage?: string
  hover?: boolean
  responsive?: boolean
  bordered?: boolean
  className?: string
  onActionSuccess?: (action: string, row: any) => void
  onActionError?: (action: string, row: any, error: any) => void
  showActionLoading?: boolean
  inlineActionsColumn?: string // Column key where actions should be rendered inline (e.g., 'id' or 'name')
}

const MasterDataTable: React.FC<MasterDataTableProps> = ({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = 'No data available',
  hover = true,
  responsive = true,
  bordered = false,
  className = '',
  onActionSuccess,
  onActionError,
  showActionLoading = true,
  inlineActionsColumn,
}) => {
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set())

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-end'
      default:
        return 'text-start'
    }
  }

  const handleActionClick = async (action: TableAction, row: any, index: number) => {
    const actionKey = `${action.label}-${row.id || row.key || index}`
    
    if (loadingActions.has(actionKey)) {
      return
    }

    try {
      setLoadingActions(prev => new Set(prev).add(actionKey))
      await action.onClick(row, index)
      onActionSuccess?.(action.label, row)
    } catch (error) {
      onActionError?.(action.label, row, error)
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }

  const renderCell = (column: TableColumn, row: any, index: number) => {
    const value = row[column.key]
    const isInlineActionsColumn = inlineActionsColumn === column.key && actions && actions.length > 0
    
    let cellContent: React.ReactNode
    
    if (column.render) {
      cellContent = column.render(value, row, index)
    } else if (value === null || value === undefined || value === '') {
      cellContent = '-'
    } else if (typeof value === 'boolean') {
      cellContent = (
        <Badge bg={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    } else if (value instanceof Date) {
      cellContent = value.toLocaleDateString()
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      cellContent = new Date(value).toLocaleDateString()
    } else {
      cellContent = value
    }

    // If this is the inline actions column, wrap content with actions
    if (isInlineActionsColumn) {
      return (
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">{cellContent}</div>
          <div className="ms-2 flex-shrink-0">
            {renderInlineActions(row, index)}
          </div>
        </div>
      )
    }

    return cellContent
  }

  const renderInlineActions = (row: any, index: number) => {
    if (!actions || actions.length === 0) {
      return null
    }

    // For inline actions, prefer icon buttons for better UX
    if (actions.length === 1) {
      const action = actions[0]
      const actionKey = `${action.label}-${row.id || row.key || index}`
      const isLoading = showActionLoading && loadingActions.has(actionKey)
      
      // Default icon based on variant
      const defaultIcon = action.variant === 'danger' ? faTrash : faEdit
      
      return (
        <button
          className={`btn btn-sm btn-${action.variant || 'primary'}`}
          onClick={() => handleActionClick(action, row, index)}
          disabled={isLoading}
          title={isLoading ? (action.loadingLabel || 'Loading...') : action.label}
          aria-label={isLoading ? (action.loadingLabel || 'Loading...') : action.label}
        >
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            action.icon || <FontAwesomeIcon icon={defaultIcon} />
          )}
        </button>
      )
    }

    // For multiple actions, show as button group with icons
    if (actions.length <= 3) {
      return (
        <ButtonGroup size="sm">
          {actions.map((action, actionIndex) => {
            const actionKey = `${action.label}-${row.id || row.key || index}`
            const isLoading = showActionLoading && loadingActions.has(actionKey)
            
            // Default icon based on variant
            const defaultIcon = action.variant === 'danger' ? faTrash : faEdit
            
            return (
              <button
                key={actionIndex}
                className={`btn btn-${action.variant || 'primary'}`}
                onClick={() => handleActionClick(action, row, index)}
                disabled={isLoading}
                title={isLoading ? (action.loadingLabel || 'Loading...') : action.label}
                aria-label={isLoading ? (action.loadingLabel || 'Loading...') : action.label}
              >
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  action.icon || <FontAwesomeIcon icon={defaultIcon} />
                )}
              </button>
            )
          })}
        </ButtonGroup>
      )
    }

    // For many actions, use dropdown
    return (
      <Dropdown align="end">
        <DropdownToggle
          as="button"
          className="btn btn-transparent btn-sm p-1"
          bsPrefix="none"
          disabled={Array.from(loadingActions).some(key => 
            key.includes(`-${row.id || row.key || index}`)
          )}
          title="More actions"
          aria-label="More actions"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </DropdownToggle>
        <DropdownMenu>
          {actions.map((action, actionIndex) => {
            const actionKey = `${action.label}-${row.id || row.key || index}`
            const isLoading = showActionLoading && loadingActions.has(actionKey)
            
            return (
              <DropdownItem
                key={actionIndex}
                onClick={() => handleActionClick(action, row, index)}
                className={action.variant === 'danger' ? 'text-danger' : ''}
                disabled={isLoading}
              >
                {isLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                )}
                {action.icon && !isLoading && <span className="me-2">{action.icon}</span>}
                {isLoading ? (action.loadingLabel || 'Loading...') : action.label}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </Dropdown>
    )
  }

  const renderActions = (row: any, index: number) => {
    if (!actions || actions.length === 0) {
      return null
    }

    if (actions.length === 1) {
      const action = actions[0]
      const actionKey = `${action.label}-${row.id || row.key || index}`
      const isLoading = showActionLoading && loadingActions.has(actionKey)
      
      return (
        <div className="text-end">
          <button
            className={`btn btn-sm btn-${action.variant || 'primary'}`}
            onClick={() => handleActionClick(action, row, index)}
            disabled={isLoading}
            title={isLoading ? (action.loadingLabel || 'Loading...') : action.label}
            aria-label={isLoading ? (action.loadingLabel || 'Loading...') : action.label}
          >
            {isLoading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
            )}
            {action.icon && !isLoading && <span className="me-1">{action.icon}</span>}
            {isLoading ? (action.loadingLabel || 'Loading...') : action.label}
          </button>
        </div>
      )
    }

    return (
      <div className="text-end">
        <Dropdown align="end">
          <DropdownToggle
            as="button"
            className="btn btn-transparent btn-sm p-0"
            bsPrefix="none"
            disabled={Array.from(loadingActions).some(key => 
              key.includes(`-${row.id || row.key || index}`)
            )}
            title="More actions"
            aria-label="More actions"
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </DropdownToggle>
          <DropdownMenu>
            {actions.map((action, actionIndex) => {
              const actionKey = `${action.label}-${row.id || row.key || index}`
              const isLoading = showActionLoading && loadingActions.has(actionKey)
              
              return (
                <DropdownItem
                  key={actionIndex}
                  onClick={() => handleActionClick(action, row, index)}
                  className={action.variant === 'danger' ? 'text-danger' : ''}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                  )}
                  {action.icon && !isLoading && <span className="me-2">{action.icon}</span>}
                  {isLoading ? (action.loadingLabel || 'Loading...') : action.label}
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        Loading...
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Table
        responsive={responsive}
        hover={hover}
        bordered={bordered}
        className={className}
      >
        <tbody>
          <tr>
            <td colSpan={columns.length + (actions && !inlineActionsColumn ? 1 : 0)} className="text-center py-4">
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      </Table>
    )
  }

  return (
    <Table
      responsive={responsive}
      hover={hover}
      bordered={bordered}
      className={className}
    >
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`${getAlignmentClass(column.align)} ${column.className || ''} ${column.priority ? 'table-priority-column' : 'table-non-priority-column'}`}
            >
              {column.label}
            </th>
          ))}
          {actions && actions.length > 0 && !inlineActionsColumn && (
            <th className="text-end table-non-priority-column" style={{ width: '60px' }}>
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id || row.key || index}>
            {columns.map((column) => (
              <td
                key={column.key}
                className={`${getAlignmentClass(column.align)} ${column.className || ''} ${column.priority ? 'table-priority-column' : 'table-non-priority-column'}`}
              >
                {renderCell(column, row, index)}
              </td>
            ))}
            {actions && actions.length > 0 && !inlineActionsColumn && (
              <td className="text-end table-non-priority-column" style={{ width: '60px' }}>
                {renderActions(row, index)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default MasterDataTable
