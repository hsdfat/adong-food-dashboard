'use client'

import React from 'react'
import { Spinner } from 'react-bootstrap'
import { useLoadingOverlay } from './LoadingOverlayContext'
import './LoadingOverlay.scss'

export default function LoadingOverlay() {
  const { isLoading } = useLoadingOverlay()

  console.log('LoadingOverlay: isLoading =', isLoading)

  if (!isLoading) return null

  console.log('LoadingOverlay: Rendering overlay')

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-backdrop" />
      <div className="loading-overlay-content">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <div className="mt-3 text-white fw-semibold">Loading...</div>
      </div>
    </div>
  )
}
