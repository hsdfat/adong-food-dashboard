'use client'

import React from 'react'
import { FormSelect, Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'

interface StatusSelectProps {
  currentStatus: string;
  allStatuses: string[];
  isChanged: boolean;
  isSaving: boolean;
  colors: { bg: string; text: string; border: string };
  onStatusChange: (newStatus: string) => void;
  onSave: () => void;
  onDiscard: () => void;
}

export default function StatusSelect({
  currentStatus,
  allStatuses,
  isChanged,
  isSaving,
  colors,
  onStatusChange,
  onSave,
  onDiscard,
}: StatusSelectProps) {
  const dict = useDictionary()
  
  return (
    <div className="d-flex align-items-center gap-2">
      <FormSelect
        size="sm"
        value={currentStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        disabled={isSaving}
        style={{
          minWidth: '120px',
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.border,
        }}
      >
        {allStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </FormSelect>

      {isChanged && (
        <div className="d-flex gap-1">
          <Button
            variant="success"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            title={dict.common?.save || 'Save'}
          >
            {isSaving ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onDiscard}
            disabled={isSaving}
            title={dict.common?.cancel || 'Cancel'}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      )}
    </div>
  )
}

