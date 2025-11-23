'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Alert,
  FormControl,
  InputGroup,
  Card,
  CardBody,
  CardHeader,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import MasterDataTable, { TableColumn, TableAction } from '@/components/Common/MasterDataTable/MasterDataTable'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'
import LoadingState from '@/components/Common/LoadingState/LoadingState'
import ActionButton from '@/components/Common/ActionButton/ActionButton'

export interface MasterDataListPageProps<T> {
  title: string
  addNewLabel: string
  createPath: string
  searchPlaceholder?: string
  emptyMessage?: string
  loadingMessage?: string
  columns: TableColumn[]
  actions: TableAction[]
  data: ResourceCollection<T> | null
  loading: boolean
  error: string
  onLoadData: (page: number, perPage: number, search: string) => Promise<void>
  onDelete?: (id: string, item: T) => Promise<void>
  onError?: (error: string) => void
  getItemName?: (item: T) => string
  getItemId?: (item: T) => string
  basePath: string
  dictKey?: string
  inlineActionsColumn?: string // Column key where actions should be rendered inline (e.g., 'id' or 'name')
}

function MasterDataListPage<T extends Record<string, any>>({
  title,
  addNewLabel,
  createPath,
  searchPlaceholder,
  emptyMessage = 'No data found',
  loadingMessage,
  columns,
  actions,
  data,
  loading,
  error,
  onLoadData,
  onDelete,
  onError,
  getItemName = (item: T) => item.name || item.id || 'item',
  getItemId = (item: T) => item.id || item.key || '',
  basePath,
  dictKey,
  inlineActionsColumn,
}: MasterDataListPageProps<T>) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const dict = useDictionary()
  const { addNotification } = useNotification()

  // Get query params
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('per_page') || '10')
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setSearchQuery(search)
    onLoadData(page, perPage, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search])

  const handleDelete = async (id: string, item: T) => {
    const itemName = getItemName(item)
    const dictSection = dictKey ? (dict as any)[dictKey] : null
    const confirmMessage = dictSection?.confirm_delete || `Are you sure you want to delete ${itemName}?`
    
    if (!confirm(confirmMessage)) {
      return
    }

    if (onDelete) {
      try {
        await onDelete(id, item)
        addNotification({
          type: 'success',
          title: 'Success',
          message: `${itemName} has been deleted successfully.`,
        })
        onLoadData(page, perPage, search)
      } catch (err) {
        const errorMsg = dictSection?.error_delete || `Failed to delete ${itemName}. Please try again.`
        addNotification({
          type: 'error',
          title: 'Error',
          message: errorMsg,
        })
        onError?.(errorMsg)
        console.error(err)
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1') // Reset to first page

    if (searchQuery.trim()) {
      newSearchParams.set('search', searchQuery.trim())
    } else {
      newSearchParams.delete('search')
    }

    router.push(`${basePath}?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    router.push(`${basePath}?${newSearchParams.toString()}`)
  }

  const handleActionSuccess = (action: string, row: any) => {
    const itemName = getItemName(row)
    if (action === 'Edit') {
      addNotification({
        type: 'info',
        title: 'Navigation',
        message: `Redirecting to edit ${itemName}...`,
      })
    }
  }

  const handleActionError = (action: string, row: any, error: any) => {
    const itemName = getItemName(row)
    addNotification({
      type: 'error',
      title: 'Action Failed',
      message: `Failed to ${action.toLowerCase()} ${itemName}. Please try again.`,
    })
  }

  // Enhance actions with delete handler if onDelete is provided
  const enhancedActions = actions.map(action => {
    // Only auto-handle delete if onDelete is provided and action is delete
    if (onDelete && (action.label === 'Delete' || action.variant === 'danger')) {
      return {
        ...action,
        onClick: async (row: T) => {
          const id = getItemId(row)
          await handleDelete(id, row)
        },
      }
    }
    return action
  })

  if (loading) {
    return (
      <Card>
        <CardBody>
          <LoadingState message={loadingMessage || 'Loading...'} />
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{title}</h4>
        <ActionButton
          variant="primary"
          size="sm"
          icon={faPlus}
          onClick={() => router.push(createPath)}
        >
          {addNewLabel}
        </ActionButton>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert variant="danger" dismissible onClose={() => onError?.('')}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-3">
          <InputGroup>
            <FormControl
              type="text"
              placeholder={searchPlaceholder || 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ActionButton
              variant="primary"
              type="submit"
              icon={faSearch}
            >
              {dict.common?.search || 'Search'}
            </ActionButton>
            {search && (
              <Button variant="secondary" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </InputGroup>
        </form>

        {/* Table */}
        <MasterDataTable
          data={data?.data || []}
          columns={columns}
          actions={enhancedActions}
          loading={loading}
          emptyMessage={emptyMessage}
          onActionSuccess={handleActionSuccess}
          onActionError={handleActionError}
          inlineActionsColumn={inlineActionsColumn}
        />

        {/* Pagination */}
        {data && data.meta && <Pagination meta={data.meta} />}
      </CardBody>
    </Card>
  )
}

export default MasterDataListPage

