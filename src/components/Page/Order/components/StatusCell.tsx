'use client'

import React, { useState } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'

const STATUS_COLORS = {
  pending: { bg: '#ffc107', text: '#000000', border: '#ffc107' },
  approved: { bg: '#198754', text: '#ffffff', border: '#198754' },
  completed: { bg: '#198754', text: '#ffffff', border: '#198754' },
  cancelled: { bg: '#dc3545', text: '#ffffff', border: '#dc3545' },
  rejected: { bg: '#dc3545', text: '#ffffff', border: '#dc3545' },
  default: { bg: '#6c757d', text: '#ffffff', border: '#6c757d' },
}

function getStatusColors(status: string) {
  const statusLower = status.toLowerCase()
  return (
    STATUS_COLORS[statusLower as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.default
  )
}

interface StatusCellProps {
  orderId: string;
  currentStatus: string;
  allStatuses: string[];
  onSave: (orderId: string, newStatus: string) => Promise<void>;
}

function translateStatus(status: string, dict: any): string {
  const statusKey = status.toLowerCase()
  // Try multiple dictionary paths for status translations
  console.log('Translating status:', statusKey)
  console.log('Dictionary paths:', dict.orders?.status_badges?.[statusKey], dict.orders_list?.status_badges?.[statusKey])
  return (
    dict.orders?.status_badges?.[statusKey] ||
    dict.orders_list?.status_badges?.[statusKey] ||
    status
  )
}

export default function StatusCell({
  orderId,
  currentStatus,
  allStatuses,
  onSave,
}: StatusCellProps) {
  const [editedStatus, setEditedStatus] = useState<string>(currentStatus)
  const [saving, setSaving] = useState(false)
  const dict = useDictionary()

  const isChanged = editedStatus !== currentStatus
  const colors = getStatusColors(editedStatus)

  const handleSave = async () => {
    if (!isChanged) return

    setSaving(true)
    try {
      await onSave(orderId, editedStatus)
      // Status will be updated by parent component reload
    } catch (err) {
      console.error('[StatusCell] Failed to save status:', err)
      setEditedStatus(currentStatus) // Revert on error
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    setEditedStatus(currentStatus)
  }

  return (
    <div className="d-flex align-items-center gap-1" style={{ minWidth: '120px' }}>
      <Form.Select
        size="sm"
        value={editedStatus}
        onChange={(e) => setEditedStatus(e.target.value)}
        disabled={saving}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.border,
          flex: '1 1 auto',
          minWidth: '85px',
          fontSize: '0.75rem',
          padding: '0.2rem 0.4rem',
          height: 'auto',
          fontWeight: 500,
        }}
      >
        {allStatuses.map((status) => (
          <option key={status} value={status}>
            {translateStatus(status, dict)}
          </option>
        ))}
      </Form.Select>

      <div className="d-flex gap-1" style={{ width: '52px', flexShrink: 0 }}>
        {isChanged && (
          <>
            <Button
              size="sm"
              variant="success"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.2rem 0.4rem',
                width: '24px',
                fontSize: '0.75rem',
                lineHeight: 1,
              }}
            >
              {saving ? (
                <Spinner animation="border" size="sm" style={{ width: '10px', height: '10px' }} />
              ) : (
                <FontAwesomeIcon icon={faSave} style={{ fontSize: '0.75rem' }} />
              )}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDiscard}
              disabled={saving}
              style={{
                padding: '0.2rem 0.4rem',
                width: '24px',
                fontSize: '0.75rem',
                lineHeight: 1,
              }}
            >
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.75rem' }} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
