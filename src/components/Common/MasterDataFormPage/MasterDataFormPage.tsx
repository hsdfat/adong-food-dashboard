'use client'

import React, { useState, useEffect } from 'react'
import {
  Form,
  Alert,
  Card,
  CardBody,
  CardHeader,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import useDictionary from '@/locales/dictionary-hook'
import SaveButton from '@/components/Common/SaveButton/SaveButton'
import ActionButton from '@/components/Common/ActionButton/ActionButton'

export interface MasterDataFormPageProps {
  title: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel?: () => void
  cancelPath: string
  loading?: boolean
  error?: string
  success?: string
  submitLabel?: string
  cancelLabel?: string
  className?: string
}

const MasterDataFormPage: React.FC<MasterDataFormPageProps> = ({
  title,
  children,
  onSubmit,
  onCancel,
  cancelPath,
  loading = false,
  error = '',
  success = '',
  submitLabel,
  cancelLabel,
  className = '',
}) => {
  const router = useRouter()
  const dict = useDictionary()
  const [localError, setLocalError] = useState(error)
  const [localSuccess, setLocalSuccess] = useState(success)

  // Sync props with local state
  useEffect(() => {
    setLocalError(error)
  }, [error])

  useEffect(() => {
    setLocalSuccess(success)
  }, [success])

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push(cancelPath)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    setLocalSuccess('')
    await onSubmit(e)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h4 className="mb-0">{title}</h4>
      </CardHeader>
      <CardBody>
        {localError && (
          <Alert variant="danger" dismissible onClose={() => setLocalError('')}>
            {localError}
          </Alert>
        )}

        {localSuccess && (
          <Alert variant="success" dismissible onClose={() => setLocalSuccess('')}>
            {localSuccess}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {children}

          <div className="mt-4">
            <SaveButton
              loading={loading}
              submitLabel={submitLabel}
              className="me-3"
            />
            <ActionButton
              variant="secondary"
              type="button"
              onClick={handleCancel}
            >
              {cancelLabel || dict.common?.cancel || 'Cancel'}
            </ActionButton>
          </div>
        </Form>
      </CardBody>
    </Card>
  )
}

export default MasterDataFormPage

