'use client'

import React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export interface ActionButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'
  size?: 'sm' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: IconDefinition
  loadingLabel?: string
  children: React.ReactNode
  onClick?: () => void | Promise<void>
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size,
  loading = false,
  disabled = false,
  icon,
  loadingLabel,
  children,
  onClick,
  type = 'button',
  className = '',
}) => {
  const isDisabled = loading || disabled

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      className={className}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {icon && !loading && <FontAwesomeIcon icon={icon} className="me-2" />}
      {loading ? (loadingLabel || 'Loading...') : children}
    </Button>
  )
}

export default ActionButton


