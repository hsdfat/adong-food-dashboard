'use client'

import React from 'react'
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
  // Build button classes manually to match Bootstrap styling
  const btnClasses = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    disabled && 'disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (disabled) {
    return (
      <span className={btnClasses} style={{ pointerEvents: 'none' }}>
        {showIcon && <FontAwesomeIcon icon={faCommentDots} className="me-2" />}
        {children || 'Mở Zalo'}
      </span>
    )
  }

  return (
    <a
      href={zaloLink}
      target="_blank"
      rel="noopener noreferrer"
      className={btnClasses}
      style={{ textDecoration: 'none' }}
    >
      {showIcon && <FontAwesomeIcon icon={faCommentDots} className="me-2" />}
      {children || 'Mở Zalo'}
    </a>
  )
}

export default ZaloButton
