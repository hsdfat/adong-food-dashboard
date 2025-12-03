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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // For iOS Safari compatibility, use window.location.href instead of target="_blank"
    if (disabled) {
      e.preventDefault()
      return
    }

    // Try to open in new tab, fallback to window.location for iOS
    e.preventDefault()
    const newWindow = window.open(zaloLink, '_blank', 'noopener,noreferrer')

    // If popup was blocked (iOS Safari), fallback to same window
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = zaloLink
    }
  }

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
      onClick={handleClick}
      className={btnClasses}
      style={{ textDecoration: 'none' }}
    >
      {showIcon && <FontAwesomeIcon icon={faCommentDots} className="me-2" />}
      {children || 'Mở Zalo'}
    </a>
  )
}

export default ZaloButton
