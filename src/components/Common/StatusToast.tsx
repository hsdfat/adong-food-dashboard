'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { Toast, ToastContainer } from 'react-bootstrap'

type StatusVariant = 'success' | 'danger' | 'warning' | 'info'

interface StatusToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
  variant?: StatusVariant;
  delay?: number;
  position?: {
    placement?:
      | 'top-start'
      | 'top-center'
      | 'top-end'
      | 'middle-start'
      | 'middle-center'
      | 'middle-end'
      | 'bottom-start'
      | 'bottom-center'
      | 'bottom-end';
  };
}

export default function StatusToast({
  show,
  message,
  onClose,
  variant = 'info',
  delay = 2000,
  position = { placement: 'top-end' },
}: StatusToastProps) {
  if (typeof window === 'undefined') return null

  return createPortal(
    <ToastContainer
      position={position.placement || 'top-end'}
      className="p-3"
      style={{ zIndex: 2000 }}
    >
      <Toast bg={variant} onClose={onClose} show={show} delay={delay} autohide>
        <Toast.Body
          className={variant === 'warning' ? 'text-dark' : 'text-white'}
        >
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>,
    document.body,
  )
}
