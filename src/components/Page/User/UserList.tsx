'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { userApi } from '@/services'
import { User } from '@/models'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'
import { Badge } from 'react-bootstrap'

export default function UserList() {
  const [usersData, setUsersData] =
    useState<ResourceCollection<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  const loadUsers = async (
    page: number,
    perPage: number,
    search: string,
  ) => {
    try {
      setLoading(true)
      setError('')

      // Build query string
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('per_page', perPage.toString())
      if (search) {
        params.append('search', search)
      }

      // Call API with query parameters
      const data = await userApi.getAll(`?${params.toString()}`)
      setUsersData(data)
    } catch (err) {
      setError(dict.users?.error_load || 'Failed to load users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, user: User) => {
    await userApi.delete(id)
  }

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'userId',
      label: dict.users?.id || 'ID',
      align: 'left',
      priority: true,
    },
    {
      key: 'userName',
      label: dict.users?.user_name || 'Username',
      align: 'left',
      priority: true,
    },
    {
      key: 'fullName',
      label: dict.users?.full_name || 'Full Name',
      align: 'left',
      priority: true,
    },
    {
      key: 'role',
      label: dict.users?.role || 'Role',
      align: 'center',
      render: (value) => {
        const role = value as string
        const roleColors: Record<string, string> = {
          Admin: 'danger',
          user: 'primary',
          moderator: 'warning',
        }
        return (
          <Badge bg={roleColors[role] || 'secondary'}>
            {dict.users?.roles?.[role.toLowerCase() as keyof typeof dict.users.roles] || role}
          </Badge>
        )
      },
    },
    {
      key: 'email',
      label: dict.users?.email || 'Email',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'phone',
      label: dict.users?.phone || 'Phone',
      align: 'left',
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'active',
      label: dict.users?.status || 'Status',
      align: 'center',
      render: (value) => {
        const isActive = value as boolean
        return (
          <Badge bg={isActive ? 'success' : 'secondary'}>
            {isActive ? (dict.users?.active || 'Active') : (dict.users?.inactive || 'Inactive')}
          </Badge>
        )
      },
    },
    {
      key: 'createdDate',
      label: dict.users?.created_date || 'Created Date',
      align: 'center',
      render: (value) => value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.edit || 'Edit',
      onClick: async (user) => {
        const item = user as User
        router.push(`/users/${item.userId}/edit`)
      },
      variant: 'warning',
    },
    {
      label: dict.action?.delete || 'Delete',
      onClick: handleDelete,
      variant: 'danger',
      confirmMessage: dict.users?.confirm_delete,
    },
  ]

  return (
    <MasterDataListPage<User>
      title={dict.users?.title || 'User Management'}
      addNewLabel={dict.users?.add_new || 'Add New User'}
      createPath="/users/create"
      searchPlaceholder="Search users..."
      emptyMessage={dict.users?.no_data || 'No users found'}
      loadingMessage={dict.users?.loading || 'Loading...'}
      columns={columns}
      actions={actions}
      data={usersData}
      loading={loading}
      error={error}
      onLoadData={loadUsers}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(user) => user.fullName || user.userName || 'user'}
      getItemId={(user) => user.userId}
      basePath="/users"
      dictKey="users"
      actionsColumnPosition="fullName"
    />
  )
}
