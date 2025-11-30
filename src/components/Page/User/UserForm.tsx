'use client'

import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
  FormSelect,
  FormCheck,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { userApi } from '@/services'
import {
  User,
  CreateUserInput,
  UpdateUserInput,
} from '@/models/user'
import useDictionary from '@/locales/dictionary-hook'
import { generateId } from '@/utils/id-generator'

interface UserFormProps {
  user?: User;
  isEdit?: boolean;
}

export default function UserForm({
  user,
  isEdit = false,
}: UserFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    userId: user?.userId || '',
    userName: user?.userName || '',
    password: '',
    fullName: user?.fullName || '',
    role: user?.role || 'user',
    email: user?.email || '',
    phone: user?.phone || '',
    active: user?.active !== undefined ? user.active : true,
  })

  // Auto-generate ID for new users
  useEffect(() => {
    if (!isEdit && !user && !formData.userId) {
      setFormData((prev) => ({
        ...prev,
        userId: generateId('USR'),
      }))
    }
  }, [isEdit, user, formData.userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && user) {
        const updateData: UpdateUserInput = {
          userName: formData.userName,
          fullName: formData.fullName,
          role: formData.role,
          email: formData.email,
          phone: formData.phone,
          active: formData.active,
        }
        if (formData.password) {
          updateData.password = formData.password
        }
        await userApi.update(user.userId, updateData)
        setSuccess(dict.users?.success_update || 'User updated successfully')
      } else {
        if (!formData.password) {
          setError('Password is required for new users')
          setLoading(false)
          return
        }
        const createData: CreateUserInput = {
          userId: formData.userId,
          userName: formData.userName,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
          email: formData.email,
          phone: formData.phone,
          active: formData.active,
        }
        await userApi.create(createData)
        setSuccess(dict.users?.success_create || 'User created successfully')
      }

      setTimeout(() => {
        router.push('/users')
      }, 1500)
    } catch (err) {
      setError(
        isEdit
          ? (dict.users?.error_update || 'Failed to update user')
          : (dict.users?.error_create || 'Failed to create user'),
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <FormGroup className="mb-3">
        <FormLabel>{dict.users?.id || 'User ID'}</FormLabel>
        <FormControl
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          disabled={isEdit}
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>{dict.users?.user_name || 'Username'} *</FormLabel>
        <FormControl
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>
          {dict.users?.password || 'Password'} {isEdit ? '(leave blank to keep current)' : '*'}
        </FormLabel>
        <FormControl
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEdit}
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>{dict.users?.full_name || 'Full Name'} *</FormLabel>
        <FormControl
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>{dict.users?.role || 'Role'} *</FormLabel>
        <FormSelect
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="user">{dict.users?.roles?.user || 'User'}</option>
          <option value="Admin">{dict.users?.roles?.admin || 'Admin'}</option>
          <option value="moderator">{dict.users?.roles?.moderator || 'Moderator'}</option>
        </FormSelect>
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>{dict.users?.email || 'Email'}</FormLabel>
        <FormControl
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>{dict.users?.phone || 'Phone'}</FormLabel>
        <FormControl
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormCheck
          type="checkbox"
          name="active"
          label={dict.users?.active || 'Active'}
          checked={formData.active}
          onChange={handleChange}
        />
      </FormGroup>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading
            ? (dict.action?.saving || 'Saving...')
            : (dict.action?.save || 'Save')}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => router.push('/users')}
          disabled={loading}
        >
          {dict.action?.cancel || 'Cancel'}
        </Button>
      </div>
    </Form>
  )
}
