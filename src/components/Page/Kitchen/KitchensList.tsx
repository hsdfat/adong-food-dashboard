'use client'

import React, { useEffect, useState } from 'react'
import { Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { kitchenApi } from '@/services'
import { Kitchen } from '@/models'
import useDictionary from '@/locales/dictionary-hook'

export default function KitchensList() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadKitchens()
  }, [])

  const loadKitchens = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await kitchenApi.getAll()
      setKitchens(data)
    } catch (err) {
      setError(dict.kitchens?.error_load || 'Failed to load kitchens')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(dict.kitchens?.confirm_delete || 'Are you sure you want to delete this kitchen?')) {
      return
    }

    try {
      await kitchenApi.delete(id)
      await loadKitchens()
    } catch (err) {
      setError(dict.kitchens?.error_delete || 'Failed to delete kitchen')
      console.error(err)
    }
  }

  if (loading) {
    return <div>{dict.kitchens?.loading || 'Loading...'}</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button variant="success" onClick={() => router.push('/kitchens/create')}>
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' '}{dict.kitchens?.add_new || 'Add New Kitchen'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>{dict.kitchens?.id || 'ID'}</th>
            <th>{dict.kitchens?.name || 'Kitchen Name'}</th>
            <th>{dict.kitchens?.address || 'Address'}</th>
            <th>{dict.kitchens?.phone || 'Phone'}</th>
            <th>{dict.kitchens?.status || 'Status'}</th>
            <th>{dict.ingredients?.created_date || 'Created Date'}</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {kitchens.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                {dict.kitchens?.no_data || 'No kitchens found'}
              </td>
            </tr>
          ) : (
            kitchens.map((kitchen) => (
              <tr key={kitchen.kitchenId}>
                <td>{kitchen.kitchenId}</td>
                <td>{kitchen.kitchenName}</td>
                <td>{kitchen.address || '-'}</td>
                <td>{kitchen.phone || '-'}</td>
                <td>
                  <Badge bg={kitchen.active ? 'success' : 'secondary'}>
                    {kitchen.active ? (dict.common?.active || 'Active') : (dict.common?.inactive || 'Inactive')}
                  </Badge>
                </td>
                <td>{new Date(kitchen.createdDate).toLocaleDateString()}</td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${kitchen.kitchenId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem onClick={() => router.push(`/kitchens/${kitchen.kitchenId}/edit`)}>
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(kitchen.kitchenId)}
                      >
                        {dict.action.delete}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}