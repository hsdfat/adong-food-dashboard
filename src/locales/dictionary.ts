// import 'server-only'
import Cookies from 'js-cookie'
import { defaultLocale } from '@/locales/config'

const dictionaries = {
  en: () => import('./en/lang.json').then((module) => module.default),
  vi: () => import('./vi/lang.json').then((module) => module.default),
}

type Locale = keyof typeof dictionaries

export const getLocales = () => Object.keys(dictionaries) as Array<Locale>

export const getLocale = (): Locale => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    const localeCookie = Cookies.get('locale')
    
    if (localeCookie && getLocales().includes(localeCookie as Locale)) {
      return localeCookie as Locale
    }
  }

  // Server-side or fallback
  return defaultLocale
}

export const getDictionary = async () => {
  const locale = getLocale()
  return dictionaries[locale]()
}