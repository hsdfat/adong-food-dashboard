'use client'

import React from 'react'
import ActionButton, { ActionButtonProps } from '../ActionButton/ActionButton'
import useDictionary from '@/locales/dictionary-hook'

export interface SaveButtonProps extends Omit<ActionButtonProps, 'variant' | 'children' | 'loadingLabel'> {
  loading?: boolean
  submittingLabel?: string
  submitLabel?: string
}

const SaveButton: React.FC<SaveButtonProps> = ({
  loading = false,
  submittingLabel,
  submitLabel,
  ...props
}) => {
  const dict = useDictionary()

  return (
    <ActionButton
      variant="success"
      type="submit"
      loading={loading}
      loadingLabel={submittingLabel || dict.action?.submitting || 'Submitting...'}
      {...props}
    >
      {submitLabel || dict.action?.submit || 'Save'}
    </ActionButton>
  )
}

export default SaveButton


