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
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: unknown, index: number) => React.ReactNode;
  className?: string;
  priority?: boolean; // Mark column as priority (shown on mobile with full width)
}

export interface TableAction {
  label: string;
  onClick: (row: unknown, index: number) => Promise<void> | void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  loadingLabel?: string;
}

export interface MasterDataTableProps {
  data: unknown[];
  columns: TableColumn[];
  actions?: TableAction[];
  loading?: boolean;
  emptyMessage?: string;
  hover?: boolean;
  responsive?: boolean;
  bordered?: boolean;
  className?: string;
  onActionSuccess?: (action: string, row: unknown) => void;
  onActionError?: (action: string, row: unknown, error: unknown) => void;
  showActionLoading?: boolean;
  actionsColumnPosition?: string; // Column key after which the Actions column should be placed (e.g., 'id' or 'name')
  actionsColumnLabel?: string; // Translation for the Actions column header
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
  actionsColumnPosition,
  actionsColumnLabel = 'Actions',
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

  const handleActionClick = async (
    action: TableAction,
    row: unknown,
    index: number,
  ) => {
    const rowWithId = row as { id?: string | number; key?: string | number };
    const actionKey = `${action.label}-${rowWithId.id || rowWithId.key || index}`

    if (loadingActions.has(actionKey)) {
      return
    }

    try {
      setLoadingActions((prev) => new Set(prev).add(actionKey))
      await action.onClick(row, index)
      onActionSuccess?.(action.label, row)
    } catch (error) {
      onActionError?.(action.label, row, error)
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }

  const renderCell = (column: TableColumn, row: unknown, index: number) => {
    const rowRecord = row as Record<string, unknown>;
    const value = rowRecord[column.key]

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
      // Convert unknown value to string for display
      cellContent = String(value)
    }

    return cellContent
  }


  const renderActions = (row: unknown, index: number) => {
    if (!actions || actions.length === 0) {
      return null
    }

    const rowWithId = row as { id?: string | number; key?: string | number };
    const rowId = rowWithId.id || rowWithId.key || index;

    // Always use dropdown with 3 dots
    return (
      <div className="text-center">
        <Dropdown align="end">
          <DropdownToggle
            as="button"
            className="btn btn-transparent btn-sm p-1"
            bsPrefix="none"
            disabled={Array.from(loadingActions).some((key) =>
              key.includes(`-${rowId}`),
            )}
            title="Actions"
            aria-label="Actions"
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </DropdownToggle>
          <DropdownMenu>
            {actions.map((action, actionIndex) => {
              const actionKey = `${action.label}-${rowId}`
              const isLoading =
                showActionLoading && loadingActions.has(actionKey)

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
                  {action.icon && !isLoading && (
                    <span className="me-2">{action.icon}</span>
                  )}
                  {isLoading
                    ? action.loadingLabel || 'Loading...'
                    : action.label}
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

  // Find the index where Actions column should be inserted
  const getActionsColumnIndex = () => {
    if (!actions || actions.length === 0) {
      return -1
    }
    if (!actionsColumnPosition) {
      return columns.length // Default: at the end
    }
    const positionIndex = columns.findIndex(
      (col) => col.key === actionsColumnPosition,
    )
    return positionIndex >= 0 ? positionIndex + 1 : columns.length
  }

  const actionsColumnIndex = getActionsColumnIndex()

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
            <td
              colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)}
              className="text-center py-4"
            >
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
          {columns.map((column, colIndex) => {
            const shouldInsertActionsBefore =
              actionsColumnIndex === colIndex && actions && actions.length > 0

            return (
              <React.Fragment key={column.key}>
                {shouldInsertActionsBefore && (
                  <th
                    className="text-center table-non-priority-column table-actions-column"
                    style={{ width: '60px' }}
                  >
                    {actionsColumnLabel}
                  </th>
                )}
                <th
                  className={`${getAlignmentClass(column.align)} ${column.className || ''} ${column.priority ? 'table-priority-column' : 'table-non-priority-column'}`}
                >
                  {column.label}
                </th>
              </React.Fragment>
            )
          })}
          {actionsColumnIndex === columns.length &&
            actions &&
            actions.length > 0 && (
              <th
                className="text-center table-non-priority-column table-actions-column"
                style={{ width: '60px' }}
              >
                {actionsColumnLabel}
              </th>
            )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const rowWithId = row as { id?: string | number; key?: string | number };
          const rowKey = rowWithId.id || rowWithId.key || index;
          return (
          <tr key={rowKey}>
            {columns.map((column, colIndex) => {
              const shouldInsertActionsBefore =
                actionsColumnIndex === colIndex &&
                actions &&
                actions.length > 0

              return (
                <React.Fragment key={column.key}>
                  {shouldInsertActionsBefore && (
                    <td
                      className="text-center table-non-priority-column table-actions-column"
                      style={{ width: '60px' }}
                    >
                      {renderActions(row, index)}
                    </td>
                  )}
                  <td
                    className={`${getAlignmentClass(column.align)} ${column.className || ''} ${column.priority ? 'table-priority-column' : 'table-non-priority-column'}`}
                  >
                    {renderCell(column, row, index)}
                  </td>
                </React.Fragment>
              )
            })}
            {actionsColumnIndex === columns.length &&
              actions &&
              actions.length > 0 && (
                <td
                  className="text-center table-non-priority-column table-actions-column"
                  style={{ width: '60px' }}
                >
                  {renderActions(row, index)}
                </td>
              )}
          </tr>
          );
        })}
      </tbody>
    </Table>
  )
}

export default MasterDataTable
