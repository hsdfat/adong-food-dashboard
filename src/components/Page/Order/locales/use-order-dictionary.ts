'use client'

import { useMemo } from 'react'
import useDictionary from '@/locales/dictionary-hook'
import { OrderDictionary } from './types'
import { getLocale } from '@/locales/dictionary'
import Cookies from 'js-cookie'

// Import locale files
import enDictionary from './en.json'
import viDictionary from './vi.json'

const orderDictionaries = {
  en: enDictionary as OrderDictionary,
  vi: viDictionary as OrderDictionary,
}

export default function useOrderDictionary(locale?: string): OrderDictionary {
  const globalDictionary = useDictionary()
  
  const orderDictionary = useMemo(() => {
    // Use provided locale or get from cookies
    const currentLocale = locale || getLocale(Cookies.get('locale')) || 'en'
    
    return orderDictionaries[currentLocale as keyof typeof orderDictionaries] || orderDictionaries.en
  }, [locale, globalDictionary])

  return orderDictionary
}
