'use client'

import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'

export interface ZaloButtonProps {
  zaloLink: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-light'
    | 'outline-dark';
  size?: 'sm' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const ZaloButton: React.FC<ZaloButtonProps> = ({
  zaloLink,
  variant = 'info',
  size,
  disabled = false,
  children,
  className = '',
  showIcon = true,
}) => {
  const handleClick = () => {
    if (zaloLink) {
      window.open(zaloLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleClick}
      className={className}
    >
      {showIcon && <FontAwesomeIcon icon={faCommentDots} className="me-2" />}
      {children || 'Mở Zalo'}
    </Button>
  )
}

export default ZaloButton
