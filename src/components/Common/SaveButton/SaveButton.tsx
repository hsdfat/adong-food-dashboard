'use client'

import React from 'react'
import useDictionary from '@/locales/dictionary-hook'
import ActionButton, { ActionButtonProps } from '../ActionButton/ActionButton'

export interface SaveButtonProps
  extends Omit<ActionButtonProps, 'variant' | 'children' | 'loadingLabel'> {
  loading?: boolean;
  submittingLabel?: string;
  submitLabel?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  loading = false,
  submittingLabel,
  submitLabel,
  ...props
}) => {
  const dict = useDictionary()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('SaveButton: clicked, type=submit should trigger form submission')
    props.onClick?.(e)
  }

  return (
    <ActionButton
      variant="success"
      type="submit"
      loading={loading}
      loadingLabel={
        submittingLabel || dict.action?.submitting || 'Submitting...'
      }
      onClick={handleClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {submitLabel || dict.action?.submit || 'Save'}
    </ActionButton>
  )
}

export default SaveButton
