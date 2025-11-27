'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface LoadingOverlayContextType {
  isLoading: boolean
  showLoading: () => void
  hideLoading: () => void
}

const LoadingOverlayContext = createContext<LoadingOverlayContextType | undefined>(undefined)

export function LoadingOverlayProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  const showLoading = () => setIsLoading(true)
  const hideLoading = () => setIsLoading(false)

  // Auto-hide loading overlay when pathname changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  return (
    <LoadingOverlayContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingOverlayContext.Provider>
  )
}

export function useLoadingOverlay() {
  const context = useContext(LoadingOverlayContext)
  if (!context) {
    throw new Error('useLoadingOverlay must be used within LoadingOverlayProvider')
  }
  return context
}
