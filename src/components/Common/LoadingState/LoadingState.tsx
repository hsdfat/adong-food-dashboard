'use client'

import React from 'react'
import { Card, CardBody, Spinner } from 'react-bootstrap'

export interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullHeight = false,
  size = 'sm',
  className = '',
}) => {
  const containerClass = fullHeight
    ? `d-flex align-items-center justify-content-center ${className}`
    : `text-center py-4 ${className}`
  const style = fullHeight ? { minHeight: '400px' } : {}

  // Spinner only accepts 'sm' | undefined, so map 'lg' to undefined (default size)
  const spinnerSize = size === 'lg' ? undefined : size

  return (
    <div className={containerClass} style={style}>
      <div>
        <Spinner
          animation="border"
          size={spinnerSize}
          role="status"
          aria-hidden="true"
          className="me-2"
        />
        <span>{message}</span>
      </div>
    </div>
  )
}

export const LoadingStateCard: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  ...props
}) => (
    <Card>
      <CardBody>
        <LoadingState message={message} {...props} />
      </CardBody>
    </Card>
  )

export default LoadingState
